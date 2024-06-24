import React from "react";
import { Image } from "react-native";

export default function LinkedInHeader() {
  return (
    <Image
      source={require("../assets/linkedin-logo.png")}
      style={{ width: 100, height: 30 }}
      resizeMode="contain"
    />
  );
}
