import {Express} from 'express';
import request from 'supertest';
import {POSTS_PATH} from '../../src/core/paths/paths';
import {HttpStatus} from '../../src/core/types/httpStatuses';
import {generateBasicAuthToken} from '.';
import {Post} from '../../src/posts/types/post';
import {PostInputDto} from '../../src/posts/types/post';

export const getPostDto = (blogId: string): PostInputDto => {
  return {
    title: 'New post title',
    shortDescription: 'Новое короткое описание...',
    content: 'Контент для нового поста...',
    blogId
  };
};

export const getPostById = async (app: Express, postId: string): Promise<Post> => {
  const postResponse = await request(app)
    .get(`${POSTS_PATH}/${postId}`)
    .expect(HttpStatus.OK_200);

  return postResponse.body;
};

export const createPost = async (app: Express, blogId: string): Promise<Post> => {
  const testPostData: PostInputDto = getPostDto(blogId);

  const createdPostResponse = await request(app)
    .post(POSTS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testPostData)
    .expect(HttpStatus.CREATED_201);

  return createdPostResponse.body;
};

export const updatePost = async (
  app: Express,
  postId: string,
  blogId: string
): Promise<void> => {
  const testPostData: PostInputDto = getPostDto(blogId);

  await request(app)
    .put(`${POSTS_PATH}/${postId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testPostData)
    .expect(HttpStatus.NO_CONTENT_204);
};
