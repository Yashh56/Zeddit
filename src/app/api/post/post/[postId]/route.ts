import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { AuthErrorResponse } from "@/helper/authErrorResponse";
import InternalErrorResponse from "@/helper/InternalErrorResponse";
import Res from "@/helper/JsonResponse";
import { db } from "@/lib/db";
import { getServerSession, User } from "next-auth";

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !user) {
    return Response.json(AuthErrorResponse);
  }
  try {
    const findLikes = await db.likes.findMany({
      where: {
        postId: params.postId,
      },
    });
    if (findLikes) {
      await db.likes.deleteMany({
        where: {
          postId: params.postId,
        },
      });
    }

    const findComments = await db.comment.deleteMany({
      where: {
        postId: params.postId,
      },
    });
    if (findComments) {
      await db.comment.deleteMany({
        where: {
          postId: params.postId,
        },
      });
    }
    const deleteOne = await db.post.delete({
      where: {
        id: params.postId,
      },
    });
    return Response.json(Res({ title: "Post has been deleted", status: 200 }));
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !user) {
    return Response.json(AuthErrorResponse);
  }
  try {
    const { title, content, image } = await req.json();
    const updateOne = await db.post.update({
      where: {
        id: params.postId,
      },
      data: {
        title,
        content,
        image,
      },
    });
    return Response.json(
      Res({ title: "Post has been Updated !!", status: 200 })
    );
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
    const post = await db.post.findUnique({
      where: {
        id: params.postId,
      },
    });
    return Response.json(post);
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}
