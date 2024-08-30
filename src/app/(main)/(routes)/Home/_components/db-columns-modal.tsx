"use client";

import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import type { DbConnectFormValues } from "./db-connect-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";





interface DbColumnsModalProps {
  form: UseFormReturn<DbConnectFormValues, any, undefined>;
  getTablesWithColumnNames: () => Promise<void>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  tablesWithColumns: Record<string, string[]>;
}

export default function DbColumnsModal({
  form,
  getTablesWithColumnNames,
  isOpen,
  setIsOpen,
  tablesWithColumns,
}: DbColumnsModalProps) {
  const selectedColumns = form.watch("selectedColumns") || [];

  const handleColumnToggle = (column: string) => {
    const currentColumns = form.getValues("selectedColumns") || [];
    form.setValue(
      "selectedColumns",
      currentColumns.includes(column)
        ? currentColumns.filter(col => col !== column)
        : [...currentColumns, column]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="w-full"
          onClick={async () => {
            await getTablesWithColumnNames();
          }}
        >
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
          <ScrollArea className="h-[400px] w-full rounded-md border bg-muted/40 p-4">
            <div className="space-y-6">
              {Object.entries(tablesWithColumns).map(([tableName, columns]) => (
                <div key={tableName}>
                  <h4 className="text-md font-bold mb-2">{tableName}</h4>
                  <div className="space-y-2">
                    {columns.map(column => (
                      <FormField
                        key={column}
                        control={form.control}
                        name="selectedColumns"
                        render={() => (
                          <FormItem>
                            <div className="flex items-center space-x-3">
                              <FormControl>
                                <Checkbox
                                  id={column}
                                  checked={selectedColumns.includes(column)}
                                  onCheckedChange={() =>
                                    handleColumnToggle(column)
                                  }
                                  className="border-muted-foreground/50"
                                />
                              </FormControl>
                              <label
                                htmlFor={column}
                                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {column}
                              </label>
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
