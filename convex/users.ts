import type { UserJSON } from "@clerk/nextjs/server";
import type { Validator } from "convex/values";
import { ConvexError, v } from "convex/values";

import type { QueryCtx } from "./_generated/server";
import { internalMutation } from "./_generated/server";
import { query } from "./functions";

export const getCurrentUser = query({
  args: {},
  handler: async ({ user }) => {
    return user;
  },
});

export const getUserById = query({
  args: {
    id: v.id("users"),
  },
  handler: async ({ db }, { id }) => {
    return await db.get(id);
  },
});

export async function getUserByClerkId(ctx: QueryCtx, clerkId: string) {
  const user = await ctx.db
    .query("users")
    .withIndex("byClerkId", (q) => q.eq("clerkId", clerkId))
    .unique();

  return user;
}

// Start: Clerk utils start here
export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    // TODO: have a general utility to cast nulls to undefined
    const userAttributes = {
      firstName: data.first_name!,
      lastName: data.last_name!,
      clerkId: data.id,
      username: data.username!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      email: data.email_addresses.find(
        (emailAddress) => emailAddress.id === data.primary_email_address_id
      )?.email_address!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      phoneNumber: data.phone_numbers.find(
        (phoneNumber) => phoneNumber.id === data.primary_phone_number_id
      )?.phone_number!,
      imageUrl: data.image_url,
    };

    const user = await getUserByClerkId(ctx, data.id);
    try {
      if (user === null) {
        await ctx.db.insert("users", {
          ...userAttributes,
        });
      } else {
        await ctx.db.patch(user._id, { ...userAttributes });
      }
    } catch (error) {
      console.log(error);
      throw new ConvexError(
        "We encountered an issue processing your request. Please try again later."
      );
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await getUserByClerkId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`
      );
    }
  },
});
// End: Clerk utils end here
