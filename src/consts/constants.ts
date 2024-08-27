export const embeddingModels = [
  "bert-base-uncased",
  "distilbert-base-uncased",
  "roberta-base",
  "microsoft/MiniLM-L12-H384-uncased",
  "distilroberta-base",
  "gpt2",
  "google/electra-small-discriminator",
  "albert-base-v2",
  "t5-small",
  "xlm-roberta-base",
  "text-embedding-3-large",
  "text-embedding-3-small",
  "text-embedding-ada-002",
] as const;

export const llmModels = [
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4-turbo",
  "gpt-3.5-turbo",
] as const;

export const databaseTypes = ["postgresql", "mysql"] as const;
