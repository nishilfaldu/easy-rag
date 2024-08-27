"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload } from "lucide-react"
import DatabaseReview from "./DatabaseReview"

export default function NewBotForm() {

  const [isOpen, setIsOpen] = useState(false)
  const embeddings = ["OpenAI", "Cohere", "Hugging Face"]
  const llmModels = ["GPT-3.5", "GPT-4", "Claude", "LLAMA"]
  const databaseTypes = ["PostgreSQL", "MySQL", "MongoDB", "SQLite"]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"> <PlusIcon className="mr-1 h-3 w-3" /> Add Chatbot</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Chatbot</DialogTitle>
          <DialogDescription>
            Choose to either upload files or connect a database for your chatbot.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="connect">Connect Database</TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name-upload">Name of the Chatbot</Label>
                <Input id="name-upload" placeholder="Enter chatbot name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="embedding-upload">Embedding transformer</Label>
                <Select>
                  <SelectTrigger id="embedding-upload">
                    <SelectValue placeholder="Select embedding" />
                  </SelectTrigger>
                  <SelectContent>
                    {embeddings.map((embed) => (
                      <SelectItem key={embed} value={embed.toLowerCase()}>
                        {embed}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="llm-upload">LLM Model</Label>
                <Select>
                  <SelectTrigger id="llm-upload">
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
                <Label htmlFor="file-upload">Upload files</Label>
                <Input id="file-upload" type="file" multiple />
              </div>
              <Button type="submit" className="w-full">
                <Upload className="mr-2 h-4 w-4" /> Upload
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="connect">
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
                    {embeddings.map((embed) => (
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
              <DatabaseReview/>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}