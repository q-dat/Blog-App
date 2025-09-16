import mongoose, { Schema, Document } from 'mongoose';

export interface IPostDocument extends Document {
  _id: mongoose.Types.ObjectId;
  post_catalog_id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  imageUrl: string;
}

const PostSchema: Schema = new Schema<IPostDocument>(
  {
    post_catalog_id: {
      type: Schema.Types.ObjectId,
      ref: 'PostCatalog',
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model<IPostDocument>('Post', PostSchema);

export default Post;
