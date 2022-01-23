import React from "react";
import { } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getLastMessagesFunc, getTodayMessagesFunc, getMessageByIdFunc, useGetTodayMessages, useGetLastMessages, useGetMessageById, getByURL } from "../utils/Api";
import { Text, TextInput, Surface, Button, DefaultTheme, Provider as PaperProvider, List, Menu, Title } from 'react-native-paper';
import { theme } from "../assets/paperTheme";
import { BaseButton } from "react-native-gesture-handler";

export default function MessagesScreen() {
  const navigation = useNavigation();
  // const { data: { results: dataToday }} = useGetTodayMessages();
  // const { data: { results: dataLast }}  = useGetLastMessages();
  // const { data: dataId } = useGetMessageById("32");
  return (
    <PaperProvider theme={theme}>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("Home")}
      >Go Back</Button>
      <Button
        mode="contained"
        onPress={async () => console.log(await getTodayMessagesFunc())}
      >Test Today</Button>
      <Button
        mode="contained"
        onPress={async () => console.log(await getLastMessagesFunc())}
      >Test Last</Button>
      <Button
        mode="contained"
        onPress={async () => console.log(await getMessageByIdFunc(30))}
      >Test Id</Button>
    </PaperProvider>
  );
}
