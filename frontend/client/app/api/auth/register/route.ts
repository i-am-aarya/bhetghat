import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { firstname, lastname, username, email, password, confirmPassword } =
    await req.json();
  try {
    // const response = await fetch("")
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_GAME_SERVER}/auth/v1/register`,
      // `https://${process.env.NEXT_PUBLIC_GAME_SERVER}/auth/v1/register`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstname,
          lastname,
          username,
          email,
          password,
          confirmPassword,
        }),
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Invalid Credentials!" },
        { status: 401 },
      );
    }
    const data = await response.json();

    return NextResponse.json(
      { message: `Registration Successful! UserID: ${data.userID}` },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
