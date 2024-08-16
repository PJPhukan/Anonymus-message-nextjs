"use client";
import { useSession, signIn, signOut } from "next-auth/react";
export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      <div className="container  m-auto flex justify-items-center items-center flex-col gap-5 p-5">
        <h1 className=" text-2xl ">This is Sign in page</h1>
        <button
          onClick={() => signIn()}
          className="border-solid border-2 border-sky-500  m-auto rounded-full py-3 px-12 text-xl"
        >
          Sign in
        </button>
      </div>
    </>
  );
}
