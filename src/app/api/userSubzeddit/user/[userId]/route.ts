import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { AuthErrorResponse } from "@/helper/authErrorResponse";
import InternalErrorResponse from "@/helper/InternalErrorResponse";
import { db } from "@/lib/db";
import { getServerSession, User } from "next-auth";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !user) {
    return Response.json(AuthErrorResponse);
  }
  try {
    const allUserJoinedSubZeddits = await db.userSubZeddit.findMany({
      where: {
        userId: params.userId,
      },
    });
    return Response.json(allUserJoinedSubZeddits);
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}
