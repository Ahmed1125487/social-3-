import {
  ForBiddenException,
  NotFoundException,
  BadRequestException,
} from "./../../Common/exception";
import { CommentRepository, PostRepository } from "./../../Common/repository";
import { HUser } from "./../../DB/model/user.model";
import mongoose from "mongoose";

const toPostId = (id: string): mongoose.Types.ObjectId => {
  if (!mongoose.isObjectIdOrHexString(id)) {
    throw new BadRequestException("Invalid post ID");
  }
  return new mongoose.Types.ObjectId(id);
};

export class PostService {
  private readonly postRepository = new PostRepository();
  private readonly commentRepository = new CommentRepository();

  async create(content: string, user: HUser) {
    return await this.postRepository.createOne({
      data: { content, owner: user._id },
    });
  }

  async findMine(user: HUser) {
    return await this.postRepository.find({
      filter: { owner: user._id },
      options: { sort: { createdAt: -1 } },
    });
  }

  async findFeed(page: number, limit: number) {
    return await this.postRepository.paginate({
      filter: {},
      options: {
        sort: { createdAt: -1 },
        populate: [{ path: "owner", select: "firstName lastName image" }],
      },
      page,
      limit,
    });
  }

  async findById(id: string) {
    const post = await this.postRepository.findById({ id: toPostId(id) });
    if (!post) throw new NotFoundException("Post not found");
    return post;
  }

  // loads the post and makes sure `user` is the one who wrote it
  private async findOwned(id: string, user: HUser, action: string) {
    const post = await this.findById(id);
    if (!post.owner.equals(user._id)) {
      throw new ForBiddenException(`Only the post owner can ${action} it`);
    }
    return post;
  }

  async update(id: string, content: string, user: HUser) {
    const post = await this.findOwned(id, user, "update");
    post.content = content;
    return await post.save();
  }

  async delete(id: string, user: HUser) {
    const post = await this.findOwned(id, user, "delete");
    // a deleted post shouldn't leave orphan comments behind
    await this.commentRepository.deleteMany({ filter: { post: post._id } });
    await post.deleteOne();
  }

  async createComment(postId: string, content: string, user: HUser) {
    const post = await this.findById(postId);
    return await this.commentRepository.createOne({
      data: { content, post: post._id, owner: user._id },
    });
  }

  async findComments(postId: string) {
    const post = await this.findById(postId);
    const comments = await this.commentRepository.find({
      filter: { post: post._id },
      options: { sort: { createdAt: -1 } },
    });
    return comments;
  }
}

export const postService = new PostService();
