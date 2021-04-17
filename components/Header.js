import React, { Component } from "react";
import { Text, View } from "react-native";
import { Header } from "react-native-elements";

export default class MyHeader extends Component {
  render() {
    return (
      <Header
        color="#1f89dc"
        centerComponent={{
          text: this.props.title,
          style: { fontSize: 20, color: "#fff" },
        }}
      />
    );
  }
}
