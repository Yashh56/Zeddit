'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarImage } from './ui/avatar';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { UserDropdown } from './userDropdown';
import { Skeleton } from './ui/skeleton';

interface searchResultProps {
  name: string;
  icon: string;
}

export default function Navbar() {
  const [displayPicture, setDisplayPicture] = useState('');
  const { data: session } = useSession();
  const userId = session?.user.id;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<searchResultProps[]>([]);
  const [loader, setLoader] = useState(false)

  const getDisplayPic = async () => {
    try {
      setLoader(true)
      const res = await axios.get(`/api/profile/${userId}`);
      setDisplayPicture(res.data.uniqueProfile.profilePicture);
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
    finally {
      setLoader(false)
    }
  };

  useEffect(() => {
    if (userId) {
      getDisplayPic();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const searchRes = async () => {
    try {
      const res = await axios.get(`/api/search/${searchQuery}`);
      setSearchResult(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      searchRes();
    } else {
      setSearchResult([]); // clear results if search query is empty
    }
  }, [searchQuery]);

  return (
    <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6 justify-between text-black bg-white dark:bg-[#171717] dark:text-white">
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

      {/* Improved Search Bar */}
      <div className="relative flex-1 mx-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 bg-[#252728] text-white rounded-full border border-transparent focus:outline-none focus:border-black dark:focus:border-white transition-colors shadow-md"
            placeholder="Search for posts, communities, or topics"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 5a7 7 0 100 14 7 7 0 000-14zM21 21l-4.35-4.35"
            />
          </svg>
        </div>

        {searchResult.length > 0 && (
          <div className="absolute top-12 left-0 w-full bg-white text-black dark:bg-[#171717] dark:text-white rounded-lg shadow-lg p-3 max-h-60 overflow-y-auto z-10">
            {searchResult.map((sub, idx) => (
              <Link key={idx} href={`/s/${sub.name}`} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
                <img src={sub.icon} alt={sub.name} className="w-8 h-8 rounded-full" />
                <span>{sub.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* User Profile Dropdown */}
      {
        loader ? <Skeleton className="h-12 w-12 rounded-full" />
          : <UserDropdown displayPicture={displayPicture} />

      }
    </header>
  );
}
