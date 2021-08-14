import {
  useLinkBuilder,
  useNavigation,
  useNavigationState,
} from "@react-navigation/native";
import { Box, Column, Heading, HStack, Image, Link } from "native-base";
import React, { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { NavProp } from ".";
import { RootStackParamList } from "../types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Icon from "../components/Common/Icon";
import { useTranslation } from "react-i18next";
import { useUserBookmarks } from "../hooks/useBookmarks";
import { Item } from "../components/Common/Item";

export default function Drawer() {
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const [users] = useUserBookmarks();
  if (width < 1000) return null;
  return (
    <Column
      borderRightWidth={1}
      borderRightColor="coolGray.500"
      minW={200}
      maxW={300}
      flex={1}
      bg="coolGray.100"
      _dark={{ bg: "coolGray.900" }}>
      <Box
        bg="coolGray.200"
        height="48px"
        justifyContent="center"
        alignItems="center"
        _dark={{ bg: "coolGray.800" }}>
        <Heading fontSize="lg">CuppaZee Max</Heading>
      </Box>
      <Column p={2} space={2}>
        <Box borderRadius={4} bg="coolGray.200" _dark={{ bg: "coolGray.800" }}>
          <Item checkMatch navMethod="reset" icon="magnify" title={t("pages:tools_search")} link={["Tools_Search"]} />
        </Box>
        <Box borderRadius={4} bg="coolGray.200" _dark={{ bg: "coolGray.800" }}>
          {users.map(i => (
            <Item
              checkMatch navMethod="reset"
              image={`https://munzee.global.ssl.fastly.net/images/avatars/ua${Number(
                i.user_id
              ).toString(36)}.png`}
              imageRounded
              title={i.username}
              link={["User_Profile", { username: i.username }]}
            />
          ))}
        </Box>
        <Box borderRadius={4} bg="coolGray.200" _dark={{ bg: "coolGray.800" }}>
          <Item checkMatch navMethod="reset" icon="map-marker-radius" title={t("pages:tools_nearby")} link={["Tools_Nearby"]} />
          <Item checkMatch navMethod="reset"
            icon="map-marker"
            title={t("pages:tools_bouncers_overview")}
            link={["Tools_Bouncers"]}
          />
          <Item checkMatch navMethod="reset"
            icon="clock"
            title={t("pages:tools_bouncing_soon")}
            link={["Tools_BouncersExpiring"]}
          />
        </Box>
        <Box borderRadius={4} bg="coolGray.200" _dark={{ bg: "coolGray.800" }}>
          <Item checkMatch navMethod="reset" icon="bomb" title={t("pages:tools_blastplanner")} link={["Tools_Blast"]} />
          <Item checkMatch navMethod="reset"
            icon="map-marker-circle"
            title={t("pages:tools_poiplanner")}
            link={["Tools_POIPlanner"]}
          />
          <Item checkMatch navMethod="reset"
            icon="home-circle-outline"
            title={t("pages:tools_destinationplanner")}
            link={["Tools_DestinationPlanner"]}
          />
          <Item checkMatch navMethod="reset" icon="dna" title={t("pages:tools_evo_planner")} link={["Tools_EvoPlanner"]} />
        </Box>
        <Box borderRadius={4} bg="coolGray.200" _dark={{ bg: "coolGray.800" }}>
          <Item checkMatch navMethod="reset" icon="calendar" title={t("pages:tools_calendar")} link={["Tools_Calendar"]} />
          <Item checkMatch navMethod="reset" icon="earth" title={t("pages:tools_universal")} link={["Tools_Universal"]} />
          <Item checkMatch navMethod="reset"
            icon="database"
            title={t("pages:tools_munzee_types")}
            link={["Tools_TypeCategory", { category: "root" }]}
          />
        </Box>
      </Column>
    </Column>
  );
}
