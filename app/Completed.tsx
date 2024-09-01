import React, { useEffect, useState } from "react";
import { View, Text, Image , ScrollView} from "react-native";
import { useSQLiteContext } from "expo-sqlite";


function Completed(props: any) {
  const db = useSQLiteContext();
  const [data, setData] = useState({ array: [] });
  async function set() {
    setData({
      array: await db.getAllAsync("SELECT * FROM completed WHERE value=?", [
        props.value,
      ]),
    });
  }
  useEffect(() => {
    set();
  });
  return (
    <View className="">
      {data.array.map((element: any) => {
        return (
            <View className="border-2 m-6">
              <View className=" space-y-6 my-6 mx-4">
                <Text className=" text-2xl font-bold">{element.task}</Text>
                <Text>{element.description} .</Text>
              </View>
              <View className="flex-row justify-end m-4 space-x-2">
                <Image className="h-4 w-4"
                  source={{
                    uri: "https://img.icons8.com/?size=30&id=98955&format=png&color=40C057",
                  }}
                        />
                <Text className=" text-green-700">Completed</Text>
              </View>
            </View>
        );
      })}
    </View>
  );
}

export default Completed;
