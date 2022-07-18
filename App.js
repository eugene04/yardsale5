import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { AuthProvider } from "./app/navigation/AuthProvider";
import Routes from "./app/navigation/Routes";
import { LogBox } from "react-native";
import _ from "lodash";
LogBox.ignoreLogs(["Setting a timer"]);
export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </PaperProvider>
  );
}
//const styles = StyleSheet.create({
//container: {
// flex: 1,
// padding: 10,
//margin: 20,
// },
//});