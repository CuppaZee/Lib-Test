import { Button, Input, Layout, Text } from "@ui-kitten/components";
import { getTaskOptionsAsync } from "expo-task-manager";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Linking, Pressable, ScrollView, NativeModules } from "react-native";
import Icon from "../../components/Common/Icon";
import useSetting, { LiveLocationErrorAtom } from "../../hooks/useSetting";
import useTitle from "../../hooks/useTitle";
import { getBackgroundPermissionsAsync } from "expo-location"
import { teakensAtom, useTeakens } from "../../hooks/useToken";
import { useAtom } from "jotai";
import AsyncStorage from "@react-native-async-storage/async-storage";

function DevScreen() {
  const [data, setData] = React.useState("");
  const teakensData = useTeakens();
  const [_, updateTeakens] = useAtom(teakensAtom);
  const [teakens, setTeakens] = React.useState("");
  React.useEffect(() => {
    console.log(teakensData);
    setTeakens(JSON.stringify(teakensData.data));
  }, [teakensData])
  const [liveLocationError] = useSetting(LiveLocationErrorAtom);
  React.useEffect(() => {
    (async function () {
      try {
        setData(
          JSON.stringify(
            [await getTaskOptionsAsync("BACKGROUND_LOCATION"), await getBackgroundPermissionsAsync()],
            null,
            2
          )
        );
      } catch { }
    })();
  }, []);
  return (
    <Layout style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 800 }}>
        <Text>{data}</Text>
        <Text>Hey!</Text>
        <Text>{JSON.stringify(liveLocationError)}</Text>
        <Button
          style={{ margin: 4 }}
          appearance="outline"
          onPress={() => {
            NativeModules.LiveLocation.setExpoPushToken(
              "ExponentPushToken[8YOVYvLHKPSQpK72ytSkPy]"
            );
          }}>
          Set Expo Push Token
        </Button>
        <Button
          style={{ margin: 4 }}
          appearance="outline"
          onPress={() => {
            NativeModules.LiveLocation.startLocationUpdates(10000, 5000, 15000);
          }}>
          Start Location Updates (Fast)
        </Button>
        <Button
          style={{ margin: 4 }}
          appearance="outline"
          onPress={() => {
            NativeModules.LiveLocation.startLocationUpdates(60000, 30000, 120000);
          }}>
          Start Location Updates (Medium)
        </Button>
        <Button
          style={{ margin: 4 }}
          appearance="outline"
          onPress={() => {
            NativeModules.LiveLocation.stopLocationUpdates();
          }}>
          Stop Location Updates
        </Button>
        <Button
          style={{ margin: 4 }}
          appearance="outline"
          onPress={async () => {
            setData(JSON.stringify(await NativeModules.LiveLocation.getLocationUpdatesStatus()));
          }}>
          Get Location Updates Status
        </Button>
        <Input multiline numberOfLines={10} value={teakens} onChangeText={v => setTeakens(v)} />
        <Button
          style={{ margin: 4 }}
          appearance="outline"
          onPress={async () => {
            updateTeakens(JSON.parse(teakens));
            AsyncStorage.setItem("CUPPAZEE_TEAKENS", JSON.stringify(JSON.parse(teakens)));
          }}>
          Update Stuff
        </Button>
      </ScrollView>
    </Layout>
  );
}

export default function DonateScreen() {
  const { t } = useTranslation();
  useTitle(`☕ ${t("pages:tools_donate")}`);
  const [count, setCount] = React.useState(0);
  if (count > 4) {
    return <DevScreen />;
  }
  return (
    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        onPress={() => Linking.openURL("https://patreon.com/CuppaZee")}
        appearance="outline"
        style={{ margin: 4 }}
        accessoryLeft={props => <Icon name="patreon" {...props} />}>
        {t("donate:patreon")}
      </Button>
      <Button
        onPress={() => Linking.openURL("https://ko-fi.com/sohcah")}
        appearance="outline"
        style={{ margin: 4 }}
        accessoryLeft={props => <Icon name="coffee" {...props} />}>
        {t("donate:kofi")}
      </Button>
      <Pressable
        onPress={() => {
          setCount(count + 1);
        }}>
        <Text style={{ textAlign: "center", maxWidth: "80%" }} category="s1">
          {t("donate:paypal_title", { email: "donate@cuppazee.app" })}
        </Text>
      </Pressable>
      <Text style={{ textAlign: "center", maxWidth: "80%" }} category="c1">
        {t("donate:paypal_description")}
      </Text>
    </Layout>
  );
}
