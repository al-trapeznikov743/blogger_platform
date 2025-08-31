import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {HttpStatus} from '../../core/types/httpStatuses';
import {UserInputDto, USERS_DI_TYPES} from '../../users/types/user';
import {AUTH_DI_TYPES, ConfirmCodeType, EmailResendDto, LoginDto} from '../types/auth';
import {withErrorHandling} from '../../core/errors/withErrorHandling.decorator';
import {UsersService} from '../../users/domain/users.service';
import {RequestDevice, RequestUserData} from '../../devices/types/devices';
import {RequestWithBody} from '../../core/types/requests';
import {AuthService} from '../domain/auth.service';

@injectable()
export class AuthController {
  constructor(
    @inject(USERS_DI_TYPES.UsersService) private usersService: UsersService,
    @inject(AUTH_DI_TYPES.AuthService) private authService: AuthService
  ) {}

  @withErrorHandling
  async authMe({user}: Request, res: Response) {
    const {id: userId, email, login} = await this.usersService.getUserById(user!.id);

    res.status(HttpStatus.OK_200).send({userId, email, login});
  }

  @withErrorHandling
  async login(
    {body: {loginOrEmail, password}, headers, ip}: RequestWithBody<LoginDto>,
    res: Response
  ) {
    const requestData = {
      ip,
      device: headers?.['user-agent'] || 'Unknown device'
    } as RequestUserData;

    const {accessToken, refreshToken} = await this.authService.loginUser(
      loginOrEmail,
      password,
      requestData
    );

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true, // true — для HTTPS; в dev-режиме можно временно поставить false
        sameSite: 'none', // политика кросс-доменных запросов
        path: '/auth/refresh-token',
        maxAge: 20_000
      })
      .status(HttpStatus.OK_200)
      .send({accessToken});
  }

  @withErrorHandling
  async logout({device}: Request, res: Response) {
    await this.authService.logoutUser(device as RequestDevice);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  }

  @withErrorHandling
  async refreshToken({device, headers, ip}: Request, res: Response) {
    const requestData = {
      ip,
      device: headers?.['user-agent'] || 'Unknown device'
    } as RequestUserData;

    const {accessToken, refreshToken} = await this.authService.refreshToken(
      device as RequestDevice,
      requestData
    );

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true, // true — для HTTPS; в dev-режиме можно временно поставить false
        sameSite: 'none', // политика кросс-доменных запросов
        path: '/auth/refresh-token',
        maxAge: 20_000
      })
      .status(HttpStatus.OK_200)
      .send({accessToken});
  }

  @withErrorHandling
  async registration(
    {body: {login, email, password}}: RequestWithBody<UserInputDto>,
    res: Response
  ) {
    await this.authService.registerUser(login, password, email);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  }

  @withErrorHandling
  async registrationConfirm(
    {body: {code}}: RequestWithBody<ConfirmCodeType>,
    res: Response
  ) {
    await this.authService.confirmEmail(code);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  }

  @withErrorHandling
  async registrationEmailResending(
    {body: {email}}: RequestWithBody<EmailResendDto>,
    res: Response
  ) {
    await this.authService.emailResending(email);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  }

  @withErrorHandling
  async passwordRecovery({body: {email}}: Request, res: Response) {
    await this.authService.passwordRecovery(email);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  }

  @withErrorHandling
  async newPassword({body: {newPassword, recoveryCode}}: Request, res: Response) {
    await this.authService.newPassword(newPassword, recoveryCode);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  }
}
