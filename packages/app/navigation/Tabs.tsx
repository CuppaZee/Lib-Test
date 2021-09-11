import {Box, Column, Heading, HStack, Pressable, ScrollView, VStack} from "native-base";
import React, {useCallback} from "react";
import { useWindowDimensions } from "react-native";
import Icon from "../components/Common/Icon";
import { useTranslation } from "react-i18next";
import {useClanBookmarks, useUserBookmarks} from "../hooks/useBookmarks";
import {Item, TabItem} from "../components/Common/Item";
import useSetting, {DrawerAtom} from "../hooks/useSetting";

export default function Tabs() {
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const [users] = useUserBookmarks();
  const [clans] = useClanBookmarks();
  if (width >= 1000) return null;
  return (
    <HStack
      borderTopWidth={1}
      borderTopColor="coolGray.500"
      style={{
        height: 56,
      }}
      bg="coolGray.100"
      _dark={{ bg: "coolGray.900" }}>
      <TabItem checkMatch navMethod="reset" icon="magnify" title={t("pages:tools_search")} link={["Tools_Search"]} />
      <TabItem
        checkMatch navMethod="reset"
        image={`https://munzee.global.ssl.fastly.net/images/avatars/ua${Number(
          users[0]?.user_id
        ).toString(36)}.png`}
        imageRounded
        title={users[0]?.username}
        link={["Player_Profile", { username: users[0]?.username }]}
      />
      <TabItem
        checkMatch navMethod="reset"
        image={`https://munzee.global.ssl.fastly.net/images/clan_logos/${Number(
          clans[0]?.clan_id
        ).toString(36)}.png`}
        imageRounded
        title={clans[0]?.name}
        link={["Clan_Stats", { clanid: clans[0]?.clan_id }]}
      />
      <TabItem checkMatch navMethod="reset" icon="shield-half-full" title="Clans" link={["Clan_Bookmarks"]} />
      <TabItem checkMatch navMethod="reset" icon="more" title="More" link={["Tools_Donate"]} />
    </HStack>
  );
}
