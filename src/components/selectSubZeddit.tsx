"use client"
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useSession } from "next-auth/react"
import axios from "axios"


interface comboboxProps {
    value: string;
    setValue: (value: string) => void
}

interface joinedSubZedditProps {
    subZedditName: string;
    subZedditId: string
}


export function SelectSubZeddit({ value, setValue }: comboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [subZeddits, setSubZeddits] = React.useState<joinedSubZedditProps[]>([])
    const { data: session } = useSession()
    const userId = session?.user.id;

    const getJoined = async () => {
        try {
            const res = await axios.get(`/api/userSubzeddit/user/${userId}`)
            console.log(res.data)
            setSubZeddits(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    React.useEffect(() => { getJoined() }, [userId])
    console.log(value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? subZeddits.find((framework) => framework.subZedditId === value)?.subZedditName
                        : "Select Subzeddit..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {subZeddits.map((framework) => (
                                <CommandItem
                                    key={framework.subZedditId}
                                    value={framework.subZedditId}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === framework.subZedditId ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {framework.subZedditName}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
