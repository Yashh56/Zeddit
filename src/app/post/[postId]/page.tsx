"use client"
import Comments from '@/components/comments';
import Navbar from '@/components/Navbar';
import SideNav from '@/components/sideNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { ArrowUpWideNarrow, Cross, Pencil, XIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'

interface DataProps {
    title: string;
    content: string;
    image: string;
    createdAt: string;
}




import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from '@radix-ui/react-separator';
import Image from 'next/image';
import { DropMenu } from './dropMenu';




function PostPage() {
    const params = useParams<({ postId: string })>();
    const [data, setData] = useState<DataProps | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const { data: session, status } = useSession();
    const router = useRouter();
    const userId = session?.user.id;
    const [postId, setPostId] = useState<string>('');
    const [subZedditId, setSubZedditId] = useState('')
    const [edit, setEdit] = useState(false)

    // Create a ref for the textarea
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/sign-up');
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, router]);

    const getPost = async () => {
        try {
            const res = await axios.get(`/api/post/post/${params.postId}`);
            const postData = res.data;
            console.log(postData)
            setData(postData);
            setSubZedditId(postData.subZedditId)
            setTitle(postData.title);
            setContent(postData.content);
            setPostId(postData.id);
            setImage(postData.image);
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {

        if (params.postId) {
            getPost();
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.postId]);

    const editPost = async () => {
        try {
            const res = await axios.patch(`/api/post/post/${postId}`, { title, content, image })
            console.log(res.data)
            await getPost()
            setEdit(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleEditClick = () => {
        setEdit(true);
        textareaRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (status === 'loading') {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-100">
                <Image src='https://i.gifer.com/ZKZg.gif' height={12} width={12} className='h-12 w-12 animate-spin' alt="Loading..." />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <Separator className="bg-white" />
            <div className="flex flex-1 flex-col md:flex-row">
                <SideNav />
                <main className="w-full lg:w-3/4 p-6 bg-white dark:bg-[#171717] rounded-lg shadow-md">
                    <div className="flex flex-col items-center text-center">
                        <div className='flex gap-8 m-2 justify-start items-start text-start'>
                            <h1 className='text-3xl text-left font-bold'>{title}</h1>
                            <DropdownMenu />
                            {!edit && (
                                <DropMenu
                                    postId={postId}
                                    content={content}
                                    image={image}
                                    title={title}
                                    setEdit={setEdit}
                                    getPost={getPost}
                                />

                            )}
                            {edit && (
                                <XIcon
                                    size={24}
                                    onClick={() => setEdit(false)}
                                    className="cursor-pointer"
                                />
                            )}
                        </div>
                        {image && (
                            <Image
                                src={image}
                                className="mb-4 h-fit w-fit max-h-80 rounded-lg shadow-md object-contain"

                                width={200}
                                height={170}
                                // style={{ objectFit: "cover", width: "100%", height: "105px" }}
                                alt={image}
                            />
                        )}
                        {
                            edit ? (
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="font-mono h-96 w-full"
                                    ref={textareaRef}  // Attach the ref to the textarea
                                />
                            ) : (
                                <p className="text-lg md:text-xl font-mono text-gray-700 dark:text-gray-300">{content}</p>
                            )
                        }
                        {edit && (
                            <Button onClick={editPost} variant={'default'} className='rounded-md  mt-2 p-4'>
                                Save
                            </Button>
                        )}
                    </div>
                    {data && (
                        <div className="mt-8">
                            <Comments postId={postId} subZedditId={subZedditId} />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default PostPage;
