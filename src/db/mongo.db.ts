import {Collection, Db, MongoClient} from 'mongodb';
import {config} from '../core/settings/config';
import {UserDbType} from '../users/types/user';
import {BlogDbType} from '../blogs/types/blog';
import {PostDbType} from '../posts/types/post';

const USER_COLLECTION_NAME = 'users';
const BLOG_COLLECTION_NAME = 'blogs';
const POST_COLLECTION_NAME = 'posts';

export let client: MongoClient;
export let userCollection: Collection<UserDbType>;
export let blogCollection: Collection<BlogDbType>;
export let postCollection: Collection<PostDbType>;

export const runDB = async (url: string): Promise<void> => {
  client = new MongoClient(url);
  const db: Db = client.db(config.DB_NAME);

  userCollection = db.collection<UserDbType>(USER_COLLECTION_NAME);
  blogCollection = db.collection<BlogDbType>(BLOG_COLLECTION_NAME);
  postCollection = db.collection<PostDbType>(POST_COLLECTION_NAME);

  try {
    await client.connect();
    await db.command({ping: 1});

    console.log('✅ Connected to the database');
  } catch (e) {
    await client.close();

    throw new Error(`❌ Database not connected: ${e}`);
  }
};

export async function stopDb() {
  if (!client) {
    throw new Error(`❌ No active client`);
  }

  await client.close();
}
