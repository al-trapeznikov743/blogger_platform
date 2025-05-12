import {ObjectId} from 'mongodb';

export type BasePost = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type Post = BasePost & {
  id: string;
};

export type PostDbType = BasePost & {
  _id?: ObjectId;
};

export type PostInputDto = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type PaginatedPosts = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Post[];
};
