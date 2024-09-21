import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { AuthErrorResponse } from "@/helper/authErrorResponse";
import InternalErrorResponse from "@/helper/InternalErrorResponse";
import Res from "@/helper/JsonResponse";
import { db } from "@/lib/db";
import { getServerSession, User } from "next-auth";

export async function POST(
  req: Request,
  { params }: { params: { commentId: string; userId: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!user) {
    return Response.json(AuthErrorResponse);
  }
  try {
    const { subZedditId, postId } = await req.json();
    const create = await db.likes.create({
      data: {
        userId: params.userId,
        commentId: params.commentId,
        subZedditId,
        postId,
      },
    });
    return Response.json(
      Res({ title: "Comment like has been created", status: 201 })
    );
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { commentId: string; userId: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!user) {
    return Response.json(AuthErrorResponse);
  }
  try {
    const likeExisted = await db.likes.findUnique({
      where: {
        userId_commentId: {
          userId: params.userId,
          commentId: params.commentId,
        },
      },
    });
    if (!likeExisted) {
      return Response.json(Res({ title: "Like not exist", status: 404 }));
    }
    const deleteOne = await db.likes.delete({
      where: {
        userId_commentId: {
          userId: params.userId,
          commentId: params.commentId,
        },
      },
    });
    return Response.json(
      Res({ title: "Comment has been Disliked", status: 200 })
    );
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}

export async function GET(
  req: Request,
  { params }: { params: { commentId: string; userId: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!user) {
    return Response.json(AuthErrorResponse);
  }
  try {
    const uniqueLike = await db.likes.findUnique({
      where: {
        userId_commentId: {
          userId: params.userId,
          commentId: params.commentId,
        },
      },
    });
    return Response.json(uniqueLike);
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}
