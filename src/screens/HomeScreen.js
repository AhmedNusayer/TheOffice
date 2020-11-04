import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  AsyncStorage,
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
import { useNetInfo } from "@react-native-community/netinfo";
import {
  storePostDataJSON,
  getPostDataJSON,
  removePostData,
} from "../functions/AsyncStorageFunctions";

const HomeScreen = (props) => {
  const netInfo = useNetInfo();
  if (netInfo.type != "unknown" && !netInfo.isInternetReachable) {
    alert("No internet connection!");
  }
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendRequest, setSendRequest] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    let tempPosts = [];
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    for (let key of keys) {
      tempPosts.push({
        data: key,
      });
    }
    setPosts(tempPosts);
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
    if (sendRequest) {
      setSendRequest(false);
    }
  }, [sendRequest]);

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
                setInput(currentInput);
              }}
            />
            <Button
              title="Post"
              type="outline"
              onPress={function () {
                setLoading(true);
                let postBody = {
                  id: auth.CurrentUser.name,
                  title: "Post Title",
                  body: input,
                };
                storePostDataJSON(input, postBody);
                console.log(postBody);
                setLoading(false);
                setSendRequest(true);
              }}
            />
            {/* <Button
              title="Get"
              type="outline"
              onPress={async function () {
                const keys = await AsyncStorage.getAllKeys();
                const items = await AsyncStorage.multiGet(keys);
                for (let key of keys) {
                  setPosts(await getPostDataJSON(key));
                }
                console.log(posts);
              }}
            /> */}
          </Card>

          <FlatList
            data={posts}
            renderItem={({ item }) => {
              return (
                <PostCard
                  author={auth.CurrentUser.name}
                  title="hello world"
                  body={item.data}
                />
              );
            }}
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
