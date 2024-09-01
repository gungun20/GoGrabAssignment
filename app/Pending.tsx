import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity , Image } from "react-native";
import Modal from "react-native-modal";
import { useSQLiteContext } from "expo-sqlite";

function Pending(props: any) {
  const db = useSQLiteContext();
  const [data, setData] = useState({ array: [] });
  const [visible, setVisible] = useState(false); // Setting visibility of the Modal for Marking the task completed
 // setting the array of tasks
  async function set() {
    setData({
      array: await db.getAllAsync("SELECT * FROM pending WHERE value=?", [
        props.value,
      ]),
    });
  }
  useEffect(() => {
    set();
  });
// Deleting the Task from the Group through remove function
  async function remove(task : any) {
    await db.runAsync("DELETE FROM pending WHERE task = ?", [task]);
  }
  // Marking the task Done through completed function
  const completed = async (value: any, task: any, description: any) => {
    await db.runAsync("DELETE FROM pending WHERE task = ?", [task]);
    await db.runAsync(
      "INSERT INTO completed (value, task , description) VALUES (?,?,?)",
      [value, task, description]
    );
    setVisible(false);
  };
  return (
    <View className="">
      {data.array.map((element: any) => {
        return (
          <>
            <View className="border-2 m-6">
              <Modal isVisible={visible}>
                <View className=" bg-white">
                  <View className="my-10 mx-5">
                    <Text className=" text-md">
                      Are you sure you want to mark Task{" "}
                      <Text className="font-semibold">"{element.task}"</Text> as
                      Completed ?
                    </Text>
                  </View>
                  <View className=" flex-row justify-end m-8 space-x-6">
                    <TouchableOpacity
                      onPress={() =>
                        completed(
                          element.value,
                          element.task,
                          element.description
                        )
                      }
                      className=" bg-green-600 py-2 px-6"
                    >
                      <Text className="text-white">Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setVisible(false)}
                      className=" bg-red-600 py-2 px-6"
                    >
                      <Text className="text-white">No</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              <View className=" space-y-6 my-6 mx-4">
                <Text className=" text-2xl font-bold">{element.task}</Text>
                <Text>{element.description} .</Text>
              </View>
              <View className="flex-row justify-between my-4 mx-8">
                <TouchableOpacity onPress={() => remove(element.task)}>
                  <Image
                     className="h-6 w-6"
                    source={{
                      uri: "https://img.icons8.com/?size=24&id=99971&format=png&color=FA5252",
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  className=" border-green-800 border w-36 p-1 grid items-center"
                  onPress={() => setVisible(true)}
                >
                  <Text className="text-green-500">Mark as Completed</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        );
      })}
    </View>
  );
}

export default Pending;
