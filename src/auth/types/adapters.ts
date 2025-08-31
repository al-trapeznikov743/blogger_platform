export const ADAPTERS_DI_TYPES = {
  JwtService: Symbol.for('JwtService'),
  BcryptService: Symbol.for('BcryptService'),
  NodemailerService: Symbol.for('NodemailerService')
};

export type Payload = {
  userId: string;
  deviceId?: string;
  iat?: number;
  exp?: number;
};
