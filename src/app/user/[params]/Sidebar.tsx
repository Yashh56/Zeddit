import { Button } from '@/components/ui/button';
import { Separator } from '../../../components/ui/separator';
import EditProfile from '../../../components/editProfile';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface SidebarProps {
  userId: string;
  username: string;
  bio: string;
  profilePicture: string;
  setUsername: (value: string) => void;
  setBio: (value: string) => void;
  setProfilePicture: (value: string) => void;
}

const Sidebar = ({ userId, username, bio, profilePicture, setUsername, setBio, setProfilePicture }: SidebarProps) => {
  const [totalVotes, setTotalVotes] = useState<number | undefined>();
  const [totalJoinedSubZeddits, setTotalJoinedSubZeddits] = useState<number | undefined>();
  const [joinedDate, setJoinedDate] = useState<string>('');
  // console.log(username)
  const userData = async () => {
    try {
      const res = await axios.get(`/api/profile/${userId}`);
      setTotalVotes(res.data.allLikes);
      setTotalJoinedSubZeddits(res.data.joinedSubZedditsCount);
      setJoinedDate(res.data.uniqueProfile.createdAt);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId) {
      userData();
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <aside className="w-full h-fit lg:w-1/4 p-4 bg-white dark:bg-slate-950 rounded-lg shadow-lg">
      <div className="mb-4">
        <div className="flex-col items-center justify-between">
          <h2 className="text-xl font-semibold">User Stats</h2>
          <Separator className="text-white bg-white mt-2" />
          <div className="flex justify-between mt-4">
            <div className="flex-col">
              <h1 className="text-xl font-mono">Total Likes</h1>
              <p className="text-xl font-mono text-center">{totalVotes}</p>
            </div>

            <div className="flex-col">
              <h1 className="text-xl font-mono">Total SubZeddit</h1>
              <p className="text-xl font-mono text-center">{totalJoinedSubZeddits}</p>
            </div>
          </div>
        </div>
        <Separator className="bg-white mt-2" />
        <div className="flex-col mt-3 justify-center items-center">
          <div className="flex gap-4 items-center justify-center">
            {/* Pass props to EditProfile component */}
            <EditProfile
              username={username}
              bio={bio}
              profilePicture={profilePicture}
              setUsername={setUsername}
              setBio={setBio}
              setProfilePicture={setProfilePicture}
            />
            {/* // Todo */}
            <Button variant={'destructive'}>Delete an Account</Button>
          </div>
        </div>
        <div>
          <p className="text-xl font-mono mt-2">Joined Date: {joinedDate.slice(0, 10)}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
