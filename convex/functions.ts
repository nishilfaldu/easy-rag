import { ConvexError } from "convex/values";
import {
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";

import type { MutationCtx, QueryCtx } from "./_generated/server";
import {
  mutation as mutationRaw,
  query as queryRaw,
} from "./_generated/server";
import { getUserByClerkId } from "./users";

// TODO: separate the redundant function into authCheck
const queryAuthCheck = customCtx(async (ctx: QueryCtx) => {
  // Look up the logged in user or get identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError(
      "Oops! It looks like you're not signed in/up. Please log in to continue."
    );
  }

  if (!identity.emailVerified) {
    throw new ConvexError(
      "Oops! Your email address hasn't been verified yet. Please check your inbox for the verification email."
    );
  }

  // NOTE: the below also throws an error
  const user = await getUserByClerkId(ctx, identity.subject);
  if (!user) {
    throw new ConvexError(
      "We couldn't find a user with that Clerk ID. Please check the Clerk ID and try again."
    );
  }

  return { db: ctx.db, user: user, storage: ctx.storage };
});

const mutationAuthCheck = customCtx(async (ctx: MutationCtx) => {
  // Look up the logged in user or get identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError(
      "Oops! It looks like you're not signed in/up. Please log in to continue."
    );
  }

  if (!identity.emailVerified) {
    throw new ConvexError(
      "Oops! Your email address hasn't been verified yet. Please check your inbox for the verification email."
    );
  }

  // NOTE: the below also throws an error
  const user = await getUserByClerkId(ctx, identity.subject);
  if (!user) {
    throw new ConvexError(
      "We couldn't find a user with that Clerk ID. Please check the Clerk ID and try again."
    );
  }

  return { db: ctx.db, user: user, storage: ctx.storage };
});

export const query = customQuery(queryRaw, queryAuthCheck);
export const mutation = customMutation(mutationRaw, mutationAuthCheck);
// export const action = customAction(actionRaw, authCheck);

// Public (unauthenticated) functions.
//
// The embeddable chatbot runs inside an iframe on someone else's website, where
// the visitor has no EasyRAG/Clerk session. The handful of functions that power
// that widget — reading a bot by id and reading/sending its messages — therefore
// can't go through the auth check above. These wrappers leave the rest of the
// platform locked down while exposing only that narrow surface.
export const publicQuery = customQuery(
  queryRaw,
  customCtx(async () => ({}))
);
export const publicMutation = customMutation(
  mutationRaw,
  customCtx(async () => ({}))
);
