import {ObjectId, WithId} from 'mongodb';
import {postCollection} from '../../db/mongo.db';
import {PostInputDto} from '../dto/post-dto';
import {Post} from '../types/post';

export const postsRepository = {
  async findAll(): Promise<WithId<Post>[]> {
    return postCollection.find().toArray();
  },

  async findById(id: string): Promise<WithId<Post> | null> {
    return postCollection.findOne({_id: new ObjectId(id)});
  },

  async create(newPost: Post): Promise<WithId<Post>> {
    const insertResult = await postCollection.insertOne(newPost);

    return {...newPost, _id: insertResult.insertedId};
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
