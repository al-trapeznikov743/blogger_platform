import {randomUUID} from 'crypto';
import {config} from '../../core/settings/config';
import {BadRequestError, UnauthorizedError} from '../../core/errors';
import {User} from '../../users/domain/user.entity';
import {usersRepository} from '../../users/repositories/users.repository';
import {UserType, UserViewType} from '../../users/types/user';
import {bcryptService} from '../adapters/bcrypt.adapter';
import {emailTemplates} from '../adapters/emailTemplates';
import {jwtService} from '../adapters/jwt.adapter';
import {nodemailerService} from '../adapters/nodemailer.adapter';
import {Tokens} from '../types/auth';
import {parseTimeToSeconds} from '../../shared/utils';
import {devicesService} from '../../devices/domain/devices.service';
import {RequestDevice, RequestUserData} from '../../devices/types/devices';

const checkConfirmationEmail = (user: UserViewType, code?: string) => {
  const {
    emailConfirmation: {confirmationCode, expirationDate, isConfirmed}
  } = user;

  if (isConfirmed) {
    const field = code ? 'code' : 'email';

    throw new BadRequestError(field, 'Email already confirmed');
  }

  if (new Date(expirationDate) < new Date()) {
    throw new BadRequestError('confirmCode', 'Code is expired');
  }

  if (code && confirmationCode !== code) {
    throw new BadRequestError('confirmCode', 'Confirm code does not match');
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

  // console.log('accessToken: ', accessToken);
  // console.log('NEW_refreshToken: ', refreshToken);

  return {accessToken, refreshToken};
};

export const authService = {
  async loginUser(
    loginOrEmail: string,
    password: string,
    requestData: RequestUserData
  ): Promise<Tokens> {
    const {id: userId} = await this.checkUserCredentials(loginOrEmail, password);

    return createOrUpdateSession(userId, requestData);
  },

  async logoutUser(device: RequestDevice) {
    await devicesService.deleteUserDeviceById(device.deviceId, device);
  },

  async refreshToken({userId, deviceId}: RequestDevice, requestData: RequestUserData) {
    return createOrUpdateSession(userId, requestData, deviceId);
  },

  async checkUserCredentials(loginOrEmail: string, password: string): Promise<UserType> {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);

    if (!user) {
      throw new UnauthorizedError('Incorrect login or password');
    }

    const isPassCorrect = await bcryptService.checkPassword(password, user.passwordHash);

    if (!isPassCorrect) {
      throw new UnauthorizedError('Incorrect login or password');
    }

    return user;
  },

  async registerUser(login: string, password: string, email: string) {
    const user = await usersRepository.findUserByLoginOrEmail(login, email);

    if (user) {
      let field = 'email';

      if (login === user?.login && email !== user?.email) {
        field = 'login';
      }

      throw new BadRequestError(field, 'A user with this login or email already exists');
    }

    const passwordHash = await bcryptService.generateHash(password);

    const newUser = new User({login, email, passwordHash});

    await usersRepository.create(newUser);

    await nodemailerService.sendEmail(
      newUser.email,
      newUser.emailConfirmation.confirmationCode,
      emailTemplates.registration
    );
  },

  async confirmEmail(code: string): Promise<void> {
    const user = await usersRepository.findUserByConfirmCode(code);

    if (!user) {
      throw new BadRequestError('email', 'Confirmation code is incorrect');
    }

    checkConfirmationEmail(user, code);

    await usersRepository.updateUser(user.id, {
      'emailConfirmation.isConfirmed': true
    });
  },

  async emailResending(email: string): Promise<void> {
    const user = await usersRepository.findUserByEmail(email);

    if (!user) {
      throw new BadRequestError('email', 'User is not exist');
    }

    checkConfirmationEmail(user);

    const updateFields = {
      'emailConfirmation.confirmationCode': randomUUID(),
      'emailConfirmation.expirationDate': User.getExpDate()
    };

    await usersRepository.updateUser(user.id, updateFields);

    await nodemailerService.sendEmail(
      email,
      updateFields['emailConfirmation.confirmationCode'],
      emailTemplates.registration
    );
  }
};
