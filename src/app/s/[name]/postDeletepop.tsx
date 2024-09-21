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
import { Trash2 } from "lucide-react"

interface DeletePostParams {
  postId: string
  imageUrl: string
}

export function DeletePost({ postId, imageUrl }: DeletePostParams) {
  const { edgestore } = useEdgeStore()

  const deletePost = async () => {
    try {
      const res = await axios.delete(`/api/post/post/${postId}`)
      if (imageUrl.length > 0) {
        await edgestore.publicFiles.delete({
          url: imageUrl
        })
      }
      console.log(res.data)
      window.location.reload()
    } catch (error) {
      console.log(error)
    } finally {
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash2 />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            post and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deletePost}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
