import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import NewBotForm from "../_components/NewBotForm"

const projects = [
  {
    id: 1,
    name: "Project Alpha",
    progress: "Loading",
    embeddedTransformers: ["BERT", "GPT-2"],
    models: ["Classification", "NER"]
  },
  {
    id: 2,
    name: "Project Beta",
    progress: "Splitting",
    embeddedTransformers: ["RoBERTa"],
    models: ["Sentiment Analysis"]
  },
  {
    id: 3,
    name: "Project Gamma",
    progress: "Embedding",
    embeddedTransformers: ["T5", "BART"],
    models: ["Summarization", "Translation"]
  },
  {
    id: 4,
    name: "Project Delta",
    progress: "Deployed",
    embeddedTransformers: ["XLNet"],
    models: ["Question Answering"]
  }
]

const getStatusColor = (progress: String) => {
  if (progress == "Error") return "bg-red-100 text-red-800"
  if (progress == "Loading") return "bg-yellow-100 text-yellow-800"
  if (progress == "Splitting") return "bg-blue-100 text-blue-800"
  if (progress == "Embedding") return "bg-purple-100 text-purple-800"
  return "bg-green-100 text-green-800"
}

const getStatusText = (progress: String) => {
  return progress
}

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Home</h1>
        <NewBotForm/>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden rounded-lg shadow hover:shadow-md transition-shadow duration-300">
            <CardHeader className="bg-muted py-2 px-3">
              <CardTitle className="text-base font-medium">{project.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="mb-2 flex justify-between items-center">
                <span className="text-xs font-medium">Status:</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(project.progress)}`}>
                  {getStatusText(project.progress)}
                </span>
              </div>
              <div className="mb-2">
                <h3 className="text-xs font-semibold mb-1">Embedded Transformers:</h3>
                <div className="flex flex-wrap gap-1">
                  {project.embeddedTransformers.map((transformer, index) => (
                    <span key={index} className="bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-full text-[10px]">
                      {transformer}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold mb-1">Models:</h3>
                <div className="flex flex-wrap gap-1">
                  {project.models.map((model, index) => (
                    <span key={index} className="bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full text-[10px]">
                      {model}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}