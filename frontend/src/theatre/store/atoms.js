import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

// Define your atoms with persistence
export const userDetailsAtom = atom({
  key: "user",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const searchBarAtom = atom({
  key: "searchBarInput",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const navLinkAtom = atom({
  key: "navLinkActive",
  default: "Home",
  effects_UNSTABLE: [persistAtom],
});

export const showsDetailAtom = atom({
  key: "showDetail",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const highlightedShowDetailAtom = atom({
  key: "highlightedShowDetail",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const popupStatus = atom({
  key: "popupstatus",
  default: {
    message: "",
    type: "",
    active: false,
  },
  effects_UNSTABLE: [persistAtom],
});
