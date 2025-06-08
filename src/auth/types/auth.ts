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
