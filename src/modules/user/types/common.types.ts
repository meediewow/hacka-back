import { ObjectId } from 'mongodb';

export interface IFindUserData {
  identifier?: string;
  id?: string | ObjectId;
}
