import {ObjectId} from 'mongodb';

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
