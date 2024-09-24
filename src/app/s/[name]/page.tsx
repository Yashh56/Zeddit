"use client"

import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import SideNav from '@/components/sideNav';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { CreatePost } from '@/components/createPost';
import JoinSubzeddit from '@/components/JoinSubzeddit';
import { useSession } from 'next-auth/react';
import Post from '@/components/Post';
import Loader from '@/components/loader';
import { Skeleton } from '@/components/ui/skeleton';

interface PostsProps {
    title: string;
    content: string;
    image: string;
    id: string;
    userId: string;
    NSFW: boolean
}

const SubredditPage = () => {
    const params = useParams<{ name: string }>();
    const [data, setData] = useState([]);
    const [icon, setIcon] = useState('');
    const [admin, setAdmin] = useState('');
    const [adminId, setAdminId] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [subZedditId, setSubZedditId] = useState('');
    const [posts, setPosts] = useState<PostsProps[]>([]);
    const { data: session, status } = useSession();
    const userId = session?.user.id;
    const [joined, setJoined] = useState(false);
    const router = useRouter()
    const [loader, setLoader] = useState(false)
    useEffect(() => {
        if (status === 'unauthenticated' && !userId) {
            router.replace('/landing');
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, router]);

    const getData = async () => {
        try {
            const res = await axios.get(`/api/subzeddit/${params.name}`);
            setData(res.data);
            setSubZedditId(res.data.id);
            setIcon(res.data.icon);
            setName(res.data.name);
            setDescription(res.data.description);
            setCreatedAt(res.data.createdAt);
            setAdmin(res.data.admin);
            setAdminId(res.data.adminId);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subZedditId]);
    const getPosts = async () => {
        try {
            setLoader(true)
            const res = await axios.get(`/api/post/${subZedditId}`);
            // console.log(res.data)
            setPosts(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoader(false)
        }
    };

    useEffect(() => {
        getPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subZedditId]);
    const handlePostCreated = async () => {
        await getPosts();
    };

    if (status === 'loading') {
        return <Loader />
    }

    if (status === 'authenticated') {
        return (
            <div className="flex flex-col min-h-fit dark:bg-[#171717]">
                {/* <Navbar /> */}
                <div className="flex flex-1 mt-12 flex-col md:flex-row">
                    <SideNav onPostCreated={getPosts} />
                    <main className="lg:w-3/4 w-full p-4 dark:text-slate-300 bg-white dark:bg-[#171717] bg-opacity-90 rounded-lg shadow-lg">
                        <div className="flex items-center gap-2 max-md:justify-evenly flex-wrap">
                            <Avatar>
                                <AvatarImage src={icon} />
                            </Avatar>
                            <h1 className="text-2xl md:text-3xl font-bold">s/{name}</h1>
                            <JoinSubzeddit subZedditId={subZedditId} adminId={adminId} icon={icon} setJoined={setJoined} name={name} />
                            {joined && <CreatePost subZedditId={subZedditId} name={name} onPostCreated={handlePostCreated} />}
                        </div>
                        <div className="mt-4">
                            {
                                loader ? <div className="flex gap-3 w-full h-full justify-center items-center space-y-3">
                                    <div className=' flex flex-col gap-4'>
                                        <Skeleton className="h-4 w-[200px]" />
                                        <Skeleton className="h-[325px] w-[450px] rounded-xl" />
                                    </div>
                                    <div className="space-y-2 mt-12">
                                        <Skeleton className="h-4 w-[550px]" />
                                        <Skeleton className="h-4 w-[550px]" />
                                        <Skeleton className="h-4 w-[550px]" />
                                        <Skeleton className="h-4 w-[550px]" />
                                    </div>
                                </div> :
                                    posts.map((post, index) => (
                                        <Post key={index}
                                            userId={userId}
                                            subZedditId={subZedditId}
                                            postId={post.id}
                                            title={post.title}
                                            postUserId={post.userId}
                                            content={post.content}
                                            image={post.image}
                                            subZedditName={name}
                                            getPosts={getPosts}
                                            NSFW={post.NSFW}
                                        />
                                    ))
                            }
                        </div>
                    </main>
                    <Sidebar
                        description={description}
                        admin={admin}
                        adminId={adminId}
                        subZedditId={subZedditId}
                        imageUrl={icon}
                    />
                </div>
            </div>
        );
    }
};
export default SubredditPage;
