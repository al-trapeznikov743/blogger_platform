import {FindBlogsQueryOptions, PaginatedBlogs} from './../types/blog';
import {blogsRepository} from './../repositories/blogs.repository';
import {NotFoundError} from '../../core/errors';
import {BlogInputDto} from '../types/blog';
import {Blog} from '../types/blog';

export const blogsService = {
  async findMany(options: FindBlogsQueryOptions): Promise<PaginatedBlogs> {
    return blogsRepository.findMany(options);
  },

  async findById(id: string): Promise<Blog> {
    const blog = await blogsRepository.findById(id);

    if (!blog) {
      throw new NotFoundError('id', `Blog with ID=${id} not found`);
    }

    return blog;
  },

  async create(blog: BlogInputDto): Promise<Blog> {
    return blogsRepository.create({
      ...blog,
      createdAt: new Date().toISOString(),
      isMembership: false
    });
  },

  async update(id: string, body: BlogInputDto): Promise<void> {
    const blog = await blogsRepository.findById(id);

    if (!blog) {
      throw new NotFoundError('id', `Blog with ID=${id} not found`);
    }

    return blogsRepository.update(id, body);
  },

  async delete(id: string): Promise<void> {
    const blog = await blogsRepository.findById(id);

    if (!blog) {
      throw new NotFoundError('id', `Blog with ID=${id} not found`);
    }

    return blogsRepository.delete(id);
  }
};
