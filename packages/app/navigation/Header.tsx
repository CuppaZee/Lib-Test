import {NativeStackHeaderProps} from "@react-navigation/native-stack/lib/typescript/src/types";
import React, { useEffect, useReducer, useState } from "react";
import { useIsFetching, useQueryClient } from "react-query";
import day from "dayjs";
import { ActivityIndicator } from "react-native";
import Icon from "../components/Common/Icon";
import { Box, Button, Heading, HStack, Text, useTheme } from "native-base";

function LoadIcon() {
  const loading = useIsFetching();
  const queryClient = useQueryClient();
  const theme = useTheme();
  return (
    <Button
      size="sm"
      bg="transparent"
      startIcon={
        loading ? (
          <ActivityIndicator color={theme.colors.coolGray[500]} size={24} />
        ) : (
          <Icon style={{ height: 24 }} name="refresh" />
        )
      }
      onPress={() =>
        queryClient.refetchQueries({
          predicate: query => query.queryKey[0] !== "token",
          active: true,
        })
      }
    />
  );
}

function Time() {
  const [_, u] = useReducer(i => i + 1, 0);
  useEffect(() => {
    const interval = setInterval(() => {
      u();
    }, 500);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return <>{day.mhqNow().format("L LT [MHQ]")}</>;
}

export default function Header(props: NativeStackHeaderProps) {
  const title = props.options.headerTitle?.toString() ?? props.route.name;
  return (
    <Box bg="coolGray.200" _dark={{ bg: "coolGray.800" }} safeAreaTop>
      <HStack alignItems="center" p={1}>
        {!!props.back && <Button
          size="sm"
          bg="transparent"
          style={{ opacity: props.navigation.canGoBack() ? 1 : 0.4 }}
          startIcon={<Icon style={{ height: 24 }} name="arrow-left" />}
          onPress={() => props.navigation.goBack()}
        />}
        <Box pl={props.back ? 0 : 2} flex={1}>
          <Heading numberOfLines={1} fontSize="lg">{title}</Heading>
          <Text numberOfLines={1} fontSize="sm">
            <Time />
          </Text>
        </Box>
        <LoadIcon />
      </HStack>
    </Box>
  );
}
