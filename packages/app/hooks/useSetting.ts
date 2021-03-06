import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { atom as jotaiAtom, useAtom, WritableAtom } from "jotai";
import builds from "../builds";
import { CuppaZeeDB } from "@cuppazee/db";

export function atom<T>(initial: T) {
  return jotaiAtom<T>(initial);
}

export interface Setting<T> {
  data: T;
  loaded: boolean;
  key: string;
}

export const BuildAtom = atom<Setting<number>>({
  data: builds(new CuppaZeeDB([], [], []))[builds(new CuppaZeeDB([], [], [])).length - 1].build - 1,
  loaded: false,
  key: "@cuppazee/build",
});

export const ThemeAtom = atom<Setting<string>>({
  data: "green_light",
  loaded: false,
  key: "@cuppazee/personalisation/theme",
});

export const ClanPersonalisationAtom = atom<
  Setting<{
    style: number;
    reverse: boolean;
    single_line: boolean;
    full_background: boolean;
    colours: string[];
    edited: boolean;
  }>
>({
  data: {
    style: 2,
    reverse: false,
    single_line: false,
    full_background: false,
    edited: false,
    colours: [
      "#eb0000",
      "#ef6500",
      "#fa9102",
      "#fcd302",
      "#bfe913",
      "#55f40b",
      "#0cf4af",
      "",
      "",
      "",
      "",
      "#FFE97F",
      "#DFF77E",
      "#B0FC8D",
    ],
  },
  loaded: false,
  key: "@cuppazee/personalisation/clan",
});

export const ClansAtom = atom<
  Setting<{
    [clan_id: string]: {
      level: number;
      share: boolean;
      subtract: boolean;
      shadow: boolean;
    };
  }>
>({
  data: {},
  loaded: false,
  key: "@cuppazee/clans",
});

export const TipsAtom = atom<
  Setting<{
    [id: string]: {
      time: number;
      count: number;
    };
  }>
>({
  data: {},
  loaded: false,
  key: "@cuppazee/tips",
});

export const ReadyAtom = atom<Setting<string | false>>({
  data: false,
  loaded: false,
  key: "@cuppazee/ready",
});

export const LiveLocationErrorAtom = atom<Setting<"" | "permission_failed" | "updated" | "updated_native">>({
  data: "",
  loaded: false,
  key: "@cuppazee/errors/live_location",
});

export const DrawerAtom = atom<Setting<{
  open?: boolean;
}>>({
  data: {
    open: true,
  },
  loaded: false,
  key: "@cuppazee/personalisation/drawer",
});

export const MapStyleAtom = atom<Setting<"monochrome" | "streets" | "satellite">>({
  data: "monochrome",
  loaded: false,
  key: "@cuppazee/personalisation/maps",
});

export const CumulativeRewardsAtom = atom<Setting<boolean>>({
  data: false,
  loaded: false,
  key: "@cuppazee/clan/cumulative_rewards",
});

export const SkipDashboardAtom = atom<Setting<boolean>>({
  data: false,
  loaded: false,
  key: "@cuppazee/skipdashboard",
});

export default function useSetting<T>(atom: WritableAtom<Setting<T>, Setting<T>> & {loading?: number}) {
  const [value, setValue] = useAtom(atom);
  useEffect(() => {
    if (!value.loaded && (!atom.loading || atom.loading < Date.now() - 10000)) {
      atom.loading = Date.now();
      AsyncStorage.getItem(value.key).then(data => {
        const jsonData = JSON.parse(data || "null");
        if (typeof value.data === "object" && !Array.isArray(value.data)) {
          setValue({ data: { ...value.data, ...(jsonData || {}) }, loaded: true, key: value.key });
        } else {
          setValue({ data: jsonData || value.data, loaded: true, key: value.key });
        }
      });
    }
  }, [value.loaded]);
  return [
    value.data,
    (data: T) => {
      setValue({ ...value, data });
      return AsyncStorage.setItem(value.key, JSON.stringify(data));
    },
    value.loaded,
  ] as const;
}
