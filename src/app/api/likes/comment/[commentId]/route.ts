import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { AuthErrorResponse } from "@/helper/authErrorResponse";
import InternalErrorResponse from "@/helper/InternalErrorResponse";
import Res from "@/helper/JsonResponse";
import { db } from "@/lib/db";
import { getServerSession, User } from "next-auth";

// export async function POST(
//   req: Request,
//   { params }: { params: { commentId: string } }
// ) {
//   const session = await getServerSession(authOptions);
//   const user: User = session?.user;
//   if (!user) {
//     return Response.json(AuthErrorResponse);
//   }
//   try {
//     const { userId, commentId, subZedditId } = await req.json();
//     const create = await db.likes.create({
//       data: {
//         userId,
//         commentId,
//         subZedditId,
//       },
//     });
//     return Response.json(
//       Res({ title: "Comment like has been created", status: 201 })
//     );
//   } catch (error) {
//     console.log(error);
//     return Response.json(InternalErrorResponse);
//   }
// }

export async function GET(
  req: Request,
  { params }: { params: { commentId: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!user) {
    return Response.json(AuthErrorResponse);
  }

  try {
    const countOfLikes = await db.likes.count({
      where: {
        commentId: params.commentId,
      },
    });
    return Response.json(countOfLikes);
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}
