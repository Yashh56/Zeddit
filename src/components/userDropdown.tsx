import {
    Github,
    LogOut,
    User
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage } from "./ui/avatar"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"

interface userDropdownProps {
    displayPicture: string
}

export function UserDropdown({ displayPicture }: userDropdownProps) {
    const { data: session, status } = useSession()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage src={displayPicture} />
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 dark:bg-[#171717] dark:text-white text-black">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <Link href={`/user/${session?.user.id}/`}>Profile</Link>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span onClick={() => signOut({ callbackUrl: '/', redirect: true })}>Log out</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Github className="mr-2 h-4 w-4" />
                    <Link target='_blank' href={`https://github.com/Yashh56/Zeddit`}>GitHub</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <ThemeToggle />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
