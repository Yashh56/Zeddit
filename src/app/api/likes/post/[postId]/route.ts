import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { AuthErrorResponse } from "@/helper/authErrorResponse";
import InternalErrorResponse from "@/helper/InternalErrorResponse";
import Res from "@/helper/JsonResponse";
import { db } from "@/lib/db";
import { getServerSession, User } from "next-auth";

// export async function POST(
//   req: Request,
//   { params }: { params: { postId: string } }
// ) {
//   const session = await getServerSession(authOptions);
//   const user: User = session?.user;
//   if (!user) {
//     return AuthErrorResponse;
//   }
//   try {
//     const { userId, commentId, subZedditId } = await req.json();
//     const create = await db.likes.create({
//       data: {
//         userId,
//         postId: params.postId,
//         subZedditId,
//         commentId,
//       },
//     });
//     return Response.json(create);
//     // return Response.json(Res({ title: "Post has been liked", status: 201 }));
//   } catch (error) {
//     console.log(error);
//     return Response.json(InternalErrorResponse);
//   }
// }

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!user) {
    return Response.json(AuthErrorResponse);
  }
  try {
    const countOfVotes = await db.likes.count({
      where: {
        postId: params.postId,
      },
    });
    return Response.json(countOfVotes);
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}
