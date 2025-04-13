import {db} from '../../db/memory.db';
import {Repository} from '../../db/repository.base';
import {BlogInputDto} from '../dto/blog-dto';
import {Blog} from '../types/blogs';

export const blogsRepository = new Repository<Blog, BlogInputDto>(db, 'blogs');
