import React from "react";
import { SidebarLink } from "@/constants/sidebarLinks";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";

const AppSideBarItem = ({ item, isMobile }: { item: SidebarLink; isMobile: boolean }) => {
  const pathname = usePathname();

  const isActive = (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route;

  return (
    <Link
      href={item.route}
      key={item.label}
      className={cn(
        isActive ? "primary-gradient text-light-900 rounded-lg" : "text-dark300_light900",
        "flex items-center justify-start gap-4 bg-transparent p-4"
      )}
    >
      <Image src={item.imgURL} alt={item.label} width={20} height={20} className={cn({ "invert-colors": !isActive })} />
      <p className={cn(isActive ? "base-bold" : "base-medium", !isMobile && "max-lg:hidden")}>{item.label}</p>
    </Link>
  );
};
export default AppSideBarItem;
