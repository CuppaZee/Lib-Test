import {Button, ButtonGroup, Layout, Spinner, Text, useTheme} from "@ui-kitten/components";
import dayjs from "dayjs";
import React from "react";
import { useTranslation } from "react-i18next";
import { PixelRatio, ScrollView, StyleSheet, View } from "react-native";
import {
  LevelCell,
  RewardCell,
  RewardDataCell,
  RewardTitleCell,
} from "./Cell";
import useComponentSize from "../../hooks/useComponentSize";
import useCuppaZeeRequest from "../../hooks/useCuppaZeeRequest";
import useSetting, {ClanPersonalisationAtom, CumulativeRewardsAtom} from "../../hooks/useSetting";
import Icon from "../Common/Icon";
import { ClanRewardsData, GameID } from "@cuppazee/utils/lib";

const generateLevels = (n: number) =>
  new Array(n)
    .fill(0)
    .map(
      (_, i) =>
        [
          { level: i + 1, type: "individual" as const },
        ] as { level: number; type: "group" | "individual" }[]
    )
    .flat();

export interface ClanRewardsTableProps {
  game_id: number;
}

export default React.memo(
  function ClanRequirementsTable({
    game_id,
  }: ClanRewardsTableProps) {
    const { t } = useTranslation();
    const [size, onLayout] = useComponentSize();
    const fontScale = PixelRatio.getFontScale();
    const [style] = useSetting(ClanPersonalisationAtom);
    const [cumulative, setCumulative] = useSetting(CumulativeRewardsAtom);
    const reverse = style.reverse;
    const compact = style.style;

    const theme = useTheme();
    const borderColor =
      (theme.style === "dark" ? theme["color-basic-400"] : theme["color-basic-800"])
        .replace("rgb(", "rgba(")
        .slice(0, -1) + ", 0.3)";

    const rewards_data = useCuppaZeeRequest<{ data: ClanRewardsData }>("clan/rewards", {
      game_id,
    });

    const rewards = rewards_data.data?.data;

    if (rewards?.levels.length === 0) {
      return null;
    }

    if (!rewards || !size) {
      return (
        <Layout
          onLayout={onLayout}
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Spinner />
        </Layout>
      );
    }
    
    const levelCount = rewards_data.data?.data?.levels.length ?? 0;
    const levels = new Array(levelCount).fill(0).map((_, n) => n + 1);
    const sidebarLevels = generateLevels(levelCount);

    const headerStack = compact !== 0;
    const showSidebar = compact !== 0;
    const sidebarWidth = (compact ? 120 : 150) * fontScale;
    const columnWidth = showSidebar
      ? (compact ? (headerStack ? 68 : 90) : headerStack ? 80 : 120) * fontScale
      : 400;
    const minTableWidth = rewards.order.length * columnWidth + sidebarWidth;

    const rewards_rows = (reverse ? rewards.order : sidebarLevels) as (
      | number
      | { type: "group" | "individual"; level: number }
    )[];
    const rewards_columns = (reverse ? sidebarLevels : rewards.order) as (
      | number
      | { type: "group" | "individual"; level: number }
    )[];
    return (
      <Layout onLayout={onLayout} level="2" style={{ margin: 4, borderRadius: 8 }}>
        <Layout
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: 48 * fontScale,
            padding: 4,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
          level="4">
          <Icon
            style={{
              height: 32 * fontScale,
              width: 32 * fontScale,
              marginRight: 8,
              color: theme.style === "dark" ? "#fff" : "#000",
            }}
            name="playlist-check"
          />
          <View style={{flex: 1}}>
            <Text category="h6">{t("clan:clan_rewards")}</Text>
            <Text category="s1">{dayjs(new GameID(game_id).date).format("MMMM YYYY")}</Text>
          </View>
          <Button
            size="tiny"
            style={{borderTopRightRadius: 0, borderBottomRightRadius: 0}}
            appearance={cumulative ? "outline" : "filled"}
            onPress={() => setCumulative(false)}
          >
            Individual
          </Button>
          <Button
            size="tiny"
            style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}
            appearance={cumulative ? "filled" : "outline"}
            onPress={() => setCumulative(true)}
          >
            Cumulative
          </Button>
        </Layout>
        {!Object.values(rewards.levels[0]).some(i => i !== 1) && (
          <Text style={{ padding: 4 }}>
            Please be aware that the Munzee API is still returning April Fools rewards. I have not
            manually typed inthe actual rewards, so this is still displaying the April Fools
            rewards.
          </Text>
        )}
        <View style={{ flexDirection: "row" }}>
          {showSidebar && (
            <View
              key="sidebar"
              style={{
                minWidth: sidebarWidth,
                flex: size.width < minTableWidth ? undefined : 1,
                borderRightWidth: 2,
                borderColor,
              }}>
              <View
                style={{
                  borderBottomWidth: 2,
                  borderColor,
                }}>
                <RewardTitleCell
                  key="header"
                  game_id={game_id}
                  date={dayjs(new GameID(game_id).date)}
                />
              </View>
              {rewards_rows.map(row =>
                typeof row == "number" ? (
                  <RewardCell key={row} reward_id={row} rewards={rewards} />
                ) : (
                  <LevelCell
                    levels={levels}
                    key={`${row.level}_${row.type}`}
                    level={row.level}
                    type={row.type}
                  />
                )
              )}
            </View>
          )}
          <ScrollView
            style={{
              flex: (reverse ? sidebarLevels : rewards.order).length,
            }}
            contentContainerStyle={{ flexGrow: 1 }}
            horizontal={true}
            pagingEnabled={size.width < 720 || size.width < minTableWidth}
            snapToInterval={columnWidth}
            snapToAlignment={showSidebar || !reverse ? "start" : "center"}>
            {rewards_columns.map(column => (
              <View
                key={typeof column === "number" ? column : `${column.level}_${column.type}`}
                style={{
                  width: columnWidth,
                  flexGrow: 1,
                  maxWidth: size?.width,
                }}>
                <View
                  style={{
                    borderBottomWidth: 2,
                    borderColor,
                  }}>
                  {typeof column === "number" ? (
                    <RewardCell
                      key="header"
                      reward_id={column}
                      stack={headerStack}
                      rewards={rewards}
                    />
                  ) : (
                    <LevelCell
                      levels={levels}
                      key="header"
                      level={column.level}
                      type={column.type}
                      stack={headerStack}
                    />
                  )}
                </View>
                {rewards_rows.map(row => {
                  if (typeof row !== "number" && typeof column === "number") {
                    return (
                      <RewardDataCell
                        key={`${row.level}_${row.type}`}
                        reward_id={column}
                        level={row.level}
                        type={row.type}
                        rewards={rewards}
                        cumulative={cumulative}
                      />
                    );
                  }
                  if (typeof row === "number" && typeof column !== "number") {
                    return (
                      <RewardDataCell
                        key={row}
                        reward_id={row}
                        level={column.level}
                        type={column.type}
                        rewards={rewards}
                        cumulative={cumulative}
                      />
                    );
                  }
                  return null;
                })}
              </View>
            ))}
          </ScrollView>
        </View>
      </Layout>
    );
  },
  (prev, now) => prev.game_id === now.game_id
);

const styles = StyleSheet.create({
  card: {
    margin: 4,
    borderRadius: 8,
  },
});
