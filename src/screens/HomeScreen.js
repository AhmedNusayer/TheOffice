import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
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
import * as firebase from "firebase";
import "firebase/firestore";

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
    firebase
      .firestore()
      .collection("posts")
      .orderBy("created_at", "desc")
      .onSnapshot((querySnapshot) => {
        let temp_posts = [];
        querySnapshot.forEach((doc) => {
          temp_posts.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setPosts(temp_posts);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert(error);
      });
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
                firebase
                  .firestore()
                  .collection("posts")
                  .add({
                    userId: auth.CurrentUser.uid,
                    body: input,
                    author: auth.CurrentUser.displayName,
                    created_at: firebase.firestore.Timestamp.now(),
                    likes: [],
                    comments: [],
                  })
                  .then(() => {
                    setLoading(true);
                    alert("Post created successfully!");
                  })
                  .catch((error) => {
                    setLoading(true);
                    alert(error);
                  });
              }}
            />
          </Card>

          <FlatList
            data={posts}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onLongPress={() => {
                    firebase
                      .firestore()
                      .collection("posts")
                      .doc(item.id)
                      .delete()
                      .then(function () {
                        console.log("Document successfully deleted!");
                      })
                      .catch(function (error) {
                        console.error("Error removing document: ", error);
                      });
                  }}
                >
                  <PostCard
                    onPress={() => {
                      alert("longly pressed");
                    }}
                    author={item.data.author}
                    title={item.id}
                    body={item.data.body}
                  />
                </TouchableOpacity>
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
