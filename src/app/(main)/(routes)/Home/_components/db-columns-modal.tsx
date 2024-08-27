"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// Simulated database columns
const databaseColumns = [
  "id",
  "name",
  "email",
  "age",
  "created_at",
  "updated_at",
  "address",
  "phone_number",
  "subscription_status",
  "last_login",
];

export default function DbColumnsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const handleColumnToggle = (column: string) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const handleTrainModel = () => {
    console.log("Training model with columns:", selectedColumns);
    setIsOpen(false);
    // Here you would typically send the selectedColumns to your backend
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="w-full">
          Connect Database
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Database Columns</DialogTitle>
          <DialogDescription>
            Choose the columns you want to use for training your model.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <h4 className="text-sm font-medium mb-3 text-muted-foreground">
            Selected columns: {selectedColumns.length} /{" "}
            {databaseColumns.length}
          </h4>
          <ScrollArea className="h-[400px] w-full rounded-md border bg-muted/40 p-4">
            <div className="space-y-4">
              {databaseColumns.map((column) => (
                <div key={column} className="flex items-center space-x-3">
                  <Checkbox
                    id={column}
                    checked={selectedColumns.includes(column)}
                    onCheckedChange={() => handleColumnToggle(column)}
                    className="border-muted-foreground/50"
                  />
                  <label
                    htmlFor={column}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {column}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="flex justify-center sm:justify-center">
          <Button
            onClick={handleTrainModel}
            disabled={selectedColumns.length === 0}
            className="w-full sm:w-auto"
          >
            Train my Model
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
