import { atom, selector } from "recoil";

export const userDetailsAtom = atom({
  key: "user",
  default: {},
});

export const bookingsAtom = atom({
  key: "bookings",
  default: [],
});

export const biddingsAtom = atom({
  key: "biddings",
  default: [],
});

export const searchBarAtom = atom({
  key: "searchBarInput",
  default: "",
});

export const navLinkAtom = atom({
  key: "navLinkActive",
  default: "Home",
});

export const showsDetailAtom = atom({
  key: "showDetail",
  default: {},
});

export const highlightedShowDetailAtom = atom({
  key: "highlightedShowDetail",
  default: {},
});
