import {inject, injectable} from 'inversify';
import {BlogsRepository} from './../repositories/blogs.repository';
import {NotFoundError} from '../../core/errors';
import {
  Blog,
  BlogInputDto,
  FindBlogsQueryOptions,
  PaginatedBlogs,
  BLOG_DI_TYPES
} from '../types/blog';

@injectable()
export class BlogsService {
  constructor(
    @inject(BLOG_DI_TYPES.BlogsRepository) private blogsRepository: BlogsRepository
  ) {}

  async findMany(options: FindBlogsQueryOptions): Promise<PaginatedBlogs> {
    return this.blogsRepository.findMany(options);
  }

  async findById(id: string): Promise<Blog> {
    const blog = await this.blogsRepository.findById(id);

    if (!blog) {
      throw new NotFoundError('id', `Blog with ID=${id} not found`);
    }

    return blog;
  }

  async create(blog: BlogInputDto): Promise<Blog> {
    return this.blogsRepository.create({
      ...blog,
      createdAt: new Date().toISOString(),
      isMembership: false
    });
  }

  async update(id: string, body: BlogInputDto): Promise<void> {
    const blog = await this.blogsRepository.findById(id);

    if (!blog) {
      throw new NotFoundError('id', `Blog with ID=${id} not found`);
    }

    return this.blogsRepository.update(id, body);
  }

  async delete(id: string): Promise<void> {
    const blog = await this.blogsRepository.findById(id);

    if (!blog) {
      throw new NotFoundError('id', `Blog with ID=${id} not found`);
    }

    return this.blogsRepository.delete(id);
  }
}
