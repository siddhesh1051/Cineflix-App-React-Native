import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { serverURL } from '../constants/index'


const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPassFocused, setIsPassFocused] = useState(false);

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

  const saveEmail = async () => {
    try {
      // Save the email to AsyncStorage
      await AsyncStorage.setItem('userEmail', email);
      console.log('Email saved successfully');
    } catch (error) {
      console.error('Error saving email:', error);
    }
  };
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (token) {
          setTimeout(() => {
            navigation.replace("Home");
          }, 400);
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    checkLoginStatus();
  }, []);
  const handleLogin = () => {
    const user = {
      email: email,
      password: password,
    };

    axios
      .post(`${serverURL}/login`, user)
      .then((response) => {
        console.log(response);
        const token = response.data.token;
        AsyncStorage.setItem("authToken", token);
        saveEmail();
        navigation.navigate("Home");
      })
      .catch((error) => {
        Alert.alert("Login error");
        console.log("error ", error);
      });
  };
  return (
    <SafeAreaView
      className='bg-neutral-900 text-white'
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      {/* <View>
          <Image
            style={{ width: 100, height: 100, resizeMode:'contain' , borderRadius: 10}}
            source={
             Logo
            }
          />
        </View> */}

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 32, fontWeight: "bold", marginTop: 25, color: 'white' }}>
            Login
          </Text>
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
          onPress={handleLogin}
          style={{
            width: 200,
            padding: 15,
            marginTop: 30,
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 6,
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
            Login
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Register")}
          style={{ marginTop: 12 }}
        >
          <Text style={{ textAlign: "center", fontSize: 16, color: 'white' }}>
            Don't have an account? <Text className=" text-[#F16670]"> Sign up </Text>
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
