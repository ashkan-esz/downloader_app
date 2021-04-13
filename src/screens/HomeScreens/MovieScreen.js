import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {MovieLoadingAndError} from "../../components/atoms";
import {MovieTopPoster, MovieScreenDownloadSection} from "../../components/molecules";
import {MovieScreenInfoSection} from "../../components/organisms";
import {ScreenLayout} from "../../components/layouts";
import {useRoute} from "@react-navigation/native";
import {useQuery, useQueryClient} from "react-query";
import {homeStackHelpers} from "../../helper";
import {searchByID} from "../../api";

//todo : add like/dislike number and functionality to like
//todo : enhanced trailer watching
//todo : add cast section

const MovieScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const route = useRoute();
    const routeParams = route.params;
    const queryClient = useQueryClient();

    const getData = async () => {
        let result = await searchByID(routeParams.id, 'high');
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, isLoading, isError} = useQuery(
        [routeParams.title, routeParams.poster],
        getData,
        {
            placeholderData: null,
            cacheTime: 5 * 60 * 1000,
            staleTime: 5 * 60 * 1000,
        }
    );

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries([routeParams.title, routeParams.poster]);
        setRefreshing(false);
    }

    const _retry = async () => {
        await queryClient.resetQueries([routeParams.title, routeParams.poster]);
    }

    const episodesOrDuration = data !== null
        ? homeStackHelpers.getEpisodeCountsDuration(data.latestData, data.episodes, data.duration, data.type)
        : '';

    return (
        <ScreenLayout paddingSides={5}>
            <View style={style.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            onRefresh={_onRefresh}
                            refreshing={refreshing}
                            colors={['blue', 'red']}
                        />
                    }
                >

                    <MovieTopPoster
                        title={routeParams.title}
                        episodesDuration={episodesOrDuration}
                        poster={routeParams.poster}
                        rating={routeParams.rating}
                        genres={data ? data.genres : []}
                    />

                    {
                        (!data || isLoading || isError)
                            ? <MovieLoadingAndError
                                isError={isError}
                                retry={_retry}
                            />
                            : <View>
                                <MovieScreenInfoSection
                                    data={data}
                                />
                                <MovieScreenDownloadSection
                                    data={data}
                                />
                                <View style={{paddingBottom: 100}}/>
                            </View>
                    }

                </ScrollView>
            </View>
        </ScreenLayout>
    );
};

const style = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 70,
    }
});

MovieScreen.propTypes = {}


export default MovieScreen;
