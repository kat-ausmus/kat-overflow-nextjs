import React from "react";
import { SidebarLink } from "@/constants/sidebarLinks";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";

const SideBarItem = ({ item }: { item: SidebarLink }) => {
  const pathname = usePathname();

  const isActive = (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route;

  return (
    <Link
      href={item.route}
      key={item.label}
      className={cn(
        isActive ? "primary-gradient text-light-900 rounded-lg" : "text-dark300_light900",
        "flex justify-start gap-2 bg-transparent p-4 max-lg:justify-center"
      )}
    >
      <Image src={item.imgURL} alt={item.label} width={20} height={20} className={cn({ "invert-colors": !isActive })} />
      <p className={cn(isActive ? "base-bold" : "base-medium", "max-lg:hidden")}>{item.label}</p>
    </Link>
  );
};
export default SideBarItem;
