import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, Title, Paragraph, Avatar } from "react-native-paper";
import FormButton from "../components/FormButton";
import "firebase/firestore";
import { AuthContext } from "../navigation/AuthProvider";
//import useStatsBar from "../utils/useStatusBar";
import firebase from "../utils/Firebase";
import "intl";
import "intl/locale-data/jsonp/en";

const db = firebase.firestore();
export default function DetailScreen({ route, navigation }) {
  // const [product, setProduct] = useState([]);
  const [chat, setChat] = useState([]);

  const { Id } = route.params;
  const { description } = route.params;
  const { price } = route.params;
  const { image } = route.params;
  const { category } = route.params;
  const { MyParagraph } = route.params;
  const { roomName } = route.params;
  const { name } = route.params;
  const { user } = useContext(AuthContext);
  const currentUser = user.toJSON();
  const email = currentUser.email;
  const userNameArray = email.split("@");
  const userName = userNameArray[0];

  const { address } = route.params;

  const fetchChatId = () => {
    const chatId = [];
    db.collection("item")
      .doc(Id)
      .collection("THREADS")
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          chatId.push({
            id: doc.id,
          });
        });
        setChat(chatId);
        // console.log("Why :", chat);
        // console.log("for what:", chatId);
      });
  };

  useEffect(() => {
    fetchChatId();
    // console.log({ user });
    // console.log({ itemId });
  }, []);

  console.log(chat.length);
  const myId = chat.map((item) => {
    return item.id;
  });
  //

  console.log(roomName);
  console.log(email);
  console.log(userName);
  console.log(userNameArray);
  const stringId = myId.toString();
  //console.log(stringId);
  //console.log(Id);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return (
    <View>
      <Card>
        <Card.Title
          title={category}
          //subtitle={MySubtitle}
          left={(props) => <Avatar.Icon {...props} icon="cart" />}
        />
        <Card.Cover source={{ uri: image }} />
        <Card.Content>
          <Title style={styles.title2}>{category}</Title>
          <Title>{formatter.format(price)}</Title>
          <Title style={styles.seller}>seller's details</Title>
          <Title style={styles.title}> my name is {name} </Title>
          <Title style={styles.title}>
            You can view the product at {address}
          </Title>
        </Card.Content>

        <FormButton
          title="join chat room here"
          modeValue="text"
          uppercase={false}
          labelStyle={styles.navButtonText}
          onPress={() =>
            navigation.navigate("chatroom", {
              itemId: Id,
              myChatId: stringId,
              room: roomName,
              name: userName,
            })
          }
        />
        <FormButton
          title="ratings"
          modeValue="text"
          uppercase={false}
          labelStyle={styles.navButtonText}
          onPress={() => navigation.navigate("ratings")}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    //color: "teal",
    fontSize: 15,
  },
  seller: {
    color: "red",
    textDecorationLine: "underline",
  },
  title2: {
    color: "teal",
    fontSize: 17,
  },
});
