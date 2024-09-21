import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { AuthErrorResponse } from "@/helper/authErrorResponse";
import InternalErrorResponse from "@/helper/InternalErrorResponse";
import { db } from "@/lib/db";
import { getServerSession, User } from "next-auth";

export async function GET(
  req: Request,
  { params }: { params: { userId: string; subzedditId: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!user) {
    return Response.json(AuthErrorResponse);
  }
  try {
    const suggestedSubZeddits = await db.subzeddit.findMany({
      where: {
        id: { not: params.subzedditId },
      },
      take: 3,
    });
    return Response.json(suggestedSubZeddits);
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}
