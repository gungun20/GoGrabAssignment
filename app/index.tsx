import React from "react";
import * as SQLite from "expo-sqlite";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import TaskScreen from "./TaskScreen";

const Stack = createNativeStackNavigator();

function Index() {
  SQLite.openDatabaseAsync("todo.db");
  async function initialize(db: SQLite.SQLiteDatabase) {
    await db.execAsync(`
        PRAGMA journal_mode = 'wal';
        CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL);
`   );
    await db.execAsync(`
        PRAGMA journal_mode = 'wal';
        CREATE TABLE IF NOT EXISTS completed (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, task TEXT NOT NULL, description VARCHAR(100));
`   );
    await db.execAsync(`
        PRAGMA journal_mode = 'wal';
        CREATE TABLE IF NOT EXISTS pending (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, task TEXT NOT NULL, description VARCHAR(100));
`);
  }

  return (
    <SQLite.SQLiteProvider databaseName="todo.db" onInit={initialize}>
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Task" component={TaskScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SQLite.SQLiteProvider>
  );
}

export default Index;
