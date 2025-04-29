import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import request from 'supertest';
import {clearDb, generateBasicAuthToken} from '../../utils';
import {createPost, getPostById, updatePost} from '../../utils/posts';
import {setupApp} from '../../../src/setupApp';
import {POSTS_PATH} from '../../../src/core/paths/paths';
import {HttpStatus} from '../../../src/core/types/httpStatuses';
import {createBlog} from '../../utils/blogs';
import {config} from '../../../src/core/settings/config';
import {client, runDB} from '../../../src/db/mongo.db';

describe('Posts API', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(config.MONGO_URL);
    await clearDb(app);
  });

  afterAll(async () => {
    await client.close();
  });

  it('✅ should return posts; GET /posts', async () => {
    const blog = await createBlog(app);

    await createPost(app, blog.id);
    await createPost(app, blog.id);

    const response = await request(app).get(POSTS_PATH).expect(HttpStatus.OK_200);

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
        title: expect.any(String),
        shortDescription: expect.any(String),
        content: expect.any(String),
        blogId: expect.any(String),
        blogName: expect.any(String),
        createdAt: expect.any(String)
      })
    );

    await request(app)
      .get(POSTS_PATH)
      .query({pageNumber: null})
      .expect(HttpStatus.OK_200);

    await request(app).get(POSTS_PATH).query({pageSize: null}).expect(HttpStatus.OK_200);

    await request(app)
      .get(POSTS_PATH)
      .query({pageNumber: null, pageSize: null})
      .expect(HttpStatus.OK_200);
  });

  it('✅ should return post by id; GET /posts/:id', async () => {
    const blog = await createBlog(app);
    const createdPost = await createPost(app, blog.id);

    const post = await getPostById(app, createdPost.id);

    expect(post).toEqual({
      id: createdPost.id,
      title: expect.any(String),
      shortDescription: expect.any(String),
      content: expect.any(String),
      blogId: expect.any(String),
      blogName: expect.any(String),
      createdAt: expect.any(String)
    });
  });

  it('✅ should create post; POST /posts', async () => {
    const blog = await createBlog(app);

    await createPost(app, blog.id);
  });

  it('✅ should update post; PUT /posts/:id', async () => {
    const blog = await createBlog(app);
    const createdPost = await createPost(app, blog.id);

    await updatePost(app, createdPost.id, blog.id);

    const postResponse = await getPostById(app, createdPost.id);

    expect(postResponse).toEqual({
      id: createdPost.id,
      title: expect.any(String),
      shortDescription: expect.any(String),
      content: expect.any(String),
      blogId: expect.any(String),
      blogName: expect.any(String),
      createdAt: expect.any(String)
    });
  });

  it('✅ should delete post and check after "NOT FOUND"; DELETE /posts/:id', async () => {
    const blog = await createBlog(app);
    const createdPost = await createPost(app, blog.id);

    await request(app)
      .delete(`${POSTS_PATH}/${createdPost.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NO_CONTENT_204);

    await request(app)
      .get(`${POSTS_PATH}/${createdPost.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NOT_FOUND_404);
  });
});
