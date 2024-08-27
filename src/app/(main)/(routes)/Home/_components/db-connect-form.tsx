import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatabaseReview from "./db-columns-modal";
import { databaseTypes, embeddingModels, llmModels } from "@/consts/constants";

export default function DbConnectForm() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name-connect">Name of the Chatbot</Label>
        <Input id="name-connect" placeholder="Enter chatbot name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="embedding-connect">Embedding transformer</Label>
        <Select>
          <SelectTrigger id="embedding-connect">
            <SelectValue placeholder="Select embedding" />
          </SelectTrigger>
          <SelectContent>
            {embeddingModels.map((embed) => (
              <SelectItem key={embed} value={embed.toLowerCase()}>
                {embed}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="llm-connect">LLM Model</Label>
        <Select>
          <SelectTrigger id="llm-connect">
            <SelectValue placeholder="Select LLM model" />
          </SelectTrigger>
          <SelectContent>
            {llmModels.map((model) => (
              <SelectItem key={model} value={model.toLowerCase()}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="db-url">Database URL</Label>
        <Input id="db-url" placeholder="Enter database URL" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="db-type">Type of database</Label>
        <Select>
          <SelectTrigger id="db-type">
            <SelectValue placeholder="Select database type" />
          </SelectTrigger>
          <SelectContent>
            {databaseTypes.map((type) => (
              <SelectItem key={type} value={type.toLowerCase()}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* <Button type="submit" className="w-full">
        Connect Database
      </Button> */}
      <DatabaseReview />
    </form>
  );
}
