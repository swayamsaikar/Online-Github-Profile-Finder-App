import React, { Component } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { Button, ListItem } from "react-native-elements";

import Icon from "react-native-vector-icons/MaterialIcons";
import MyHeader from "./components/Header";
import BackIcon from "react-native-vector-icons/Ionicons";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      UserData: "",
      UserReposData: [],
      isModalVisible: false,
    };
  }

  fetchData = async () => {
    var trimmedText = this.state.text.trim().toLowerCase();
    try {
      var req = await fetch(`https://api.github.com/users/${trimmedText}`);
      var res = await req.json();
      this.setState({ UserData: res });
    } catch (error) {
      alert(error);
    }
  };

  fetchReposOfTheCorrespondingUser = async () => {
    var trimmedText = this.state.text.split(" ").join("").toLowerCase();
    try {
      var req = await fetch(
        `https://api.github.com/users/${trimmedText}/repos`
      );
      var res = await req.json();
      this.setState({ UserReposData: res });
    } catch (error) {
      alert(error);
    }
  };

  ShowModal = (UserReposData, UserData) => (
    <Modal animationType="fade" visible={this.state.isModalVisible}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <BackIcon
            name="chevron-back-circle-outline"
            color="grey"
            size={40}
            style={{ margin: 10 }}
            onPress={() => this.setState({ isModalVisible: false })}
          />

          <View style={{ marginRight: "30%" }}>
            <Text style={{ fontSize: 25, fontWeight: "bold", color: "grey" }}>
              List Of All Repositories
            </Text>
          </View>
        </View>

        <FlatList
          data={UserReposData}
          showsHorizontalScrollIndicator={false}
          initialNumToRender={7}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ marginBottom: 20, marginLeft: "5%" }}
              onPress={() => {
                Linking.openURL(`${item.html_url}`);
              }}
            >
              <ListItem.Title bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>Repo Name :- {item.name}</ListItem.Title>
                  <ListItem.Subtitle>
                    Created At :- {item.created_at}
                  </ListItem.Subtitle>
                  <ListItem.Subtitle>
                    Updated At :- {item.updated_at}
                  </ListItem.Subtitle>
                </ListItem.Content>
              </ListItem.Title>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          onEndReachedThreshold={0.7}
        />
      </View>
    </Modal>
  );

  render() {
    return (
      <View>
        <MyHeader title=" Github Profile Finder" />
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Icon name="person-search" size={30} color="grey" />
            <TextInput
              placeholder="Search Profile"
              style={styles.Input}
              value={this.state.text}
              onChangeText={(text) => {
                this.setState({ text: text });
              }}
            />
            <Button
              icon={{
                name: "search",
                size: 25,
                color: "#fff",
              }}
              buttonStyle={{ borderRadius: 45 }}
              onPress={() => {
                !this.state.text
                  ? alert("Please Fill The Input Field")
                  : this.fetchReposOfTheCorrespondingUser(),
                  this.fetchData();
              }}
            />
          </View>

          <View style={{ alignItems: "center", margin: 20 }}>
            {!this.state.UserData ? (
              <Image
                source={
                  !this.state.UserData.avatar_url
                    ? require("./assets/githubLogo.png")
                    : { uri: this.state.UserData.avatar_url }
                }
                style={{ width: 200, height: 200, borderRadius: 200 / 2 }}
              />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`${this.state.UserData.html_url}`);
                }}
              >
                <Image
                  source={
                    !this.state.UserData.avatar_url
                      ? require("./assets/githubLogo.png")
                      : { uri: this.state.UserData.avatar_url }
                  }
                  style={{ width: 200, height: 200, borderRadius: 200 / 2 }}
                />
              </TouchableOpacity>
            )}

            <Text style={{ fontSize: 20, marginTop: 10 }}>
              {!this.state.UserData.login
                ? "User Name"
                : this.state.UserData.login}
            </Text>
          </View>

          <View style={styles.informationBox}>
            <View style={styles.informationBoxHolder}>
              <Text style={styles.Public_Repos_styles}>
                Public Repos :-
                {!this.state.UserData.public_repos
                  ? " none"
                  : this.state.UserData.public_repos}
              </Text>
              <Text style={styles.followers_text_styles}>
                User Followers :-
                {!this.state.UserData.followers
                  ? " none"
                  : this.state.UserData.followers}
              </Text>
              <Text style={styles.following_text_styles}>
                User Followings :-
                {!this.state.UserData.following
                  ? " none"
                  : this.state.UserData.following}
              </Text>
              <Text style={styles.created_at_styles}>
                Profile Created :-
                {!this.state.UserData.created_at
                  ? " none"
                  : this.state.UserData.created_at}
              </Text>
              <Text style={[styles.created_at_styles, { marginTop: "7%" }]}>
                Profile Updated :-
                {!this.state.UserData.updated_at
                  ? " none"
                  : this.state.UserData.updated_at}
              </Text>
            </View>
            <View style={{ marginTop: "5%" }}>
              <Button
                title="Click To See More"
                onPress={() => {
                  this.setState({ isModalVisible: true });
                }}
              />
            </View>
          </View>
          {this.ShowModal(this.state.UserReposData, this.state.UserData)}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: "5%",
    marginHorizontal: "5%",
  },
  Input: {
    borderBottomWidth: 1,
    borderColor: "#000",
    fontSize: 20,
    width: "70%",
    padding: 5,
  },
  // This to
  informationBox: {
    height: "50%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    backgroundColor: "#fff",
  },
  informationBoxHolder: {
    height: "80%",
    width: "90%",
    borderRadius: 15,
    borderColor: "black",
    borderWidth: 1,
  },
  Public_Repos_styles: {
    fontSize: 20,
    color: "#464646",
    marginLeft: "8%",
    marginTop: "8%",
    fontWeight: "bold",
  },
  followers_text_styles: {
    fontSize: 20,
    color: "#464646",
    marginLeft: "8%",
    marginTop: "2.5%",
    fontWeight: "bold",
  },
  following_text_styles: {
    color: "#464646",
    // fontWeight: '800',
    fontSize: 20,
    marginLeft: "8%",
    marginTop: "3%",
    fontWeight: "bold",
  },
  created_at_styles: {
    marginLeft: "8%",
    marginTop: "5%",
    fontSize: 18,
    color: "green",
  },
  // This style copied from my weather app
});
