export interface Blog {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

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
