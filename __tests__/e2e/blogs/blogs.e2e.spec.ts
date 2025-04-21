import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import request from 'supertest';
import {clearDb, generateBasicAuthToken} from '../../utils';
import {createBlog, getBlogById, getBlogDto, updateBlog} from '../../utils/blogs';
import {setupApp} from '../../../src/setupApp';
import {BLOGS_PATH} from '../../../src/core/paths/paths';
import {HttpStatus} from '../../../src/core/types/httpStatuses';
import {BlogInputDto} from '../../../src/blogs/dto/blog-dto';
import {config} from '../../../src/core/settings/config';
import {client, runDB} from '../../../src/db/mongo.db';

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

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
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

  it('✅ should create blog; POST /blogs', async () => {
    const newBlog: BlogInputDto = {
      ...getBlogDto(),
      name: 'New best blog'
    };

    await createBlog(app, newBlog);
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
});
