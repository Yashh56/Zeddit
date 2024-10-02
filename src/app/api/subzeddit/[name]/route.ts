import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { AuthErrorResponse } from "@/helper/authErrorResponse";
import { db } from "@/lib/db";
import InternalErrorResponse from "@/helper/InternalErrorResponse";
import Res from "@/helper/JsonResponse";

export async function GET(
  req: Request,
  { params }: { params: { name: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !user) {
    return Response.json(AuthErrorResponse);
  }

  try {
    const findByName = await db.subzeddit.findUnique({
      where: {
        name: params.name,
      },
    });

    

    return Response.json(findByName);
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { name: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !user) {
    return Response.json(AuthErrorResponse);
  }
  try {
    const { name, description, icon } = await req.json();
    const updateOne = await db.subzeddit.update({
      where: {
        name: params.name,
      },
      data: {
        name,
        description,
        icon,
      },
    });
    return Response.json(
      Res({ title: "Information has been updated !!", status: 200 })
    );
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}
