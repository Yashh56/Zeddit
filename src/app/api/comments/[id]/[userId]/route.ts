import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/option";
import { AuthErrorResponse } from "@/helper/authErrorResponse";
import { db } from "@/lib/db";
import InternalErrorResponse from "@/helper/InternalErrorResponse";
import Res from "@/helper/JsonResponse";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; userId: string } }
) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) {
    return Response.json(AuthErrorResponse);
  }
  try {
    const findOne = await db.comment.findUnique({
      where: {
        id: params.id,
        userId: params.userId,
      },
    });
    if (!findOne) {
      return Response.json(Res({ title: "comment not found", status: 404 }));
    }
    await db.likes.deleteMany({
      where: {
        commentId: params.id,
        userId: params.userId,
      },
    });
    const deleteOne = await db.comment.delete({
      where: {
        id: params.id,
      },
    });
    return Response.json(deleteOne);
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}
