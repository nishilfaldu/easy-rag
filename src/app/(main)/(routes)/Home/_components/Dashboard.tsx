"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NewBotForm from "./NewBotForm";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/app/_components/empty-state";

const getStatusColor = (progress: string) => {
  if (progress === "Error") return "bg-red-100 text-red-800";
  if (progress === "Loading") return "bg-yellow-100 text-yellow-800";
  if (progress === "Splitting") return "bg-blue-100 text-blue-800";
  if (progress === "Embedding") return "bg-purple-100 text-purple-800";
  return "bg-green-100 text-green-800";
};

const getStatusText = (progress: string) => {
  return progress;
};

export default function Dashboard() {
  const { isAuthenticated } = useConvexAuth();
  const bots = useQuery(api.bots.list, isAuthenticated ? undefined : "skip");

  const isBotsLoading = !bots; // Determine if bots are loading

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Home</h1>
        <NewBotForm />
      </header>

      {isBotsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Render 4 skeleton cards as placeholders */}
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="overflow-hidden rounded-lg shadow">
              <CardHeader className="bg-muted py-2 px-3">
                <Skeleton className="h-6 w-3/4 bg-gray-300 rounded-md" />
              </CardHeader>
              <CardContent className="p-3">
                <div className="mb-2 flex justify-between items-center">
                  <span className="text-xs font-medium">Status:</span>
                  <Skeleton className="h-4 w-1/4 bg-gray-300 rounded-md" />
                </div>
                <div className="mb-2">
                  <h3 className="text-xs font-semibold mb-1">
                    Embedded Transformers:
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    <Skeleton className="h-6 w-1/4 bg-gray-300 rounded-full" />
                    <Skeleton className="h-6 w-1/4 bg-gray-300 rounded-full" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold mb-1">Models:</h3>
                  <div className="flex flex-wrap gap-1">
                    <Skeleton className="h-6 w-1/4 bg-gray-300 rounded-full" />
                    <Skeleton className="h-6 w-1/4 bg-gray-300 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : bots.length === 0 ? (
        <EmptyState
          imagePath="/hippo-empty-cart.png"
          message="You have no bots"
          linkMessage="Create a new bot by clicking Add Chatbot"
          linkHref={{ pathname: "/Home" }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {bots.map((bot) => (
            <Card
              key={bot._id}
              className="overflow-hidden rounded-lg shadow hover:shadow-md transition-shadow duration-300"
            >
              <CardHeader className="bg-muted py-2 px-3">
                <CardTitle className="text-base font-medium">
                  {bot.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="mb-2 flex justify-between items-center">
                  <span className="text-xs font-medium">Status:</span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(
                      bot.progress
                    )}`}
                  >
                    {getStatusText(bot.progress)}
                  </span>
                </div>
                <div className="mb-2">
                  <h3 className="text-xs font-semibold mb-1">
                    Embedded Transformers:
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {/* {bot.embeddedTransformers.map((transformer, index) => ( */}
                    <span className="bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-full text-[10px]">
                      {bot.embeddingModel}
                    </span>
                    {/* ))} */}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold mb-1">Models:</h3>
                  <div className="flex flex-wrap gap-1">
                    {/* {bot.models.map((model, index) => ( */}
                    <span className="bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full text-[10px]">
                      {bot.completionModel}
                    </span>
                    {/* ))} */}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
