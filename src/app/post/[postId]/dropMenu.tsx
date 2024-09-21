
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MenuIcon, Pencil } from "lucide-react";
import { DeletePost } from '@/components/postDeletepop';
import { Separator } from '@radix-ui/react-separator';
import Image from 'next/image';
import { useRef, useState } from "react";
import axios from "axios";


interface DropdownMenuProps {
    title: string;
    content: string;
    image: string;
    postId: string;
    getPost: () => void;
    setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DropMenu({ title, content, image, postId, getPost, setEdit }: DropdownMenuProps) {
    const [open, setOpen] = useState(false);

    const editPost = async () => {
        try {
            const res = await axios.patch(`/api/post/post/${postId}`, { title, content, image });
            console.log(res.data);
            await getPost();
            setEdit(false);
        } catch (error) {
            console.log(error);
        }
    };

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const handleEditClick = () => {
        setEdit(true);
        textareaRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <MenuIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 flex justify-start p-4 bg-[#171717] gap-2">
                <div className='flex-col gap-2 p-4'>
                    <div>
                        <DeletePost postId={postId} imageUrl={image} text={"Delete"} />
                    </div>
                    <Separator className='text-white bg-white' />
                    <div onClick={handleEditClick} className="cursor-pointer flex gap-2 mt-2 font-semibold text-xl">
                        <Pencil size={24} />  Edit
                    </div>

                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

