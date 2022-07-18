import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
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

const db = firebase.firestore();

export default function ListScreen({ navigation }) {
  const [product, setProduct] = useState([]);
  const [newProduct, setNewProduct] = useState([]);
  const [newLatitude, setNewLatitude] = useState("");
  const [newLongitude, setNewLongitude] = useState("");
  const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  let myNewProduct;
  //let productArray;
  const myProduct = [];

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
      myData(newProduct);
    }
    return () => (mounted = false);
  }, [newProduct]);

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

  const myData = (myNewProduct) => {
    //productArray = myNewProduct.map((product) => {
    //   product;
    //  });
    GetCurrentLocation().then(() => {
      myNewProduct.forEach((element) => {
        const mydistance = calcDistance(
          element.latitude,
          element.longitude,
          newLatitude,
          newLongitude
        );
        element.distance = mydistance;
      });

      myNewProduct.sort((a, b) => a.distance - b.distance);
      setProduct(myNewProduct);
    });
  };

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

      console.log("step 2");
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
              navigation.navigate("Details", {
                Id: item.id,
                category: item.category,
                createdAt: item.createdAt,
                latitude: item.latitude,
                image: item.image,
                description: item.values.description,
                roomName: item.values.roomName,
                distance: item.distance,

                price: item.values.price,
              })
            }
          >
            <Card style={styles.card}>
              <Card.Title title={item.category} />
              <Card.Title title={item.distance.toFixed(2)} />
              <Card.Cover source={{ uri: item.image }} />
              <Card.Content>
                <Paragraph style={styles.paragraph}>
                  {item.values.description}
                </Paragraph>

                <Title> {formatter.format(item.values.price)} </Title>
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
    color: "teal",
  },
});