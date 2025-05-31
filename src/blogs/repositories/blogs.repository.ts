import {ObjectId} from 'mongodb';
import {blogCollection} from '../../db/mongo.db';
import {
  Blog,
  BaseBlog,
  BlogInputDto,
  FindBlogsQueryOptions,
  PaginatedBlogs
} from '../types/blog';
import {mapMongoId} from '../../db/utils';

export const blogsRepository = {
  async findMany({
    sortBy,
    sortDirection,
    pageNumber,
    pageSize,
    searchNameTerm
  }: FindBlogsQueryOptions): Promise<PaginatedBlogs> {
    const filter: any = {};

    if (searchNameTerm) {
      filter.name = {$regex: searchNameTerm, $options: 'i'};
    }

    const blogs = await blogCollection
      .find(filter)
      .sort({[sortBy]: sortDirection})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const totalCount = await blogCollection.countDocuments(filter);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount,
      items: blogs.map(mapMongoId) as Blog[]
    };
  },

  async findById(id: string): Promise<Blog | null> {
    const blog = await blogCollection.findOne({_id: new ObjectId(id)});

    return blog ? (mapMongoId(blog) as Blog) : blog;
  },

  async create(blog: BaseBlog): Promise<Blog> {
    const insertResult = await blogCollection.insertOne(blog);

    return mapMongoId({...blog, _id: insertResult.insertedId}) as Blog;
  },

  async update(id: string, body: BlogInputDto): Promise<void> {
    const updateResult = await blogCollection.updateOne(
      {_id: new ObjectId(id)},
      {$set: {...body}}
    );

    if (updateResult.matchedCount < 1) {
      throw new Error('Blog not exist');
    }
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await blogCollection.deleteOne({
      _id: new ObjectId(id)
    });

    if (deleteResult.deletedCount < 1) {
      throw new Error('Blog not exist');
    }
  }
};
