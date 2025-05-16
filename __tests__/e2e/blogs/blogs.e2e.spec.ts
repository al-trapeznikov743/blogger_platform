import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import request from 'supertest';
import {clearDb, generateBasicAuthToken} from '../../utils';
import {createBlog, getBlogById, updateBlog} from '../../utils/blogs';
import {setupApp} from '../../../src/setupApp';
import {BLOGS_PATH} from '../../../src/core/paths/paths';
import {HttpStatus} from '../../../src/core/types/httpStatuses';
import {BlogInputDto} from '../../../src/blogs/types/blog';
import {config} from '../../../src/core/settings/config';
import {client, runDB} from '../../../src/db/mongo.db';
import {createPost} from '../../utils/posts';

describe('Blogs API', () => {
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

  it('✅ should return blogs; GET /blogs', async () => {
    await createBlog(app);
    await createBlog(app);

    const response = await request(app).get(BLOGS_PATH).expect(HttpStatus.OK_200);

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
        name: expect.any(String),
        description: expect.any(String),
        websiteUrl: expect.any(String),
        createdAt: expect.any(String),
        isMembership: expect.any(Boolean)
      })
    );

    await request(app)
      .get(BLOGS_PATH)
      .query({pageNumber: null})
      .expect(HttpStatus.OK_200);

    await request(app).get(BLOGS_PATH).query({pageSize: null}).expect(HttpStatus.OK_200);

    await request(app)
      .get(BLOGS_PATH)
      .query({pageNumber: null, pageSize: null})
      .expect(HttpStatus.OK_200);

    await request(app)
      .get(BLOGS_PATH)
      .query({sortBy: '', sortDirection: ''})
      .expect(HttpStatus.OK_200);

    await request(app)
      .get(BLOGS_PATH)
      .query({pageNumber: null, pageSize: null, sortBy: null, sortDirection: null})
      .expect(HttpStatus.OK_200);
  });

  it('✅ should return blogs filtered by searchNameTerm; GET /blogs', async () => {
    await createBlog(app);
    await createBlog(app, {name: 'TerMString-name'});

    const response = await request(app)
      .get(BLOGS_PATH)
      .query({searchNameTerm: 'term'})
      .expect(HttpStatus.OK_200);

    const {totalCount, items} = response.body;

    expect(totalCount).toBeGreaterThanOrEqual(1);
    expect(items.length).toBeGreaterThanOrEqual(1);
  });

  it('✅ should return blog by id; GET /blogs/:id', async () => {
    const createdBlog = await createBlog(app);

    const blog = await getBlogById(app, createdBlog.id);

    expect(blog).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      websiteUrl: expect.any(String),
      createdAt: expect.any(String),
      isMembership: expect.any(Boolean)
    });
  });

  it('✅ should update blog; PUT /blogs/:id', async () => {
    const createdBlog = await createBlog(app);

    const blogUpdateData: BlogInputDto = {
      name: 'New blog 404',
      description: 'Вопросы новых и старых технологий',
      websiteUrl: 'https://googleyandex.com/'
    };

    await updateBlog(app, createdBlog.id, blogUpdateData);

    const blogResponse = await getBlogById(app, createdBlog.id);

    expect(blogResponse).toEqual({
      ...blogUpdateData,
      id: createdBlog.id,
      name: expect.any(String),
      description: expect.any(String),
      websiteUrl: expect.any(String),
      createdAt: expect.any(String),
      isMembership: expect.any(Boolean)
    });
  });

  it('✅ should delete blog and check after "NOT FOUND"; DELETE /blogs/:id', async () => {
    const createdBlog = await createBlog(app);

    await request(app)
      .delete(`${BLOGS_PATH}/${createdBlog.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NO_CONTENT_204);

    await request(app)
      .get(`${BLOGS_PATH}/${createdBlog.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NOT_FOUND_404);
  });

  it('✅ should create post for specific blog; POST /blogs/:id/posts', async () => {
    const blog = await createBlog(app);

    const response = await request(app)
      .post(`${BLOGS_PATH}/${blog.id}/posts`)
      .set('Authorization', adminToken)
      .send({
        title: 'Post title',
        shortDescription: 'Short description',
        content: 'Post content'
      })
      .expect(HttpStatus.CREATED_201);

    expect(response.body).toEqual({
      id: expect.any(String),
      title: expect.any(String),
      shortDescription: expect.any(String),
      content: expect.any(String),
      blogId: expect.any(String),
      blogName: expect.any(String),
      createdAt: expect.any(String)
    });
  });

  // fantom error?
  it('✅ should return posts by blog; GET /blogs/:id/posts', async () => {
    const blog = await createBlog(app);

    createPost(app, blog.id);
    createPost(app, blog.id);

    const response = await request(app)
      .get(`${BLOGS_PATH}/${blog.id}/posts`)
      .expect(HttpStatus.OK_200);

    const {totalCount, items} = response.body;

    expect(totalCount).toBeGreaterThanOrEqual(2);
    expect(items.length).toBeGreaterThanOrEqual(2);
  });
});
