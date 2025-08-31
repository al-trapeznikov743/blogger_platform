import {inject, injectable} from 'inversify';
import {NotFoundError} from '../../core/errors';
import {Post, PaginatedPosts, POST_DI_TYPES, PostInputDto} from '../types/post';
import {BLOG_DI_TYPES} from '../../blogs/types/blog';
import {PostsRepository} from '../repositories/posts.repository';
import {BlogsRepository} from '../../blogs/repositories/blogs.repository';
import {FullQueryOptions} from '../../shared/utils';

@injectable()
export class PostsService {
  constructor(
    @inject(POST_DI_TYPES.PostsRepository) private postsRepository: PostsRepository,
    @inject(BLOG_DI_TYPES.BlogsRepository) private blogsRepository: BlogsRepository
  ) {}

  async findMany(options: FullQueryOptions): Promise<PaginatedPosts> {
    return this.postsRepository.findMany(options);
  }

  async findById(id: string): Promise<Post> {
    const post = await this.postsRepository.findById(id);

    if (!post) {
      throw new NotFoundError('id', `Post with ID=${id} not found`);
    }

    return post;
  }

  async create(body: PostInputDto): Promise<Post> {
    const blog = await this.blogsRepository.findById(body.blogId);

    if (!blog) {
      throw new NotFoundError('id', `Blog with ID=${body.blogId} not found`);
    }

    return this.postsRepository.create({
      ...body,
      blogId: blog.id,
      blogName: blog.name,
      createdAt: new Date().toISOString()
    });
  }

  async update(id: string, body: PostInputDto): Promise<void> {
    const post = await this.postsRepository.findById(id);

    if (!post) {
      throw new NotFoundError('id', `Post with ID=${id} not found`);
    }

    const blog = await this.blogsRepository.findById(body.blogId);

    if (!blog) {
      throw new NotFoundError('id', `Blog with ID=${body.blogId} not found`);
    }

    return this.postsRepository.update(id, body);
  }

  async delete(id: string): Promise<void> {
    const post = await this.postsRepository.findById(id);

    if (!post) {
      throw new NotFoundError('id', `Post with ID=${id} not found`);
    }

    return this.postsRepository.delete(id);
  }

  async findPostsByBlogId(
    blogId: string,
    options: FullQueryOptions
  ): Promise<PaginatedPosts> {
    const blog = await this.blogsRepository.findById(blogId);

    if (!blog) {
      throw new NotFoundError('id', `Blog with ID=${blogId} not found`);
    }

    return this.postsRepository.findPostsByBlogId(blog.id, options);
  }

  async createPostForBlog(blogId: string, body: Post) {
    const blog = await this.blogsRepository.findById(blogId);

    if (!blog) {
      throw new NotFoundError('id', `Blog with ID=${blogId} not found`);
    }

    return this.postsRepository.create({
      ...body,
      blogId: blog.id,
      blogName: blog.name,
      createdAt: new Date().toISOString()
    });
  }
}
