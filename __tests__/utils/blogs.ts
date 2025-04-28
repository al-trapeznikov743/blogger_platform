import request from 'supertest';
import {Express} from 'express';
import {BlogInputDto, BlogDtoForTest} from '../../src/blogs/types/blog';
import {Blog} from '../../src/blogs/types/blog';
import {BLOGS_PATH} from '../../src/core/paths/paths';
import {HttpStatus} from '../../src/core/types/httpStatuses';
import {generateBasicAuthToken} from '.';

export const getBlogDto = () => {
  return {
    name: 'New blog name',
    description: 'Вопросы новых технологий',
    websiteUrl: 'https://google.com/'
  };
};

export const getBlogById = async (app: Express, blogId: string): Promise<Blog> => {
  const blogResponse = await request(app)
    .get(`${BLOGS_PATH}/${blogId}`)
    .expect(HttpStatus.OK_200);

  return blogResponse.body;
};

export const createBlog = async (
  app: Express,
  blogDto?: BlogDtoForTest
): Promise<Blog> => {
  let defaultBlogData: BlogInputDto = getBlogDto();

  const testBlogData = {...defaultBlogData, ...blogDto};

  const createdBlogResponse = await request(app)
    .post(BLOGS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.CREATED_201);

  return createdBlogResponse.body;
};

export const updateBlog = async (
  app: Express,
  blogId: string,
  blogDto?: BlogInputDto
): Promise<void> => {
  const defaultBlogData: BlogInputDto = getBlogDto();

  const testDriverData = {...defaultBlogData, ...blogDto};

  const updatedBlogResponse = await request(app)
    .put(`${BLOGS_PATH}/${blogId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testDriverData)
    .expect(HttpStatus.NO_CONTENT_204);

  return updatedBlogResponse.body;
};
