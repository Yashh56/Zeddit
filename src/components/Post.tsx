"use client";
import axios from "axios";
import Link from "next/link";
import { DeletePost } from "@/components/postDeletepop";
import { useEffect, useState } from "react";
import JoinSubzeddit from "./JoinSubzeddit";
import PostLikeButton from "./postLikes";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { ShieldAlert } from "lucide-react";

interface PostProps {
  title: string;
  content: string;
  image: string;
  postId: string;
  postUserId: string;
  subZedditId: string;
  userId: string;
  subZedditName: string;
  getPosts: () => void;
  NSFW: boolean;
}

const Post: React.FC<PostProps> = ({
  title,
  content,
  image,
  postId,
  postUserId,
  subZedditId,
  userId,
  subZedditName,
  getPosts,
  NSFW
}) => {
  const [isJoined, setIsJoined] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [icon, setIcon] = useState("");
  const [name, setName] = useState("");
  const { toast } = useToast();
  const getDataOfSubzeddit = async () => {
    try {
      const res = await axios.get(`/api/subzeddit/id/${subZedditId}`);
      const response = res.data.getSubZeddit
      setAdminId(response.adminId);
      setIcon(response.icon);
      setName(response.name);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (adminId != userId) {
      getDataOfSubzeddit();
    }
  }, [adminId, userId]);

  const getJoined = async () => {
    try {
      const res = await axios.get(`/api/userSubzeddit/${subZedditId}/${userId}`);
      if (res.data) {
        setIsJoined(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getJoined();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, subZedditId]);

  return (
    <div className="dark:bg-[#171717] bg-white w-full p-6 rounded-lg border border-gray-300 dark:border-gray-700 mb-6 shadow-md transition duration-300 hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-col">
          <Link href={`/s/${subZedditName}`} className="text-sm font-mono hover:underline">
            s/{subZedditName}
          </Link>
          <h2 className="text-xl md:text-2xl font-bold flex gap-3 text-center items-center">{NSFW === true ? <><ShieldAlert size={23} className="text-red-500" /> {title}</> : title}</h2>
        </div>
        {userId === postUserId && (
          <div className="mt-1 ml-6">
            <DeletePost postId={postId} imageUrl={image} getPosts={getPosts} />
          </div>
        )}
        {!isJoined && (
          <JoinSubzeddit subZedditId={subZedditId} adminId={adminId} setJoined={setIsJoined} icon={icon} name={name} />
        )}
      </div>

      <Link href={`/post/${postId}`} className="flex flex-col md:flex-row gap-4 mb-4">
        {image.length > 0 && <div className="w-full md:w-1/2 h-48">
          <img
            className={`w-full h-full object-cover rounded-lg shadow-md ${NSFW && 'blur-md'}`}
            src={image}
          />
        </div>}
        <div className="flex-1">
          <p className="text-md md:text-lg font-mono text-gray-700 dark:text-gray-200 leading-relaxed">
            {content.length > 250 ? `${content.slice(0, 250)}...` : content}
          </p>
        </div>
      </Link>

      <div className="flex justify-between items-center">
        <PostLikeButton postId={postId} subZedditId={subZedditId} userId={userId} />
        <Link href={`/post/${postId}`}>
          <Button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm md:text-base hover:bg-blue-500 transition-colors duration-200">
            Read More
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Post;
