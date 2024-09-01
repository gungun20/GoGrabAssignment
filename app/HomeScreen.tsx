import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import Modal from "react-native-modal";

function HomeScreen({ navigation }) {
  const db = useSQLiteContext();
  const [visible, setVisible] = useState(false); // Setting visibility state of Modal for adding group
  const [task, setTask] = useState(""); // Setting Name of task when it is added
  const [data, setData] = useState({ array: [] });

  // Insert TaskGroups by add function
  const add = async () => {
    await db.runAsync("INSERT INTO todos (value) VALUES (?)", [task]);
    setData({ array: await db.getAllAsync("SELECT * FROM todos") });
    console.log(data.array);
    setVisible(false);
  };
  // set data in the array on first load
  async function set() {
    setData({ array: await db.getAllAsync("SELECT * FROM todos") });
  }

  useEffect(() => {
    set();
  }, []);
  return (
    <View className="h-screen bg-green-200 flex-1">
      <Modal isVisible={visible}>
        <View className="bg-white">
          <View className="my-10 mx-5 space-y-6">
            <Text className="text-lg">Enter Name of the Task :</Text>
            <TextInput
              className=" border-b-2 border-black w-2/3"
              value={task}
              onChangeText={(text) => setTask(text)}
            />
          </View>
          <View className="flex-row justify-end m-5 space-x-4">
            <TouchableOpacity
              className=" bg-blue-600 p-3"
              onPress={() => setVisible(false)}
            >
              <Text className="text-white">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={add} className=" bg-blue-600 p-3">
              <Text className="text-white">Add Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View className=" bg-blue-500 h-16 grid items-center justify-center">
        <Text className=" text-white text-3xl">TodoApp</Text>
      </View>
      <View className=" flex-row m-10 items-center justify-between">
        <Text className="text-2xl font-bold">TaskList</Text>
        <TouchableOpacity
          onPress={() => setVisible(true)}
          className=" flex-row border border-blue-900 p-2 space-x-2"
        >
          <Image
            className="h-5 w-5"
            source={{
              uri: "https://img.icons8.com/?size=24&id=3220&format=png&color=228BE6",
            }}
          />
          <Text>Add Task</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View className="mx-4 flex-1">
          {data.array.map((element: any) => {
            return (
              <>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Task", { value: element.value })
                  }
                  className=" bg-white my-4 h-20 grid justify-center items-center"
                >
                  <Text className="text-xl">{element.value}</Text>
                </TouchableOpacity>
              </>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

export default HomeScreen;
