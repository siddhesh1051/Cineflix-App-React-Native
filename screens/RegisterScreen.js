import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { serverURL } from '../constants/index'


const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigation = useNavigation();
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPassFocused, setIsPassFocused] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);

  const handleUsernameFocus = () => {
    setIsUsernameFocused(true);
  };

  const handleUsernameBlur = () => {
    setIsUsernameFocused(false);
  };

  const handleEmailFocus = () => {
    setIsEmailFocused(true);
  };

  const handleEmailBlur = () => {
    setIsEmailFocused(false);
  };
  const handlePassFocus = () => {
    setIsPassFocused(true);
  };

  const handlePassBlur = () => {
    setIsPassFocused(false);
  };



  const handleRegister = () => {
    const user = {
      username: username,
      email: email,
      password: password,
    };

    axios
      .post(`${serverURL}/register`, user)
      .then((response) => {
        console.log(response.data);
        Alert.alert(
          "Registration successful",
          "you have been registered successfully"
        );
        setUsername("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        Alert.alert(
          "Registration failed",
          "An error occurred during registration"
        );
        console.log("error", error);
      });
  };
  return (
    <SafeAreaView
      className='bg-neutral-900 text-white'
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <KeyboardAvoidingView>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 32, fontWeight: "bold", marginTop: 25, color: 'white' }}>
            Signup
          </Text>
        </View>

        <View style={{ marginTop: 30 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              borderColor: isUsernameFocused ? "#F16670" : "#D0D0D0",
              borderWidth: 1,
              paddingVertical: 5,
              borderRadius: 8,
            }}
          >
            <Ionicons
              style={{ marginLeft: 8 }}
              name="person"
              size={24}
              color="gray"
            />
            <TextInput
              value={username}
              onChangeText={(text) => setUsername(text)}
              placeholderTextColor={"gray"}
              width={250}
              style={{
                color: "gray",
                marginVertical: 10,
                fontSize: password ? 18 : 18,
              }}
              placeholder="Enter your Email"
              onFocus={handleUsernameFocus}
              onBlur={handleUsernameBlur}
            />
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              borderColor: isEmailFocused ? "#F16670" : "#D0D0D0",
              borderWidth: 1,
              paddingVertical: 5,
              borderRadius: 8,

            }}

          >
            <MaterialIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="gray"
            />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholderTextColor={"gray"}
              width={250}
              style={{
                color: "gray",
                marginVertical: 10,
                fontSize: email ? 18 : 18,
              }}
              placeholder="Enter your Email"
              onFocus={handleEmailFocus}
              onBlur={handleEmailBlur}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                borderColor: isPassFocused ? "#F16670" : "#D0D0D0",
                borderWidth: 1,
                paddingVertical: 5,
                borderRadius: 8,

              }}
            >
              <AntDesign
                style={{ marginLeft: 8 }}
                name="lock"
                size={24}
                color={isPassFocused ? "#F16670" : "gray"}
              />
                 <TextInput
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholderTextColor={"gray"}
                width={250}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  fontSize: password ? 16 : 16,

                }}
                placeholder="Enter your Password"
                onFocus={handlePassFocus}
                onBlur={handlePassBlur}
              />
            </View>
          </View>
        </View>

        <View />

        <Pressable
          onPress={handleRegister}
          style={{
            width: 200,
            backgroundColor: "black",
            marginTop: 30,
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 6,
            padding: 15,
            backgroundColor: "#F16670",


          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 20,
              color: "white",
            }}
          >
            Register
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.goBack()}
          style={{ marginTop: 10 }}
        >
          <Text style={{ textAlign: "center", fontSize: 16, color: 'white' }}>
            Already have an account? <Text className=" text-[#F16670]"> Login </Text>
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
