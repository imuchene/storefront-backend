export interface LipaNaMpesaCallback {
  Body: Body;
}

export interface Body {
  stkCallback: StkCallback;
}

export interface StkCallback {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode:        number;
  ResultDesc:        string;
  CallbackMetadata:  CallbackMetadata;
}

export interface CallbackMetadata {
  Item: Item[];
}

export interface Item {
  Name:  string;
  Value: number | string;
}
