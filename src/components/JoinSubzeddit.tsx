import axios from "axios";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { useToast } from "./ui/use-toast";

interface JoinSubzedditProps {
  subZedditId: string;
  adminId: string;
  icon: string;
  name: string;
  setJoined: Dispatch<SetStateAction<boolean>>;
}

const JoinSubzeddit = ({
  subZedditId,
  adminId,
  setJoined,
  icon,
  name,
}: JoinSubzedditProps) => {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const [isJoined, setIsJoined] = useState(false);
  const { toast } = useToast()
  const getJoined = async () => {
    try {
      const res = await axios.get(`/api/userSubzeddit/${subZedditId}/${userId}`);
      // console.log(res.data)
      setIsJoined(res.data);
      setJoined(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userId && subZedditId) {
      getJoined();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, subZedditId]);

  const join = async () => {
    try {
      if (adminId !== userId) {
        setIsJoined(true);
        setJoined(true);

        const res = await axios.post(`/api/userSubzeddit/${subZedditId}`, {
          userId,
          icon,
          subZedditName: name,
        });
        toast({
          title: "SubZeddit Joined",
          description: `You are now member of ${name} !`
        })
        if (res.status !== 200) {
          setIsJoined(false);
          setJoined(false);
        }
      } else {
        console.log("You can't join, you are the admin");
      }
    } catch (error) {
      setIsJoined(false);
      setJoined(false);
      console.error(error);
    }
  };

  const leave = async () => {
    try {
      if (userId === adminId) {
        console.log("Admin can't leave his subzeddit")
        return;
      }
      const res = await axios.delete(`/api/userSubzeddit/${subZedditId}/${userId}`)
      console.log(res.data)
      setIsJoined(false)

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      {isJoined ? (
        <Button onClick={adminId === userId ? () => { } : leave} variant={adminId === userId ? 'ghost' : 'destructive'}>
          {adminId === userId ? 'Joined' : 'Leave'}
        </Button>
      ) : (
        <Button onClick={adminId !== userId ? join : () => { }} className="w-20" >Join</Button>
      )}
    </div>
  );
};

export default JoinSubzeddit;
