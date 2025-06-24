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

  constructor({
    login,
    email,
    passwordHash,
    expirationDate,
    confirmationCode,
    isConfirmed
  }: BaseUserData) {
    this.login = login;
    this.email = email;
    this.passwordHash = passwordHash;
    this.createdAt = new Date().toISOString();

    this.emailConfirmation = {
      expirationDate: expirationDate || User.getExpDate(),
      confirmationCode: confirmationCode || randomUUID(),
      isConfirmed: !!isConfirmed
    };
  }

  private static getExpDate(): string {
    const date = new Date();

    date.setMinutes(date.getMinutes() + 15);

    return date.toISOString();
  }
}
