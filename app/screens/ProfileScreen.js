import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import {
  GET_SELF,
  GET_FOLLOWERS,
  GET_FOLLOWING,
  SEARCH_USERS,
  FOLLOW_USER,
} from "../config/queries";

export default function ProfileScreen() {
  const [isShowingFollowings, setIsShowingFollowings] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_SELF);

  const {
    loading: loadingFollowing,
    error: errorFollowing,
    data: dataFollowing,
    refetch: refetchFollowing,
  } = useQuery(GET_FOLLOWING);

  const {
    loading: loadingFollowers,
    error: errorFollowers,
    data: dataFollowers,
    refetch: refetchFollowers,
  } = useQuery(GET_FOLLOWERS);

  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchFollowing();
      refetchFollowers();
    }, [])
  );

  const {
    loading: loadingSearch,
    data: dataSearch,
    error: errorSearch,
  } = useQuery(SEARCH_USERS, {
    variables: { query: searchTerm },
    skip: !isSearchActive,
  });

  const [followUser] = useMutation(FOLLOW_USER, {
    onCompleted: (data) => {
      Alert.alert("Success", data.followUser.message);

      refetchFollowing();
      setIsShowingFollowings(true);
      setIsSearchActive(false);
      setSearchQuery("");
      setSearchTerm("");
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  if (loading || loadingFollowing || loadingFollowers)
    return <ActivityIndicator size="large" />;

  if (error) Alert.alert("Error", error.message);

  if (errorFollowing) Alert.alert("Error", errorFollowing.message);

  if (errorFollowers) Alert.alert("Error", errorFollowers.message);

  if (errorSearch) Alert.alert("Error", errorSearch.message);

  const user = data.self;

  function handleSearch() {
    if (searchQuery) {
      setSearchTerm(searchQuery);
      setIsSearchActive(true);
    }
  }

  function handleFollow(userId) {
    followUser({ variables: { followingId: userId } });
  }

  function isFollowing(userId) {
    return dataFollowing.following.some(
      (following) => following._id === userId
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("../assets/cat.jpg")}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Find user here..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.followingButton,
              isShowingFollowings ? styles.activeButton : styles.inactiveButton,
              isSearchActive && styles.inactiveButton,
            ]}
            onPress={() => {
              setIsShowingFollowings(true);
              setIsSearchActive(false);
              refetchFollowing();
            }}
          >
            <Text style={styles.buttonText}>Followings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.followersButton,
              !isShowingFollowings
                ? styles.activeButton
                : styles.inactiveButton,
              isSearchActive && styles.inactiveButton,
            ]}
            onPress={() => {
              setIsShowingFollowings(false);
              setIsSearchActive(false);
              refetchFollowers();
            }}
          >
            <Text style={styles.buttonText}>Followers</Text>
          </TouchableOpacity>
        </View>

        <ScrollView>
          <View style={styles.sectionContainer}>
            {loadingSearch && <ActivityIndicator size="large" />}
            {isSearchActive &&
              dataSearch &&
              dataSearch.searchUsers.length === 0 && (
                <Text>No users found</Text>
              )}
            {isSearchActive && dataSearch && dataSearch.searchUsers.length > 0
              ? dataSearch.searchUsers.map((user, index) => (
                  <View key={index} style={styles.userContainer}>
                    <Image
                      source={require("../assets/cat.jpg")}
                      style={styles.userImage}
                    />
                    <View style={styles.userInfo}>
                      <Text style={styles.otherName}>{user.name}</Text>
                      <Text style={styles.otherUsername}>{user.username}</Text>
                    </View>
                    {!isFollowing(user._id) && (
                      <TouchableOpacity onPress={() => handleFollow(user._id)}>
                        <Ionicons name="person-add" size={24} color="#0077b5" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              : !isSearchActive && (
                  <>
                    {isShowingFollowings
                      ? dataFollowing.following.map((following, index) => (
                          <View key={index} style={styles.userContainer}>
                            <Image
                              source={require("../assets/cat.jpg")}
                              style={styles.userImage}
                            />
                            <View style={styles.userInfo}>
                              <Text style={styles.otherName}>
                                {following.name}
                              </Text>
                              <Text style={styles.otherUsername}>
                                {following.username}
                              </Text>
                            </View>
                          </View>
                        ))
                      : dataFollowers.followers.map((follower, index) => (
                          <View key={index} style={styles.userContainer}>
                            <Image
                              source={require("../assets/cat.jpg")}
                              style={styles.userImage}
                            />
                            <View style={styles.userInfo}>
                              <Text style={styles.otherName}>
                                {follower.name}
                              </Text>
                              <Text style={styles.otherUsername}>
                                {follower.username}
                              </Text>
                            </View>
                          </View>
                        ))}
                  </>
                )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  username: {
    fontSize: 16,
    color: "gray",
  },
  email: {
    fontSize: 16,
    color: "gray",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginHorizontal: 20,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  searchButton: {
    padding: 10,
  },
  searchButtonText: {
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  followingButton: {
    padding: 10,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  followersButton: {
    padding: 10,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  activeButton: {
    backgroundColor: "#0077b5",
  },
  inactiveButton: {
    backgroundColor: "#7fbbda",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  otherName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  otherUsername: {
    fontSize: 14,
  },
  addButtonIcon: {
    marginLeft: 10,
  },
});
