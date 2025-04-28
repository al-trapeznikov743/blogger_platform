export interface Post {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
}

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
