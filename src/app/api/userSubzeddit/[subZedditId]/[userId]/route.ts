import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { AuthErrorResponse } from "@/helper/authErrorResponse";
import InternalErrorResponse from "@/helper/InternalErrorResponse";
import Res from "@/helper/JsonResponse";
import { db } from "@/lib/db";
import { getServerSession, User } from "next-auth";

export async function GET(
  req: Request,
  { params }: { params: { subZedditId: string; userId: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !user) {
    return Response.json(AuthErrorResponse);
  }
  try {
    const checkIfJoined = await db.userSubZeddit.findFirst({
      where: {
        subZedditId: params.subZedditId,
        userId: params.userId,
      },
    });
    if (!checkIfJoined) {
      return Response.json(false);
    }
    return Response.json(true);
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { subZedditId: string; userId: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!user) {
    return Response.json(AuthErrorResponse);
  }
  try {
    const findOne = await db.userSubZeddit.findFirst({
      where: {
        subZedditId: params.subZedditId,
        userId: params.userId,
      },
    });
    if (!findOne) {
      return Response.json(
        Res({ title: "User Subzeddit not found!!", status: 404 })
      );
    }
    const deleteOne = await db.userSubZeddit.deleteMany({
      where: {
        subZedditId: params.subZedditId,
        userId: params.userId,
      },
    });
    return Response.json(deleteOne);
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}
