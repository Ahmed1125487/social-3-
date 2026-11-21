import { IPost } from "./../../Common/interface/post.interface";
import mongoose, { HydratedDocument } from "mongoose";

const postSchema = new mongoose.Schema<IPost>(
  {
    content: { type: String, required: true, trim: true, maxLength: 5000 },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// "my posts" and the feed are always newest first
postSchema.index({ owner: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

export const PostModel: mongoose.Model<IPost> =
  (mongoose.models.Post as mongoose.Model<IPost> | undefined) ??
  mongoose.model<IPost>("Post", postSchema);
export type HPost = HydratedDocument<IPost>;
