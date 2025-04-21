import {Collection, Db, MongoClient} from 'mongodb';
import {config} from '../core/settings/config';
import {Blog} from '../blogs/types/blog';
import {Post} from '../posts/types/post';

const BLOG_COLLECTION_NAME = 'blogs';
const POST_COLLECTION_NAME = 'posts';

export let client: MongoClient;
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;

export const runDB = async (url: string): Promise<void> => {
  client = new MongoClient(url);
  const db: Db = client.db(config.DB_NAME);

  blogCollection = db.collection<Blog>(BLOG_COLLECTION_NAME);
  postCollection = db.collection<Post>(POST_COLLECTION_NAME);

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
