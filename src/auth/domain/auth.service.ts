import {inject, injectable} from 'inversify';
import {randomUUID} from 'crypto';
import {config} from '../../core/settings/config';
import {BadRequestError, UnauthorizedError} from '../../core/errors';
import {User} from '../../users/domain/user.entity';
import {UsersRepository} from '../../users/repositories/users.repository';
import {
  EmailConfirmation,
  RecoveryPassword,
  USERS_DI_TYPES,
  UserType
} from '../../users/types/user';
import {BcryptService} from '../adapters/bcrypt.adapter';
import {emailTemplates} from '../adapters/emailTemplates';
import {JwtService} from '../adapters/jwt.adapter';
import {NodemailerService} from '../adapters/nodemailer.adapter';
import {Tokens} from '../types/auth';
import {parseTimeToSeconds} from '../../shared/utils';
import {DevicesService} from '../../devices/domain/devices.service';
import {
  DEVICES_DI_TYPES,
  RequestDevice,
  RequestUserData
} from '../../devices/types/devices';
import {ADAPTERS_DI_TYPES} from '../types/adapters';

const checkCode = (field: string, targetCode: string, expDate: string, code?: string) => {
  if (new Date(expDate) < new Date()) {
    throw new BadRequestError(field, 'Code is expired');
  }

  if (code && targetCode !== code) {
    throw new BadRequestError(field, 'Code does not match');
  }
};

const getTokenPeriod = () => {
  const atTimeSec = parseTimeToSeconds(config.AC_TIME as string);
  const rtTimeSec = parseTimeToSeconds(config.RT_TIME as string);

  const iat = Math.floor(Date.now() / 1000);

  const atExp = iat + atTimeSec;
  const rtExp = iat + rtTimeSec;

  const deviceIat = new Date(iat * 1000);
  const deviceExp = new Date(rtExp * 1000);

  return {
    iat,
    atExp,
    rtExp,
    deviceIat,
    deviceExp
  };
};

const createOrUpdateSession = async (
  devicesService: DevicesService,
  jwtService: JwtService,
  userId: string,
  {ip, device}: RequestUserData,
  deviceId?: string
): Promise<Tokens> => {
  const {iat, atExp, rtExp, deviceIat, deviceExp} = getTokenPeriod();

  let currentDeviceId = deviceId;

  if (currentDeviceId) {
    await devicesService.updateDeviceSession(currentDeviceId, {
      ip,
      iat: deviceIat,
      exp: deviceExp
    });
  } else {
    currentDeviceId = await devicesService.createDeviceSession({
      userId,
      ip,
      device,
      iat: deviceIat,
      exp: deviceExp
    });
  }

  const [accessToken, refreshToken] = await Promise.all([
    jwtService.createToken({userId, iat, exp: atExp}, config.AC_SECRET),

    jwtService.createToken(
      {userId, deviceId: currentDeviceId, iat, exp: rtExp},
      config.RT_SECRET
    )
  ]);

  return {accessToken, refreshToken};
};

@injectable()
export class AuthService {
  constructor(
    @inject(USERS_DI_TYPES.UsersRepository) private usersRepository: UsersRepository,
    @inject(DEVICES_DI_TYPES.DevicesService) private devicesService: DevicesService,
    @inject(ADAPTERS_DI_TYPES.JwtService) private jwtService: JwtService,
    @inject(ADAPTERS_DI_TYPES.BcryptService) private bcryptService: BcryptService,
    @inject(ADAPTERS_DI_TYPES.NodemailerService)
    private nodemailerService: NodemailerService
  ) {}

  private checkConfirmationEmail(emailConfirmation: EmailConfirmation, code?: string) {
    const {confirmationCode, expirationDate, isConfirmed} = emailConfirmation;

    if (isConfirmed) {
      const field = code ? 'code' : 'email';

      throw new BadRequestError(field, 'Email already confirmed');
    }

    checkCode('confirmCode', confirmationCode, expirationDate, code);
  }

