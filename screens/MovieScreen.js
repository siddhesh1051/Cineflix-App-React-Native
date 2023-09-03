import React, { useEffect, useState } from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, ScrollView, Platform, Modal, StatusBar  } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeftIcon, ChevronLeftIcon } from 'react-native-heroicons/outline';
import { HeartIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { fallbackMoviePoster, fetchMovieCredits, fetchMovieDetails, fetchSimilarMovies, image500 } from '../api/moviedb';
import { styles, theme } from '../theme';
import Loading from '../components/loading';
import * as ScreenOrientation from 'expo-screen-orientation';
// import { Cast } from 'react-native-feather';
import MovieList from './../components/movieList';
import Cast from './../components/cast';

const ios = Platform.OS === 'ios';
const topMargin = ios ? '' : ' mt-3';
var { width, height } = Dimensions.get('window');

export default function MovieScreen() {
    const { params: item } = useRoute();
    const navigation = useNavigation();
    const [movie, setMovie] = useState({});
    const [cast, setCast] = useState([]);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [isFavourite, toggleFavourite] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showVideoPlayer, setShowVideoPlayer] = useState(false);

    useEffect(() => {
        setLoading(true);
        getMovieDetails(item.id);
        getMovieCredits(item.id);
        getSimilarMovies(item.id);
    }, [item]);

    const getMovieDetails = async (id) => {
        const data = await fetchMovieDetails(id);
        setLoading(false);
        if (data) {
            setMovie({ ...movie, ...data });
        }
    };

    const getMovieCredits = async (id) => {
        const data = await fetchMovieCredits(id);
        if (data && data.cast) {
            setCast(data.cast);
        }
    };

    const getSimilarMovies = async (id) => {
        const data = await fetchSimilarMovies(id);
        if (data && data.results) {
            setSimilarMovies(data.results);
        }
    };

    const handleWatch = async () => {
        setShowVideoPlayer(true);
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
    };

    const handleCloseVideo = async () => {
        setShowVideoPlayer(false);
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };

    return (
        <>
        <Modal visible={showVideoPlayer} animationType="slide" onRequestClose={handleCloseVideo} statusBarTranslucent ={true} className='flex flex-row justify-center items-center '>
            <View style={{ flex: 1 }}>
                {/* <TouchableOpacity style={{ flex: 1 }} onPress={handleCloseVideo} /> */}
                <View style={{ flex: 1, backgroundColor: 'black' }}>
                <StatusBar hidden />
               {/* { StatusBar.setHidden(true)} */}
                    {item?.id && (
                        <WebView
                            source={{ uri: `https://vidsrc.me/embed/movie?tmdb=${item?.id}` }}
                            style={{ flex: 1 }}
                            // className='w-screen h-screen' 
                            />
                    )}
                </View>
            </View>
        </Modal><ScrollView contentContainerStyle={{ paddingBottom: 20 }} className="flex-1 bg-neutral-900">
                {/* Back button and movie poster */}

                <View className="w-full">
                {/* <StatusBar hidden /> */}
                    <SafeAreaView className={"absolute z-20 w-full flex-row justify-between items-center px-4 " + topMargin}>
                        <TouchableOpacity style={styles.background} className="rounded-xl p-1" onPress={() => navigation.goBack()}>
                            <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => toggleFavourite(!isFavourite)}>
                            <HeartIcon size="35" color={isFavourite ? theme.background : 'white'} />
                        </TouchableOpacity>
                    </SafeAreaView>
                    {loading ? (
                        <Loading />
                    ) : (
                        <View>
                            <Image
                                source={{ uri: image500(movie.poster_path) || fallbackMoviePoster }}
                                style={{ width, height: height * 0.55 }} />
                            <LinearGradient
                                colors={['transparent', 'rgba(23, 23, 23, 0.8)', 'rgba(23, 23, 23, 1)']}
                                style={{ width, height: height * 0.40 }}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                                className="absolute bottom-0" />
                        </View>
                    )}
                </View>

                {/* Movie details */}
                <View style={{ marginTop: -(height * 0.09) }} className="space-y-3">
                    {/* Title */}
                    <Text className="text-white text-center text-3xl font-bold tracking-widest">
                        {movie?.title}
                    </Text>

                    {/* Status, release year, runtime */}
                    {movie?.id ? (
                        <Text className="text-neutral-400 font-semibold text-base text-center">
                            {movie?.status} • {movie?.release_date?.split('-')[0] || 'N/A'} • {movie?.runtime} min
                        </Text>
                    ) : null}

                    {/* Genres  */}
                    <View className="flex-row justify-center mx-4 space-x-2">
                        {movie?.genres?.map((genre, index) => {
                            let showDot = index + 1 !== movie.genres.length;
                            return (
                                <Text key={index} className="text-neutral-400 font-semibold text-base text-center">
                                    {genre?.name} {showDot ? "•" : null}
                                </Text>
                            );
                        })}
                    </View>

                    {/* Description */}
                    <Text className="text-neutral-400 mx-4 tracking-wide">
                        {movie?.overview}
                    </Text>
                </View>

                {/* Watch Now Button */}
                <View className="flex-row justify-center mx-1 space-x-2 shadow-xl">
                    <TouchableOpacity onPress={handleWatch} style={styles.background} className="rounded-full px-2 py-4 flex justify-center items-center flex-row mt-3 w-[50%]">
                        <Text className='text-xl text-white'>
                            Watch Now
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Video Player Modal */}


                {/* Cast */}
                {movie?.id && cast.length > 0 && <Cast navigation={navigation} cast={cast} />}

                {/* Similar movies section */}
                {movie?.id && similarMovies.length > 0 && <MovieList title={'Similar Movies'} hideSeeAll={true} data={similarMovies} />}

            </ScrollView></>
    );
}
