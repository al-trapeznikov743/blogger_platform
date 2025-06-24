import {ObjectId} from 'mongodb';
import {db} from '../../db/mongo.db';
import {BaseComment, Comment, CommentInputDto, PaginatedComments} from '../types/comment';
import {getCommentInView} from './utils';
import {FullPaginationSorting} from '../../core/types/paginationAndSorting';

export const commentsRepository = {
  async findManyByPostId(
    postId: string,
    {sortBy, sortDirection, pageNumber, pageSize}: FullPaginationSorting
  ): Promise<PaginatedComments> {
    const filter: any = {postId};

    const comments = await db
      .commentCollection()
      .find(filter)
      .sort({[sortBy]: sortDirection})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await db.commentCollection().countDocuments(filter);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount,
      items: comments.map(getCommentInView) as Comment[]
    };
  },

  async findCommentById(id: string): Promise<Comment | null> {
    const comment = await db.commentCollection().findOne({_id: new ObjectId(id)});

    return comment ? (getCommentInView(comment) as Comment) : comment;
  },

  async create(comment: BaseComment): Promise<Comment> {
    const insertResult = await db.commentCollection().insertOne(comment);

    return getCommentInView({...comment, _id: insertResult.insertedId}) as Comment;
  },

  async update(id: string, body: CommentInputDto): Promise<void> {
    const updateResult = await db
      .commentCollection()
      .updateOne({_id: new ObjectId(id)}, {$set: {...body}});

    if (updateResult.matchedCount < 1) {
      throw new Error('Comment not exist');
    }
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await db.commentCollection().deleteOne({
      _id: new ObjectId(id)
    });

    if (deleteResult.deletedCount < 1) {
      throw new Error('Comment not exist');
    }
  }
};
