export type RootStackParamList = {
  User_Profile: { username: string };
  User_Activity: { username: string; date?: string };
  User_Inventory: { username: string };
  User_Challenges: { username: string; date?: string };
  User_Challenge: { username: string; challenge: string; date?: string };
  User_Captures: { username: string; category?: string };
  User_ZeeOps: { username: string };
  User_Bouncers: { username: string };
  User_ClanProgress: { username: string };
  User_QRew: { username: string };
  User_Cubimals: { username: string };
  User_QRates: { username: string };
  User_Rooms: { username: string };

  Clan_Cuppa: undefined;
  Clan_Requirements: { year?: number; month?: number };
  Clan_Bookmarks: { year?: number; month?: number };
  Clan_Stats: { clanid: number; year?: number; month?: number };

  Tools_Search: undefined;
  Tools_Donate: undefined;
  Tools_Calendar: undefined;
  Tools_Credits: undefined;
  Tools_TestScan: undefined;
  Tools_OpenSource: undefined;
  Tools_Bouncers: undefined;
  Tools_BouncersExpiring: undefined;
  Tools_BouncersMap: { type: string };
  Tools_Munzee: { a: string; b?: string };
  Tools_Nearby: undefined;
  Tools_POIPlanner: undefined;
  Tools_DestinationPlanner: undefined;
  Tools_EvoPlanner: undefined;
  Tools_Universal: undefined;
  Tools_Blast: undefined;
  Tools_TypeCategory: { category: string };
  Tools_TypeMunzee: { type: string };
  Tools_WidgetConfigureActivityWidget: { id: string };
  Tools_GardenPainter: undefined;

  Settings_Personalisation: undefined;
  Settings_Accounts: undefined;
  Settings_Notifications: undefined;
  Settings_Bookmarks: undefined;

  Welcome: undefined;

  somewherewithoutcoffee: undefined;
};

// type MainDrawerParams<Params> = {
//   [K in keyof Params]: { screen: K; params: Params[K] };
// }[keyof Params];

// export type MainDrawerParamList = {
//   Dashboard: MainDrawerParams<DashStackParamList>;
//   User: MainDrawerParams<UserStackParamList> & { username: string };
//   Clan: MainDrawerParams<ClanStackParamList>;
//   Tools: MainDrawerParams<ToolsStackParamList>;
//   Settings: MainDrawerParams<SettingsStackParamList>;
//   Welcome: undefined;
// };