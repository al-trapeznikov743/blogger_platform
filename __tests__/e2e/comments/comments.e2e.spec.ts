import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import request from 'supertest';
import {config} from '../../../src/core/settings/config';
import {COMMENTS_PATH, POSTS_PATH} from '../../../src/core/paths/paths';
import {HttpStatus} from '../../../src/core/types/httpStatuses';
import {client, runDB} from '../../../src/db/mongo.db';
import {setupApp} from '../../../src/setupApp';
import {clearDb} from '../../utils';
import {createUser, getUserDto} from '../../utils/users';
import {userLogin} from '../../utils/auth';
import {createBlog} from '../../utils/blogs';
import {createPost} from '../../utils/posts';
import {createComment, getCommentById} from '../../utils/comments';
import {Blog} from '../../../src/blogs/types/blog';

describe('Comments API', () => {
  const app = express();
  setupApp(app);

  const userData = getUserDto();

  let accessToken: string = '';
  let blog: Blog | null = null;

  beforeAll(async () => {
    await runDB(config.MONGO_URL);
    await clearDb(app);

    await createUser(app, userData);

    blog = await createBlog(app);

    const token = await userLogin(app, {
      loginOrEmail: userData.login,
      password: userData.password
    });

    accessToken = token;
  }, 15000);

  afterAll(async () => {
    await client.close();
  });

  it('✅ should create new comment for post; POST /posts/{postId}/comments', async () => {
    const post = await createPost(app, blog!.id);
    const comment = await createComment(app, post.id, accessToken);

    expect(comment).toEqual({
      id: expect.any(String),
      content: expect.any(String),
      commentatorInfo: {
        userId: expect.any(String),
        userLogin: expect.any(String)
      },
      createdAt: expect.any(String)
    });
  });

  it('✅ should get comments by postId; GET /posts/{postId}/comments', async () => {
    const post = await createPost(app, blog!.id);

    await createComment(app, post.id, accessToken);
    await createComment(app, post.id, accessToken);

    const response = await request(app)
      .get(`${POSTS_PATH}/${post.id}/comments`)
      .expect(HttpStatus.OK_200);

    const {pagesCount, page, pageSize, totalCount, items} = response.body;

    expect(typeof pagesCount).toBe('number');
    expect(typeof page).toBe('number');
    expect(typeof pageSize).toBe('number');
    expect(typeof totalCount).toBe('number');
    expect(Array.isArray(items)).toBe(true);

    expect(totalCount).toBeGreaterThanOrEqual(2);
    expect(items.length).toBeGreaterThanOrEqual(2);

    expect(items[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        content: expect.any(String),
        commentatorInfo: {
          userId: expect.any(String),
          userLogin: expect.any(String)
        },
        createdAt: expect.any(String)
      })
    );
  });

  it('✅ should get comment by commentId; GET /comments/{id}', async () => {
    const post = await createPost(app, blog!.id);
    const comment = await createComment(app, post.id, accessToken);

    const commentResult = await getCommentById(app, comment.id);

    expect(commentResult).toEqual({
      id: expect.any(String),
      content: expect.any(String),
      commentatorInfo: {
        userId: expect.any(String),
        userLogin: expect.any(String)
      },
      createdAt: expect.any(String)
    });
  });

  it('✅ should update comment by commentId; PUT /comments/{id}', async () => {
    const post = await createPost(app, blog!.id);
    const comment = await createComment(app, post.id, accessToken);

    const content = 'newContentForComment';

    await request(app)
      .put(`${COMMENTS_PATH}/${comment.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({content})
      .expect(HttpStatus.NO_CONTENT_204);

    const commentResult = await getCommentById(app, comment.id);

    expect(commentResult.content).toBe(content);
  });

  it('✅ should delete comment by commentId; DELETE /comments/{id}', async () => {
    const post = await createPost(app, blog!.id);
    const comment = await createComment(app, post.id, accessToken);

    await request(app)
      .delete(`${COMMENTS_PATH}/${comment.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.NO_CONTENT_204);

    await request(app)
      .get(`${COMMENTS_PATH}/${comment.id}`)
      .expect(HttpStatus.NOT_FOUND_404);
  });
});
