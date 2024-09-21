import { getServerSession, User } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/option";
import { AuthErrorResponse } from "@/helper/authErrorResponse";
import { db } from "@/lib/db";
import InternalErrorResponse from "@/helper/InternalErrorResponse";

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !user) {
    return Response.json(AuthErrorResponse);
  }
  try {
    const { userId, content, username, subZedditId } = await req.json();
    const createComment = await db.comment.create({
      data: {
        content,
        userId,
        username,
        postId: params.postId,
        subZedditId,
      },
    });
    return Response.json(createComment);
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !user) {
    return Response.json(AuthErrorResponse);
  }
  try {
    const allComments = await db.comment.findMany({
      where: {
        postId: params.postId,
      },
    });
    return Response.json(allComments);
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}
