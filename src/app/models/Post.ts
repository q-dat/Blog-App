import mongoose, { Schema } from 'mongoose';

export interface PostDocument extends Document {
  _id: mongoose.Types.ObjectId;
  post_catalog_id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  imageUrl: string;
}
const PostSchema: Schema = new Schema<PostDocument>(
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
  {
    timestamps: true,
  }
);
export default mongoose.models.Post || mongoose.model<PostDocument>('Post', PostSchema);
