"use client"
import SideNav from '@/components/sideNav';
import Navbar from '@/components/Navbar';
import { Separator } from '@/components/ui/separator';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Post from '@/components/Post';
import Loader from '@/components/loader';
import { Skeleton } from '@/components/ui/skeleton';

interface DataProps {
  title: string;
  image: string;
  content: string;
  id: string;
  userId: string;
  subZedditId: string;
  subZedditName: string;
}

const Page = () => {
  const { data: session, status } = useSession();
  const [randomPostData, setRandomPostData] = useState<DataProps[]>([]);
  const router = useRouter();
  const userId = session?.user.id
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/landing');
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router]);


  const randomPosts = async () => {
    try {
      setLoader(true)
      const res = await axios.get(`/api/randomPost`);
      // console.log(res.data)
      setRandomPostData(res.data);

    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false)
    }
  };

  useEffect(() => {
    randomPosts(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === 'loading') {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <Separator className="bg-white" />
        <div className="flex flex-1 flex-col md:flex-row">
          <SideNav />
          <main className="flex-1 p-4 md:p-6 bg-gray-100 dark:bg-[#171717] dark:text-white text-black">
            <div>
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
                    />
                  )
                  )}
            </div>
          </main>
        </div>
      </div>
    );
  }
};

export default Page;
