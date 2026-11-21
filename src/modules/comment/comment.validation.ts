import { languageEnum } from "./../../Common/enum";
import { mongoId } from "./../post/post.validation";
import { z } from "zod";

const commentBody = () =>
  z.strictObject({
    content: z.string().trim().min(1).max(2000),
  });

export const addComment = (lang: languageEnum) =>
  z.object({
    params: z.object({ postId: mongoId(lang) }),
    body: commentBody(),
  });

export const listComments = (lang: languageEnum) =>
  z.object({
    params: z.object({ postId: mongoId(lang) }),
  });

export const commentParam = (lang: languageEnum) =>
  z.object({
    params: z.object({ commentId: mongoId(lang) }),
  });

export const editComment = (lang: languageEnum) =>
  z.object({
    params: z.object({ commentId: mongoId(lang) }),
    body: commentBody(),
  });
