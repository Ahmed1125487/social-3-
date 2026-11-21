import { generalValidationFields } from "./../../Common/utils/validation";
import { languageEnum } from "./../../Common/enum";
import { z } from "zod";

// a mongo id is exactly 24 hex chars
export const mongoId = (lang: languageEnum) =>
  generalValidationFields
    .id(lang)
    .refine((value) => /^[0-9a-fA-F]{24}$/.test(value), { message: "Invalid format " });

export const postContent = () =>
  z.object({
    body: z.strictObject({
      content: z.string().trim().min(1).max(5000),
    }),
  });

export const postParam = (lang: languageEnum) =>
  z.object({
    params: z.object({ postId: mongoId(lang) }),
  });

export const editPost = (lang: languageEnum) =>
  z.object({
    params: z.object({ postId: mongoId(lang) }),
    body: z.strictObject({
      content: z.string().trim().min(1).max(5000),
    }),
  });

export const postFeedQuery = (lang: languageEnum) =>
  z.object({
    query: z.object({
      page: generalValidationFields.page(),
      limit: generalValidationFields.limit(),
    }),
  });
