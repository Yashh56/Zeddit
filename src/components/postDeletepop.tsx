import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useEdgeStore } from "@/lib/edgestore"
import axios from "axios"
import { Trash } from "lucide-react"
import { useState } from "react"
import { ToastAction } from "./ui/toast"
import { useToast } from "./ui/use-toast"

interface DeletePostParams {
  postId: string
  imageUrl: string
  text?: string
  getPosts: () => void;
}

export function DeletePost({ postId, imageUrl, text, getPosts }: DeletePostParams) {
  const { edgestore } = useEdgeStore()
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const deletePost = async () => {
    try {
      const res = await axios.delete(`/api/post/post/${postId}`)
      if (imageUrl.length > 0) {
        await edgestore.publicFiles.delete({
          url: imageUrl
        })
      }
      console.log(res.data)
      setOpen(false)
      toast({
        title: "Post deletion",
        description: "Your post has been deleted successfully",
        action: (
          <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
        )
      })
      await getPosts();
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div onClick={() => setOpen(true)} className="text-xl  flex  gap-2 font-semibold cursor-pointer">
          <Trash /> {text}
          {/* <Trash2 className="cursor-pointer" /> */}
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your post and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deletePost}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
