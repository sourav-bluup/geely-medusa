import { NgeniusOptions, NgeniusOrderResponse } from './types';
import { Logger } from '@medusajs/framework/types';

type CreateHostedSessionRequest = {
  amount: number;
  currency: string;
  sessionId: string;
};

type VerifyWebhookSignatureRequest = {
  payload: string;
  signature: string;
};

class NgeniusClient {
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly outletId: string;
  private readonly isSandbox: boolean;
  private readonly enableLogging: boolean;
  private readonly loger: Logger;

  constructor(options: NgeniusOptions, loger: Logger) {
    this.apiKey = options.apiKey;
    this.apiUrl = options.apiUrl;
    this.outletId = options.outletId;
    this.isSandbox = this.detectSandbox(options.apiUrl);
    this.enableLogging = this.isSandbox;
    this.loger = loger;
  }

  async verifyWebhookSignature({
    payload,
    signature,
  }: VerifyWebhookSignatureRequest): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    try {
      await this.fetchRequest('POST', '/webhooks/validate', {
        body: JSON.stringify({ payload, signature }),
        headers: this.getHeaders('webhooks', accessToken),
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async retrieveOrderStatus(orderReference: string): Promise<NgeniusOrderResponse> {
    const accessToken = await this.getAccessToken();
    return this.fetchRequest<NgeniusOrderResponse>(
      'GET',
      `/transactions/outlets/${this.outletId}/orders/${orderReference}`,
      {
        headers: this.getHeaders('payment', accessToken),
      },
    );
  }

  async createHostedSessionPayment({
    amount,
    currency,
    sessionId,
  }: CreateHostedSessionRequest): Promise<any> {
    const accessToken = await this.getAccessToken();
    return this.fetchRequest<any>(
      'POST',
      `/transactions/outlets/${this.outletId}/payment/hosted-session/${sessionId}`,
      {
        body: JSON.stringify({
          action: 'PURCHASE',
          amount: { currencyCode: currency, value: amount },
        }),
        headers: this.getHeaders('payment', accessToken),
      },
    );
  }

  private detectSandbox(apiUrl: string): boolean {
    return apiUrl.includes('sandbox') || apiUrl.includes('test');
  }

  private log(...args: any[]): void {
    if (this.enableLogging) {
      this.loger.log(args);
    }
  }

  private async fetchRequest<T>(
    method: 'GET' | 'POST',
    endpoint: string,
    config: RequestInit,
  ): Promise<T> {
    try {
      const url = this.buildUrl(endpoint);
      this.log(`Ngenius ${method} request to ${url}`);
      this.log('Ngenius request config:', JSON.stringify(config, null, 2));

      const response = await fetch(url, { method, ...config });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: T = await response.json();

      this.log(`Ngenius response (${response.status}):`);
      this.log(JSON.stringify(data, null, 2));

      return data;
    } catch (error) {
      this.log('Ngenius error:', error);

      if (error instanceof Error) {
        throw new Error(`Ngenius error: ${error.message}`);
      }

      throw error;
    }
  }

  private buildUrl(endpoint: string): string {
    return `${this.apiUrl}${endpoint}`;
  }

  private async getAccessToken(): Promise<string> {
    const response = await this.fetchRequest<{ access_token: string }>(
      'POST',
      '/identity/auth/access-token',
      {
        headers: this.getHeaders('identity'),
        body: JSON.stringify({}),
      },
    );
    return response.access_token;
  }

  private getHeaders(
    type: 'identity' | 'payment' | 'webhooks',
    accessToken?: string,
  ): Record<string, string> {
    const headers: Record<string, string> = {};

    switch (type) {
      case 'identity':
        headers['Content-Type'] = 'application/vnd.ni-identity.v1+json';
        headers['Accept'] = 'application/vnd.ni-identity.v1+json';
        headers['Authorization'] = `Basic ${this.apiKey}`;
        break;
      case 'payment':
        headers['Content-Type'] = 'application/vnd.ni-payment.v2+json';
        headers['Accept'] = 'application/vnd.ni-payment.v2+json';
        headers['Authorization'] = `Bearer ${accessToken}`;
        break;
      case 'webhooks':
        headers['Content-Type'] = 'application/vnd.ni-webhooks.v2+json';
        headers['Authorization'] = `Bearer ${accessToken}`;
        break;
    }

    return headers;
  }
}

export { NgeniusClient };
