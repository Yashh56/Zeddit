"use client";

import { useEffect, useState } from 'react';
import { Home, User, LogOut } from "lucide-react";
import Link from 'next/link';
import { CreateSubzeddit } from './createSubzeddit';
import axios from 'axios';
import { signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarImage } from './ui/avatar';
import { CreatePost } from './createPostWithoutId';

interface JoinedProps {
  icon: string;
  subZedditName: string;
}

interface SideNavProps {
  onPostCreated: () => void;
}

export default function SideNav({ onPostCreated }: SideNavProps) {
  const [allJoinedSubZeddits, setAllJoinedSubZeddits] = useState<JoinedProps[]>([]);
  const { data: session } = useSession();
  const userId = session?.user.id;
  const navLinks = [
    { href: '/', label: 'Home', icon: <Home className="mr-2 w-4 h-4" /> },
    { href: `/user/${userId}`, label: 'Profile', icon: <User className="mr-2 w-4 h-4" /> },
    {
      href: '/',
      label: 'Logout',
      icon: <LogOut className="mr-2 w-4 h-4" />,
      onClick: () => signOut({ callbackUrl: '/', redirect: true })
    }
  ];
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
    <div className="hidden md:flex md:flex-col h-screen dark:bg-[#171717] dark:text-white text-black p-4 md:w-1/5 lg:w-64 space-y-8 shadow-lg">
      <div className="text-left ml-2 mt-2 p-2 ">
        <h2 className="text-xl font-semibold">Dashboard</h2>
      </div>
      <nav className="flex-col w-full space-y-3">
        {
          navLinks.map((nav) => (
            <Link href={nav.href} className="flex items-center p-3 hover:bg-gray-700 rounded-md transition-colors duration-300">
              {nav.icon}
              <span className='font-medium'>{nav.label}</span>
            </Link>
          ))
        }
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Create</h3>
          <div className="flex flex-col space-y-2 mt-2">
            <div className="flex items-center p-2 hover:bg-gray-700 rounded-md transition-colors duration-300">
              <span className="mr-2">Create Community</span>
              <CreateSubzeddit />
            </div>
            {
              allJoinedSubZeddits.length > 0 &&
              <div className="flex items-center p-2 hover:bg-gray-700 rounded-md transition-colors duration-300">
                <span>Create Post</span>
                <CreatePost onPostCreated={onPostCreated} />
              </div>
            }
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold">Joined Communities</h3>
          <div className="flex flex-col space-y-4 mt-4">
            {allJoinedSubZeddits.length > 0 ? (
              allJoinedSubZeddits.map((subZeddit, idx) => (
                <Link href={`/s/${subZeddit.subZedditName}`} key={idx} className="flex items-center space-x-4 p-2 hover:bg-gray-700 rounded-md transition-colors duration-300">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={subZeddit.icon} className="w-full h-full object-cover" />
                  </Avatar>
                  <span className="font-medium">{subZeddit.subZedditName}</span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-400">No joined SubZeddits yet</p>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
