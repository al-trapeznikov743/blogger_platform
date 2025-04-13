import express from 'express';
import request from 'supertest';
import {clearDb, generateBasicAuthToken} from '../../utils';
import {createPost, getPostById, updatePost} from '../../utils/posts';
import {setupApp} from '../../../src/setupApp';
import {POSTS_PATH} from '../../../src/core/paths/paths';
import {HttpStatus} from '../../../src/core/types/httpStatuses';
import {createBlog} from '../../utils/blogs';

describe('Posts API', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await clearDb(app);
  });

  it('✅ should return posts; GET /posts', async () => {
    const blog = await createBlog(app);

    await createPost(app, blog.id);
    await createPost(app, blog.id);

    const response = await request(app).get(POSTS_PATH).expect(HttpStatus.OK_200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
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
      blogName: expect.any(String)
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
      blogName: expect.any(String)
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
