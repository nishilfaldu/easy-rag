import { Trash2Icon, Upload } from "lucide-react";
import { toast } from "sonner";
import { FaFilePdf, FaFileWord, FaFileAlt, FaFileCsv } from "react-icons/fa"; // Import file icons
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { truncateString } from "@/lib/utils";

interface AddFilesModalProps {
  uploadedFiles: File[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export function AddFilesModal({
  uploadedFiles,
  setUploadedFiles,
}: AddFilesModalProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (uploadedFiles.length + files.length > 6) {
      toast.error("You can only upload up to 6 files.");

      return;
    }

    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf"))
      return <FaFilePdf className="text-red-500 h-12 w-12" />;
    if (fileType.includes("word"))
      return <FaFileWord className="text-blue-500 h-12 w-12" />;
    if (fileType.includes("csv"))
      return <FaFileCsv className="text-green-500 h-12 w-12" />;
    return <FaFileAlt className="text-gray-500 h-12 w-12" />; // Default for TXT, MD, MDX
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          className="p-0 text-black cursor-pointer underline underline-offset-4"
        >
          here
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-fit">
        <DialogHeader>
          <DialogTitle>Edit files</DialogTitle>
          <DialogDescription>
            Make changes to your uploaded files here. Click save when you are
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 col-span-1 relative gap-2">
          {uploadedFiles.map((file, index) => (
            <Button
              variant={"link"}
              className="relative group cursor-pointer p-0 h-60 w-full flex flex-col items-center"
              key={index}
              onClick={() => removeFile(index)}
            >
              <div className="object-cover rounded-md transition-transform duration-300 group-hover:blur-sm flex justify-center items-center">
                {getFileIcon(file.type)}
              </div>
              <p className="text-sm text-muted-foreground truncate mt-2">
                {truncateString(file.name, 30, true)}
              </p>

              <Trash2Icon className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-black opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
            </Button>
          ))}
          {uploadedFiles.length < 6 &&
            Array.from({ length: 6 - uploadedFiles.length }).map((_, index) => (
              <Button
                key={index + uploadedFiles.length}
                type="button"
                variant={"ghost"}
                className="p-0 cursor-pointer flex aspect-square h-full w-full items-center justify-center rounded-md border border-dashed bg-white relative"
              >
                <Upload className="h-4 w-4 text-muted-foreground text-black absolute cursor-pointer" />
                <Input
                  type="file"
                  multiple
                  className="opacity-0 cursor-pointer w-full h-full p-0"
                  accept=".pdf,.doc,.docx,.txt,.md,.mdx,.csv"
                  onChange={handleFileChange}
                />
                <span className="sr-only">Upload</span>
              </Button>
            ))}
        </div>
        <DialogClose>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
