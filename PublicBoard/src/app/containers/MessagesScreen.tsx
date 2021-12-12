import React from "react";
import { View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGetTodayMessages, useGetLastMessages, useGetMessageById } from "../utils/Api";

export default function MessagesScreen() {
  const navigation = useNavigation();
  const { data: { results: dataToday }} = useGetTodayMessages();
  const { data: { results: dataLast }}  = useGetLastMessages();
  const { data: dataId } = useGetMessageById("1");
  return (
    <View>
      <Button
        title="Go Back"
        onPress={() => navigation.navigate("Home")}
      ></Button>
      <Button
        title="Test Today"
        onPress={async () => console.log(dataToday)}
      ></Button>
      <Button
        title="Test Last"
        onPress={async () => console.log(dataLast)}
      ></Button>
      <Button
        title="Test Id"
        onPress={async () => console.log(dataId)}
      ></Button>
    </View>
  );
}
