import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const {email, password} = await req.json()
  try {

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/auth/v1/login`,
      {
        method: "POST",
        headers: {"content-type": "application/json"},
        credentials: "include",
        body: JSON.stringify({email, password})
      }
    )

    if(!response.ok){
      return NextResponse.json({error: "Invalid Credentials"}, {status: 401})
    }

    const data = await response.json()

    ;(await cookies()).set({
      name: "authToken",
      value: data.authToken,
      httpOnly: true,
      // secure: 
      path: "/",
      // sameSite: "strict",
      expires: new Date(Date.now() + 4 * 60 * 60 * 1000)
    })

    return NextResponse.json({user: data.user}, {status: 200})


  } catch(error) {

    return NextResponse.json({error: "Something Went Wrong!"}, {status: 500})
  }
}