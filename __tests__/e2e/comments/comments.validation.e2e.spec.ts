import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import request from 'supertest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {ObjectId} from 'mongodb';
import {COMMENTS_PATH, POSTS_PATH} from '../../../src/core/paths/paths';
import {HttpStatus} from '../../../src/core/types/httpStatuses';
import {db} from '../../../src/db/mongo.db';
import {setupApp} from '../../../src/setupApp';
import {getInvalidQueryParams} from '../../utils';
import {createUser, getUserDto} from '../../utils/users';
import {userLogin} from '../../utils/auth';
import {createBlog} from '../../utils/blogs';
import {createPost} from '../../utils/posts';
import {createComment, getCommentDto} from '../../utils/comments';
import {Blog} from '../../../src/blogs/types/blog';
import {CommentInputDto} from '../../../src/comments/types/comment';

describe('Comments API validation check', () => {
  const app = express();
  setupApp(app);

  const userData = getUserDto();
  const commentDto: CommentInputDto = getCommentDto();
  const randomId = new ObjectId().toString();

  let accessToken: string = '';
  let blog: Blog | null = null;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    await db.run(mongoServer.getUri());
    await createUser(app, userData);

    blog = await createBlog(app);

    accessToken = await userLogin(app, {
      loginOrEmail: userData.login,
      password: userData.password
    });
  }, 15000);

  afterAll(async () => {
    await db.clearCollections();
    await db.stop();
    await mongoServer.stop();
  });

  describe('❌ should not create comment; POST /posts/{postId}/comments', () => {
    it('❌ should not create comment without authorization', async () => {
      const post = await createPost(app, blog!.id);

      await request(app)
        .post(`${POSTS_PATH}/${post.id}/comments`)
        .send(commentDto)
        .expect(HttpStatus.UNAUTHORIZED_401);

      await request(app)
        .post(`${POSTS_PATH}/${post.id}/comments`)
        .set('Authorization', `Bearer invalidAccessToken`)
        .send(commentDto)
        .expect(HttpStatus.UNAUTHORIZED_401);
    });

    it('❌ should not create comment when incorrect body passed', async () => {
      const post = await createPost(app, blog!.id);

      await request(app)
        .post(`${POSTS_PATH}/${post.id}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(HttpStatus.BAD_REQUEST_400);

      await request(app)
        .post(`${POSTS_PATH}/${post.id}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({content: 'InvalidContent'})
        .expect(HttpStatus.BAD_REQUEST_400);
    });

    it('❌ should not create comment if post does not exist', async () =>
      request(app)
        .post(`${POSTS_PATH}/${randomId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentDto)
        .expect(HttpStatus.NOT_FOUND_404));
  });

  describe('❌ should not get comments by postId; GET /posts/{postId}/comments', () => {
    it('❌ should not get comments when incorrect query params', async () => {
      const post = await createPost(app, blog!.id);

      await request(app)
        .get(`${POSTS_PATH}/${post.id}/comments`)
        .query(getInvalidQueryParams())
        .expect(HttpStatus.BAD_REQUEST_400);
    });

    it('❌ should not get comments if post does not exist', async () =>
      request(app)
        .get(`${POSTS_PATH}/${randomId}/comments`)
        .expect(HttpStatus.NOT_FOUND_404));
  });

  describe('❌ should not get comment by commentId; GET /comments/{id}', () => {
    it('❌ should not get comment if commentId does not exist', () =>
      request(app).get(`${COMMENTS_PATH}/${randomId}`).expect(HttpStatus.NOT_FOUND_404));
  });

  describe('❌ should not update comment; PUT /comments/{id}', () => {
    it('❌ should not update comment when incorrect body passed', async () => {
      const post = await createPost(app, blog!.id);
      const comment = await createComment(app, post.id, accessToken);

      await request(app)
        .put(`${COMMENTS_PATH}/${comment.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({content: 'InvalidContent'})
        .expect(HttpStatus.BAD_REQUEST_400);
    });

    it('❌ should not update comment without authorization', async () => {
      const post = await createPost(app, blog!.id);
      const comment = await createComment(app, post.id, accessToken);

      await request(app)
        .put(`${COMMENTS_PATH}/${comment.id}`)
        .send(commentDto)
        .expect(HttpStatus.UNAUTHORIZED_401);
    });

    it('❌ should not update comment of another user', async () => {
      const anotherUserData = getUserDto();

      await createUser(app, anotherUserData);

      const anotherToken = await userLogin(app, {
        loginOrEmail: anotherUserData.login,
        password: anotherUserData.password
      });

      const post = await createPost(app, blog!.id);
      const comment = await createComment(app, post.id, accessToken);

      await request(app)
        .put(`${COMMENTS_PATH}/${comment.id}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .send(commentDto)
        .expect(HttpStatus.FORBIDDEN_403);
    });

    it('❌ should not update comment if commentId does not exist', () =>
      request(app)
        .put(`${COMMENTS_PATH}/${randomId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentDto)
        .expect(HttpStatus.NOT_FOUND_404));
  });

  describe('❌ should not delete comment; DELETE /comments/{id}', () => {
    it('❌ should not delete comment without authorization', async () => {
      const post = await createPost(app, blog!.id);
      const comment = await createComment(app, post.id, accessToken);

      await request(app)
        .delete(`${COMMENTS_PATH}/${comment.id}`)
        .expect(HttpStatus.UNAUTHORIZED_401);
    });

    it('❌ should not delete comment of another user', async () => {
      const anotherUserData = getUserDto();

      await createUser(app, anotherUserData);

      const anotherToken = await userLogin(app, {
        loginOrEmail: anotherUserData.login,
        password: anotherUserData.password
      });

      const post = await createPost(app, blog!.id);
      const comment = await createComment(app, post.id, accessToken);

      await request(app)
        .delete(`${COMMENTS_PATH}/${comment.id}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .expect(HttpStatus.FORBIDDEN_403);
    });

    it('❌ should not delere comment if commentId does not exist', async () => {
      await request(app)
        .delete(`${COMMENTS_PATH}/${randomId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.NOT_FOUND_404);
    });
  });
});
