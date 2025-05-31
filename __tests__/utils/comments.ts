import {Express} from 'express';
import request from 'supertest';
import {COMMENTS_PATH, POSTS_PATH} from '../../src/core/paths/paths';
import {HttpStatus} from '../../src/core/types/httpStatuses';
import {generateBasicAuthToken} from '.';
import {Post} from '../../src/posts/types/post';
import {PostInputDto} from '../../src/posts/types/post';
import {CommentInputDto} from '../../src/comments/types/comment';

export const getCommentDto = () => {
  return {content: 'New my comment content row'};
};

export const createComment = async (
  app: Express,
  postId: string,
  accessToken: string
): Promise<Post> => {
  const commentDto: CommentInputDto = getCommentDto();

  const createdCommentResponse = await request(app)
    .post(`${POSTS_PATH}/${postId}/comments`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(commentDto)
    .expect(HttpStatus.CREATED_201);

  return createdCommentResponse.body;
};

export const getCommentById = async (app: Express, id: string) => {
  const commentResponse = await request(app)
    .get(`${COMMENTS_PATH}/${id}`)
    .expect(HttpStatus.OK_200);

  return commentResponse.body;
};
