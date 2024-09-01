import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { useRoute } from "@react-navigation/native";
import Completed from "./Completed";
import Pending from "./Pending";
import { useSQLiteContext } from "expo-sqlite";

function TaskScreen() {
  const route = useRoute();
  const db = useSQLiteContext();
  const [visible, setVisible] = useState(false); // Setting visibilty of the Modal to add task
  const [screen, setScreen] = useState(false); 
  const value = route.params?.value; // Value of the parameter sent through Navigation
  const [task, setTask] = useState(""); // Setting task to be added in the respective group
  const [description, setDescription] = useState(""); // Setting Description of the task to be added

  // Adding task in the group through add function
  const add = async () => {
    await db.runAsync(
      "INSERT INTO pending (value, task, description) VALUES (?,?,?)",
      [value, task, description]
    );
    setVisible(false);
    setTask("");
    setDescription("");
  };

  return (
    <View className="flex-1">
      <Modal isVisible={visible}>
        <View className=" bg-white">
          <View className="my-10 mx-5 space-y-5">
            <Text className="text-lg">Enter a Task :</Text>
            <TextInput
              onChangeText={(text) => setTask(text)}
              value={task}
              className="border-b-2 w-3/4"
            />
            <Text className="text-lg">Description : </Text>
            <TextInput
              onChangeText={(text) => setDescription(text)}
              value={description}
              className="border-2 w-72 h-40"
              multiline={true}
              textAlignVertical="top"
            />
          </View>
          <View className="flex-row justify-end m-6 space-x-10">
            <TouchableOpacity
              onPress={() => setVisible(false)}
              className=" bg-blue-800 p-3"
            >
              <Text className="text-white">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={add} className=" bg-blue-800 p-3">
              <Text className="text-white">Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View className="flex-row mx-10 mt-8 justify-between items-center">
        <Text className="text-2xl">{value}</Text>
        <TouchableOpacity onPress={() => setVisible(true)}>
          <Image
            className="w-10 h-10"
            source={{
              uri: "https://img.icons8.com/?size=50&id=37839&format=png&color=228BE6",
            }}
          />
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-between items-center m-10">
        <TouchableOpacity
          onPress={() => setScreen(false)}
          className={
            screen
              ? "border-2 p-2 rounded-2xl"
              : "border-2 p-2 rounded-2xl bg-black"
          }
        >
          <Text className={!screen ? "text-white" : ""}>Completed Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setScreen(true)}
          className={
            screen
              ? "border-2 p-2 rounded-2xl bg-black"
              : "border-2 p-2 rounded-2xl"
          }
        >
          <Text className={screen ? "text-white" : ""}>Pending Tasks</Text>
        </TouchableOpacity>
      </View>
        <ScrollView>
          <View>
            {screen ? <Pending value={value} /> : <Completed value={value} />}
          </View>
        </ScrollView>
    </View>
  );
}

export default TaskScreen;
