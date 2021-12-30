import React from "react";
import { View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getLastMessagesFunc, getTodayMessagesFunc, getMessageByIdFunc, useGetTodayMessages, useGetLastMessages, useGetMessageById, getByURL } from "../utils/Api";

export default function MessagesScreen() {
  const navigation = useNavigation();
  // const { data: { results: dataToday }} = useGetTodayMessages();
  // const { data: { results: dataLast }}  = useGetLastMessages();
  // const { data: dataId } = useGetMessageById("32");
  return (
    <View>
      <Button
        title="Go Back"
        onPress={() => navigation.navigate("Home")}
      ></Button>
      <Button
        title="Test Today"
        onPress={async () => console.log(await getTodayMessagesFunc())}
      ></Button>
      <Button
        title="Test Last"
        onPress={async () => console.log(await getLastMessagesFunc())}
      ></Button>
      <Button
        title="Test Id"
        onPress={async () => console.log(await getMessageByIdFunc(30))}
      ></Button>
    </View>
  );
}
