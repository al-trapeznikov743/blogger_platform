import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {POST_DI_TYPES} from '../types/post';
import {COMMENTS_DI_TYPES} from '../../comments/types/comment';
import {withErrorHandling} from '../../core/errors/withErrorHandling.decorator';
import {getQueryOptions} from '../../shared/utils';
import {HttpStatus} from '../../core/types/httpStatuses';
import {PostsService} from '../domain/posts.service';
import {CommentsService} from '../../comments/domain/comments.service';

@injectable()
export class PostsController {
  constructor(
    @inject(POST_DI_TYPES.PostsService) private postsService: PostsService,
    @inject(COMMENTS_DI_TYPES.CommentsService) private commentsService: CommentsService
  ) {}

  @withErrorHandling
  async getPosts(req: Request, res: Response) {
    const options = getQueryOptions(req.query);
    const posts = await this.postsService.findMany(options);

    res.status(HttpStatus.OK_200).send(posts);
  }

  @withErrorHandling
  async getPostById({params}: Request, res: Response) {
    const post = await this.postsService.findById(params.id);

    res.status(HttpStatus.OK_200).send(post);
  }

  @withErrorHandling
  async createPost({body}: Request, res: Response) {
    const post = await this.postsService.create(body);

    res.status(HttpStatus.CREATED_201).send(post);
  }

  @withErrorHandling
  async updatePost({params, body}: Request, res: Response) {
    await this.postsService.update(params.id, body);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  }

  @withErrorHandling
  async deletePost({params}: Request, res: Response) {
    await this.postsService.delete(params.id);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  }

  @withErrorHandling
  async createComment({params, user, body}: Request, res: Response) {
    const comment = await this.commentsService.create(params.id, user!.id, body);

    res.status(HttpStatus.CREATED_201).send(comment);
  }

  @withErrorHandling
  async searchComments({params, query}: Request, res: Response) {
    const options = getQueryOptions(query);

    const post = await this.postsService.findById(params.id);
    const comments = await this.commentsService.findManyByPostId(post.id, options);

    res.status(HttpStatus.OK_200).send(comments);
  }
}
