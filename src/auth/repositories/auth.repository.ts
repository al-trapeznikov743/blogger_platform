import {db} from '../../db/mongo.db';
import {mapMongoId} from '../../db/utils';
import {BaseRefreshToken, RefreshTokenViewType} from '../types/auth';

export const authRepository = {
  async addRefreshToken(refreshTokenData: BaseRefreshToken) {
    await db.refreshTokenCollection().insertOne(refreshTokenData);
  },

  async findRefreshToken(token: string): Promise<RefreshTokenViewType | null> {
    const tokenData = await db.refreshTokenCollection().findOne({token});

    return tokenData ? (mapMongoId(tokenData) as RefreshTokenViewType) : tokenData;
  },

  async findRefreshTokenByUserId(userId: string): Promise<RefreshTokenViewType | null> {
    const tokenData = await db.refreshTokenCollection().findOne({userId});

    return tokenData ? (mapMongoId(tokenData) as RefreshTokenViewType) : tokenData;
  },

  async deleteRefreshToken(token: string) {
    await db.refreshTokenCollection().deleteOne({token});
  },

  async deleteAllRefreshTokensForUser(userId: string) {
    await db.refreshTokenCollection().deleteMany({userId});
  },

  async deleteExpiredTokens() {
    const now = new Date().toISOString();

    await db.refreshTokenCollection().deleteMany({
      expiresAt: {$lt: now}
    });
  }
};
