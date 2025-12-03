import React from "react";
import { SidebarLink } from "@/constants/sidebarLinks";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const AppSideBarBottom = ({ item }: { item: SidebarLink; isMobile: boolean }) => {
  const signInCss = "small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none";
  const signUpCss =
    "small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none";

  const isSignIn = item.route === "/sign-in";
  return (
    <Link href={item.route}>
      <Button className={isSignIn ? signInCss : signUpCss}>
        <span className="primary-text-gradient">{item.title}</span>
      </Button>
    </Link>
  );
};
export default AppSideBarBottom;
