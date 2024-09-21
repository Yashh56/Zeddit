import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { AuthErrorResponse } from "@/helper/authErrorResponse";
import { db } from "@/lib/db";
import InternalErrorResponse from "@/helper/InternalErrorResponse";
import Res from "@/helper/JsonResponse";

export async function POST(
  req: Request,
  { params }: { params: { subZedditId: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !user) {
    return Response.json(AuthErrorResponse);
  }
  try {
    const { userId, icon, subZedditName } = await req.json();

    const adminUser = await db.subzeddit.findFirst({
      where: {
        adminId: userId,
      },
    });
    if (adminUser?.adminId === userId) {
      return Response.json(
        Res({
          title: "You are the admin you cant join your server!!",
          status: 401,
        })
      );
    }
    const joinSubzeddit = await db.userSubZeddit.create({
      data: {
        userId,
        subZedditId: params.subZedditId,
        icon,
        subZedditName,
      },
    });
    return Response.json(true);
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { subZedditId: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !user) {
    return Response.json(AuthErrorResponse);
  }

  try {
    const removeUserSubzeddit = await db.userSubZeddit.deleteMany({
      where: {
        subZedditId: params.subZedditId,
      },
    });

    return Response.json(
      Res({ title: "User leaved the subzeddit", status: 200 })
    );
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}

export async function GET(
  req: Request,
  { params }: { params: { subZedditId: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !user) {
    return Response.json(AuthErrorResponse);
  }
  try {
    const { userId } = await req.json();

    const checkIfJoined = await db.userSubZeddit.findFirst({
      where: {
        subZedditId: params.subZedditId,
        userId,
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
