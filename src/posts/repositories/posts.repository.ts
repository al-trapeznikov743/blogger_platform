import {db} from '../../db/memory.db';
import {Repository} from '../../db/repository.base';
import {PostInputDto} from '../dto/post-dto';
import {Post} from '../types/posts';

export const postsRepository = new Repository<Post, PostInputDto>(db, 'posts');
