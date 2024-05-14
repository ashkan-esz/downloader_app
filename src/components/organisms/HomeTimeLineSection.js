import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "@rneui/themed";
import {MovieError} from "../atoms";
import {HomeMovieCard, HomeMovieCardPlaceHolder} from "../molecules";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useNavigation} from "@react-navigation/native";
import * as movieApis from "../../api/movieApis";
import {Colors, Mixins, Typography} from "../../styles";
import Entypo from 'react-native-vector-icons/Entypo';
import {movieTypes} from "../../utils";


const HomeTimeLineSection = () => {
    const navigation = useNavigation();
    const queryClient = useQueryClient();

    const todayNumber = new Date().getDay();

    async function getData() {
        let result = await movieApis.getSeriesOfDay(todayNumber, 1, movieTypes.all);
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, isPending, isFetching, isError} = useQuery({
        queryKey: ['movie', 'timeLine', todayNumber],
        queryFn: getData,
        placeholderData: [],
        notifyOnChangeProps: "all",
    });

    const justifyContent = useMemo(() => ({
        justifyContent: data?.length < 3 ? 'flex-start' : undefined,
        marginRight: 5,
    }), [data?.length]);

    const _retry = async () => {
        await queryClient.refetchQueries({
            queryKey: ['movie', 'timeLine', 0]
        });
    }

    if (isError) {
        return (
            <View style={style.container}>
                <Text style={style.sectionTitle}>Today Series</Text>
                <MovieError
                    containerStyle={style.error}
                    retry={_retry}
                    hideRetry={true}
                />
            </View>
        );
    }

    if ((data.length === 0 && isFetching) || isPending) {
        return (
            <View style={style.container}>
                <Text style={style.sectionTitle}>Today Series</Text>
                <View style={style.movieListContainer}>
                    {
                        Array.apply(null, Array(3)).map((item, index) => (
                            <HomeMovieCardPlaceHolder extraStyle={style.movieCard} key={index}/>
                        ))
                    }
                </View>
            </View>
        );
    }

    return (
        <View style={style.container}>
            <Text style={style.sectionTitle}>Today Series</Text>
            <Text
                style={style.seeAll}
                onPress={() => navigation.navigate('TimeLine')}>
                See more
            </Text>
            <Entypo name="chevron-small-right" style={style.seeAllIcon} size={30} color={Colors.THIRD}
                    onPress={() => navigation.navigate('TimeLine')}/>

            <View style={[style.movieListContainer, justifyContent]}>
                {
                    data.slice(0, 3).map((item) => {
                        return (
                            <HomeMovieCard
                                extraStyle={justifyContent}
                                key={item._id.toString()}
                                posters={item.posters}
                                movieId={item._id}
                                title={item.rawTitle}
                                type={item.type}
                                tab={'todaySeries'}
                                latestData={item.latestData}
                                nextEpisode={item.nextEpisode}
                                rating={item.rating.imdb}
                                malScore={item.rating.myAnimeList}
                                follow={item.userStats?.follow || false}
                            />
                        );
                    })
                }
            </View>
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
        right: 20,
        marginTop: 5,
        color: Colors.THIRD,
        fontSize: Typography.getFontSize(18),
    },
    seeAllIcon: {
        position: 'absolute',
        right: -8,
        marginTop: 4,
    },
    movieListContainer: {
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: 20,
    },
    error: {
        marginTop: 20,
        height: Mixins.getWindowHeight(25) + 40,
        alignItems: 'center',
        justifyContent: 'center',
    }
});


export default HomeTimeLineSection;
