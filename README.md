# EasyRAG

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Convex](https://img.shields.io/badge/Convex-EE342F?style=flat-square&logo=convex&logoColor=white)](https://convex.dev/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai&logoColor=white)](https://openai.com/)
[![Anthropic](https://img.shields.io/badge/Claude-D97757?style=flat-square&logo=anthropic&logoColor=white)](https://www.anthropic.com/)

> Train your own retrieval-augmented chatbot on your own data, then drop it onto
> any website with a single snippet. Upload documents or connect a database,
> pick an embedding model and an LLM, and EasyRAG handles the chunking,
> embedding, vector search, and answering for you.

## What this was

I built EasyRAG when RAG was just becoming a thing. ChatGPT had made everyone
want a chatbot that actually knew *their* content, but the path from "I have a
pile of documents" to "there's a working assistant on my site" was still mostly
glue code and research papers. There were very few end-to-end products for it.

So I built one: a platform where anyone could ingest their own corpus, train a
retrieval-augmented chatbot on it, and embed that bot anywhere — no ML pipeline
to stand up, no vector database to operate. It was my deep-dive into how RAG
actually works under the hood: splitting, embeddings, vector similarity search,
and prompt assembly, all wired into a real product instead of a notebook.

## What it does

| Capability | Details |
|---|---|
| Ingest documents | Upload PDFs / Word docs (stored on S3); they are parsed, chunked, and embedded |
| Connect a database | Point it at a PostgreSQL or MySQL database and embed selected table columns |
| Choose your models | Ten embedding models and eight LLMs (OpenAI GPT-4o family + Anthropic Claude 3/3.5) |
| Retrieval-augmented answers | Questions are embedded, matched against your data by vector search, and answered with the retrieved context |
| Embeddable widget | Generate a snippet that drops the trained bot onto any site as a chat widget |
| Accounts & ownership | Clerk auth; each user manages their own bots, documents, and data sources |

## How retrieval works

```text
  documents / DB columns
          |
          v   load + parse        convex/ingest/load.ts
       raw text
          |
          v   split into chunks    convex/ingest  (chunks table)
        chunks
          |
          v   embed                convex/ingest/embed.ts  (OpenAI or local transformers)
      embeddings  ----------------> Convex vector index (embeddings table)
                                            |
   user question --> embed --> vector search (top-k)  --> relevant chunks
                                            |
                                            v   prompt + context
                                        LLM (GPT / Claude)   convex/serve.ts
                                            |
                                            v
                                       streamed answer
```

Ingestion runs as scheduled Convex actions, so a bot moves through
`loading -> splitting -> embedding -> deployed` while you watch its status
update live. Answering is a Convex action that embeds the latest question, runs
a vector search over that bot's embeddings, and streams the model's reply back
into the conversation.

## The embeddable widget

A trained bot is reachable as a standalone page at `/bot-only/<botId>`, designed
to be dropped into an `<iframe>`. The bot's detail page generates a ready-to-paste
HTML snippet that pins the widget to the corner of any site:

```html
<div id="chatbot-container"></div>
<script>
  window.addEventListener("load", function () {
    const iframe = document.createElement("iframe");
    iframe.src = "https://easy-rag.vercel.app/bot-only/<botId>";
    document.getElementById("chatbot-container").appendChild(iframe);
  });
</script>
```

Because the widget runs on a third-party site where the visitor has no EasyRAG
account, the three Convex functions it relies on — reading the bot and
reading/sending its messages — are exposed through dedicated **public**
(unauthenticated) wrappers in [`convex/functions.ts`](convex/functions.ts). The
rest of the platform (creating bots, listing your bots, ingestion) stays behind
Clerk auth.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router), React 18, TypeScript |
| Backend & data | Convex (database, scheduled actions, vector search) |
| Auth | Clerk |
| Models | OpenAI + Anthropic for completions; OpenAI / Hugging Face transformers for embeddings |
| Storage | AWS S3 for uploaded documents |
| UI | Tailwind CSS, shadcn/ui (Radix), Framer Motion |

## Project layout

```text
src/
  app/
    (marketing)/          landing page
    (main)/               authenticated app: home, bot management, about, contact
    (botonly-route)/      standalone embeddable widget served at /bot-only/[id]
    _components/          shared UI (nav, hero, providers)
  components/ui/          shadcn/ui primitives
  consts/                 model + database-type catalogs
convex/
  bots.ts                 bot CRUD (getBotById is public for the widget)
  messages.ts             conversation read/send (public for the widget)
  functions.ts            auth-checked and public Convex function wrappers
  ingest/                 load -> split -> embed pipeline
  serve.ts                vector search + LLM answer action
  schema.ts               tables, indexes, and the embeddings vector index
```

## Running it locally

Requires Node 18+, a [Convex](https://convex.dev) project, and a
[Clerk](https://clerk.com) application. Create `.env.local` with the values for
your own services:

```bash
NEXT_PUBLIC_CONVEX_URL=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
# set in your Convex deployment environment:
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
# plus AWS S3 credentials for document uploads
```

Then:

```bash
npm install
npx convex dev   # provisions the backend and pushes the schema/functions
npm run dev      # http://localhost:3000
```

## Status

This is a portfolio project from RAG's early days, kept as a record of building
an end-to-end retrieval pipeline and an embeddable chat product before that was
a well-trodden path. It is not maintained as a hosted service.
