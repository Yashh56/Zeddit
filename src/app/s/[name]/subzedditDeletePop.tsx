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
import { useRouter } from "next/navigation"

interface DeleteSubzeddit {
    subZedditId: string
    imageUrl: string
}

export function DeleteSubzeddit({ subZedditId, imageUrl }: DeleteSubzeddit) {

    const router = useRouter()
    const { edgestore } = useEdgeStore()

    const deleteSubZeddit = async () => {
        try {
            const res = await axios.delete(`/api/subzeddit/id/${subZedditId}`)
            console.log(res.data)
            if (imageUrl.length > 0) {
                await edgestore.publicFiles.delete({
                    url: imageUrl
                })
            }
            router.replace('/')
        } catch (error) {
            console.log(error)
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
                        Subzeddit and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteSubZeddit}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
