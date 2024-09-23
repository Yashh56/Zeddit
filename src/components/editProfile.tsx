import { Button } from '@/components/ui/button';
import { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useDropzone } from 'react-dropzone';
import { useEdgeStore } from '@/lib/edgestore';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useToast } from './ui/use-toast';
import { ToastAction } from './ui/toast';

interface EditProfileProps {
  username: string;
  bio: string;
  profilePicture: string;
  setUsername: (value: string) => void;
  setBio: (value: string) => void;
  setProfilePicture: (value: string) => void;
}

const EditProfile = ({ username, bio, profilePicture, setUsername, setBio, setProfilePicture }: EditProfileProps) => {
  const [newUsername, setNewUsername] = useState(username);
  const [newBio, setNewBio] = useState(bio);
  const [newProfilePicture, setNewProfilePicture] = useState(profilePicture);
  const { edgestore } = useEdgeStore();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const { data: session } = useSession();
  const userId = session?.user.id;
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Control dialog open state
  const { toast } = useToast()
  const uploadIcon = async (file: File) => {
    if (file) {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => setUploadProgress(progress),
      });
      setImageUrl(res.url);
      setProfilePicture(res.url) // Update the profile picture with the new image URL
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      uploadIcon(acceptedFiles[0]);
    }
  };
  console.log(imageUrl)
  console.log(profilePicture)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSaveChanges = async () => {
    try {
      const res = await axios.put(`/api/profile/${userId}`, {
        displayName: username,
        bio: bio,
        profilePicture: profilePicture, // Send the updated profile picture
      });

      console.log(res.data)
      setUsername(username);
      setBio(bio);
      setProfilePicture(profilePicture); // Update parent profile picture state
      setIsDialogOpen(false)
      toast({
        title: "Profile Updation",
        description: "Your Profile has been updated.",
        action: (
          <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
        )
      })
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="dark:bg-[#171717] bg-white sm:max-w-[425px] p-6 rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Edit Your Profile 🌻</CardTitle>
          {/* <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
           Edit your profile.
          </CardDescription> */}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <div
              {...getRootProps()}
              className="w-32 h-32 rounded-full border border-gray-400 p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-center">Drop the image here...</p>
              ) : (
                <img
                  className="w-full h-full rounded-full object-cover"
                  src={profilePicture} // Use the updated picture or fallback to the original
                  height={0}
                  width={0}
                  alt=''
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-medium">Name</Label>
            <Input
              onChange={(e) => setUsername(e.target.value)}
              value={username} // Bind input to newUsername state
              className="text-base border-gray-300 dark:border-gray-700"
            // placeholder={username}
            />
          </div>
          <div className="space-y-2">
            <Label className="font-medium">Description</Label>
            <Input
              className="text-base border-gray-300 dark:border-gray-700"
              onChange={(e) => setBio(e.target.value)}
              value={bio} // Bind input to newBio state
              placeholder="Enter a short bio"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </CardFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
