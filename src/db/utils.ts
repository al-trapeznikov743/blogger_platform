import {ObjectId} from 'mongodb';

export type MongoObj = {
  _id: ObjectId;
  [key: string]: any;
};

type ViewObj = {
  id: string;
  [key: string]: any;
};

export const mapMongoId = ({_id, ...rest}: MongoObj): ViewObj => {
  return {
    id: _id.toString(),
    ...rest
  };
};
