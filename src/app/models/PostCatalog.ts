import mongoose, { Schema, Document } from 'mongoose';

export interface IPostCatalogDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
}

const PostCatalogSchema: Schema = new Schema<IPostCatalogDocument>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const PostCatalog =
  mongoose.models.PostCatalog ||
  mongoose.model<IPostCatalogDocument>('PostCatalog', PostCatalogSchema);

export default PostCatalog;
