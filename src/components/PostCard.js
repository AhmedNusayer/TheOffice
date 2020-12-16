import React, { useState } from "react";
import { View } from "react-native";
import { Card, Button, Text, Avatar } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import * as firebase from "firebase";
import "firebase/firestore";
import { AuthContext } from "../providers/AuthProvider";

const PostCard = (props) => {
  let [likes, setLikes] = useState(0);
  return (
    <AuthContext.Consumer>
      {(auth) => (
        <Card>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Avatar
              containerStyle={{ backgroundColor: "#ffab91" }}
              rounded
              icon={{ name: "user", type: "font-awesome", color: "black" }}
              activeOpacity={1}
            />
            <Text h4Style={{ padding: 10 }} h4>
              {props.author}
            </Text>
          </View>
          <Text style={{ fontStyle: "italic" }}> {props.title}</Text>
          <Text
            style={{
              paddingVertical: 10,
            }}
          >
            {props.body}
          </Text>
          <Card.Divider />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Button
              onPress={() => {
                setLikes(likes + 1);
                alert("pressed");
              }}
              type="outline"
              title={" Likes " + likes}
              icon={<AntDesign name="like2" size={24} color="dodgerblue" />}
            />
            <Button type="solid" title="Comment (10)" />
          </View>
        </Card>
      )}
    </AuthContext.Consumer>
  );
};

export default PostCard;
