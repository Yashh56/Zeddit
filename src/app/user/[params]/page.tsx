"use client"
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import SideNav from '@/components/sideNav';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Post from '@/components/Post';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Comments from '@/components/comments';
import Image from 'next/image';

interface PostProps {
  title: string;
  content: string;
  image: string;
  subZedditId: string;
  subZedditName: string;
  userId: string;
  id: string;
}

interface CommentsProps {
  content: string;
  createdAt: string;
  username: string;
  subZedditId: string
}




const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const { data: session, status } = useSession();
  const userId = session?.user.id;
  const [postData, setPostData] = useState<PostProps[]>([]);
  const [commentData, setCommentData] = useState<CommentsProps[]>([]);
  const router = useRouter()
  const [data, setData] = useState([])
  const [likes, setLikes] = useState([])


  const getProfileData = async () => {
    try {
      const res = await axios.get(`/api/profile/${userId}`);
      console.log(res.data)
      const profile = res.data.uniqueProfile;
      setUsername(profile.displayName);
      setPostData(res.data.allPostsByUser);
      setCommentData(res.data.allCommentsByUser);
      setBio(profile.bio);
      setLikes(res.data.allLikes)
      setProfilePicture(profile.profilePicture);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      getProfileData();
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  // react-hooks/exhaustive-deps

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/sign-up');
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="h-[100vh] mt-10 flex items-center justify-center">
        <Image src='https://i.gifer.com/ZKZg.gif' className='h-12 w-12' height={12} width={12} alt='' />
      </div>
    );
  }


  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <Separator className="bg-white" />
      <div className="flex flex-1 flex-col md:flex-row">
        <SideNav />
        <main className="flex-1 p-6 bg-white dark:bg-[#202020] dark:text-white rounded-lg shadow-lg">
          <div className="flex flex-col items-center">
            {/* Profile Header Section */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-6 mb-8">
              <Avatar className="w-24 h-24 lg:w-32 lg:h-32 border-4 border-gray-200 dark:border-gray-600 shadow-lg">
                <AvatarImage src={profilePicture} />
              </Avatar>
              <div className="flex flex-col">
                <h1 className="text-3xl lg:text-4xl font-semibold mb-2">{username}</h1>
                <p className="text-gray-700 dark:text-gray-300">{bio}</p>
              </div>
            </div>
            <Separator className="bg-gray-200 dark:bg-gray-700 mb-6" />
            {/* Tabs Section */}
            <Tabs defaultValue="posts" className='dark:bg-[#171717]'>
              <TabsList className="flex space-x-4 mb-4">
                <TabsTrigger value="posts" className="py-2 px-4 text-lg font-medium border-b-2 border-transparent hover:border-gray-400 dark:hover:border-gray-600">All Posts</TabsTrigger>
                <TabsTrigger value="comments" className="py-2 px-4 text-lg font-medium border-b-2 border-transparent hover:border-gray-400 dark:hover:border-gray-600">Comments</TabsTrigger>
              </TabsList>
              <TabsContent value="posts">
                <div className="flex flex-col items-center space-y-4">
                  {!postData && <div>
                    No Data Found !
                  </div>}
                  {postData.map((post, idx) => (
                    <Post
                      key={idx}
                      image={post.image}
                      postId={post.id}
                      userId={userId}
                      content={post.content}
                      title={post.title}
                      postUserId={post.userId}
                      subZedditId={post.subZedditId}
                      subZedditName={post.subZedditName}
                      getPosts={getProfileData}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="comments">
                <div className="flex w-[100vh] h-fit flex-col items-center space-y-4">
                  {commentData.map((comment, idx) => (
                    <div
                      key={idx}
                      className="w-full gap-2  p-4 bg-gray-100 dark:bg-[#171717] border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm"
                    >
                      <h3 className="text-lg font-semibold mb-2">{comment.content}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Posted by {comment.username} on {new Date(comment.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Sidebar
          userId={userId}
          username={username}
          bio={bio}
          profilePicture={profilePicture}
          setUsername={setUsername}
          setBio={setBio}
          setProfilePicture={setProfilePicture}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
