import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import { NotificationResponse } from "expo-notifications";
import { Platform } from "react-native";

const mainUser = { value: "sohcah" };

export default function getConfig(notification?: NotificationResponse): LinkingOptions<any> {
  return {
    prefixes:
      Platform.OS === "web" ? [Linking.makeUrl("/")] : ["cuppazee://", "uk.cuppazee.paper://"],
    config: {
      screens: {
        ...Object.fromEntries(
          Object.entries({
            User_Profile: "user/:username",
            User_Activity: "user/:username/activity/:date?",
            User_Inventory: "user/:username/inventory",
            User_ZeeOps: "user/:username/zeeops",
            User_Challenges: "user/:username/challenges/:date?",
            User_Challenge: "user/:username/challenge/:challenge/:date?",
            User_Captures: "user/:username/captures/:category?",
            User_Bouncers: "user/:username/bouncers",
            User_ClanProgress: "user/:username/clan",
            User_QRew: "user/:username/qrew",
            User_Cubimals: "user/:username/cubimals",
            User_QRates: "user/:username/qrates",
            User_Rooms: "user/:username/rooms",
          }).map(i => [
            i[0],
            {
              path: i[1],
              parse: {
                username: (value: any) => (value === "_" ? mainUser.value : value),
              },
              stringify: {
                username: (value: any) => (value === mainUser.value ? "_" : value),
              },
            },
          ])
        ),

        Clan_Cuppa: "clanmanager",
        Clan_Bookmarks: "clans/:group?/:month?/:year?",
        Clan_Requirements: "clan/requirements/:month?/:year?",
        Clan_Stats: "clan/:clanid/:month?/:year?",

        Tools_Search: "search",

        Tools_Calendar: "tools/calendar",
        Tools_EvoPlanner: "tools/evoplanner",
        Tools_TestScan: "tools/testscan",
        Tools_Universal: "tools/universal",
        Tools_WidgetConfigureActivityWidget: "tools/widget_configure_activity_widget/:id",

        Tools_Bouncers: "bouncers/overview",
        Tools_BouncersExpiring: "bouncers/expiring",
        Tools_Nearby: "bouncers/nearby",
        Tools_BouncersMap: "bouncers/:type",

        Tools_Blast: "planner/blast",
        Tools_POIPlanner: "planner/poi",
        Tools_DestinationPlanner: "planner/destination",

        Tools_Munzee: "munzee/:a/:b?",

        Tools_TypeCategory: "db/:category",
        Tools_TypeMunzee: "db/type/:type?",

        Tools_Credits: "about/credits",
        Tools_Donate: "about/donate",
        Tools_OpenSource: "about/opensource",

        Settings_Personalisation: "settings/personalisation",
        Settings_Accounts: "settings/accounts",
        Settings_Notifications: "settings/notifications",
        Settings_Bookmarks: "settings/bookmarks",
        Welcome: "settings/welcome",
        somewherewithoutcoffee: "*",
      },
    },
    async getInitialURL() {
      const url = await Linking.getInitialURL();

      if (url != null) {
        return url;
      }

      // Get the `url` property from the notification which corresponds to a screen
      // This property needs to be set on the notification payload when sending it
      const notificationPath = notification?.notification.request.content.data.path;
      if (notificationPath && typeof notificationPath === "string") {
        return notificationPath;
      }

      return;
    },
    subscribe(listener) {
      const loadedMainuser = AsyncStorage.getItem("USER_BOOKMARKS").then(data => {
        try {
          const d = JSON.parse(data || "{}");
          mainUser.value = d[0].username;
        } catch {}
      });
      const onReceiveURL = async ({ url }: { url: string }) => {
        await loadedMainuser;
        listener(url);
      };

      // Listen to incoming links from deep linking
      Linking.addEventListener("url", onReceiveURL);

      // Listen to expo push notifications
      const subscription = Notifications.addNotificationResponseReceivedListener(async response => {
        const path = response.notification.request.content.data.path;
        const url = response.notification.request.content.data.url;

        if (path && typeof path === "string") {
          await loadedMainuser;
          listener("uk.cuppazee.paper://" + path);
        }

        if (url && typeof url === "string") {
          Linking.openURL(url);
        }
      });

      return () => {
        // Clean up the event listeners
        Linking.removeEventListener("url", onReceiveURL);
        subscription.remove();
      };
    },
  };
}
