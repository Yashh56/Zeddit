import { AuthErrorResponse } from "@/helper/authErrorResponse";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/option";
import { db } from "@/lib/db";
import Res from "@/helper/JsonResponse";
import InternalErrorResponse from "@/helper/InternalErrorResponse";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !user) {
    return Response.json(AuthErrorResponse);
  }

  try {
    const findPosts = await db.post.findMany({
      where: {
        subZedditId: params.id,
      },
    });

    const findLikes = await db.likes.findMany({
      where: {
        subZedditId: params.id,
      },
    });

    const findComments = await db.comment.findMany({
      where: {
        subZedditId: params.id,
      },
    });

    if (findLikes) {
      await db.likes.deleteMany({
        where: {
          subZedditId: params.id,
        },
      });
    }
    if (findComments) {
      await db.comment.deleteMany({
        where: {
          subZedditId: params.id,
        },
      });
    }
    if (findPosts) {
      await db.post.deleteMany({
        where: {
          subZedditId: params.id,
        },
      });
    }

    await db.userSubZeddit.deleteMany({
      where: {
        subZedditId: params.id,
      },
    });
    await db.subzeddit.delete({
      where: {
        id: params.id,
      },
    });
    return Response.json(
      Res({ title: "Subzeddit has been deleted.", status: 200 })
    );
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !user) {
    return Response.json(AuthErrorResponse);
  }
  try {
    const { icon, description, name } = await req.json();

    const update = await db.subzeddit.update({
      where: {
        id: params.id,
      },
      data: {
        description,
        name,
        icon,
      },
    });
    return Response.json(
      Res({ title: "Data has been updated in the database", status: 200 })
    );
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!user) {
    return Response.json(AuthErrorResponse);
  }

  try {
    const getSubZeddit = await db.subzeddit.findUnique({
      where: {
        id: params.id,
      },
    });
    return Response.json(getSubZeddit);
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}
