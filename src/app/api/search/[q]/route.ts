import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { AuthErrorResponse } from "@/helper/authErrorResponse";
import { db } from "@/lib/db";
import InternalErrorResponse from "@/helper/InternalErrorResponse";

export async function GET(req: Request, { params }: { params: { q: string } }) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!user) {
    return Response.json(AuthErrorResponse);
  }

  try {
    // Split the search query into multiple terms (by spaces or commas)
    const searchTerms = params.q.split(/\s+|,+/).filter(term => term.trim() !== '');

    if (searchTerms.length === 0) {
      return Response.json({ message: "No valid search terms provided." }, { status: 400 });
    }

    // Use Prisma to search for SubZeddits that match any of the terms partially
    const findSubzeddits = await db.subzeddit.findMany({
      where: {
        OR: searchTerms.map((term) => ({
          name: {
            contains: term,
            mode: 'insensitive', // Case-insensitive matching
          },
        })),
      },
      orderBy: {
        name: 'asc',
      },
    });

    return Response.json(findSubzeddits);
  } catch (error) {
    console.log(error);
    return Response.json(InternalErrorResponse);
  }
}
