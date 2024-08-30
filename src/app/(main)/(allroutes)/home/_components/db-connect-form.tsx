"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import DatabaseReview from "./db-columns-modal";
import { addBotWithDb } from "@/actions/bot-actions";
import {
  getMysqlTablesWithColumns,
  getPostgresqlTablesWithColumns,
} from "@/actions/db-actions";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { databaseTypes, embeddingModels, llmModels } from "@/consts/constants";

// Define the schema with Zod
const dbConnectFormSchema = z.object({
  name: z
    .string({
      required_error: "Please enter a chatbot name",
    })
    .min(2, {
      message: "Chatbot name should be at least 2 characters",
    }),
  embeddingModel: z.enum(embeddingModels, {
    errorMap: () => ({ message: "Please select an embedding model" }),
  }),
  llmModel: z.enum(llmModels, {
    errorMap: () => ({ message: "Please select an LLM model" }),
  }),
  dbUrl: z.string().url("Please enter a valid database URL"),
  dbType: z.enum(databaseTypes, {
    errorMap: () => ({ message: "Please select a database type" }),
  }),
  selectedColumns: z
    .array(z.string())
    .min(1, "Please select at least one column"),
});

export type DbConnectFormValues = z.infer<typeof dbConnectFormSchema>;

export default function DbConnectForm() {
  const [tablesWithColumns, setTablesWithColumns] = useState<
    Record<string, string[]>
  >({});
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<DbConnectFormValues>({
    resolver: zodResolver(dbConnectFormSchema),
    defaultValues: {
      name: "",
      embeddingModel: embeddingModels[0],
      llmModel: llmModels[0],
      dbUrl: "",
      dbType: databaseTypes[0],
      selectedColumns: [],
    },
    reValidateMode: "onBlur",
  });

  async function onSubmit(data: DbConnectFormValues) {
    const bot = {
      name: data.name,
      embeddingModel: data.embeddingModel,
      completionModel: data.llmModel,
    };

    const selectedTables = Object.entries(tablesWithColumns).map(
      ([tableName, columns]) => {
        return {
          tableName,
          columns: columns.filter((column) =>
            data.selectedColumns.includes(column)
          ),
        };
      }
    );

    // filter out the object with no columns
    const filteredSelectedTables = selectedTables.filter(
      (table) => table.columns.length > 0
    );

    const database = {
      url: data.dbUrl,
      type: data.dbType,
      tables: filteredSelectedTables,
    };

    const response = await addBotWithDb(bot, database);

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  }

  const getTablesWithColumnNames = async () => {
    const errorInDbUrl =
      form.formState.errors.dbUrl && form.formState.errors.dbUrl.message;
    if (errorInDbUrl) {
      toast.error("Please enter a valid database URL.");

      return;
    }
    const dbUrl = form.getValues("dbUrl");
    const dbType = form.getValues("dbType");

    try {
      let fetchedTablesWithColumns;

      if (dbType === "postgresql") {
        fetchedTablesWithColumns = await getPostgresqlTablesWithColumns(dbUrl);
      } else if (dbType === "mysql") {
        fetchedTablesWithColumns = await getMysqlTablesWithColumns(dbUrl);
      } else {
        throw new Error("Unsupported database type.");
      }

      if (Object.keys(fetchedTablesWithColumns).length === 0) {
        toast.error("No tables found in the database.");
      } else {
        setTablesWithColumns(fetchedTablesWithColumns);
        setIsOpen(true); // Open modal when columns are successfully fetched
      }
    } catch (error) {
      toast.error("Error fetching tables with columns. Please try again.");
      console.error("Error fetching tables with columns:", error);
    }
  };

  console.log(form.watch());

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Name of the Chatbot */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name of the Chatbot</FormLabel>
              <FormControl>
                <Input placeholder="Enter chatbot name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Embedding Transformer */}
        <FormField
          control={form.control}
          name="embeddingModel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Embedding Transformer</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select embedding" />
                  </SelectTrigger>
                  <SelectContent>
                    {embeddingModels.map((embed) => (
                      <SelectItem key={embed} value={embed}>
                        {embed}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* LLM Model */}
        <FormField
          control={form.control}
          name="llmModel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LLM Model</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select LLM model" />
                  </SelectTrigger>
                  <SelectContent>
                    {llmModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Database URL */}
        <FormField
          control={form.control}
          name="dbUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Database URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter database URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Database Type */}
        <FormField
          control={form.control}
          name="dbType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type of Database</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select database type" />
                  </SelectTrigger>
                  <SelectContent>
                    {databaseTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-x-2">
          <DatabaseReview
            form={form}
            getTablesWithColumnNames={getTablesWithColumnNames}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            tablesWithColumns={tablesWithColumns}
          />
          <DialogFooter className="flex justify-center w-full">
            <DialogClose asChild>
              <Button
                disabled={form.watch("selectedColumns").length === 0}
                className="w-full"
                type="submit"
              >
                Train my Model
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </form>
    </Form>
  );
}
