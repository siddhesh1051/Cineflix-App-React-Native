import { View, Text, TouchableWithoutFeedback, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { fallbackMoviePoster, image185 } from '../api/moviedb'
import { Dimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Loading from '../components/loading'
const { width, height } = Dimensions.get('window');
import { serverURL } from '../constants/index'

const WatchLater = () => {
    const [watchlater, setWatchlater] = useState([])
    const [email, setEmail] = useState('')
    const navigation = useNavigation();


    const retrieveEmail = async () => {
        try {
            const storedEmail = await AsyncStorage.getItem('userEmail');
            //   console.log('stored email', storedEmail)
            if (storedEmail !== null) {
                setEmail(storedEmail);
            }
        } catch (error) {
            console.error('Error retrieving email:', error);
        }
    };
    retrieveEmail();

    const getWatchLater = async () => {

        // retrieveEmail();
        try {
            console.log('getting watch layer')
            console.log('email =>', email)
            const { data } = await axios.get(`${serverURL}/watchLater/${email}`)
            console.log('got watch later', data)
            setWatchlater(data.movies)
        } catch (error) {
            console.log('Error getting favorites:', error)
        }
    }

    useEffect(() => {
        retrieveEmail();
        getWatchLater();
    }, [email])
  return (
    <SafeAreaView className="bg-neutral-800 flex-1">


            {
                watchlater?.length > 0 ? (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 15 }}
                        className="space-y-3"
                    >
                        <Text className="text-white font-semibold m-2 text-2xl text-center ">Watch Later</Text>

                        <View className="flex-row justify-between flex-wrap">
                            {
                                watchlater.map((item, index) => {
                                    return (
                                        <TouchableWithoutFeedback
                                            key={index}
                                            onPress={() => navigation.push('Movie', item)}>
                                            <View className="space-y-2 mb-4">
                                                <Image
                                                    source={{ uri: image185(item.poster_path) || fallbackMoviePoster }}
                                                    // source={require('../assets/images/moviePoster2.png')}
                                                    className="rounded-3xl"
                                                    style={{ width: width * 0.44, height: height * 0.3 }}
                                                />
                                                <Text className="text-gray-300 ml-1">
                                                    {
                                                        item.title?.length > 20 ? item.title.slice(0, 16) + '...' : item.title
                                                    }
                                                </Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )
                                })
                            }
                        </View>

                    </ScrollView>
                )
                : <Loading />
            }
        </SafeAreaView>
  )
}

export default WatchLater