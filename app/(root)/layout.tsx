import React from 'react';
import NavBar from '@/components/navigation/navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { LeftSideBar } from '@/components/navigation/sideBar/LeftSideBar';
import RightSideBar from '@/components/navigation/sideBar/RightSideBar';

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // const cookieStore = await cookies();
  // const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <div className="background-light800_dark200 relative flex flex-row">
      <SidebarProvider defaultOpen={true}>
        <NavBar />
        <LeftSideBar />
        <main className="left-40 flex flex-1 flex-col pt-25 pb-6 max-md:pb-14 sm:px-14">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
        <RightSideBar />
      </SidebarProvider>
    </div>
  );
};

export default RootLayout;
