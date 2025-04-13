import request from 'supertest';
import express from 'express';
import {HttpStatus} from '../../../src/core/types/httpStatuses';
import {BLOGS_PATH} from '../../../src/core/paths/paths';
import {setupApp} from '../../../src/setupApp';
import {BlogInputDto} from '../../../src/blogs/dto/blog-dto';
import {createBlog, getBlogDto} from '../../utils/blogs';
import {clearDb, generateBasicAuthToken, makeLongString} from '../../utils';

describe('Blogs API body validation check', () => {
  const app = express();
  setupApp(app);

  const randomId = Date.now().toString();
  const adminToken = generateBasicAuthToken();
  const correctTestBlogData: BlogInputDto = getBlogDto();

  beforeAll(async () => {
    await clearDb(app);
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

    expect(emptyBodyDataSet.body.errorMessages).toHaveLength(3);

    const emptyStringDataSet = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', adminToken)
      .send({
        name: '',
        description: ' ',
        websiteUrl: '  '
      })
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(emptyStringDataSet.body.errorMessages).toHaveLength(3);

    const invalidLengthDataSet = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', adminToken)
      .send({
        name: makeLongString(16),
        description: makeLongString(501),
        websiteUrl: makeLongString(101)
      })
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(invalidLengthDataSet.body.errorMessages).toHaveLength(3);

    const invalidWebsiteUrlDataSet = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', adminToken)
      .send({
        name: 'Name',
        description: 'Some description',
        websiteUrl: 'Invalid-url'
      })
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(invalidWebsiteUrlDataSet.body.errorMessages).toHaveLength(1);

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

    expect(emptyBodyDataSet.body.errorMessages).toHaveLength(3);

    const emptyStringDataSet = await request(app)
      .put(`${BLOGS_PATH}/${blog.id}`)
      .set('Authorization', adminToken)
      .send({
        name: '',
        description: ' ',
        websiteUrl: '  '
      })
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(emptyStringDataSet.body.errorMessages).toHaveLength(3);

    const invalidLengthDataSet = await request(app)
      .put(`${BLOGS_PATH}/${blog.id}`)
      .set('Authorization', adminToken)
      .send({
        name: makeLongString(16),
        description: makeLongString(501),
        websiteUrl: makeLongString(101)
      })
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(invalidLengthDataSet.body.errorMessages).toHaveLength(3);

    const invalidWebsiteUrlDataSet = await request(app)
      .put(`${BLOGS_PATH}/${blog.id}`)
      .set('Authorization', adminToken)
      .send({
        name: 'Name',
        description: 'Some description',
        websiteUrl: 'Invalid-url'
      })
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(invalidWebsiteUrlDataSet.body.errorMessages).toHaveLength(1);

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
