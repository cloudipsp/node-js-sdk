declare module "cloudipsp-node-js-sdk" {
  export interface CloudIpspOptions {
    protocol?: string;
    merchantId: number;
    baseUrl?: string;
    secretKey: string;
    creditKey?: string;
    contentType?: string;
    timeout?: number;
  }

  export default class CloudIpsp {
    constructor(options: CloudIpspOptions);

    getImportantParams(data: any): any;
    getOrderId(): string;
    isValidResponse(data: any, credit?: boolean): boolean;
    Checkout(data: any): Promise<any>;
    CheckoutToken(data: any): Promise<any>;
    Verification(data: any): Promise<any>;
    Capture(data: any): Promise<any>;
    Recurring(data: any): Promise<any>;
    Reverse(data: any): Promise<any>;
    Status(data: any): Promise<any>;
    P2pcredit(data: any): Promise<any>;
    TransactionList(data: any): Promise<any>;
    Reports(data: any): Promise<any>;
    PciDssOne(data: any): Promise<any>;
    PciDssTwo(data: any): Promise<any>;
    Settlement(data: any): Promise<any>;
    Subscription(data: any): Promise<any>;
    SubscriptionActions(data: any): Promise<any>;
  }

  export interface CheckoutData {
    order_id: string;
    order_desc: string;
    currency: string;
    amount: number;
    response_url: string;
    server_callback_url: string;
    lang?: string;
    product_id?: number;
    recurring_data?: RecurringData;
    verification?: boolean;
  }

  export interface RecurringData {
    recurring_lifetime: string;
    recurring_frequency: string;
  }

  export interface CheckoutResponse {
    checkout_url: string;
    payment_id: string;
  }

  export interface CallbackData {
    signature: string;
    data: string;
  }

  export interface CallbackResponse {
    [key: string]: any;
  }

  export interface ReverseData {
    order_id: string;
    amount?: number;
  }

  export interface ReverseResponse {
    [key: string]: any;
  }

  export interface CaptureData {
    order_id: string;
    amount: number;
  }

  export interface CaptureResponse {
    [key: string]: any;
  }

  export interface RefundData {
    order_id: string;
    amount: number;
    comment?: string;
  }

  export interface RefundResponse {
    [key: string]: any;
  }
}
