import ROUTES from "@/constants/routes";

export type SidebarLink = {
  imgURL: string;
  route: string;
  label: string;
  title: string;
};

export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: "/icons/home.svg",
    route: "/",
    label: "Home",
    title: "Home page",
  },
  {
    imgURL: "/icons/users.svg",
    route: "/communities",
    label: "Communities",
    title: "Communities page",
  },
  {
    imgURL: "/icons/star.svg",
    route: "/collections",
    label: "Collections",
    title: "Collections page",
  },
  {
    imgURL: "/icons/suitcase.svg",
    route: "/find-jobs",
    label: "Find Jobs",
    title: "Find jobs page",
  },
  {
    imgURL: "/icons/tag.svg",
    route: "/tags",
    label: "Tags",
    title: "Tags page",
  },
  // {
  //   imgURL: "/icons/user.svg",
  //   route: "/profile",
  //   label: "Profile",
  //   title: "Profile page",
  // },
  {
    imgURL: "/icons/question.svg",
    route: "/ask-a-question",
    label: "Ask a question",
    title: "Ask a question page",
  },
  {
    imgURL: "",
    route: ROUTES.SIGN_IN,
    label: "Sign In",
    title: "Sign In page",
  },
  {
    imgURL: "",
    route: ROUTES.SIGN_UP,
    label: "Sign Up",
    title: "Sign Up page",
  },
];
