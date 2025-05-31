import {ForbiddenError, NotFoundError} from '../../core/errors';
import {Comment, CommentInputDto, PaginatedComments} from '../types/comment';
import {commentsRepository} from '../repositories/comments.repository';
import {postsRepository} from '../../posts/repositories/posts.repository';
import {usersQueryRepository} from '../../users/repositories/users.query.repository';
import {FullPaginationSorting} from '../../core/types/paginationAndSorting';

export const commentsService = {
  async findManyByPostId(
    postId: string,
    options: FullPaginationSorting
  ): Promise<PaginatedComments> {
    return commentsRepository.findManyByPostId(postId, options);
  },

  async findCommentById(id: string): Promise<Comment> {
    const comment = await commentsRepository.findCommentById(id);

    if (!comment) {
      throw new NotFoundError('id', `Comment with ID=${id} not found`);
    }

    return comment;
  },

  async create(
    postId: string,
    userId: string,
    comment: CommentInputDto
  ): Promise<Comment> {
    const post = await postsRepository.findById(postId);

    if (!post) {
      throw new NotFoundError('id', `Post with ID=${postId} not found`);
    }

    const user = await usersQueryRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('id', `User with ID=${userId} not found`);
    }

    return commentsRepository.create({
      ...comment,
      postId,
      userId,
      userLogin: user.login,
      createdAt: new Date().toISOString()
    });
  },

  async update(userId: string, id: string, body: CommentInputDto): Promise<void> {
    const comment = await commentsRepository.findCommentById(id);

    if (!comment) {
      throw new NotFoundError('id', `Comment with ID=${id} not found`);
    }

    if (userId !== comment.commentatorInfo.userId) {
      throw new ForbiddenError('userId', 'You are not allowed to edit this comment');
    }

    return commentsRepository.update(id, body);
  },

  async delete(userId: string, id: string): Promise<void> {
    const comment = await commentsRepository.findCommentById(id);

    if (!comment) {
      throw new NotFoundError('id', `Comment with ID=${id} not found`);
    }

    if (userId !== comment.commentatorInfo.userId) {
      throw new ForbiddenError('userId', 'You are not allowed to delete this comment');
    }

    return commentsRepository.delete(id);
  }
};
