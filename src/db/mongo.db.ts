import {Collection, Db, MongoClient} from 'mongodb';
import {config} from '../core/settings/config';
import {UserDbType} from '../users/types/user';
import {BlogDbType} from '../blogs/types/blog';
import {PostDbType} from '../posts/types/post';
import {CommentDbType} from '../comments/types/comment';

const USER_COLLECTION_NAME = 'users';
const BLOG_COLLECTION_NAME = 'blogs';
const POST_COLLECTION_NAME = 'posts';
const COMMENT_COLLECTION_NAME = 'comment';

export const db = {
  client: {} as MongoClient,

  getDb(): Db {
    return this.client.db(config.DB_NAME);
  },

  async run(url: string) {
    try {
      this.client = new MongoClient(url);

      await this.client.connect();
      await this.getDb().command({ping: 1});

      console.log('Connected successfully to mongo server');
    } catch (e: unknown) {
      console.error("Can't connect to mongo server", e);

      await this.client.close();
    }
  },

  async stop() {
    await this.client.close();

    console.log('Connection successful closed');
  },

  async clearCollections() {
    try {
      //await this.getDb().dropDatabase()
      const db: Db = this.getDb();

      const collections = await db.listCollections().toArray();

      for (const collection of collections) {
        const collectionName = collection.name;
        await db.collection(collectionName).deleteMany({});
      }
    } catch (e: unknown) {
      console.error('Error in drop db:', e);

      await this.stop();
    }
  },

  getCollection<T extends Document>(name: string): Collection<T> {
    return this.getDb().collection<T>(name);
  },

  userCollection(): Collection<UserDbType> {
    return this.getDb().collection(USER_COLLECTION_NAME);
  },

  blogCollection(): Collection<BlogDbType> {
    return this.getDb().collection(BLOG_COLLECTION_NAME);
  },

  postCollection(): Collection<PostDbType> {
    return this.getDb().collection(POST_COLLECTION_NAME);
  },

  commentCollection(): Collection<CommentDbType> {
    return this.getDb().collection(COMMENT_COLLECTION_NAME);
  }
};
