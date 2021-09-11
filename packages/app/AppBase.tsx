import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "./polyfill";

import { useColorScheme } from "react-native";
import Navigation from "./navigation";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider as JotaiProvider } from "jotai";

import "./lang/i18n";

import CheckStatus from "./BackgroundLocation";
import useSetting, {
  LiveLocationErrorAtom,
} from "./hooks/useSetting";
import { useTranslation } from "react-i18next";
import "expo-firebase-analytics";
import * as Sentry from "sentry-expo";
import EvaWrapper from "./EvaWrapper";
import { extendTheme, NativeBaseProvider, useColorMode } from "native-base";

Sentry.init({
  dsn: "https://7823a6409bf1417dafa6f3e3ab47b6ed@o444031.ingest.sentry.io/5418530",
} as any);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      staleTime: 900000,
      retry: 1,
    },
  },
});

function ColorModeHandler() {
  const colorScheme = useColorScheme();
  const colorMode = useColorMode();
  useEffect(() => {
    colorMode.setColorMode(colorScheme);
  }, [colorScheme]);
  return null;
}

function AppBase() {
  const colorScheme = useColorScheme();
  const [liveLocationError, setLiveLocationError, liveLocationErrorLoaded] = useSetting(
    LiveLocationErrorAtom
  );

  React.useEffect(() => {
    if (liveLocationErrorLoaded && !liveLocationError) {
      CheckStatus().then(value => setLiveLocationError(value));
    }
  }, [liveLocationErrorLoaded]);
  const { i18n } = useTranslation();
  const theme = useMemo(() => {
    const defaultTheme = extendTheme({});
    return extendTheme({
      config: {
        initialColorMode: colorScheme,
      },
      colors: {
        regularGray: defaultTheme.colors.blueGray,
        primary: defaultTheme.colors.teal,
      },
    });
  }, [colorScheme]);

  return (
    <>
      <NativeBaseProvider theme={theme}>
        <ColorModeHandler />
        <EvaWrapper>
          <Navigation key={i18n.language} colorScheme={colorScheme} />
          <StatusBar />
        </EvaWrapper>
      </NativeBaseProvider>
    </>
  );
}

export default function AppProviders() {
  return (
    <SafeAreaProvider>
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          <AppBase />
        </QueryClientProvider>
      </JotaiProvider>
    </SafeAreaProvider>
  );
}
