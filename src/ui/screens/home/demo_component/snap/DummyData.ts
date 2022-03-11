import Strings from "config/Strings";

export type Snap = {
  id: string;
  title: string;
  subTitle: string;
  longDescription?: string;
  shortDescription?: string;
  location?: string;
  imageUrl?: string;
};

export const snapData: Snap[] = [
  {
    id: "1",
    title: "FOR TAKE AWAY PRICE",
    subTitle: "Drink in bottles or cans",
    longDescription:
      "Any packaged beer or cider available to Drink In for Take Out prices!",
    shortDescription: "PIVO Czech Beer Hub",
    location: "3 miles away",
    imageUrl:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=774&q=80"
  },
  {
    id: "2",
    title: "FOR TAKE AWAY PRICE",
    subTitle: "Drink in bottles or cans",
    longDescription:
      "Any packaged beer or cider available to Drink In for Take Out prices!",
    shortDescription: "PIVO Czech Beer Hub",
    location: "3 miles away",
    imageUrl:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=774&q=80"
  },
  {
    id: "3",
    title: "FOR TAKE AWAY PRICE",
    subTitle: "Drink in bottles or cans",
    longDescription:
      "Any packaged beer or cider available to Drink In for Take Out prices!",
    shortDescription: "PIVO Czech Beer Hub",
    location: "3 miles away",
    imageUrl:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=774&q=80"
  }
];

export const snapDataSplash: Snap[] = [
  {
    id: "1",
    title: Strings.splash.dicover,
    subTitle: Strings.splash.dummyText
  },
  {
    id: "2",
    title: Strings.splash.dicover,
    subTitle: Strings.splash.dummyText
  },
  {
    id: "3",
    title: Strings.splash.dicover,
    subTitle: Strings.splash.dummyText
  }
];
