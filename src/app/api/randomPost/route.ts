import { db } from "@/lib/db";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { AuthErrorResponse } from "@/helper/authErrorResponse";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !user) {
    return Response.json(AuthErrorResponse);
  }

  try {
    // Fetch all posts
    const allPosts = await db.post.findMany();

    // Shuffle posts randomly using the Fisher-Yates algorithm (efficient shuffle)
    const shuffledPosts = allPosts.sort(() => 0.5 - Math.random());

    return Response.json(shuffledPosts);
  } catch (error) {
    console.log(error);
    return Response.json({ error: 'Failed to fetch random posts' });
  }
}
