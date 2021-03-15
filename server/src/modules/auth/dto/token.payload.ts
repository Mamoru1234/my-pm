export enum TokenType {
  AUTH = 'AUTH',
  SET_PASSWORD = 'SET_PASSWORD',
}

export interface TokenPayload {
  sub: number;
  username: string;
  tokenType: TokenType;
}
