"use client";

import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { LucideArrowUpWideNarrow, SendHorizonal } from 'lucide-react';
import { Button } from './ui/button';
import CommentLikeButton from './commentsLikes';

interface CommentsProps {
    postId: string;
    subZedditId: string
}

interface DataProps {
    content: string;
    username: string;
    id: string
}

export default function Comments({ postId, subZedditId }: CommentsProps) {
    const [comments, setComments] = useState<DataProps[]>([]);
    const [comment, setComment] = useState('');
    const { data: session } = useSession();
    const userId = session?.user.id;
    const username = session?.user.username;

    const createComment = async () => {
        if (!comment.trim()) return;
        try {
            await axios.post(`/api/comments/post/${postId}`, { userId, content: comment, username, subZedditId });
            setComment('');
            getComment(); // Refresh comments without reloading the page
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const getComment = async () => {
        try {
            const res = await axios.get(`/api/comments/post/${postId}`);
            setComments(res.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    useEffect(() => {
        getComment(); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postId]);

    return (
        <div className="p-4 bg-gray-100 dark:bg-[#2b2a2a] dark:text-white text-black font-mono rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
                <Input
                    placeholder='Add a comment...'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="flex-grow rounded-md border-gray-300 dark:border-gray-700"
                />
                <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2"
                    onClick={createComment}
                >
                    <SendHorizonal />
                </Button>
            </div>

            <div className="space-y-4">
                {comments.map((comment, idx) => (
                    <div
                        key={idx}
                        className="p-4 bg-white  dark:bg-[#3d3b3b] dark:text-white border rounded-lg border-gray-300 dark:border-gray-700 shadow-sm"
                    >
                        <p className=" text-sm font-mono text-gray-600  text-right">{comment.username}</p>

                        <p className="text-lg font-mono mb-2">{comment.content}</p>
                        <div className='text-right flex items-end justify-end'>
                            <CommentLikeButton userId={userId} subZedditId={subZedditId} commentId={comment.id} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
