import {CommentDbType} from '../types/comment';

export const getCommentInView = (comment: CommentDbType | null) => {
  return comment
    ? {
        id: comment._id!.toString(),
        content: comment.content,
        commentatorInfo: {
          userId: comment.userId,
          userLogin: comment.userLogin
        },
        createdAt: comment.createdAt
      }
    : comment;
};
