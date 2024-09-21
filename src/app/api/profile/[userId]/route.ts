import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import Res from "@/helper/JsonResponse";
import { db } from "@/lib/db";
import InternalErrorResponse from "@/helper/InternalErrorResponse";

export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !user) {
    return Response.json(Res({ status: 401, title: "Not authenticated" }));
  }
  try {
    const { profilePicture, bio, displayName } = await req.json();
    const updateProfile = await db.profile.update({
      where: {
        userId: params.userId,
      },
      data: {
        bio,
        profilePicture,
        displayName,
      },
    });
    return Response.json(updateProfile, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !user) {
    return Response.json(Res({ status: 401, title: "Not authenticated" }));
  }
  try {
    const uniqueProfile = await db.profile.findUnique({
      where: {
        userId: params.userId,
      },
    });
    const allPostsByUser = await db.post.findMany({
      where: {
        userId: params.userId,
      },
    });
    const allSubZedditsByUser = await db.subzeddit.findMany({
      where: {
        adminId: params.userId,
      },
    });
    const allCommentsByUser = await db.comment.findMany({
      where: {
        userId: params.userId,
      },
    });
    const allJoinedSubZedditsByUser = await db.userSubZeddit.findMany({
      where: {
        userId: params.userId,
      },
    });

    const allLikes = await db.likes.count({
      where: {
        Post: {
          userId: params.userId,
        },
      }
    });

    const joinedSubZedditsCount = await db.userSubZeddit.count({
      where: {
        userId: params.userId,
      },
    });

    return Response.json({
      uniqueProfile: uniqueProfile,
      allPostsByUser: allPostsByUser,
      allCommentsByUser: allCommentsByUser,
      allSubZedditsByUser: allSubZedditsByUser,
      allJoinedSubZedditsByUser: allJoinedSubZedditsByUser,
      joinedSubZedditsCount: joinedSubZedditsCount,
      allLikes: allLikes,
    });
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}
