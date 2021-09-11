import useSetting, {settingAtom} from "./useSetting";

export type ClanBookmark = {
  clan_id: number;
  name: string;
  tagline: string;
};

export type UserBookmark = {
  user_id: string;
  username: string;
};

export const ClanBookmarksAtom = settingAtom<ClanBookmark[]>(
  "CLAN_BOOKMARKS",
  []
);

export const UserBookmarksAtom = settingAtom<UserBookmark[]>(
  "USER_BOOKMARKS",
  []
);

export function useUserBookmarks() {
  return useSetting(UserBookmarksAtom);
}

export function useClanBookmarks() {
  return useSetting(ClanBookmarksAtom);
}
