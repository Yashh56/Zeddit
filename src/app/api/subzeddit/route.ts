import { db } from "@/lib/db";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import Res from "@/helper/JsonResponse";
import InternalErrorResponse from "@/helper/InternalErrorResponse";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !user) {
    return Response.json(Res({ status: 401, title: "Not authenticated" }));
  }
  try {
    const allSubzeddits = await db.subzeddit.findMany();
    return Response.json(allSubzeddits, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !user) {
    return Response.json(Res({ status: 401, title: "Not authenticated" }));
  }
  try {
    const { name, description, icon, admin, adminId } = await req.json();

    const createSubzeddit = await db.subzeddit.create({
      data: {
        name,
        description,
        icon,
        admin,
        adminId,
      },
    });

    const joinOwn = await db.userSubZeddit.create({
      data: {
        subZedditId: createSubzeddit.id,
        userId: adminId,
        icon,
        subZedditName: name,
      },
    });

    return Response.json(createSubzeddit);
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}
