import {inject, injectable} from 'inversify';
import {ForbiddenError, NotFoundError} from '../../core/errors';
import {POST_DI_TYPES} from '../../posts/types/post';
import {
  Comment,
  CommentInputDto,
  COMMENTS_DI_TYPES,
  PaginatedComments
} from '../types/comment';
import {CommentsRepository} from '../repositories/comments.repository';
import {PostsRepository} from '../../posts/repositories/posts.repository';
import {UsersQueryRepository} from '../../users/repositories/users.query.repository';
import {FullPaginationSorting} from '../../core/types/paginationAndSorting';
import {USERS_DI_TYPES} from '../../users/types/user';

@injectable()
export class CommentsService {
  constructor(
    @inject(COMMENTS_DI_TYPES.CommentsRepository)
    private commentsRepository: CommentsRepository,
    @inject(POST_DI_TYPES.PostsRepository) private postsRepository: PostsRepository,
    @inject(USERS_DI_TYPES.UsersQueryRepository)
    private usersQueryRepository: UsersQueryRepository
  ) {}

  async findManyByPostId(
    postId: string,
    options: FullPaginationSorting
  ): Promise<PaginatedComments> {
    return this.commentsRepository.findManyByPostId(postId, options);
  }

  async findCommentById(id: string): Promise<Comment> {
    const comment = await this.commentsRepository.findCommentById(id);

    if (!comment) {
      throw new NotFoundError('id', `Comment with ID=${id} not found`);
    }

    return comment;
  }

  async create(
    postId: string,
    userId: string,
    comment: CommentInputDto
  ): Promise<Comment> {
    const post = await this.postsRepository.findById(postId);

    if (!post) {
      throw new NotFoundError('id', `Post with ID=${postId} not found`);
    }

    const user = await this.usersQueryRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('id', `User with ID=${userId} not found`);
    }

    return this.commentsRepository.create({
      ...comment,
      postId,
      userId,
      userLogin: user.login,
      createdAt: new Date().toISOString()
    });
  }

  async update(userId: string, id: string, body: CommentInputDto): Promise<void> {
    const comment = await this.commentsRepository.findCommentById(id);

    if (!comment) {
      throw new NotFoundError('id', `Comment with ID=${id} not found`);
    }

    if (userId !== comment.commentatorInfo.userId) {
      throw new ForbiddenError('userId', 'You are not allowed to edit this comment');
    }

    return this.commentsRepository.update(id, body);
  }

  async delete(userId: string, id: string): Promise<void> {
    const comment = await this.commentsRepository.findCommentById(id);

    if (!comment) {
      throw new NotFoundError('id', `Comment with ID=${id} not found`);
    }

    if (userId !== comment.commentatorInfo.userId) {
      throw new ForbiddenError('userId', 'You are not allowed to delete this comment');
    }

    return this.commentsRepository.delete(id);
  }
}
