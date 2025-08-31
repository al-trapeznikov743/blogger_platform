import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {COMMENTS_DI_TYPES} from '../types/comment';
import {HttpStatus} from '../../core/types/httpStatuses';
import {withErrorHandling} from '../../core/errors/withErrorHandling.decorator';
import {CommentsService} from '../domain/comments.service';

@injectable()
export class CommentsController {
  constructor(
    @inject(COMMENTS_DI_TYPES.CommentsService) private commentsService: CommentsService
  ) {}

  @withErrorHandling
  async getCommentById({params}: Request, res: Response) {
    const comment = await this.commentsService.findCommentById(params.id);

    res.status(HttpStatus.OK_200).send(comment);
  }

  @withErrorHandling
  async updateComment({params, body, user}: Request, res: Response) {
    await this.commentsService.update(user!.id, params.id, body);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  }

  @withErrorHandling
  async deleteComment({params, user}: Request, res: Response) {
    await this.commentsService.delete(user!.id, params.id);

    res.sendStatus(HttpStatus.NO_CONTENT_204);
  }
}
