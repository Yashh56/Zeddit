'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { NavItems } from '@/lib/config';
import { Avatar, AvatarImage } from './ui/avatar';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { UserDropdown } from './userDropdown';

export default function Navbar() {
  const [displayPicture, setDisplayPicture] = useState('');
  const { data: session } = useSession();
  const userId = session?.user.id;

  // Function to fetch user profile picture
  const getDisplayPic = async () => {
    try {
      const res = await axios.get(`/api/profile/${userId}`);
      setDisplayPicture(res.data.uniqueProfile.profilePicture);
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      getDisplayPic();
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6 justify-between">
      {/* Logo and Link to homepage */}
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
        prefetch={false}
      >
        <Avatar>
          <AvatarImage src="https://i.pinimg.com/736x/dc/54/ba/dc54ba6a207e656e63d1964eafdfbaad.jpg" />
        </Avatar>
        <span>Zeddit</span>
      </Link>

      <UserDropdown displayPicture={displayPicture} />
    </header>
  );
}
