/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as bots from "../bots.js";
import type * as documents from "../documents.js";
import type * as functions from "../functions.js";
import type * as http from "../http.js";
import type * as ingest_embed from "../ingest/embed.js";
import type * as ingest_load from "../ingest/load.js";
import type * as messages from "../messages.js";
import type * as serve from "../serve.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  bots: typeof bots;
  documents: typeof documents;
  functions: typeof functions;
  http: typeof http;
  "ingest/embed": typeof ingest_embed;
  "ingest/load": typeof ingest_load;
  messages: typeof messages;
  serve: typeof serve;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
