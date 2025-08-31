import {ObjectId} from 'mongodb';
import {FullPaginationSorting} from '../../core/types/paginationAndSorting';

export const BLOG_DI_TYPES = {
  BlogsRepository: Symbol.for('BlogsRepository'),
  BlogsService: Symbol.for('BlogsService'),
  BlogsController: Symbol.for('BlogsController')
};

export type BaseBlog = {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type Blog = BaseBlog & {
  id: string;
};

export type BlogDbType = BaseBlog & {
  _id?: ObjectId;
};

export type BlogInputDto = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogDtoForTest = {
  name?: string;
  description?: string;
  websiteUrl?: string;
};

export type PaginatedBlogs = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Blog[];
};

export type FindBlogsQueryOptions = FullPaginationSorting & {
  searchNameTerm?: string;
};
