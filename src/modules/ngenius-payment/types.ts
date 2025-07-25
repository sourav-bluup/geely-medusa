type NgeniusOptions = {
  apiKey: string;
  outletId: string;
  apiUrl: string;
  cancelUrl: string;
  returnUrl: string;
  cancelText: string;
};

type NgeniusOrderAction = 'SALE' | 'AUTH' | 'PURCHASE';

type NgeniusOrderRequest = {
  action: NgeniusOrderAction;
  amount: {
    currencyCode: string;
    value: number;
  };
  language?: string;
  merchantAttributes?: {
    redirectUrl: string;
    skipConfirmationPage?: boolean;
    cancelUrl?: string;
    cancelText?: string;
    skipOfferPage?: boolean;
    showPayerName?: boolean;
    paymentAttempts?: number;
    skip3DS?: boolean;
  };
  billingAddress?: NgeniusAddress;
  shippingAddress?: NgeniusAddress;
  emailAddress?: string;
  merchantOrderReference?: string;
  merchantDefinedData?: Record<string, string>;
};

type NgeniusAddress = {
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  countryCode?: string;
  postalCode?: string;
  state?: string;
  address1?: string;
};

type NgeniusOrderResponse = {
  _id: string;
  action: string;
  amount: {
    currencyCode: string;
    value: number;
  };
  language: string;
  merchantAttributes: {
    redirectUrl: string;
    skipConfirmationPage?: boolean;
  };
  emailAddress?: string;
  reference: string;
  outletId: string;
  createDateTime: string;
  referrer?: string;
  formattedAmount: string;
  formattedOrderSummary: Record<string, unknown>;
  _links: {
    'cnp:payment-link': {
      href: string;
    };
    'payment-authorization': {
      href: string;
    };
    self: {
      href: string;
    };
    'tenant-brand': {
      href: string;
    };
    payment: {
      href: string;
    };
    'merchant-brand': {
      href: string;
    };
  };
  paymentMethods: {
    card?: string[];
    wallet?: string[];
  };
  _embedded?: {
    payment: Array<{
      _id: string;
      _links: {
        'payment:apple_pay'?: {
          href: string;
        };
        self: {
          href: string;
        };
        'payment:card'?: {
          href: string;
        };
        'payment:samsung_pay'?: {
          href: string;
        };
        'payment:saved-card'?: {
          href: string;
        };
        curies?: Array<{
          name: string;
          href: string;
          templated: boolean;
        }>;
      };
      state: string;
      amount: {
        currencyCode: string;
        value: number;
      };
      updateDateTime: string;
      outletId: string;
      orderReference: string;
    }>;
  };
};

type NgeniusWebhookEvent = {
  eventId: string;
  eventType: 'AUTHORISED' | 'CAPTURED' | 'FAILED' | 'DECLINED' | 'REVERSED' | 'REFUNDED';
  eventDate: string;
  payload: {
    order: {
      reference: string;
    };
    amount: {
      value: number;
    };
    error?: {
      message: string;
    };
  };
};

export type {
  NgeniusAddress,
  NgeniusOptions,
  NgeniusOrderAction,
  NgeniusOrderRequest,
  NgeniusOrderResponse,
  NgeniusWebhookEvent,
};
