import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { GET_POSTS, ADD_LIKE } from "../config/queries";

export default function HomeScreen() {
  const navigation = useNavigation();

  const { loading, error, data, refetch } = useQuery(GET_POSTS);

  const [addLike] = useMutation(ADD_LIKE, { refetchQueries: [GET_POSTS] });

  async function handleAddLike(postId) {
    try {
      await addLike({
        variables: {
          newLike: {
            postId,
          },
        },
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  function formatDate(rawDate) {
    const date = new Date(rawDate.toString());
    
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function renderItem({ item }) {
    return (
      <View style={styles.postContainer}>
        <View style={styles.userContainer}>
          <Image
            source={require("../assets/cat.jpg")}
            style={styles.userImage}
          />
          <View>
            <Text style={styles.name}>{item.author.name}</Text>
            <Text style={styles.username}>{item.author.username}</Text>
          </View>
        </View>
        <Text style={styles.description}>{item.content}</Text>
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: item.imgUrl }} style={styles.postImage} />
        </View>
        <View style={styles.statsContainer}>
          <Text style={styles.stats}>{item.likes.length} Likes</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Comments", {
                comments: item.comments,
                postId: item._id,
              })
            }
          >
            <Text style={[styles.stats, styles.commentLink]}>
              {item.comments.length} Comments
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => handleAddLike(item._id)}>
            <Ionicons
              name="heart-outline"
              size={24}
              color="black"
              style={styles.likeIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Comments", {
                comments: item.comments,
                postId: item._id,
              })
            }
          >
            <Ionicons
              name="create-outline"
              size={24}
              color="black"
              style={styles.penIcon}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (error) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.errorContainer}>
          <Text>{error.message}</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={data.posts}
          renderItem={renderItem}
          keyExtractor={(item) => item._id.toString()}
          style={styles.feed}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  feed: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  postContainer: {
    padding: 20,
    borderBottomWidth: 10,
    borderBottomColor: "#ccc",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  user: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    marginVertical: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tag: {
    backgroundColor: "#007BFF",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    color: "#fff",
    fontSize: 12,
  },
  imageWrapper: {
    marginHorizontal: -20,
  },
  postImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  stats: {
    fontSize: 14,
    fontWeight: "bold",
  },
  commentLink: {
    color: "#007BFF",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  likeIcon: {
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  username: {
    fontSize: 14,
    color: "#777",
  },
  dateText: {
    fontSize: 12,
    color: "#777",
    marginTop: 10,
  },
});
