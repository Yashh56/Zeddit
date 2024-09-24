"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import Navbar from "@/components/Navbar";
import SideNav from "@/components/sideNav";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Post from "@/components/Post";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Comments from "@/components/comments";
import Loader from "@/components/loader";
import { Skeleton } from "@/components/ui/skeleton";

interface PostProps {
  title: string;
  content: string;
  image: string;
  subZedditId: string;
  subZedditName: string;
  userId: string;
  id: string;
  NSFW: boolean;
}

interface CommentsProps {
  content: string;
  createdAt: string;
  username: string;
  subZedditId: string;
}

const ProfilePage = () => {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const { data: session, status } = useSession();
  const userId = session?.user.id;
  const [postData, setPostData] = useState<PostProps[]>([]);
  const [commentData, setCommentData] = useState<CommentsProps[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const getProfileData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/profile/${userId}`);
      const profile = res.data.uniqueProfile;
      setUsername(profile.displayName);
      setBio(profile.bio);
      setProfilePicture(profile.profilePicture);
      setPostData(res.data.allPostsByUser);
      setCommentData(res.data.allCommentsByUser);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      getProfileData();
    }
  }, [userId]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/landing");
    }
  }, [status, router]);

  if (status === "loading") {
    return <Loader />;
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <Separator className="bg-white" />
      <div className="flex flex-1 flex-col md:flex-row">
        <SideNav onPostCreated={getProfileData} />
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
            <Tabs defaultValue="posts" className="dark:bg-[#171717] w-full">
              <TabsList className="flex space-x-4 mb-4">
                <TabsTrigger value="posts" className="py-2 px-4 text-lg font-medium border-b-2 border-transparent hover:border-gray-400 dark:hover:border-gray-600">
                  All Posts
                </TabsTrigger>
                <TabsTrigger value="comments" className="py-2 px-4 text-lg font-medium border-b-2 border-transparent hover:border-gray-400 dark:hover:border-gray-600">
                  Comments
                </TabsTrigger>
              </TabsList>

              {/* Posts Tab Content */}
              <TabsContent value="posts" className="w-full">
                {loading ? (
                  <div className="flex flex-col items-center gap-6">
                    {/* Skeleton Loader */}
                    <Skeleton className="h-8 w-48 mb-4" />
                    <Skeleton className="h-64 w-full md:w-3/4 rounded-lg" />
                    <Skeleton className="h-64 w-full md:w-3/4 rounded-lg" />
                  </div>
                ) : postData.length > 0 ? (
                  postData.map((post, idx) => (
                    <div key={idx} className="w-full">
                      <Post
                        image={post.image}
                        postId={post.id}
                        userId={userId}
                        content={post.content}
                        title={post.title}
                        postUserId={post.userId}
                        subZedditId={post.subZedditId}
                        subZedditName={post.subZedditName}
                        getPosts={getProfileData}
                        NSFW={post.NSFW}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center mt-4 text-lg">No Posts Found</div>
                )}
              </TabsContent>

              {/* Comments Tab Content */}
              <TabsContent value="comments">
                <div className="w-full">
                  {commentData.length > 0 ? (
                    commentData.map((comment, idx) => (
                      <div key={idx} className="w-full p-4 bg-gray-100 dark:bg-[#171717] border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">{comment.content}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Posted by {comment.username} on {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center mt-4 text-lg">No Comments Found</div>
                  )}
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
