import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useMutation } from "@apollo/client";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ADD_POST, GET_POSTS } from "../config/queries";

export default function AddPostScreen({ navigation }) {
  const [content, setContent] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [tags, setTags] = useState("");

  const [addPost, { loading, error }] = useMutation(ADD_POST, {
    refetchQueries: [GET_POSTS],
  });

  async function handleAddPost() {
    try {
      const response = await addPost({
        variables: {
          newPost: {
            content,
            imgUrl,
            tags: tags.split(",").map((tag) => tag.trim()),
          },
        },
      });

      Alert.alert("Success", response.data.addPost.message);

      navigation.navigate("Home");

      setContent("");
      setImgUrl("");
      setTags("");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {error && <Text style={styles.errorText}>{error.message}</Text>}
        <TextInput
          style={styles.textArea}
          placeholder="Post Content"
          value={content}
          onChangeText={setContent}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Image URL"
          value={imgUrl}
          onChangeText={setImgUrl}
        />
        <TextInput
          style={styles.input}
          placeholder="Tags (comma separated)"
          value={tags}
          onChangeText={setTags}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddPost}
          disabled={loading}
        >
          <Text style={styles.addButtonText}>
            {loading ? "Submitting..." : "Submit"}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  textArea: {
    height: "70%",
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    paddingTop: 10,
    borderRadius: 5,
    textAlignVertical: "top",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#0077b5",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
