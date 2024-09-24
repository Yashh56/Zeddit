"use client";
import SideNav from "@/components/sideNav";
import Navbar from "@/components/Navbar";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Post from "@/components/Post";
import Loader from "@/components/loader";
import { Skeleton } from "@/components/ui/skeleton";

interface DataProps {
  title: string;
  image: string;
  content: string;
  id: string;
  userId: string;
  subZedditId: string;
  subZedditName: string;
  NSFW: boolean;
}

const Page = () => {
  const { data: session, status } = useSession();
  const [randomPostData, setRandomPostData] = useState<DataProps[]>([]);
  const router = useRouter();
  const userId = session?.user.id;
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/landing");
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router]);

  const randomPosts = async () => {
    try {
      setLoader(true);
      const res = await axios.get(`/api/randomPost`);
      setRandomPostData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    randomPosts(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "loading") {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <Separator className="bg-white" />
        <div className="flex flex-1 flex-col md:flex-row">
          <SideNav onPostCreated={randomPosts} />
          <main className="flex-1 p-4 md:p-6 bg-gray-100 dark:bg-[#171717] dark:text-white text-black">
            <div>
              {loader ? (
                // Render multiple skeletons while loading
                Array(3).fill(null).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm animate-pulse"
                  >
                    {/* Skeleton for title */}
                    <Skeleton className="h-6 w-1/2 bg-gray-300 dark:bg-gray-600 rounded-lg" />
                    
                    {/* Skeleton for image or thumbnail */}
                    <Skeleton className="h-48 w-full bg-gray-300 dark:bg-gray-600 rounded-lg" />
                    
                    {/* Skeleton for content lines */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded-lg" />
                      <Skeleton className="h-4 w-5/6 bg-gray-300 dark:bg-gray-600 rounded-lg" />
                      <Skeleton className="h-4 w-2/3 bg-gray-300 dark:bg-gray-600 rounded-lg" />
                    </div>
                  </div>
                ))
              ) : (
                // Render posts once loaded
                randomPostData.map((post, idx) => (
                  <Post
                    key={`${post.id}+${idx}`}
                    userId={userId}
                    title={post.title}
                    image={post.image}
                    postId={post.id}
                    content={post.content}
                    postUserId={post.userId}
                    subZedditName={post.subZedditName}
                    subZedditId={post.subZedditId}
                    getPosts={randomPosts}
                    NSFW={post.NSFW}
                  />
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }
};

export default Page;
