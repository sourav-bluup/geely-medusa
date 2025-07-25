import { Logger } from '@medusajs/framework/types';
import {
  AbstractPaymentProvider,
  BigNumber,
  PaymentSessionStatus,
} from '@medusajs/framework/utils';
import {
  CreatePaymentProviderSession,
  PaymentMethodResponse,
  PaymentProviderContext,
  PaymentProviderError,
  PaymentProviderSessionResponse,
  ProviderWebhookPayload,
  UpdatePaymentProviderSession,
  WebhookActionResult,
} from '@medusajs/types';
import { NgeniusClient } from './ngenius-client';
import { NgeniusOptions, NgeniusWebhookEvent } from './types';
import { getSmallestUnit } from './utils/get-smallest-unit';

type InjectedDependencies = {
  logger: Logger;
};

class NgeniusPaymentProviderService extends AbstractPaymentProvider<NgeniusOptions> {
  static identifier = 'ngenius-payment';
  private logger_: Logger;
  private options_: NgeniusOptions;
  private client: NgeniusClient;

  constructor({ logger }: InjectedDependencies, options: NgeniusOptions) {
    // @ts-ignore
    super(...arguments);

    this.logger_ = logger;
    this.options_ = options;

    this.client = new NgeniusClient(this.options_, this.logger_);
  }

  listPaymentMethods(context: PaymentProviderContext): Promise<PaymentMethodResponse[]> {
    throw new Error('Method not implemented.');
  }

  async initiatePayment(
    input: CreatePaymentProviderSession,
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    try {
      const { amount, currency_code, context } = input;
      const { extra } = context;

      const order = await this.client.createHostedSessionPayment({
        amount: getSmallestUnit(amount, currency_code),
        currency: currency_code.toLocaleUpperCase(),
        sessionId: extra.cid as string,
      });

      return {
        data: order,
      };
    } catch (error) {
      return this.buildError(error.message, error);
    }
  }

  async authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>,
  ): Promise<
    | PaymentProviderError
    | { status: PaymentSessionStatus; data: PaymentProviderSessionResponse['data'] }
  > {
    // N-Genius doesn't have a separate authorization step for hosted payments
    return {
      status: PaymentSessionStatus.CAPTURED,
      data: paymentSessionData,
    };
  }

  async capturePayment(
    paymentData: Record<string, unknown>,
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse['data']> {
    try {
      const orderId = paymentData.orderReference;

      const orderStatus = await this.client.retrieveOrderStatus(orderId as string);
      const status = orderStatus._embedded?.payment[0].state;

      if (!status) {
        throw new Error('Payment not found for the given order');
      }

      if (status !== 'PURCHASED') {
        throw new Error(`Payment cannot be captured. Current state: ${status}`);
      }

      return {
        id: orderStatus._id,
        status: PaymentSessionStatus.CAPTURED,
        data: orderStatus,
      };
    } catch (error) {
      this.logger_.error('Error capturing payment:', error);
      return this.buildError('Failed to capture payment', error);
    }
  }

  async cancelPayment(
    paymentData: Record<string, unknown>,
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse['data']> {
    // Implement cancel logic if needed
    throw new Error('Method not implemented.');
  }

  async deletePayment(
    paymentSessionData: Record<string, unknown>,
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse['data']> {
    // N-Genius doesn't support deleting payments
    return paymentSessionData;
  }

  async getPaymentStatus(
    paymentSessionData: Record<string, unknown>,
  ): Promise<PaymentSessionStatus> {
    try {
      const orderId = paymentSessionData.orderId as string;
      if (!orderId) {
        throw new Error('Order ID not found in payment session data');
      }

      const orderStatus = await this.client.retrieveOrderStatus(orderId);
      const paymentState = orderStatus._embedded?.payment[0]?.state;

      switch (paymentState) {
        case 'AUTHORISED':
          return PaymentSessionStatus.AUTHORIZED;
        case 'CAPTURED':
          return PaymentSessionStatus.CAPTURED;
        case 'FAILED':
        case 'DECLINED':
          return PaymentSessionStatus.ERROR;
        case 'PENDING':
          return PaymentSessionStatus.PENDING;
        default:
          return PaymentSessionStatus.PENDING;
      }
    } catch (error) {
      this.logger_.error('Error retrieving payment status:', error);
      return PaymentSessionStatus.ERROR;
    }
  }

  async refundPayment(
    paymentData: Record<string, unknown>,
    refundAmount: number,
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse['data']> {
    // Implement refund logic
    throw new Error('Method not implemented.');
  }

  async retrievePayment(
    paymentSessionData: Record<string, unknown>,
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse['data']> {
    // Implement payment retrieval logic
    throw new Error('Method not implemented.');
  }

  async updatePayment(
    input: UpdatePaymentProviderSession,
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    throw new Error('Not supported by N-Genius');
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload['payload'],
  ): Promise<WebhookActionResult> {
    const { data, headers } = payload;
    const signature = headers['x-ngenius-signature'] as string;

    if (!signature) {
      throw new Error('Missing N-Genius signature');
    }

    const isValid = await this.client.verifyWebhookSignature({
      payload: JSON.stringify(data),
      signature,
    });

    if (!isValid) {
      throw new Error('Invalid N-Genius signature');
    }

    const webhookEvent = data as NgeniusWebhookEvent;
    const eventType = webhookEvent.eventType;
    const orderId = webhookEvent.payload.order.reference;

    switch (eventType) {
      case 'AUTHORISED':
        return {
          action: 'authorized',
          data: {
            session_id: orderId,
            amount: new BigNumber(webhookEvent.payload.amount.value),
          },
        };
      case 'CAPTURED':
        return {
          action: 'captured',
          data: {
            session_id: orderId,
            amount: new BigNumber(webhookEvent.payload.amount.value),
          },
        };
      case 'FAILED':
      case 'DECLINED':
        return {
          action: 'failed',
          data: {
            session_id: orderId,
            amount: new BigNumber(webhookEvent.payload.amount.value),
          },
        };
      case 'REVERSED':
      case 'REFUNDED':
        return {
          action: 'not_supported',
          data: {
            session_id: orderId,
            amount: new BigNumber(webhookEvent.payload.amount.value),
          },
        };
      default:
        return {
          action: 'not_supported',
          data: {
            session_id: orderId,
            amount: new BigNumber(webhookEvent.payload.amount.value),
          },
        };
    }
  }

  protected buildError(message: string, error: Error): PaymentProviderError {
    return {
      error: message,
      code: 'code' in error ? (error.code as string) : 'unknown_error',
      detail: error.message,
    };
  }
}

export default NgeniusPaymentProviderService;
