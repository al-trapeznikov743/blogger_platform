import dotenv from 'dotenv';
dotenv.config();
import request from 'supertest';
import express from 'express';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {ObjectId} from 'mongodb';
import {HttpStatus} from '../../../src/core/types/httpStatuses';
import {POSTS_PATH} from '../../../src/core/paths/paths';
import {db} from '../../../src/db/mongo.db';
import {setupApp} from '../../../src/setupApp';
import {PostInputDto} from '../../../src/posts/types/post';
import {createPost, getPostDto} from '../../utils/posts';
import {generateBasicAuthToken, getInvalidQueryParams, makeLongString} from '../../utils';
import {createBlog} from '../../utils/blogs';

describe('Posts API validation check', () => {
  const app = express();
  setupApp(app);

  const randomId = new ObjectId().toString();
  const adminToken = generateBasicAuthToken();

  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    await db.run(mongoServer.getUri());
  });

  afterAll(async () => {
    await db.clearCollections();
    await db.stop();
    await mongoServer.stop();
  });

  it('❌ should not get posts when incorrect query param; POST /blogs', async () => {
    const blog = await createBlog(app);
    await createPost(app, blog.id);

    const emptyBodyDataSet = await request(app)
      .get(POSTS_PATH)
      .query(getInvalidQueryParams())
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(emptyBodyDataSet.body.errorsMessages).toHaveLength(4);
  });

  it(`❌ should not create post when incorrect body passed; POST /posts`, async () => {
    const blog = await createBlog(app);
    const correctTestPostData: PostInputDto = getPostDto(blog.id);

    await request(app)
      .post(POSTS_PATH)
      .send(correctTestPostData)
      .expect(HttpStatus.UNAUTHORIZED_401);

    const emptyBodyDataSet = await request(app)
      .post(POSTS_PATH)
      .set('Authorization', adminToken)
      .send({})
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(emptyBodyDataSet.body.errorsMessages).toHaveLength(4);

    const emptyStringDataSet = await request(app)
      .post(POSTS_PATH)
      .set('Authorization', adminToken)
      .send({
        title: '',
        shortDescription: ' ',
        content: '  ',
        blogId: '   '
      })
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(emptyStringDataSet.body.errorsMessages).toHaveLength(4);

    const invalidLengthDataSet = await request(app)
      .post(POSTS_PATH)
      .set('Authorization', adminToken)
      .send({
        title: makeLongString(31),
        shortDescription: makeLongString(101),
        content: makeLongString(1001),
        blogId: blog.id
      })
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(invalidLengthDataSet.body.errorsMessages).toHaveLength(3);

    const randomBlogIdDataSet = await request(app)
      .post(POSTS_PATH)
      .set('Authorization', adminToken)
      .send({
        title: 'SomeTitle',
        shortDescription: 'SomeShortDescription',
        content: 'SomeContent',
        blogId: randomId
      })
      .expect(HttpStatus.NOT_FOUND_404);

    expect(randomBlogIdDataSet.body.errorsMessages).toHaveLength(1);

    const blogIdNotNumericDataSet = await request(app)
      .post(POSTS_PATH)
      .set('Authorization', adminToken)
      .send({
        title: 'SomeTitle',
        shortDescription: 'SomeShortDescription',
        content: 'SomeContent',
        blogId: 'blogId'
      })
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(blogIdNotNumericDataSet.body.errorsMessages).toHaveLength(1);
  });

  it(`❌ should not update post when incorrect body passed; PUT /posts/:id'`, async () => {
    const blog = await createBlog(app);
    const post = await createPost(app, blog.id);

    const correctTestPostData: PostInputDto = getPostDto(blog.id);

    await request(app)
      .put(`${POSTS_PATH}/${post.id}`)
      .send(correctTestPostData)
      .expect(HttpStatus.UNAUTHORIZED_401);

    const postNotFoundDataSet = await request(app)
      .put(`${POSTS_PATH}/${randomId}`)
      .set('Authorization', adminToken)
      .send(correctTestPostData)
      .expect(HttpStatus.NOT_FOUND_404);

    expect(postNotFoundDataSet.body.errorsMessages).toHaveLength(1);

    const emptyBodyDataSet = await request(app)
      .put(`${POSTS_PATH}/${post.id}`)
      .set('Authorization', adminToken)
      .send({})
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(emptyBodyDataSet.body.errorsMessages).toHaveLength(4);

    const emptyStringDataSet = await request(app)
      .put(`${POSTS_PATH}/${post.id}`)
      .set('Authorization', adminToken)
      .send({
        title: '',
        shortDescription: ' ',
        content: '  ',
        blogId: '   '
      })
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(emptyStringDataSet.body.errorsMessages).toHaveLength(4);

    const invalidLengthDataSet = await request(app)
      .put(`${POSTS_PATH}/${post.id}`)
      .set('Authorization', adminToken)
      .send({
        title: makeLongString(31),
        shortDescription: makeLongString(101),
        content: makeLongString(1001),
        blogId: blog.id
      })
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(invalidLengthDataSet.body.errorsMessages).toHaveLength(3);

    const randomBlogIdDataSet = await request(app)
      .put(`${POSTS_PATH}/${post.id}`)
      .set('Authorization', adminToken)
      .send({
        title: 'SomeTitle',
        shortDescription: 'SomeShortDescription',
        content: 'SomeContent',
        blogId: randomId
      })
      .expect(HttpStatus.NOT_FOUND_404);

    expect(randomBlogIdDataSet.body.errorsMessages).toHaveLength(1);

    const blogIdNotNumericDataSet = await request(app)
      .put(`${POSTS_PATH}/${post.id}`)
      .set('Authorization', adminToken)
      .send({
        title: 'SomeTitle',
        shortDescription: 'SomeShortDescription',
        content: 'SomeContent',
        blogId: 'blogId'
      })
      .expect(HttpStatus.BAD_REQUEST_400);

    expect(blogIdNotNumericDataSet.body.errorsMessages).toHaveLength(1);
  });

  it(`❌ should not deleted post when incorrect param; DELETE /posts/:id'`, async () => {
    const blog = await createBlog(app);
    const post = await createPost(app, blog.id);

    await request(app)
      .delete(`${POSTS_PATH}/${post.id}`)
      .send()
      .expect(HttpStatus.UNAUTHORIZED_401);

    const postNotFoundDataSet = await request(app)
      .delete(`${POSTS_PATH}/${randomId}`)
      .set('Authorization', adminToken)
      .send()
      .expect(HttpStatus.NOT_FOUND_404);

    expect(postNotFoundDataSet.body.errorsMessages).toHaveLength(1);
  });
});
