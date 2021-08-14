import { NavigationContainer, DefaultTheme, DarkTheme, getPathFromState } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import * as Notifications from "expo-notifications";
import { ColorSchemeName, Platform } from 'react-native';

import SomewhereWithoutCoffeeScreen from '../screens/SomewhereWithoutCoffee';
import { RootStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import * as Analytics from "expo-firebase-analytics";
import lazy from "../components/lazy";
import Header from './Header';

// Clan
const ClanStatsScreen = lazy(() => import("../screens/Clan/Stats"));
const ClanBookmarksScreen = lazy(() => import("../screens/Clan/Bookmarks"));
const ClanRequirementsScreen = lazy(() => import("../screens/Clan/Requirements"));
const CuppaManagerScreen = lazy(() => import("../screens/Clan/CuppaManager"));

// User
const UserProfileScreen = lazy(() => import("../screens/User/Profile"));
const UserActivityScreen = lazy(() => import("../screens/User/Activity"));
const UserInventoryScreen = lazy(() => import("../screens/User/Inventory"));
const UserZeeOpsScreen = lazy(() => import("../screens/User/ZeeOps"));
const UserChallengesScreen = lazy(() => import("../screens/User/Challenges"));
const UserChallengeScreen = lazy(() => import("../screens/User/Challenge"));
const UserCapturesScreen = lazy(() => import("../screens/User/Captures"));
const UserBouncersScreen = lazy(() => import("../screens/User/Bouncers"));
const UserClanScreen = lazy(() => import("../screens/User/Clan"));
const UserQRewScreen = lazy(() => import("../screens/User/QRew"));
const UserCubimalsScreen = lazy(() => import("../screens/User/Cubimals"));
const UserQRatesScreen = lazy(() => import("../screens/User/QRates"));
const UserRoomsScreen = lazy(() => import("../screens/User/Rooms"));

// Settings
const PersonalisationScreen = lazy(() => import("../screens/Settings/Personalisation"));
const AccountsScreen = lazy(() => import("../screens/Settings/Accounts"));
const NotificationScreen = lazy(() => import("../screens/Settings/Notifications"));
const BookmarksScreen = lazy(() => import("../screens/Settings/Bookmarks"));

// Tools
const SearchScreen = lazy(() => import("../screens/Tools/Search"));
const CalendarScreen = lazy(() => import("../screens/Tools/Calendar"));
const CreditsScreen = lazy(() => import("../screens/Tools/Credits"));
const TestScanScreen = lazy(() => import("../screens/Tools/TestScan"));
const OpenSourceScreen = lazy(() => import("../screens/Tools/OpenSource"));
const BouncersScreen = lazy(() => import("../screens/Tools/Bouncers"));
const BouncersExpiringScreen = lazy(() => import("../screens/Tools/BouncersExpiring"));
const BouncersMapScreen = lazy(() => import("../screens/Tools/BouncersMap"));
const NearbyScreen = lazy(() => import("../screens/Tools/Nearby"));
const DonateScreen = lazy(() => import("../screens/Tools/Donate"));
const POIPlannerScreen = lazy(() => import("../screens/Tools/POIPlanner"));
const DestinationPlannerScreen = lazy(() => import("../screens/Tools/DestinationPlanner"));
const EvoPlannerScreen = lazy(() => import("../screens/Tools/EvoPlanner"));
const MunzeeScreen = lazy(() => import("../screens/Tools/Munzee"));
const TypeCategoryScreen = lazy(() => import("../screens/Tools/Types/Category"));
const TypeMunzeeScreen = lazy(() => import("../screens/Tools/Types/Type"));
const ActivityWidgetScreen = lazy(() => import("../screens/Tools/WidgetConfigure/ActivityWidget"));
const GardenPainterScreen = lazy(() => import("../screens/Tools/Garden/Painter"));
const UniversalScreen = lazy(() => import("../screens/Tools/Universal"));
const BlastScreen = lazy(() => import("../screens/Tools/Blast"));

export type NavProp = StackNavigationProp<RootStackParamList>;


// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  const LinkingConfig = React.useMemo(() => LinkingConfiguration(lastNotificationResponse || undefined), [lastNotificationResponse]);
  return (
    <NavigationContainer
      linking={LinkingConfig}
      onStateChange={(state) => {
        if (!state) return;
        const currentScreen = getPathFromState(state);
        Analytics.setCurrentScreen(currentScreen);
      }}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: props => <Header {...props} />,
        // headerShown: false,
        cardStyle: {
          maxHeight: Platform.OS === "web" ? "100vh" : undefined,
        },
      }}>
      <Stack.Screen name="Clan_Bookmarks" component={ClanBookmarksScreen} />
      <Stack.Screen name="Clan_Cuppa" component={CuppaManagerScreen} />
      <Stack.Screen name="Clan_Requirements" component={ClanRequirementsScreen} />
      <Stack.Screen
        getId={({ params }) => params?.clanid.toString()}
        name="Clan_Stats"
        component={ClanStatsScreen}
      />

      <Stack.Screen name="User_Profile" component={UserProfileScreen} />
      <Stack.Screen
        getId={({ params }) => params.date}
        name="User_Activity"
        component={UserActivityScreen}
      />
      <Stack.Screen name="User_Inventory" component={UserInventoryScreen} />
      <Stack.Screen name="User_ZeeOps" component={UserZeeOpsScreen} />
      <Stack.Screen name="User_Bouncers" component={UserBouncersScreen} />
      <Stack.Screen
        getId={({ params }) => params.date}
        name="User_Challenges"
        component={UserChallengesScreen}
      />
      <Stack.Screen
        getId={({ params }) => `${params.date}/${params.challenge}`}
        name="User_Challenge"
        component={UserChallengeScreen}
      />
      <Stack.Screen
        getId={({ params }) => params.category}
        name="User_Captures"
        component={UserCapturesScreen}
      />
      <Stack.Screen name="User_ClanProgress" component={UserClanScreen} />
      <Stack.Screen name="User_QRew" component={UserQRewScreen} />
      <Stack.Screen name="User_Cubimals" component={UserCubimalsScreen} />
      <Stack.Screen name="User_QRates" component={UserQRatesScreen} />
      <Stack.Screen name="User_Rooms" component={UserRoomsScreen} />

      <Stack.Screen name="Tools_Search" component={SearchScreen} />

      <Stack.Screen name="Tools_Calendar" component={CalendarScreen} />
      <Stack.Screen name="Tools_EvoPlanner" component={EvoPlannerScreen} />
      <Stack.Screen name="Tools_TestScan" component={TestScanScreen} />
      <Stack.Screen name="Tools_Universal" component={UniversalScreen} />
      <Stack.Screen name="Tools_WidgetConfigureActivityWidget" component={ActivityWidgetScreen} />

      <Stack.Screen name="Tools_Bouncers" component={BouncersScreen} />
      <Stack.Screen name="Tools_BouncersExpiring" component={BouncersExpiringScreen} />
      <Stack.Screen name="Tools_Nearby" component={NearbyScreen} />
      <Stack.Screen name="Tools_BouncersMap" component={BouncersMapScreen} />

      <Stack.Screen name="Tools_Blast" component={BlastScreen} />
      <Stack.Screen name="Tools_POIPlanner" component={POIPlannerScreen} />
      <Stack.Screen name="Tools_DestinationPlanner" component={DestinationPlannerScreen} />

      <Stack.Screen name="Tools_GardenPainter" component={GardenPainterScreen} />

      <Stack.Screen
        getId={({ params }) => `${params.a}/${params.b}`}
        name="Tools_Munzee"
        component={MunzeeScreen}
      />

      <Stack.Screen
        getId={({ params }) => params.category}
        name="Tools_TypeCategory"
        component={TypeCategoryScreen}
      />
      <Stack.Screen
        getId={({ params }) => params.type}
        name="Tools_TypeMunzee"
        component={TypeMunzeeScreen}
      />

      <Stack.Screen name="Tools_Credits" component={CreditsScreen} />
      <Stack.Screen name="Tools_Donate" component={DonateScreen} />
      <Stack.Screen name="Tools_OpenSource" component={OpenSourceScreen} />

      <Stack.Screen name="Settings_Personalisation" component={PersonalisationScreen} />
      <Stack.Screen name="Settings_Accounts" component={AccountsScreen} />
      <Stack.Screen name="Settings_Notifications" component={NotificationScreen} />
      <Stack.Screen name="Settings_Bookmarks" component={BookmarksScreen} />

      <Stack.Screen
        name="somewherewithoutcoffee"
        component={SomewhereWithoutCoffeeScreen}
        options={{ title: "Somewhere without Coffee" }}
      />
    </Stack.Navigator>
  );
}
