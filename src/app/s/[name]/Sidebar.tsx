"use client";

import { DeleteSubzeddit } from '@/components/subzedditDeletePop';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { Pencil, XIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface SidebarProps {
  description: string;
  admin: string;
  subZedditId: string;
  adminId: string;
  imageUrl: string
}

interface SubzedditsProps {
  name: string;
  icon: string;
}

const Sidebar: React.FC<SidebarProps> = ({ description, admin, subZedditId, adminId, imageUrl }) => {
  const [subzeddits, setSubZeddits] = useState<SubzedditsProps[]>([]);
  const [edit, setEdit] = useState(false);
  const [newDescription, setNewDescription] = useState(description); // Initially set to prop description
  const { data: session } = useSession();
  const userId = session?.user.id;
  const [open, setOpen] = useState(false);
  const allSubreddits = async () => {
    try {
      const res = await axios.get(`/api/subzeddit/id/${subZedditId}`);
      setSubZeddits(res.data.getSuggestions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    allSubreddits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subZedditId]);
  useEffect(() => {
    setNewDescription(description);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description]);

  const editDes = async () => {
    try {
      const res = await axios.patch(`/api/subzeddit/id/${subZedditId}`, { description: newDescription });
      console.log(res.data);
      // Update UI with the new description
      setEdit(false);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const cancelEdit = () => {
    setEdit(false);
    setNewDescription(description);
    setOpen(false);
  };

  return (
    <aside className="w-1/4 max-md:hidden p-4 bg-white dark:bg-neutral-900 rounded-lg shadow-lg">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">About This Subreddit</h2>
          {adminId === userId && (
            <>
              {!edit ? (
                <Pencil
                  className="cursor-pointer hover:text-blue-500 transition-colors"
                  onClick={() => {
                    setEdit(true);
                    setOpen(true);
                  }}
                />
              ) : (
                <XIcon
                  className="cursor-pointer hover:text-red-500 transition-colors"
                  onClick={cancelEdit}
                />
              )}
            </>
          )}
        </div>
        {edit && open ? (
          <Textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Edit subreddit description"
          />
        ) : (
          <p className="mt-2 text-gray-700 dark:text-gray-300">{newDescription}</p>
        )}
        {open && newDescription.length > 0 && (
          <Button className="mt-2" variant="ghost" onClick={editDes}>
            Save
          </Button>
        )}
      </div>

      {/* Related Subreddits Section */}
      <div>
        {subzeddits.length > 0 &&
          <h2 className="text-xl font-semibold">Related Subreddits</h2>
        }
        <div className="mt-4 space-y-4">
          {subzeddits.map((sub, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={sub.icon} alt={sub.name} />
              </Avatar>
              <Link href={`/s/${sub.name}`} className="text-blue-500 hover:underline">{sub.name}</Link>
            </div>
          ))}
        </div>
        {adminId === userId && (
          <div className="mt-2 ml-6">
            <DeleteSubzeddit subZedditId={subZedditId} imageUrl={imageUrl} />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
