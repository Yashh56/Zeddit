import Res from "@/helper/JsonResponse";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json();
    const existedUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existedUser) {
      return Response.json(
        Res({ status: 403, title: "Username already taken" })
      );
    }
    const hashedPassword =await bcrypt.hash(password,10);
    const newUser = await db.user.create({
        data:{
            email,
            username,
            password:hashedPassword,
            Profile:{
                create:{
                    displayName:username
                }
            }
        }
    })
    return Response.json(Res({status:201,title:"User has been created"}))
  } catch (error) {
    console.log(error)
    return Response.json(
        Res({status:500,title:"Internal Error"})
    )
  }
}
