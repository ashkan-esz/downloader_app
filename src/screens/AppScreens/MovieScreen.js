import React, {useCallback, useRef, useState} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {IntersectionObserver} from 'rn-intersection-observer';
import {MovieLoadingAndError, MovieLikeAndBookmark} from "../../components/atoms";
import {MovieTopPoster, MovieScreenDownloadSection} from "../../components/molecules";
import {MovieScreenInfoSection} from "../../components/organisms";
import {ScreenLayout} from "../../components/layouts";
import {useRoute} from "@react-navigation/native";
import {useQuery, useQueryClient} from "react-query";
import {homeStackHelpers} from "../../helper";
import {useIsMounted, useLikeOrDislike} from "../../hooks";
import {searchByID} from "../../api";

//todo : show alternate title
//todo : add like/dislike number and functionality to like
//todo : enhanced trailer watching
//todo : show more data
//todo : add watch online section
//todo : add subtitle section
//todo : add cast section

const MovieScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const route = useRoute();
    const routeParams = route.params;
    const queryClient = useQueryClient();
    const scrollViewRef = useRef(null);
    const isMounted = useIsMounted();

    const getData = async () => {
        let result = await searchByID(routeParams.movieId, 'high');
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, isLoading, isError} = useQuery(
        ['movieData', routeParams.movieId],
        getData,
        {
            placeholderData: null,
            keepPreviousData: true,
            cacheTime: 3 * 60 * 1000,
            staleTime: 3 * 60 * 1000,
        }
    );

    const {
        isLike,
        isDisLike,
        _onLike,
        _onDisLike
    } = useLikeOrDislike(
        routeParams.movieId,
        data ? data.likesCount : 0,
        data ? data.dislikesCount : 0,
        data ? data.likeOrDislike : '',
        data !== null && !isError
    );

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries(['movieData', routeParams.movieId]);
        isMounted.current && setRefreshing(false);
    }

    const _retry = async () => {
        await queryClient.resetQueries(['movieData', routeParams.movieId]);
    }

    const episodesOrDuration = data !== null
        ? homeStackHelpers.getEpisodeCountsDuration(data.seasons, data.latestData, data.duration, data.type)
        : '';

    const onScroll = useCallback((event) => {
        IntersectionObserver.emitEvent('moviePlotScope');
    }, []);


    return (
        <ScreenLayout paddingSides={5}>
            <View style={style.container}>
                <ScrollView
                    ref={scrollViewRef}
                    onScroll={onScroll}
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
                        poster={routeParams.posters[0]}
                        rating={routeParams.rating}
                        genres={data ? data.genres : []}
                        posters={data ? data.posters : []}
                        isLike={isLike}
                        onDoubleTap={_onLike}
                    />

                    <MovieLikeAndBookmark
                        isLike={isLike}
                        isDisLike={isDisLike}
                        onLike={_onLike}
                        onDisLike={_onDisLike}
                        likesCount={data ? data.likesCount : 0}
                        dislikesCount={data ? data.dislikesCount : 0}
                        disable={!data || isLoading || isError}
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
                                    scrollViewRef={scrollViewRef}
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
