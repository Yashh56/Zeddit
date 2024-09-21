import React, { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface VoteProps {
  postId: string;
  userId: string
  subZedditId: string
}

function PostLikeButton({ postId, subZedditId, userId }: VoteProps) {
  const { data: session } = useSession();
  const [hasLiked, setHasLiked] = useState(false)
  const [totalLikes, setTotalLikes] = useState()

  const createLike = async () => {
    try {
      const res = await axios.post(`/api/likes/post/${postId}/${userId}`, { subZedditId: subZedditId, commentId: null })
      console.log(res.data)

      if (res.data) {
        setHasLiked(true)
        await countOfLikes()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const verifyLike = async () => {
    try {
      const res = await axios.get(`/api/likes/post/${postId}/${userId}`)
      console.log(res.data)
      if (res.data) {
        setHasLiked(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => { verifyLike() 
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId,userId])

  const deleteLike = async () => {
    try {
      const res = await axios.delete(`/api/likes/post/${postId}/${userId}`)
      setHasLiked(false)
      if (res.data) {
        await countOfLikes()
      }
      // setHasLiked()

      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const countOfLikes = async () => {
    try {
      const res = await axios.get(`/api/likes/post/${postId}`)
      console.log(res.data)
      setTotalLikes(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => { countOfLikes() 
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  if (session) {
    return (
      <div className='flex gap-3 font-mono text-xl'>
        <FaHeart
          onClick={!hasLiked ? createLike : deleteLike}
          size={24}
          className={hasLiked ? 'text-red-500' : 'text-white'}
        />
        <p className=''>{totalLikes}</p>
      </div>
    )
  }
}

export default PostLikeButton;
