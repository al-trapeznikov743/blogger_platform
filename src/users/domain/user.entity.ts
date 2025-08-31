import {randomUUID} from 'crypto';
import {BaseUserData} from '../types/user';

export class User {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: string;
    isConfirmed: boolean;
  };
  recoveryPassword?: {
    recoveryCode: string;
    expirationDate: string;
  };

  constructor({
    login,
    email,
    passwordHash,
    expirationDate,
    confirmationCode,
    isConfirmed,
    recoveryCode
  }: BaseUserData) {
    this.login = login;
    this.email = email;
    this.passwordHash = passwordHash;
    this.createdAt = new Date().toISOString();

    this.emailConfirmation = {
      confirmationCode: confirmationCode || randomUUID(),
      expirationDate: expirationDate || User.getExpDate(),
      isConfirmed: !!isConfirmed
    };

    if (recoveryCode) {
      this.recoveryPassword = {
        recoveryCode: recoveryCode,
        expirationDate: User.getExpDate()
      };
    }
  }

  static getExpDate(): string {
    const date = new Date();

    date.setMinutes(date.getMinutes() + 15);

    return date.toISOString();
  }
}
