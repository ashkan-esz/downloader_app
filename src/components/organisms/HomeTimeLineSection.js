import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "react-native-elements";
import {MovieError, SeeAllButton, TimeLinePaging} from "../atoms";
import {HomeMovieCard, HomeMovieListPlaceHolder} from "../molecules";
import {useQuery, useQueryClient} from "react-query";
import {useNavigation} from "@react-navigation/native";
import {getTimeLine_day} from "../../api";
import {getPoster, getRating, getTitleSnakeCase} from "../../utils";
import {Mixins, Typography} from "../../styles";

//todo : fix wasted stale data
//todo : also fix for timeLine screen

const HomeTimeLineSection = () => {
    const [spacing, setSpacing] = useState(1);
    const queryClient = useQueryClient();
    const navigation = useNavigation();

    async function getData({SPACING}) {
        let result = await getTimeLine_day(SPACING || spacing, 0, 3);
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, isLoading, isError} = useQuery(
        ['timeLine', spacing],
        getData,
        {
            placeholderData: [],
            refetchInterval: 3 * 60 * 1000,
            refetchIntervalInBackground: true,
        });

    //prefetch data
    useEffect(() => {
        async function prefetchData() {
            let promiseArray = [];
            let promise1 = queryClient.prefetchQuery(['timeLine', -1],
                () => getData({SPACING: -1}));
            promiseArray.push(promise1);
            let promise2 = queryClient.prefetchQuery(['timeLine', 0],
                () => getData({SPACING: 0}));
            promiseArray.push(promise2);
            let promise3 = queryClient.prefetchQuery(['timeLine', 1],
                () => getData({SPACING: 1}));
            promiseArray.push(promise3);
            await Promise.all(promiseArray);
        }

        prefetchData();
    }, []);

    if (isError) {
        return (
            <View style={style.container}>
                <Text style={style.sectionTitle}>TimeLine</Text>
                <MovieError containerStyle={style.error}/>
            </View>
        );
    }

    return (
        <View style={style.container}>
            <Text style={style.sectionTitle}>TimeLine</Text>

            <TimeLinePaging
                spacing={spacing}
                setSpacing={setSpacing}
            />

            {
                (data.length === 0 || isLoading)
                    ? <HomeMovieListPlaceHolder extraStyle={{marginTop: 0}} number={3}/>
                    : <View style={style.movieListContainer}>
                        {
                            data.map((item, index) => {
                                return (
                                    <HomeMovieCard
                                        key={index}
                                        poster={getPoster(item.poster)}
                                        id={item._id}
                                        title={item.rawTitle || getTitleSnakeCase(item.title)}
                                        type={item.type}
                                        tab={'todaySeries'}
                                        latestData={item.latestData}
                                        nextEpisode={item.nextEpisode}
                                        rating={getRating(item.rating)}
                                    />
                                );
                            })
                        }
                    </View>
            }
            <SeeAllButton
                onPress={() => navigation.navigate('TimeLine', {startSpacing: spacing})}
            />

        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 21,
        paddingBottom: 10,
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: Typography.getFontSize(24),
    },
    movieListContainer: {
        flexDirection: 'row',
        justifyContent: "space-between",
    },
    error: {
        marginTop: -10,
        height: Mixins.getWindowHeight(25),
        alignItems: 'center',
        justifyContent: 'center',
    }
});


export default HomeTimeLineSection;
