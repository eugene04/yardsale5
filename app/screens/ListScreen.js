import React, { useState, useEffect,useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  
} from "react-native";
import "firebase/firestore";
import firebase from "../utils/Firebase";
import "firebase/compat/firestore";
import { useIsFocused } from '@react-navigation/native'

import { Card, Title, Paragraph, Avatar } from "react-native-paper";

import DetailScreen from "./DetailScreen";
import FormButton from "../components/FormButton";
import "intl";
import "intl/locale-data/jsonp/en";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import { AuthContext } from "../navigation/AuthProvider";

const db = firebase.firestore();

export default function ListScreen({ route, navigation  }) {
  const [product, setProduct] = useState([]);
  const [newProduct, setNewProduct] = useState([]);
  const [newLatitude, setNewLatitude] = useState("");
  const [newLongitude, setNewLongitude] = useState("");
  const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
 // const { roomName } = newProduct.roomName;
  const currentUser = user.toJSON();
  const email = currentUser.email;
  const userNameArray = email.split("@");
  const userName = userNameArray[0];
  const [chat, setChat] = useState([]);
const Id=product.id
  let myNewProduct
  //let chatId
  //let productArray;
  const myProduct = [];
  const  {roomName}  =newProduct;
  const {id}= newProduct;
  let newlatitude1
  let newlongitude1

  //onst myProduct = [];

  //const coodata = [];
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <FormButton
          onPress={() => {
            navigation.navigate("Add to YardSale");
          }}
          title="add item"
        />
      ),
    });
  }, [navigation]);
  const isFocused = useIsFocused();


  useEffect(() => {
   
      isFocused && fetchProducts();
   
  }, [isFocused]);
  

  useEffect(() => {

    let mounted = true;
    if (mounted) {
      
      myData(newProduct)
      //fetchChatId();
      console.log(myProduct)
    }
    return () => (mounted = false);
  },[newProduct]);

//const fetchChatId = () => {
   // const chatId = [];
   
   
 // console.log(chat.length);
 // const myId = chat.map((item) => {
 //   return item.id;
//  });

  console.log(roomName);
  console.log(email);
  console.log(userName);
  console.log(userNameArray);
 // const stringId = myId.toString();
  //console.log(stringId);

  function fetchProducts() {
    //const myProduct = [];
    db.collection("item")
      .orderBy("createdAt", "desc")
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          const { createdAt, category, image, values, latitude, longitude } =
            doc.data();
          myProduct.push({
            createdAt,
            id: doc.id,
            latitude,
            longitude,
            category,
            image,
            values,
          });
        });
        setNewProduct(myProduct);
      });
  }


  const myData = async(myNewProduct) => {
    //productArray = myNewProduct.map((product) => {
    //   product;
    //  });
   await GetCurrentLocation()
      myNewProduct.forEach((element) => {
        const mydistance = calcDistance(
          element.latitude,
          element.longitude,
          newlatitude1,
          newlongitude1
        );
          db.collection("item")
            .doc(element.id)
            .collection("THREADS")
            .get()
            .then((snapshot) => {
              snapshot.docs.forEach((doc) => {
                const stringId2 = doc.id.toString()
                element.stringId = stringId2

              });
              //setChat(chatId);
              // console.log("Why :", chat);
            //   console.log("for what:", chatId);
            });
          
        element.distance = mydistance;
      });

      myNewProduct.sort((a, b) => a.distance - b.distance);
      setProduct(myNewProduct);
  }
     
     // const stringId = myId.toString();
   // }
  

  async function CheckIfLocationEnabled() {
    let enabled = await Location.hasServicesEnabledAsync();

    if (!enabled) {
      Alert.alert(
        "Location Service not enabled",
        "Please enable your location services to continue",
        [{ text: "OK" }],
        { cancelable: false }
      );
    } else {
      setLocationServiceEnabled(enabled);
    }
  }
  

  const GetCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission not granted",
        "Allow the app to use location service.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    }

    let { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
      maximumAge: 10000,
    });

    if (coords) {
      const { latitude, longitude } = coords;
      setNewLatitude(latitude);
      setNewLongitude(longitude);
      newlatitude1 = latitude;
      newlongitude1 = longitude;

     // console.log("step 2");
    }
  };

  
  function calcDistance(lat1, lon1, lat2, lon2) {
    // distance between latitudes=>
    // and longitudes
    let dLat = ((lat2 - lat1) * Math.PI) / 180.0;
    let dLon = ((lon2 - lon1) * Math.PI) / 180.0;

    // convert to radiansa
    lat1 = (lat1 * Math.PI) / 180.0;
    lat2 = (lat2 * Math.PI) / 180.0;

    // apply formulae
    let a =
      Math.pow(Math.sin(dLat / 2), 2) +
      Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
    let rad = 6371;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    console.log("step3");
    return rad * c;
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
  
  return (
    <View style={styles.container}>
      <FlatList
        //numColumns={2}
        keyExtractor={(item) => item.id}
        data={product}
        renderItem={({ item }) => (
          <TouchableOpacity
          onPress={() =>
            navigation.navigate("chatroom", {
              itemId: item.id,
              myChatId: item.stringId,
              room: item.values.roomName,
              name: userName,
            })}
          >
            <Card style={styles.card}>
              <Title style={styles.title}> {item.category} </Title>
              <Title style={styles.title2} >
                You are {item.distance.toFixed(2)}km away from were this item was listed please click on item to chat with seller
              </Title>
              
              <Card.Cover source={{ uri: item.image }} />
              <Card.Content>
                <Paragraph style={styles.paragraph}>
                  {item.values.description}
                </Paragraph>

                <Title style={styles.price} > US{formatter.format(item.values.price)} </Title>
                <Title style={styles.title2}> my usernaname is {userName} </Title>
                <Paragraph>
                  date posted :{new Date(item.createdAt).toDateString()}
                </Paragraph>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  card: {
    margin: 5,
  },
  paragraph: {
    //color: "teal",
    fontSize: 15,
    marginTop: 8,
  },
  title: {
    color: "blue",
  },
  price:{
    color: "teal",
  },
  title2: {
    //color: "teal",
    fontSize: 15,
  },
});