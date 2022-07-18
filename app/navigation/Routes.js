import React, { useContext, useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import AuthStack from "./Authstack";
import ProductStack from "./ProductStack";
import { AuthContext } from "./AuthProvider";
import Loading from "../components/loading";

export default function Routes() {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
    setLoading(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      {user ? <ProductStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
