export const embeddingModels = [
  "bert-base-uncased",
  "distilbert-base-uncased",
  "roberta-base",
  "microsoft/MiniLM-L12-H384-uncased",
  "distilroberta-base",
  "google/electra-small-discriminator",
  "albert-base-v2",
  "t5-small",
  "xlm-roberta-base",
  "text-embedding-3-large",
  "text-embedding-3-small",
  "text-embedding-ada-002",
  "all-MiniLM-L6-v2",
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
