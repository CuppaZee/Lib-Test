import { StackHeaderProps } from "@react-navigation/stack";
import React from "react";
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
      bg="none"
      startIcon={loading ? (
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

export default function Header(props: StackHeaderProps) {
  const titleData = (
    props.options.headerTitle?.toString() ?? props.route.name
  ).split("|");
  return (
    <Box bg="coolGray.200" _dark={{ bg: "coolGray.800" }} safeAreaTop>
      <HStack alignItems="center" p={1}>
        <Button
          size="sm"
          bg="none"
          style={{ opacity: props.navigation.canGoBack() ? 1 : 0.4 }}
          startIcon={<Icon style={{ height: 24 }} name="arrow-left" />}
          onPress={() => props.navigation.goBack()}
          disabled={!props.navigation.canGoBack()}
        />
        <Box flex={1}>
          <Heading fontSize="lg">{titleData[0] ?? ""}</Heading>
          <Text fontSize="sm">{titleData[1] ?? day.mhqNow().format("L LT [MHQ]")}</Text>
        </Box>
        <LoadIcon />
      </HStack>
    </Box>
  );
}
