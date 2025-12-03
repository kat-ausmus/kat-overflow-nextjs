import React from "react";
import { SidebarLink } from "@/constants/sidebarLinks";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignOut } from "@/components/auth/SignOut";
import { useSession } from "next-auth/react";

const SideBarBottomItem = ({ item }: { item: SidebarLink }) => {
  const { data: session } = useSession();
  const signInItemCss = "small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none";
  const otherCss =
    "small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none";

  const isItemSignIn = item.route === "/sign-in";
  const isItemSignOut = item.route === "/sign-out";

  const isSignedIn = !!session;

  const itemWithButton = (
    <Link href={item.route}>
      <Button className={isItemSignIn ? signInItemCss : otherCss}>
        <span className="primary-text-gradient">{item.label}</span>
      </Button>
    </Link>
  );

  const itemSignOut = <SignOut />;
  const showSignOut = isSignedIn && isItemSignOut && itemSignOut;
  const showItemWithButton = !isSignedIn && !isItemSignOut && itemWithButton;

  return showSignOut || showItemWithButton || <></>;
};
export default SideBarBottomItem;
