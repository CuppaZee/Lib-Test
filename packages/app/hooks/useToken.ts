import { useQuery } from "react-query";
import { useAtom } from "jotai";
import baseURL from "../baseURL";
import {useRef} from "react";
import { settingAtom } from "./useSetting";

const getToken = async (teaken: string, user_id: number) => {
  const response = await fetch(
    `${baseURL}/auth/get/v2?teaken=${encodeURIComponent(
      teaken
    )}&user_id=${encodeURIComponent(user_id)}`
  );
  return await response.json();
};

export type TeakenData = {
  teaken: string;
  username: string;
};


export const teakensAtom = settingAtom<{
  [user_id: string]: TeakenData;
}>(
  "CUPPAZEE_TEAKENS",
  {}
);

export function useTeakens() {
  const [teakens] = useAtom(teakensAtom);
  const ref = useRef(Math.floor(Math.random() * 10000));
  console.log("t", teakens, ref.current);
  return teakens;
}

export default function useToken(user_id?: number) {
  const [teakens] = useAtom(teakensAtom);
  const teaken =
    teakens.data[user_id ?? Object.keys(teakens.data)[0]]?.teaken ?? teakens.data["*"]?.teaken;
  const data = useQuery(
    ["token", teaken, Number(user_id ?? Object.keys(teakens.data)[0])],
    () => getToken(teaken, Number(user_id ?? Object.keys(teakens.data)[0])),
    {
      enabled: teaken !== undefined,
    }
  );
  return {
    status: (teakens.loaded && teaken) ? (data.data?.executed_in ? (data.data?.data?.access_token ? "valid" : "expired") : (data.isLoading ? "loading" : "failed")) : (teakens.loaded ? "missing" : "loading"),
    user_id: user_id ?? Object.keys(teakens.data)[0],
    token: data.data?.data,
  };
}
