import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const authToken = (await cookies()).get("authToken")?.value

  if(!authToken){
    return NextResponse.json({error: "unauthorized"}, {status: 401})
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/auth/v1/verify`,
      {
        headers: {
          cookie: `authToken=${authToken}`
        }
      }
    )

    if(!response.ok){
      return NextResponse.json({error: "Invalid Session"}, {status: 401})
    }

    const user = await response.json()
    return NextResponse.json(user, {status: 200})

  } catch(error){
    return NextResponse.json({error: "Something went wrong!"}, {status: 500})
  }

}