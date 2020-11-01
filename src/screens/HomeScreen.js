import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  Card,
  Button,
  Text,
  Avatar,
  Input,
  Header,
} from "react-native-elements";
import PostCard from "./../components/PostCard";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { AuthContext } from "../providers/AuthProvider";
import {
  storePostDataJSON,
  getPostDataJSON,
} from "../functions/AsyncStorageFunctions";

const HomeScreen = (props) => {
  const [Body, setBody] = useState("");
  return (
    <AuthContext.Consumer>
      {(auth) => (
        <View style={styles.viewStyle}>
          <Header
            leftComponent={{
              icon: "menu",
              color: "#fff",
              onPress: function () {
                props.navigation.toggleDrawer();
              },
            }}
            centerComponent={{ text: "The Office", style: { color: "#fff" } }}
            rightComponent={{
              icon: "lock-outline",
              color: "#fff",
              onPress: function () {
                auth.setIsLoggedIn(false);
                auth.setCurrentUser({});
              },
            }}
          />
          <Card>
            <Input
              placeholder="What's On Your Mind?"
              leftIcon={<Entypo name="pencil" size={24} color="black" />}
              onChangeText={function (currentInput) {
                setBody(currentInput);
              }}
            />
            <Button
              title="Post"
              type="outline"
              onPress={function () {
                let postBody = {
                  body: Body,
                };
                storePostDataJSON(Body, postBody);
                console.log(postBody.body);
              }}
            />
            <Button
              title="Get"
              type="outline"
              onPress={async function () {
                let post = await getPostDataJSON(Body);
                auth.setPostBody(post);
                console.log(await getPostDataJSON(Body));
              }}
            />
          </Card>
          <PostCard
            author="Ahmed Nusayer"
            title="hello world"
            body={auth.postBody.body}
          />
        </View>
      )}
    </AuthContext.Consumer>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 30,
    color: "blue",
  },
  viewStyle: {
    flex: 1,
  },
});

export default HomeScreen;
