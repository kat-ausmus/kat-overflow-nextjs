import React from "react";
import { SignOut } from "@/components/auth/SignOut";

const Home = async () => {
  return (
    <>
      <h1 className="h1-bold">Root Welcome to the world of Next.js</h1>
      <SignOut />
    </>
  );
};
export default Home;
