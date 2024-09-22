import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Plus } from 'lucide-react';
import { useEdgeStore } from '@/lib/edgestore';
import { useToast } from './ui/use-toast';
import { ToastAction } from './ui/toast';

interface CreatePostProps {
    subZedditId: string;
    name: string;
    onPostCreated: () => void;
}

export function CreatePost({ subZedditId, name, onPostCreated }: CreatePostProps) {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const { data: session } = useSession();
    const userId = session?.user.id;
    const [imageUrl, setImageUrl] = useState('');
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const { edgestore } = useEdgeStore();
    const [open, setOpen] = useState(false);
    const { toast } = useToast()

    const createPost = async () => {
        try {
            const res = await axios.post(`/api/post/${subZedditId}`, { title, content, image: imageUrl, userId, subZedditName: name });
            console.log(res.data);
            setOpen(false);
            toast({
                title: "Post has been created",
                description: "Your post has been created successfully",
                action: (
                    <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
                )
            })
            onPostCreated(); // Call the callback to refresh posts
        } catch (error) {
            console.log(error);
        }
    };

    const uploadIcon = async (file: File) => {
        if (file) {
            const res = await edgestore.publicFiles.upload({
                file: file,
                onProgressChange: (progress) => {
                    console.log(progress);
                    setUploadProgress(progress);
                }
            });
            setImageUrl(res.url);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadIcon(file);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {userId ? <Button variant='ghost' onClick={() => setOpen((open) => !open)}> <Plus /> Create Post</Button> : ""}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] dark:bg-black dark:text-white">
                <CardHeader>
                    <CardTitle>Create Post</CardTitle>
                    <CardDescription>Create a post 🌻.</CardDescription>
                </CardHeader>
                <CardContent className='dark:bg-black dark:text-white'>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="title" className='dark:bg-black dark:text-white'>Title</Label>
                            <Input id="title" placeholder="Enter the title" onChange={(e) => setTitle(e.target.value)} required className='dark:bg-black dark:text-white' />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="content" className='dark:bg-black dark:text-white'>Content</Label>
                            <Textarea id="content" placeholder="Enter the content" onChange={(e) => setContent(e.target.value)} required className='dark:bg-black dark:text-white' />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="image" className='dark:bg-black dark:text-white'>Display Picture</Label>
                            <Input type='file' onChange={handleFileChange} required className='dark:bg-black dark:text-white' />
                            {uploadProgress === 100 ? "Uploaded" : ""}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={uploadProgress === 100 ? createPost : () => { }} variant={uploadProgress === 100 ? 'default' : 'destructive'}>Create</Button>
                </CardFooter>
            </DialogContent>
        </Dialog>
    );
}
