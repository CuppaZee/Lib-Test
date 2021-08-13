import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Type } from "@cuppazee/db";
import TypeImage from "../Common/TypeImage";
import { useNavigation } from "@react-navigation/native";
import { Box, Heading, Text } from "native-base";

export type BouncerIconProps = {
  type?: Type;
  icon?: string;
  count: number;
};

export function BouncerIcon({ type, count, icon }: BouncerIconProps) {
  const nav = useNavigation()
  return (
    <Pressable onPress={type ? (() => nav.navigate("Tools", {
      screen: "BouncersMap",
      params: {
        type: type.icon
      }
    })) : null}>
      <Box bg="coolGray.200" _dark={{bg: "coolGray.800"}} style={[styles.card, { opacity: count > 0 ? 1 : 0.2 }]}>
        <TypeImage icon={type?.icon ?? icon ?? ""} style={{ size: 32 }} />
        <Heading numberOfLines={1} ellipsizeMode="tail" fontSize="sm">
          {type?.name ?? icon ?? ""}
        </Heading>
        <Text fontSize="md">{count}</Text>
      </Box>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 4,
    alignItems: "center",
    width: 80,
    flexGrow: 1,
  },
});
