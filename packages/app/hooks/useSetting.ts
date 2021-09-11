import AsyncStorage from "@react-native-async-storage/async-storage";
import {useEffect} from "react";
import {atom as jotaiAtom, PrimitiveAtom, useAtom, WritableAtom} from "jotai";
import builds from "../builds";
import {CuppaZeeDB} from "@cuppazee/db";
import {atomWithStorage} from "jotai/utils";
import {TeakenData} from "./useToken";


const MergeStorage = (initialData: any) => ({
  getItem: async (key: string) => {
    const jsonString = await AsyncStorage.getItem(key);
    if (!jsonString) return {data: initialData, loaded: true};
    try {
      const data = JSON.parse(jsonString);
      return {data: {...initialData, ...data}, loaded: true};
    } catch {
      return {data: initialData, loaded: true};
    }
  },
  setItem: async (key: string, data: any) => {
    await AsyncStorage.setItem(key, JSON.stringify(data.data))
  },
  delayInit: true,
});

const ReplaceStorage = (initialData: any) => ({
  getItem: async (key: string) => {
    const jsonString = await AsyncStorage.getItem(key);
    if (!jsonString) return {data: initialData, loaded: true};
    try {
      const data = JSON.parse(jsonString);
      return {data: data, loaded: true};
    } catch {
      return {data: initialData, loaded: true};
    }
  },
  setItem: async (key: string, data: any) => {
    await AsyncStorage.setItem(key, JSON.stringify(data.data))
  },
  delayInit: true,
});

export function settingAtom<T>(key: string, initialData: T, loadMethod?: "merge" | "replace") {
  const method = loadMethod ?? ((typeof initialData === "object" && !Array.isArray(initialData)) ? "merge" : "replace");
  return atomWithStorage<{
    data: T;
    loaded: boolean;
  }>(
    key,
    {
      data: initialData,
      loaded: false,
    },
    (method === "merge" ? MergeStorage : ReplaceStorage)(initialData),
  )
}

export interface Setting<T> {
  data: T;
  loaded: boolean;
}

export const BuildAtom = settingAtom<number>(
  "@cuppazee/build",
  builds(new CuppaZeeDB([], [], []))[builds(new CuppaZeeDB([], [], [])).length - 1].build - 1
);

export const ThemeAtom = settingAtom<string>(
  "@cuppazee/personalisation/theme",
  "green_light"
);

export const ClanPersonalisationAtom = settingAtom<{
  style: number;
  reverse: boolean;
  single_line: boolean;
  full_background: boolean;
  colours: string[];
  edited: boolean;
}>(
  "@cuppazee/personalisation/clan",
  {
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
);

export const ClansAtom = settingAtom<{
  [clan_id: string]: {
    level: number;
    share: boolean;
    subtract: boolean;
    shadow: boolean;
  };
}>(
  "@cuppazee/clans",
  {}
);

export const TipsAtom = settingAtom<{
  [id: string]: {
    time: number;
    count: number;
  };
}>(
  "@cuppazee/tips",
  {}
);

export const ReadyAtom = settingAtom<string | false>(
  "@cuppazee/ready",
  false
);

export const LiveLocationErrorAtom = settingAtom<"" | "permission_failed" | "updated" | "updated_native">(
  "@cuppazee/errors/live_location",
  ""
);

export const DrawerAtom = settingAtom<{
  open?: boolean;
  collapsed: boolean;
}>(
  "@cuppazee/personalisation/drawer",
  {
    open: true,
    collapsed: false,
  }
);

export const MapStyleAtom = settingAtom<"monochrome" | "streets" | "satellite">(
  "@cuppazee/personalisation/maps",
  "monochrome"
);
export const CumulativeRewardsAtom = settingAtom<boolean>(
  "@cuppazee/clan/cumulative_rewards",
  false
);

export const SkipDashboardAtom = settingAtom<boolean>(
  "@cuppazee/skipdashboard",
  false
);

export default function useSetting<T>(atom: PrimitiveAtom<Setting<T>>) {
  const [value, setValue] = useAtom(atom);
  return [
    value.data,
    (data: T) => {
      setValue({...value, data});
    },
    value.loaded,
  ] as const;
}
