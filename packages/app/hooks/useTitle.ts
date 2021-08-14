import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { NavProp } from "../navigation-drawer";

export default function useTitle(title: string) {
  const nav = useNavigation<NavProp>();
  const pageOpen = useIsFocused();
  useEffect(() => {
    if(pageOpen) {
      nav.setOptions({title, headerTitle: title.replace(/☕ /g, "")});
    }
  }, [nav, pageOpen, title])
  return;
};