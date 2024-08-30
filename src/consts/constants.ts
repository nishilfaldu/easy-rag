export const embeddingModels = [
  "text-embedding-3-large",
  "text-embedding-3-small",
  "text-embedding-ada-002",
  "all-MiniLM-L6-v2",
  "all-MiniLM-L12-v2",
  "nli-roberta-base-v2",
  "all-mpnet-base-v2",
  "all-distilroberta-v1",
  "gtr-t5-base",
  "sentence-t5-large",
] as const;

export const llmModels = [
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4-turbo",
  "gpt-3.5-turbo",
  "claude-3-5-sonnet-20240620",
  "claude-3-opus-20240229",
  "claude-3-sonnet-20240229",
  "claude-3-haiku-20240307",
] as const;

export const databaseTypes = ["postgresql", "mysql"] as const;
