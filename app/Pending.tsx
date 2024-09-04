import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity , Image , TextInput} from "react-native";
import Modal from "react-native-modal";
import { useSQLiteContext } from "expo-sqlite";

function Pending(props: any) {
  const db = useSQLiteContext();
  const [data, setData] = useState({ array: [] });
  const [visible, setVisible] = useState(false); // Setting visibility of the Modal for Marking the task completed
  // setting the array of tasks
  const [visible1, setVisible1] = useState(false);
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [index, setIndex] = useState(-1);
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
  async function remove(task: any) {
    
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
  const press = (index1 : any) => {
    setIndex(index1);
    setVisible1(true);
  }
  const edit = async () => {
    
    await db.runAsync("UPDATE pending SET task = ? WHERE id = ?", [text1,index+1]);
    await db.runAsync("UPDATE pending SET description = ? WHERE id = ?", [text2, index + 1]);
    setData({
      array: await db.getAllAsync("SELECT * FROM pending WHERE value=?", [
        props.value,
      ]),
    });
    setVisible1(false);
  }
  return (
    <View className="">
      <Modal isVisible={visible1}>
        <View className=" bg-white">
          <View className="my-10 mx-5 space-y-5">
            <Text className="text-lg">Edit Task :</Text>
            <TextInput
              onChangeText={(text) => setText1(text)}
              value={text1}
              className="border-b-2 w-3/4"
            />
            <Text className="text-lg">Edit Description : </Text>
            <TextInput
              onChangeText={(text) => setText2(text)}
              value={text2}
              className="border-2 w-72 h-40"
              multiline={true}
              textAlignVertical="top"
            />
          </View>
          <View className="flex-row justify-end m-6 space-x-10">
            <TouchableOpacity
              onPress={() => setVisible1(false)}
              className=" bg-blue-800 p-3"
            >
              <Text className="text-white">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={edit}
              className=" bg-blue-800 p-3"
            >
              <Text className="text-white">Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {data.array.map((element: any, index: any) => {
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
                <TouchableOpacity onPress={() => press(index)}>
                  <Image
                    className="h-6 w-6"
                    source={{
                      uri: "https://img.icons8.com/?size=24&id=86374&format=png",
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
