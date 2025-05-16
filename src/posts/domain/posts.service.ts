import {postsRepository} from '../repositories/posts.repository';
import {NotFoundError} from '../../core/errors';
import {blogsService} from '../../blogs/domain/blogs.service';
import {PaginatedPosts, PostInputDto} from '../types/post';
import {Post} from '../types/post';
import {FullQueryOptions} from '../../shared/utils';

export const postsService = {
  async findMany(options: FullQueryOptions): Promise<PaginatedPosts> {
    return postsRepository.findMany(options);
  },

  async findById(id: string): Promise<Post> {
    const post = await postsRepository.findById(id);

    if (!post) {
      throw new NotFoundError('id', `Post with ID=${id} not found`);
    }

    return post;
  },

  async create(body: PostInputDto): Promise<Post> {
    const blog = await blogsService.findById(body.blogId);

    return postsRepository.create({
      ...body,
      blogId: blog.id,
      blogName: blog.name,
      createdAt: new Date().toISOString()
    });
  },

  async update(id: string, body: PostInputDto): Promise<void> {
    const post = await postsRepository.findById(id);

    if (!post) {
      throw new NotFoundError('id', `Post with ID=${id} not found`);
    }

    await blogsService.findById(body.blogId);

    return postsRepository.update(id, body);
  },

  async delete(id: string): Promise<void> {
    const post = await postsRepository.findById(id);

    if (!post) {
      throw new NotFoundError('id', `Post with ID=${id} not found`);
    }

    return postsRepository.delete(id);
  },

  async findPostsByBlogId(
    blogId: string,
    options: FullQueryOptions
  ): Promise<PaginatedPosts> {
    const blog = await blogsService.findById(blogId);

    return postsRepository.findPostsByBlogId(blog.id, options);
  },

  async createPostForBlog(blogId: string, body: Post) {
    const blog = await blogsService.findById(blogId);

    return postsRepository.create({
      ...body,
      blogId: blog.id,
      blogName: blog.name,
      createdAt: new Date().toISOString()
    });
  }
};
