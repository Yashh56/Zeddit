"use client"
import SideNav from '@/components/sideNav';
import Navbar from '@/components/Navbar';
import { Separator } from '@/components/ui/separator';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Post from '@/components/Post';
import Image from 'next/image';


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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/sign-up');
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router]);



  useEffect(() => {
    const randomPosts = async () => {
      try {
        const res = await axios.get(`/api/randomPost`);
        // console.log(res.data)
        setRandomPostData(res.data);

      } catch (error) {
        console.log(error);
      }
    };
    randomPosts(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === 'loading') {
    return (
      <div className="h-[100vh] mt-10 flex items-center justify-center">
        <Image src='https://i.gifer.com/ZKZg.gif' className='h-12 w-12' height={12} width={12} alt='' />
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
            <div className="flex flex-col items-center md:items-start space-y-6">
              {randomPostData.map((post, idx) => (
                <div>
                  <Post key={`${post.id}+${idx}`} userId={userId} title={post.title} image={post.image} postId={post.id} content={post.content} postUserId={post.userId} subZedditName={post.subZedditName} subZedditId={post.subZedditId} />
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }
};

export default Page;
