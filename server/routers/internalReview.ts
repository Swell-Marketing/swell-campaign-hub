import { router, adminProcedure } from "../_core/trpc";
import { dispatchInternalReviewEvent } from "../activepiecesHandoff";

export const internalReviewRouter = router({
  request: adminProcedure.mutation(async () => dispatchInternalReviewEvent()),
});
