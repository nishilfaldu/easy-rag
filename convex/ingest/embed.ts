import OpenAI from "openai";

export async function embedTexts(
  texts: string[],
  // TODO: this needs better type
  EMBEDDINGS_MODEL: string
) {
  if (texts.length === 0) return [];

  if (
    EMBEDDINGS_MODEL === "text-embedding-3-large" ||
    EMBEDDINGS_MODEL === "text-embedding-3-small" ||
    EMBEDDINGS_MODEL === "text-embedding-ada-002"
  ) {
    const openai = new OpenAI();
    const { data } = await openai.embeddings.create({
      input: texts,
      model: "text-embedding-ada-002",
    });
    return data.map(({ embedding }) => embedding);
  } else {
    // TODO: use transformers library here - add other options here
    return [[]];
  }
}
