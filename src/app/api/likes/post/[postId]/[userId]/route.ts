import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { AuthErrorResponse } from "@/helper/authErrorResponse";
import InternalErrorResponse from "@/helper/InternalErrorResponse";
import Res from "@/helper/JsonResponse";
import { db } from "@/lib/db";
import { getServerSession, User } from "next-auth";

export async function POST(
  req: Request,
  { params }: { params: { postId: string; userId: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!user) {
    return Response.json(AuthErrorResponse);
  }
  try {
    const { subZedditId, commentId } = await req.json();
    const create = await db.likes.create({
      data: {
        postId: params.postId,
        userId: params.userId,
        subZedditId,
        commentId,
      },
    });
    return Response.json(
      Res({ title: "Like on post has been created", status: 201 })
    );
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}

export async function GET(
  req: Request,
  { params }: { params: { postId: string; userId: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!user) {
    return Response.json(AuthErrorResponse);
  }
  try {
    const findUnique = await db.likes.findUnique({
      where: {
        userId_postId: {
          postId: params.postId,
          userId: params.userId,
        },
      },
    });
    return Response.json(findUnique);
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string; userId: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!user) {
    return Response.json(AuthErrorResponse);
  }
  try {
    const findUnique = await db.likes.findUnique({
      where: {
        userId_postId: {
          postId: params.postId,
          userId: params.userId,
        },
      },
    });
    if (!findUnique) {
      return Response.json(Res({ title: "Like not exist", status: 404 }));
    }
    await db.likes.delete({
      where: {
        userId_postId: {
          postId: params.postId,
          userId: params.userId,
        },
      },
    });
    return Response.json(Res({ title: "Like has been deleted", status: 200 }));
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}
