export const AUTH_DI_TYPES = {
  AuthService: Symbol.for('AuthService'),
  AuthController: Symbol.for('AuthController')
};

export type LoginDto = {
  loginOrEmail: string;
  password: string;
};

export type ConfirmCodeType = {
  code: string;
};

export type EmailResendDto = {
  email: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};
