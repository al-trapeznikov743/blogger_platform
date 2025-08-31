import {injectable} from 'inversify';
import {ObjectId} from 'mongodb';
import {db} from '../../db/mongo.db';
import {Post, PaginatedPosts, PostInputDto, BasePost} from '../types/post';
import {mapMongoId} from '../../db/utils';
import {FullQueryOptions} from '../../shared/utils';

const getPosts = (
  filter: {[key: string]: any},
  {pageSize, pageNumber, sortBy, sortDirection}: FullQueryOptions
) =>
  Promise.all([
    db
      .postCollection()
      .find(filter)
      .sort({[sortBy]: sortDirection})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray(),
    db.postCollection().countDocuments(filter)
  ]);

@injectable()
export class PostsRepository {
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
  }

  async findById(id: string): Promise<Post | null> {
    const post = await db.postCollection().findOne({_id: new ObjectId(id)});

    return post ? (mapMongoId(post) as Post) : post;
  }

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
  }

  async create(post: BasePost): Promise<Post> {
    const insertResult = await db.postCollection().insertOne(post);

    return mapMongoId({...post, _id: insertResult.insertedId}) as Post;
  }

  async update(id: string, body: PostInputDto): Promise<void> {
    await db.postCollection().updateOne(
      {
        _id: new ObjectId(id)
      },
      {$set: {...body}}
    );
  }

  async delete(id: string): Promise<void> {
    await db.postCollection().deleteOne({
      _id: new ObjectId(id)
    });
  }
}
