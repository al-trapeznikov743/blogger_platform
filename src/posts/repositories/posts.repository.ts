import {ObjectId} from 'mongodb';
import {postCollection} from '../../db/mongo.db';
import {Post, PaginatedPosts, PostInputDto} from '../types/post';
import {mapMongoId} from '../../db/utils';
import {FullQueryOptions} from '../../shared/utils';

const getPosts = (
  filter: {[key: string]: any},
  {pageSize, pageNumber, sortBy, sortDirection}: FullQueryOptions
) =>
  Promise.all([
    postCollection
      .find(filter)
      .sort({[sortBy]: sortDirection})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray(),
    postCollection.countDocuments(filter)
  ]);

export const postsRepository = {
  async findMany(options: FullQueryOptions): Promise<PaginatedPosts> {
    const {pageSize, pageNumber} = options;

    const [posts, totalCount] = await getPosts({}, options);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount,
      items: posts.map(mapMongoId) as Post[]
    };
  },

  async findById(id: string): Promise<Post | null> {
    const post = await postCollection.findOne({_id: new ObjectId(id)});

    return post ? (mapMongoId(post) as Post) : post;
  },

  async findPostsByBlogId(blogId: string, options: FullQueryOptions) {
    const {pageNumber, pageSize} = options;

    const [posts, totalCount] = await getPosts({blogId}, options);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount,
      items: posts.map(mapMongoId) as Post[]
    };
  },

  async create(post: Post): Promise<Post> {
    const insertResult = await postCollection.insertOne(post);

    return mapMongoId({...post, _id: insertResult.insertedId}) as Post;
  },

  async update(id: string, body: PostInputDto): Promise<void> {
    const updateResult = await postCollection.updateOne(
      {_id: new ObjectId(id)},
      {$set: {...body}}
    );

    if (updateResult.matchedCount < 1) {
      throw new Error('Post not exist');
    }
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await postCollection.deleteOne({
      _id: new ObjectId(id)
    });

    if (deleteResult.deletedCount < 1) {
      throw new Error('Post not exist');
    }
  }
};
