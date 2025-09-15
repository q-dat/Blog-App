import { IPostCatalog } from './post-catalog';

export interface IPost {
  _id: string;
  title: string;
  post_catalog_id: IPostCatalog;
  content: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}