  private checkRecoveryCode(recoveryPassword: RecoveryPassword, code?: string) {
    if (!recoveryPassword) {
      throw new BadRequestError('recoveryCode', 'Code does not match');
    }

    const {recoveryCode, expirationDate} = recoveryPassword;

    checkCode('recoveryCode', recoveryCode, expirationDate, code);
  }

  async loginUser(
    loginOrEmail: string,
    password: string,
    requestData: RequestUserData
  ): Promise<Tokens> {
    const {id: userId} = await this.checkUserCredentials(loginOrEmail, password);

    return createOrUpdateSession(
      this.devicesService,
      this.jwtService,
      userId,
      requestData
    );
  }

  async logoutUser(device: RequestDevice) {
    await this.devicesService.deleteUserDeviceById(device.deviceId, device);
  }

  async refreshToken({userId, deviceId}: RequestDevice, requestData: RequestUserData) {
    return createOrUpdateSession(
      this.devicesService,
      this.jwtService,
      userId,
      requestData,
      deviceId
    );
  }

  async checkUserCredentials(loginOrEmail: string, password: string): Promise<UserType> {
    const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);

    if (!user) {
      throw new UnauthorizedError('Incorrect login or password');
    }

    const isPassCorrect = await this.bcryptService.checkPassword(
      password,
      user.passwordHash
    );

    if (!isPassCorrect) {
      throw new UnauthorizedError('Incorrect login or password');
    }

    return user;
  }

  async registerUser(login: string, password: string, email: string) {
    const user = await this.usersRepository.findUserByLoginOrEmail(login, email);

    if (user) {
      let field = 'email';

      if (login === user?.login && email !== user?.email) {
        field = 'login';
      }

      throw new BadRequestError(field, 'A user with this login or email already exists');
    }

    const passwordHash = await this.bcryptService.generateHash(password);

    const newUser = new User({login, email, passwordHash});

    await this.usersRepository.create(newUser);

    await this.nodemailerService.sendEmail(
      newUser.email,
      newUser.emailConfirmation.confirmationCode,
      emailTemplates.registration
    );
  }

  async confirmEmail(code: string): Promise<void> {
    const user = await this.usersRepository.findUserByConfirmCode(code);

    if (!user) {
      throw new BadRequestError('email', 'Confirmation code is incorrect');
    }

    this.checkConfirmationEmail(user.emailConfirmation, code);

    await this.usersRepository.updateUser(user.id, {
      'emailConfirmation.isConfirmed': true
    });
  }

  async emailResending(email: string): Promise<void> {
    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) {
      throw new BadRequestError('email', 'User is not exist');
    }

    this.checkConfirmationEmail(user.emailConfirmation);

    const updateFields = {
      'emailConfirmation.confirmationCode': randomUUID(),
      'emailConfirmation.expirationDate': User.getExpDate()
    };

    await this.usersRepository.updateUser(user.id, updateFields);

    await this.nodemailerService.sendEmail(
      email,
      updateFields['emailConfirmation.confirmationCode'],
      emailTemplates.registration
    );
  }

  async passwordRecovery(email: string) {
    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) {
      return;
    }

    const recoveryCode = randomUUID();

    const updateFields = {
      'recoveryPassword.recoveryCode': recoveryCode,
      'recoveryPassword.expirationDate': User.getExpDate()
    };

    await this.usersRepository.updateUser(user.id, updateFields);

    await this.nodemailerService.sendEmail(
      email,
      recoveryCode,
      emailTemplates.passwordRecovery
    );
  }

  async newPassword(password: string, recoveryCode: string) {
    const user = await this.usersRepository.findUserByRecoveryCode(recoveryCode);

    if (!user) {
      throw new BadRequestError('recoveryCode', 'Recovery code is incorrect');
    }

    this.checkRecoveryCode(user.recoveryPassword as RecoveryPassword, recoveryCode);

    const passwordHash = await this.bcryptService.generateHash(password);

    await this.usersRepository.updateUser(user.id, {
      passwordHash,
      recoveryPassword: null
    });
  }
}
