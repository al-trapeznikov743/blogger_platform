import dotenv from 'dotenv';
dotenv.config();
import request from 'supertest';
import express from 'express';
import {ObjectId} from 'mongodb';
import {HttpStatus} from '../../../src/core/types/httpStatuses';
import {BLOGS_PATH} from '../../../src/core/paths/paths';
import {setupApp} from '../../../src/setupApp';
import {BlogInputDto} from '../../../src/blogs/dto/blog-dto';
import {createBlog, getBlogDto} from '../../utils/blogs';
import {clearDb, generateBasicAuthToken, makeLongString} from '../../utils';
import {config} from '../../../src/core/settings/config';
import {client, runDB} from '../../../src/db/mongo.db';

describe('Blogs API body validation check', () => {
  const app = express();
  setupApp(app);

  const randomId = new ObjectId().toString();
  const adminToken = generateBasicAuthToken();
  const correctTestBlogData: BlogInputDto = getBlogDto();

  beforeAll(async () => {
    await runDB(config.MONGO_URL);
    await clearDb(app);
  });

  afterAll(async () => {
    await client.close();
  });

  it(`❌ should not create blog when incorrect body passed; POST /blogs'`, async () => {
    await request(app)
      .post(BLOGS_PATH)
      .send(correctTestBlogData)
      .expect(HttpStatus.UNAUTHORIZED_401);

    const emptyBodyDataSet = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', adminToken)
      .send({})
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(emptyBodyDataSet.body.errorsMessages).toHaveLength(3);

    const emptyStringDataSet = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', adminToken)
      .send({
        name: '',
        description: ' ',
        websiteUrl: '  '
      })
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(emptyStringDataSet.body.errorsMessages).toHaveLength(3);

    const invalidLengthDataSet = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', adminToken)
      .send({
        name: makeLongString(16),
        description: makeLongString(501),
        websiteUrl: makeLongString(101)
      })
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(invalidLengthDataSet.body.errorsMessages).toHaveLength(3);

    const invalidWebsiteUrlDataSet = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', adminToken)
      .send({
        name: 'Name',
        description: 'Some description',
        websiteUrl: 'Invalid-url'
      })
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(invalidWebsiteUrlDataSet.body.errorsMessages).toHaveLength(1);

    const websiteUrlRegex =
      /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

    const isValidWebsiteUrl = websiteUrlRegex.test(
      invalidWebsiteUrlDataSet.body.websiteUrl
    );

    expect(isValidWebsiteUrl).toBe(false);
  });

  it(`❌ should not update blog when incorrect body passed; PUT /blogs/:id'`, async () => {
    const blog = await createBlog(app);

    await request(app)
      .put(`${BLOGS_PATH}/${blog.id}`)
      .send(correctTestBlogData)
      .expect(HttpStatus.UNAUTHORIZED_401);

    const blogNotFoundDataSet = await request(app)
      .put(`${BLOGS_PATH}/${randomId}`)
      .set('Authorization', adminToken)
      .send(correctTestBlogData)
      .expect(HttpStatus.NOT_FOUND_404);

    expect(blogNotFoundDataSet.body.errorsMessages).toHaveLength(1);

    const emptyBodyDataSet = await request(app)
      .put(`${BLOGS_PATH}/${blog.id}`)
      .set('Authorization', adminToken)
      .send({})
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(emptyBodyDataSet.body.errorsMessages).toHaveLength(3);

    const emptyStringDataSet = await request(app)
      .put(`${BLOGS_PATH}/${blog.id}`)
      .set('Authorization', adminToken)
      .send({
        name: '',
        description: ' ',
        websiteUrl: '  '
      })
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(emptyStringDataSet.body.errorsMessages).toHaveLength(3);

    const invalidLengthDataSet = await request(app)
      .put(`${BLOGS_PATH}/${blog.id}`)
      .set('Authorization', adminToken)
      .send({
        name: makeLongString(16),
        description: makeLongString(501),
        websiteUrl: makeLongString(101)
      })
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(invalidLengthDataSet.body.errorsMessages).toHaveLength(3);

    const invalidWebsiteUrlDataSet = await request(app)
      .put(`${BLOGS_PATH}/${blog.id}`)
      .set('Authorization', adminToken)
      .send({
        name: 'Name',
        description: 'Some description',
        websiteUrl: 'Invalid-url'
      })
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(invalidWebsiteUrlDataSet.body.errorsMessages).toHaveLength(1);

    const websiteUrlRegex =
      /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

    const isValidWebsiteUrl = websiteUrlRegex.test(
      invalidWebsiteUrlDataSet.body.websiteUrl
    );

    expect(isValidWebsiteUrl).toBe(false);
  });

  it(`❌ should not deleted blog when incorrect param; DELETE /blogs/:id'`, async () => {
    const blog = await createBlog(app);

    await request(app)
      .delete(`${BLOGS_PATH}/${blog.id}`)
      .send(correctTestBlogData)
      .expect(HttpStatus.UNAUTHORIZED_401);

    const blogNotFoundDataSet = await request(app)
      .delete(`${BLOGS_PATH}/${randomId}`)
      .set('Authorization', adminToken)
      .send()
      .expect(HttpStatus.NOT_FOUND_404);

    expect(blogNotFoundDataSet.body.errorsMessages).toHaveLength(1);
  });
});
