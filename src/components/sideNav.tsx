"use client"

import { useEffect, useState } from 'react';
import { Home, User, LogOut } from "lucide-react";
import Link from 'next/link';
import { CreateSubzeddit } from './createSubzeddit';
import axios from 'axios';
import { signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarImage } from './ui/avatar';

interface JoinedProps {
  icon: string;
  subZedditName: string;
}

export default function SideNav() {
  const [allJoinedSubZeddits, setAllJoinedSubZeddits] = useState<JoinedProps[]>([]);
  const { data: session } = useSession();
  const userId = session?.user.id;

  // Fetch all joined SubZeddits
  const allJoined = async () => {
    try {
      const res = await axios.get(`/api/userSubzeddit/user/${userId}`);
      setAllJoinedSubZeddits(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId) allJoined();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <div className="hidden md:flex md:flex-col h-screen dark:bg-[#171717] dark:text-white text-black p-4 md:w-1/5 lg:w-24 space-y-6">
      <div className="flex items-center justify-between mb-8">
      </div>

      <nav className="flex flex-col space-y-6">
        <Link href="/" className="flex items-center p-2 hover:bg-gray-700 rounded transition-colors duration-300">
          <Home className="mr-2 w-4 h-4" />
        </Link>
        <Link href={`/user/${userId}`} className="flex items-center p-2 hover:bg-gray-700 rounded transition-colors duration-300">
          <User className="mr-2 w-4 h-4" />
        </Link>
        <div className="flex items-center p-2 hover:bg-gray-700 rounded transition-colors duration-300">
          <LogOut onClick={() => signOut({ callbackUrl: '/', redirect: true })} className="mr-2 w-4 h-4 cursor-pointer" />
        </div>

        <div className="flex items-center mt-4">
          <CreateSubzeddit />
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {allJoinedSubZeddits.length > 0 ? (
            allJoinedSubZeddits.map((subZeddit, idx) => (
              <div key={idx} className='flex-col items-center space-x-2'>
                <Link href={`/s/${subZeddit.subZedditName}`}>
                  <Avatar className="cursor-pointer w-10 h-10">
                    <AvatarImage src={subZeddit.icon} className="w-full h-full object-cover" />
                  </Avatar>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">No joined SubZeddits yet</p>
          )}
        </div>
      </nav>
    </div>
  );
}
