import { RouteProp, useRoute } from "@react-navigation/native";
import * as React from "react";
import { StyleSheet, ScrollView, View, Platform } from "react-native";
import { InventoryIcon } from "../../components/Inventory/Icon";
import useCuppaZeeRequest from "../../hooks/useCuppaZeeRequest";
import useMunzeeRequest from "../../hooks/useMunzeeRequest";
import useTitle from "../../hooks/useTitle";
import { useTranslation } from "react-i18next";
import Loading from "../../components/Loading";
import { generateInventoryData, UserInventoryInputData } from "@cuppazee/utils";
import useDB from "../../hooks/useDB";
import dayjs from "dayjs";
import { openURL } from "expo-linking";
import { Box, Button, Checkbox, Heading, Text } from "native-base";
import { RootStackParamList } from "../../types";

export default function PlayerInventoryScreen() {
  const [includeZeroes, setIncludeZeroes] = React.useState(false);
  const [groupByState, setGroupByState] = React.useState(false);
  const { t } = useTranslation();
  const route = useRoute<RouteProp<RootStackParamList, "Player_Inventory">>();
  useTitle(`${route.params.username} - ${t("pages:user_inventory")}`);
  const user = useMunzeeRequest("user", { username: route.params.username });
  const data = useCuppaZeeRequest<{ data: UserInventoryInputData }>(
    "user/inventory",
    { user_id: user.data?.data?.user_id },
    user.data?.data?.user_id !== undefined,
    user.data?.data?.user_id
  );
  const db = useDB();
  const d = React.useMemo(
    () =>
      data.data?.data
        ? generateInventoryData(db, data.data.data, { hideZeroes: !includeZeroes, groupByState })
        : null,
    [data.dataUpdatedAt, includeZeroes, groupByState]
  );

  // const categories:
  //   | ((
  //       | {
  //           state: "physical" | "virtual" | "credit";
  //         }
  //       | {
  //           category: Category;
  //         }
  //     ) & {
  //       types?: UserInventoryConvertedType[];
  //       total?: number;
  //     })[]
  //   | undefined
  //   | null = groupByState
  //   ? [
  //       {
  //         state: "physical",
  //         types: d?.types.filter(i => i.type?.state === TypeState.Physical),
  //         total: d?.types
  //           .filter(i => i.type?.state === TypeState.Physical)
  //           .reduce((a, b) => a + b.amount, 0),
  //       },
  //       {
  //         state: "virtual",
  //         types: d?.types.filter(i => i.type?.state === TypeState.Virtual),
  //         total: d?.types
  //           .filter(i => i.type?.state === TypeState.Virtual)
  //           .reduce((a, b) => a + b.amount, 0),
  //       },
  //       {
  //         state: "credit",
  //         types: d?.types.filter(
  //           i => i.type?.state !== TypeState.Physical && i.type?.state !== TypeState.Virtual
  //         ),
  //         total: d?.types
  //           .filter(
  //             i => i.type?.state !== TypeState.Physical && i.type?.state !== TypeState.Virtual
  //           )
  //           .reduce((a, b) => a + b.amount, 0),
  //       },
  //     ]
  //   : d?.categories
  //       .map(c => ({
  //         category: c,
  //         types: d?.types.filter(i => getCategory(i) === c),
  //         total: d?.types
  //           .filter(i => getCategory(i) === c)
  //           .reduce((a, b) => a + b.amount, 0),
  //       }))
  //       .sort((a, b) => b.total - a.total);

  if (!user.isFetched || !data.isFetched || !d) {
    return <Loading data={[user, data]} />;
  }

  return (
    <Box bg="regularGray.100" _dark={{ bg: "regularGray.900" }} style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", padding: 4 }}>
          <Checkbox
            value="zero"
            isChecked={includeZeroes}
            onChange={i => setIncludeZeroes(i)}
            style={{ margin: 8 }}>
            {t("user_inventory:settings_zero")}
          </Checkbox>
          <Checkbox
            value="group"
            isChecked={!groupByState}
            onChange={i => setGroupByState(!i)}
            style={{ margin: 8 }}>
            {t("user_inventory:settings_group")}
          </Checkbox>
        </View>
        <View style={styles.grid}>
          {d.groups.filter(includeZeroes ? () => true : i => (i.total ?? 0) > 0).map(c => (
            <Box
              bg="regularGray.200"
              _dark={{ bg: "regularGray.800" }}
              style={{
                width: 400,
                flexGrow: 1,
                maxWidth: "100%",
                margin: 4,
                borderRadius: 4,
              }}>
              <Heading fontSize="lg" style={{ textAlign: "center" }}>
                {"category" in c
                  ? c.category.name
                  : c.state.slice(0, 1).toUpperCase() + c.state.slice(1) + "s"}{" "}
                ({c.total || "0"})
              </Heading>
              {"category" in c && c.category.accessories && (
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}>
                  {c.category.accessories.filter(i=>Platform.OS !== "web" || i.link.startsWith("http")).map(i => (
                    <Button
                      size="sm"
                      style={{
                        margin: 4,
                        ...(["primary", "success", "danger", "warning"].includes(i.color)
                          ? {}
                          : { backgroundColor: i.color }),
                      }}
                      color={
                        ["primary", "success", "danger", "warning"].includes(i.color)
                          ? i.color + ".500"
                          : undefined
                      }
                      onPress={() => {
                        openURL(i.link.startsWith("~") ? i.link.slice(1) : i.link);
                      }}>
                      {i.label}
                    </Button>
                  ))}
                </View>
              )}
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}>
                {c.types
                  ?.slice()
                  .filter(includeZeroes ? () => true : i => i.amount > 0)
                  .sort((a, b) => b.amount - a.amount)
                  .map(i => (
                    <InventoryIcon {...i} />
                  ))}
              </View>
            </Box>
          ))}
        </View>
        <Heading style={{ textAlign: "center" }} fontSize="xl">
          {t("user_inventory:history")}
        </Heading>
        <View style={styles.grid}>
          {d?.history.map(c => (
            <Box
              bg="regularGray.200"
              _dark={{bg:"regularGray.800"}}
              style={{
                width: 400,
                flexGrow: 1,
                maxWidth: "100%",
                margin: 4,
                borderRadius: 4,
              }}>
              <Heading fontSize="lg" style={{ textAlign: "center" }}>
                {typeof c.title === "string" ? c.title : t(c.title[0] as any, c.title[1])}
              </Heading>
              <Heading fontSize="md" style={{ textAlign: "center" }}>
                {dayjs(c.time.valueOf()).format("L LT")}
              </Heading>
              {c.description && (
                <Text fontSize="sm" style={{ textAlign: "center" }}>
                  {c.description}
                </Text>
              )}
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}>
                {c.types
                  .slice()
                  .sort((a, b) => b.amount - a.amount)
                  .map(i => (
                    <InventoryIcon {...i} />
                  ))}
              </View>
            </Box>
          ))}
        </View>
      </ScrollView>
    </Box>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
