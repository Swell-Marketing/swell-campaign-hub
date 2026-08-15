import {
  opportunityCollectionStates,
  opportunityOfferHypotheses,
  opportunityOnboardingStates,
  opportunityQualificationStates,
  opportunityScopeStates,
  opportunitySourceChannels,
} from "../../drizzle/schema";
import {
  createOpportunity,
  getOpportunityById,
  listOpportunities,
  updateOpportunity,
} from "../db";
import { adminProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const optionalUrl = z.string().url().max(2048).optional().nullable();
const optionalText = z.string().trim().max(8000).optional().nullable();

export const createOpportunityInput = z.object({
  accountName: z.string().trim().min(2).max(200),
  sourceChannel: z.enum(opportunitySourceChannels),
  sourceReference: optionalUrl,
  evidenceRoute: optionalUrl,
  evidenceSummary: optionalText,
  offerHypothesis: z.enum(opportunityOfferHypotheses),
  qualificationState: z.enum(opportunityQualificationStates),
  scopeState: z.enum(opportunityScopeStates),
  collectionState: z.enum(opportunityCollectionStates),
  onboardingState: z.enum(opportunityOnboardingStates),
  nextAction: optionalText,
  nextActionAt: z.date().optional().nullable(),
});

const updateOpportunityInput = createOpportunityInput.partial().extend({
  id: z.number().int().positive(),
});

export const opportunitiesRouter = router({
  list: adminProcedure.query(() => listOpportunities()),
  get: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const opportunity = await getOpportunityById(input.id);
      if (!opportunity) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Opportunity not found" });
      }
      return opportunity;
    }),
  create: adminProcedure.input(createOpportunityInput).mutation(async ({ ctx, input }) => {
    return createOpportunity({
      ...input,
      createdByUserId: ctx.user.id,
    });
  }),
  update: adminProcedure.input(updateOpportunityInput).mutation(async ({ input }) => {
    const { id, ...values } = input;
    const updated = await updateOpportunity(id, values);
    if (!updated) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Opportunity not found" });
    }
    return updated;
  }),
});
