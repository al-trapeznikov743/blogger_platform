import {Express} from 'express';
import request from 'supertest';
import {HttpStatus} from '../../src/core/types/httpStatuses';
import {TESTING_PATH} from '../../src/core/paths/paths';
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME
} from '../../src/auth/middlewares/baseAuthGuard.middleware';
import {ErrorType} from '../../src/core/errors/types';

export const clearDb = (app: Express) =>
  request(app).delete(`${TESTING_PATH}/all-data`).expect(HttpStatus.NO_CONTENT_204);

export function generateBasicAuthToken() {
  const credentials = `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`;
  const token = Buffer.from(credentials).toString('base64');

  return `Basic ${token}`;
}

export const makeLongString = (
  minLength: number,
  includeSpaces: boolean = true
): string => {
  if (!minLength) {
    return '';
  }

  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charsWithSpaces = chars + ' ';
  let result = '';

  while (result.length < minLength) {
    const char = includeSpaces
      ? charsWithSpaces[Math.floor(Math.random() * charsWithSpaces.length)]
      : chars[Math.floor(Math.random() * chars.length)];

    result += char;
  }

  result = result.trim();

  while (result.length < minLength) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
};

export const checkFieldsWithErrors = (
  result: {
    [key: string]: any;
  },
  fields: string[]
) => {
  const fieldsWithErrors = result.body.errorsMessages.map((err: ErrorType) => err.field);

  fields.forEach((field) => expect(fieldsWithErrors).toContain(field));
};

export const getInvalidQueryParams = () => {
  return {pageNumber: -5, pageSize: 9999, sortBy: 'as', sortDirection: 'sc'};
};
