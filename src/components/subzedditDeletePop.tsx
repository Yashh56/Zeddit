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
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useState } from "react"
import { Label } from "./ui/label"

interface DeleteSubzeddit {
    subZedditId: string
    imageUrl: string
}

export function DeleteSubzeddit({ subZedditId, imageUrl }: DeleteSubzeddit) {

    const router = useRouter()
    const { edgestore } = useEdgeStore()
    const [check, setCheck] = useState('')
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
                <Button variant={'destructive'}> Delete SubZeddit</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        Subzeddit and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Label className="text-sm">
                    For Deleting your Subzeddit write "CONFIRM"
                </Label>
                <Input
                    value={check}
                    required
                    onChange={(e) => setCheck(e.target.value)}
                />
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button variant={check === "CONFIRM" ? 'destructive' : 'ghost'} onClick={check === "CONFIRM" ? deleteSubZeddit : () => { }
                    }>Delete</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
