import { authentication } from "./../../middleware/authentication.middleware";
import { responseFormatter } from "./../../middleware/response.middleware";
import { validation } from "./../../middleware/validation.middleware";
import { NextFunction, Request, Response, Router } from "express";
import { commentService } from "./comment.service";
import * as validators from "./comment.validation";

const router = Router({ strict: true, caseSensitive: true });

router.use(authentication());

router
  .route("/:commentId")
  .get(
    validation(validators.commentParam),
    responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
      const data = await commentService.findById(req.validate.params.commentId);
      return { data };
    }),
  )
  .patch(
    validation(validators.editComment),
    responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
      const { params, body } = req.validate;
      const data = await commentService.update(params.commentId, body.content, req.user);
      return { data };
    }),
  )
  .delete(
    validation(validators.commentParam),
    responseFormatter(async (req: Request, res: Response, next: NextFunction) => {
      await commentService.delete(req.validate.params.commentId, req.user);
      return { data: { deleted: true } };
    }),
  );

export default router;
