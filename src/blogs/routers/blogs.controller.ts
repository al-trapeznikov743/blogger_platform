import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {HttpStatus} from '../../core/types/httpStatuses';
import {BlogsService} from '../domain/blogs.service';
import {getQueryOptions} from '../../shared/utils';
import {BLOG_DI_TYPES} from '../types/blog';
import {POST_DI_TYPES} from '../../posts/types/post';
import {PostsService} from '../../posts/domain/posts.service';
import {withErrorHandling} from '../../core/errors/withErrorHandling.decorator';

@injectable()
export class BlogsController {
  constructor(
    @inject(BLOG_DI_TYPES.BlogsService) private blogsService: BlogsService,
    @inject(POST_DI_TYPES.PostsService) private postsService: PostsService
  ) {}

  @withErrorHandling
  async getBlogs(req: Request, res: Response) {
    const options = getQueryOptions(req.query);
    const blogs = await this.blogsService.findMany(options);

    res.status(HttpStatus.OK_200).send(blogs);
  }

  @withErrorHandling
  async getBlogById({params}: Request, res: Response) {
    const blog = await this.blogsService.findById(params.id);

    res.status(HttpStatus.OK_200).send(blog);
  }

  @withErrorHandling
  async createBlog({body}: Request, res: Response) {
    const createdBlog = await this.blogsService.create(body);

    res.status(HttpStatus.CREATED_201).send(createdBlog);
  }

  @withErrorHandling
  async updateBlog({params, body}: Request, res: Response) {
    await this.blogsService.update(params.id, body);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  }

  @withErrorHandling
  async deleteBlog({params}: Request, res: Response) {
    await this.blogsService.delete(params.id);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  }

  @withErrorHandling
  async createPostForBlog({params, body}: Request, res: Response) {
    const post = await this.postsService.createPostForBlog(params.id, body);

    res.status(HttpStatus.CREATED_201).send(post);
  }

  @withErrorHandling
  async getPostsByBlogId(req: Request, res: Response) {
    const blogId = req.params.id;
    const options = getQueryOptions(req.query);

    const posts = await this.postsService.findPostsByBlogId(blogId, options);

    res.status(HttpStatus.OK_200).send(posts);
  }
}
