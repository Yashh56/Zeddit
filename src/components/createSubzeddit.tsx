import axios from 'axios'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { useEdgeStore } from '@/lib/edgestore'
import { useRouter } from 'next/navigation'
import { Textarea } from './ui/textarea'
import { Plus } from 'lucide-react'
import { Checkbox } from './ui/checkbox'
import { useToast } from './ui/use-toast'
import { ToastAction } from './ui/toast'

export function CreateSubzeddit() {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [icon, setIcon] = useState<File>()
    const [ImageUrl, setImageUrl] = useState('')
    const [iconUploadToBackend, setIconUploadToBackend] = useState("")
    const [uploadProgress, setUploadProgress] = useState<Number>()
    const { data: session, status } = useSession()
    const admin = session?.user.username;
    const adminId: string = session?.user.id;
    const { edgestore } = useEdgeStore()
    const router = useRouter()
    const [ready, setReady] = useState(false)
    const { toast } = useToast()

    const uploadIcon = async (file: File) => {
        if (file) {
            const res = await edgestore.publicFiles.upload({ file: file, onProgressChange: (progress) => { console.log(progress); setUploadProgress(progress) } });
            setImageUrl(res.url)
            setIconUploadToBackend(res.url)
        }
    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIcon(file);
            uploadIcon(file)

        }
    }
    const create = async () => {
        try {
            const encodedName = name.replace("%20", " ")
            const res = await axios.post('/api/subzeddit/', { name: encodedName, description, icon: iconUploadToBackend, admin, adminId });
            router.replace(`/s/${encodedName}`);  // Use encoded name for redirection
            toast({
                title: "SubZeddit Creation",
                description: "Your SubZeddit has been created successfully",
                action: (
                    <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
                )
            })
        } catch (error) {
            console.log(error)
        }
    }

    if (status === 'unauthenticated') return <div>Unauthenticated</div>
    if (status === 'loading') return <div>Loading...</div>
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Plus size={24}/>
                {/* <Plus/> */}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] dark:bg-[#171717] ">
                <CardHeader>
                    <CardTitle>Create an Community 🌻</CardTitle>
                    <CardDescription>A Community or subzeddit where members can join and enjoy.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name" className=' '>Name</Label>
                            <Input placeholder="Enter The Name of Community" onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name" className=' ' >Description</Label>
                            <Textarea placeholder="Enter The Description" onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name" className=' '>DisplayPicture</Label>
                            <Input type='file' required className=' '
                                onChange={handleFileChange}
                            />
                            {
                                uploadProgress === 100 ? "Uploaded" : ""
                            }
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    {/* <Button variant="outline">Cancel</Button> */}
                    <div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="terms" onClick={() => {
                                name.length > 0 && ImageUrl.length > 0 && setReady((ready) => !ready)
                            }} />
                            <Label htmlFor="terms" className={!ready ? 'text-red-800' : 'text-white'}>Accept terms and conditions</Label>
                        </div>
                    </div>
                    <Button onClick={
                        () =>
                            ready && create()
                    } variant={!ready ? 'destructive' : 'default'}>Create</Button>
                </CardFooter>
            </DialogContent>
        </Dialog>
    )
}