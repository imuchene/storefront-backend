export interface JwtTokenPayload {
  customerId: string;
  isSecondFactorAuthenticated?: boolean;
}
