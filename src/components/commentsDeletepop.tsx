"use client"

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

interface DeleteCommentProps {
  commentId: String
  userId: string
  getComments: () => {}
}

export function CommentDelete({ commentId, userId, getComments }: DeleteCommentProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const deleteComment = async () => {
    try {
      const res = await axios.delete(`/api/comments/${commentId}/${userId}`)
      console.log(res.data)
      setOpen(false)
      toast({
        title: "Comment Deletion",
        description: "Your Comment has been deleted"
      })
      await getComments();
    } catch (error) {

    }
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div onClick={() => setOpen(true)} className="text-xl  flex  gap-2 font-semibold cursor-pointer">
          <Trash />
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
          <AlertDialogAction onClick={deleteComment}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
