import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "@rneui/themed";
import {MovieError} from "../atoms";
import {HomeMovieCard, HomeMovieListPlaceHolder} from "../molecules";
import {useQuery, useQueryClient} from "react-query";
import {useNavigation} from "@react-navigation/native";
import {getSeriesOfDay} from "../../api";
import {Colors, Mixins, Typography} from "../../styles";


const HomeTimeLineSection = () => {
    const navigation = useNavigation();
    const queryClient = useQueryClient();

    const todayNumber = new Date().getDay();

    async function getData() {
        let result = await getSeriesOfDay(todayNumber, 1, ['movie', 'serial', 'anime_movie', 'anime_serial']);
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, isLoading, isError} = useQuery(
        ['timeLine', todayNumber],
        getData,
        {
            placeholderData: [],
        });

    const _retry = async () => {
        await queryClient.refetchQueries(['timeLine', 0]);
    }

    if (isError) {
        return (
            <View style={style.container}>
                <Text style={style.sectionTitle}>TimeLine</Text>
                <MovieError
                    containerStyle={style.error}
                    retry={_retry}
                    hideRetry={true}
                />
            </View>
        );
    }

    return (
        <View style={style.container}>
            <Text style={style.sectionTitle}>Today Series</Text>
            <Text
                style={style.seeAll}
                onPress={() => navigation.navigate('TimeLine')}>
                See All
            </Text>

            {
                (data.length === 0 || isLoading)
                    ? <HomeMovieListPlaceHolder extraStyle={style.movieListContainer} number={3}/>
                    : <View style={style.movieListContainer}>
                        {
                            data.slice(0, 3).map((item) => {
                                return (
                                    <HomeMovieCard
                                        key={item._id.toString()}
                                        posters={item.posters}
                                        movieId={item._id}
                                        title={item.rawTitle}
                                        type={item.type}
                                        tab={'todaySeries'}
                                        latestData={item.latestData}
                                        nextEpisode={item.nextEpisode}
                                        rating={item.rating.imdb || item.rating.myAnimeList}
                                        like={item.userStats.like_movie}
                                        dislike={item.userStats.dislike_movie}/>
                                );
                            })
                        }
                    </View>
            }

        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 25,
        paddingBottom: 10,
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: Typography.getFontSize(24),
    },
    seeAll: {
        position: 'absolute',
        right: 5,
        marginTop: 5,
        color: Colors.NAVBAR,
        fontSize: Typography.getFontSize(18)
    },
    movieListContainer: {
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: 20,
    },
    error: {
        marginTop: 20,
        height: Mixins.getWindowHeight(25),
        alignItems: 'center',
        justifyContent: 'center',
    }
});


export default HomeTimeLineSection;
