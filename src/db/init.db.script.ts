// import {blogCollection, postCollection} from './mongo.db';
// import {MongoRepository} from './repository.base';
// import {Blog} from '../blogs/types/blog';
// import {Post} from '../posts/types/post';
import {db} from './memory.db';

/* export const initDatabase = async () => {
  try {
    const blogsRepo = new MongoRepository<Blog>(blogCollection);
    const postsRepo = new MongoRepository<Post>(postCollection);

    await blogCollection.deleteMany({});
    await postCollection.deleteMany({});

    await blogsRepo.createMany(db.blogs.map(({id, ...rest}) => rest));
    await postsRepo.createMany(db.posts.map(({id, ...rest}) => rest));

    console.log('🌱 Database has been seeded successfully');
  } catch (e) {
    console.error('❌ Failed to seed database:', e);
  }
}; */
