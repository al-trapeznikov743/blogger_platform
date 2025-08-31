import {ObjectId} from 'mongodb';

export const COMMENTS_DI_TYPES = {
  CommentsRepository: Symbol.for('CommentsRepository'),
  CommentsService: Symbol.for('CommentsService'),
  CommentsController: Symbol.for('CommentsController')
};

export type BaseComment = {
  content: string;
  postId: string;
  userId: string;
  userLogin: string;
  createdAt: string;
};

export type CommentDbType = BaseComment & {
  _id?: ObjectId;
};

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
};

export type CommentInputDto = {
  content: string;
};

export type PaginatedComments = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Comment[];
};
