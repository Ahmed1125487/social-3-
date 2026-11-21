import { authentication } from "./../../middleware/authentication.middleware";
import { responseFormatter } from "./../../middleware/response.middleware";
import { validation } from "./../../middleware/validation.middleware";
import { NextFunction, Request, Response, Router } from "express";
import * as commentValidators from "./../comment/comment.validation";
import { postService } from "./post.service";
import * as validators from "./post.validation";

const router = Router({ strict: true, caseSensitive: true });

// every post endpoint needs a logged-in user
router.use(authentication());

router
  .route("/")
  .post(
    validation(validators.postContent),
    responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
      const data = await postService.create(req.validate.body.content, req.user);
      return { status: 201, data };
    }),
  )
  .get(
    responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
      const data = await postService.findMine(req.user);
      return { data };
    }),
  );

// fixed path, so it has to come before "/:postId"
router.get(
  "/feed",
  validation(validators.postFeedQuery),
  responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit } = req.validate.query;
    const data = await postService.findFeed(page, limit);
    return { data };
  }),
);

// comments that belong to a post
router
  .route("/:postId/comments")
  .post(
    validation(commentValidators.addComment),
    responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
      const { params, body } = req.validate;
      const data = await postService.createComment(params.postId, body.content, req.user);
      return { status: 201, data };
    }),
  )
  .get(
    validation(commentValidators.listComments),
    responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
      const data = await postService.findComments(req.validate.params.postId);
      return { data };
    }),
  );

router
  .route("/:postId")
  .get(
    validation(validators.postParam),
    responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
      const data = await postService.findById(req.validate.params.postId);
      return { data };
    }),
  )
  .patch(
    validation(validators.editPost),
    responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
      const { params, body } = req.validate;
      const data = await postService.update(params.postId, body.content, req.user);
      return { data };
    }),
  )
  .delete(
    validation(validators.postParam),
    responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
      await postService.delete(req.validate.params.postId, req.user);
      return { data: { deleted: true } };
    }),
  );

export default router;
