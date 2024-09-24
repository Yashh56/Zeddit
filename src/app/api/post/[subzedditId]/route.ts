import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { db } from "@/lib/db";
import { AuthErrorResponse } from "@/helper/authErrorResponse";
import InternalErrorResponse from "@/helper/InternalErrorResponse";

export async function POST(
  req: Request,
  { params }: { params: { subzedditId: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !user) {
    return Response.json(AuthErrorResponse);
  }
  try {
    const { title, content, image, userId, subZedditName, NSFW } = await req.json();

    const findUser = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!findUser) {
      return Response.json(AuthErrorResponse);
    }

    const newPost = await db.post.create({
      data: {
        userId,
        title,
        content,
        image,
        subZedditId: params.subzedditId,
        subZedditName,
        NSFW,
      },
    });
    return Response.json(newPost);
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}

export async function GET(
  req: Request,
  { params }: { params: { subzedditId: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !user) {
    return Response.json(AuthErrorResponse);
  }

  try {
    const allPosts = await db.post.findMany({
      where: {
        subZedditId: params.subzedditId,
      },
    });
    return Response.json(allPosts);
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}
