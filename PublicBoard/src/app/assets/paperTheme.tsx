import { StyleSheet } from "react-native";
import { DefaultTheme } from "react-native-paper";

export const theme = {
    ...DefaultTheme,
    roundness: 20,
    colors: {
      ...DefaultTheme.colors,
      primary: 'tomato',
      accent: 'yellow',
      
    },
  };

export const styles = StyleSheet.create({
  surface: {
    padding: 8,
    justifyContent: 'center',
    elevation: 4,
    alignSelf: 'stretch',
  },
  title: {
      justifyContent: 'center',
      alignItems: 'center',
  }
  });