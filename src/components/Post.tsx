"use client"
import axios from "axios";
import Link from "next/link";
import { DeletePost } from "@/components/postDeletepop";
import { useEffect, useState } from "react";
import JoinSubzeddit from "./JoinSubzeddit";
import PostLikeButton from "./postLikes";
import Image from "next/image";



interface PostProps {
    title: string;
    content: string;
    image: string;
    postId: string;
    postUserId: string;
    subZedditId: string
    userId: string
    subZedditName: string
}

const Post: React.FC<PostProps> = ({ title, content, image, postId, postUserId, subZedditId, userId, subZedditName }) => {
    const [isJoined, setIsJoined] = useState(false)
    const [adminId, setAdminId] = useState('')
    const [icon, setIcon] = useState('')
    const [name, setName] = useState('')
    const getDataOfSubzeddit = async () => {
        try {
            const res = await axios.get(`/api/subzeddit/id/${subZedditId}`)
            // console.log(res.data)
            setAdminId(res.data.adminId)
            setIcon(res.data.icon)
            setName(res.data.name)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (adminId != userId) {
            getDataOfSubzeddit()
        }
 // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adminId,userId])

    const getJoined = async () => {
        try {
            const res = await axios.get(`/api/userSubzeddit/${subZedditId}/${userId}`)
            // console.log(res.data)
            if (res.data) {
                setIsJoined(true)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => { getJoined()
         // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [userId, subZedditId])

    return (
        <div className="dark:bg-[#171717] bg-white dark:text-white p-6 rounded-lg border border-gray-300 dark:border-gray-700 mb-6 shadow-md transition duration-300 hover:shadow-lg">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-col">
                    <Link href={`/s/${subZedditName}`} className="text-sm font-mono hover:underline">S/ {subZedditName}</Link>
                    <h2 className="text-2xl md:text-3xl font-bold text-left">{title}</h2>
                </div>
                {userId === postUserId && (
                    <div className="mt-1 ml-6">
                        <DeletePost postId={postId} imageUrl={image} />
                    </div>
                )}
                {!isJoined && <JoinSubzeddit subZedditId={subZedditId} adminId={adminId} setJoined={setIsJoined} icon={icon} name={name} />}
            </div>
            <Link href={`/post/${postId}`}>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <Image
                        alt={icon || ""}
                        width={200}
                        height={170}
                        className="w-full md:w-1/2 rounded-lg shadow-md object-cover max-h-64"
                        src={image}
                    />
                    <p className="text-md md:text-lg font-mono text-gray-700 dark:text-gray-200 leading-relaxed">
                        {content.length > 250 ? `${content.slice(0, 250)}...` : content}
                    </p>
                </div>
            </Link>
            <div className="flex justify-between items-center">
                <PostLikeButton postId={postId} subZedditId={subZedditId} userId={userId} />
                <Link href={`/post/${postId}`}>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm md:text-base hover:bg-blue-500 transition-colors duration-200">
                        Read More
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Post;
