import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl, StatusBar} from 'react-native';
import {MovieLoadingAndError, MovieLikeAndBookmark} from "../../components/atoms";
import {MovieTopPoster, MovieScreenDownloadSection} from "../../components/molecules";
import {MovieScreenInfoSection} from "../../components/organisms";
import {ScreenLayout} from "../../components/layouts";
import {useRoute} from "@react-navigation/native";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {homeStackHelpers} from "../../helper";
import {useFollow, useIsMounted, useLikeOrDislike, useWatchList} from "../../hooks";
import * as movieApis from "../../api/movieApis";
import {useSelector} from "react-redux";
import {Colors} from "../../styles";

//todo : show alternate title
//todo : add like/dislike number and functionality to like
//todo : enhanced trailer watching
//todo : show more data
//todo : add watch online section
//todo : add subtitle section
//todo : add cast section

const MovieScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [forceClosePlot, setForceClosePlot] = useState(false);
    const route = useRoute();
    const routeParams = route.params;
    const queryClient = useQueryClient();
    const scrollViewRef = useRef(null);
    const isMounted = useIsMounted();
    const internet = useSelector(state => state.user.internet);

    const pageTop = useMemo(() => ({
        top: internet ? StatusBar.currentHeight + 5 : 0,
    }), [internet]);

    const getData = async () => {
        let result = await movieApis.searchByID(routeParams.movieId, 'high');
        if (result !== 'error') {
            return result;
        } else {
            //todo : handle error
            return null;
        }
    }

    const {data, isPending, isError} = useQuery({
        queryKey: ['movie', 'movieData', routeParams.movieId],
        queryFn: getData,
        placeholderData: null,
        gcTime: 3 * 60 * 1000,
        staleTime: 3 * 60 * 1000,
        notifyOnChangeProps: "all",
    });

    const {
        isLikeLoading,
        isDislikeLoading,
        _onLike,
        _onDisLike
    } = useLikeOrDislike(
        routeParams.movieId,
        data ? data.userStats.likes_count : 0,
        data ? data.userStats.dislikes_count : 0,
        data?.userStats?.like || false,
        data?.userStats?.dislike || false,
    );

    const {
        isFollowLoading,
        _onFollow,
    } = useFollow(
        routeParams.movieId,
        data ? data.userStats.follow_count : 0,
        data?.userStats?.follow || false,
        data ? data.userStats.watchlist_count : 0,
        data?.userStats?.watchlist || false,
    );

    const {
        isWatchListLoading,
        _onWatchList,
    } = useWatchList(
        routeParams.movieId,
        data ? data.userStats.watchlist_count : 0,
        data?.userStats?.watchlist || false,
    );

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries({
            queryKey: ['movie', 'movieData', routeParams.movieId]
        });
        isMounted.current && setRefreshing(false);
    }

    const _retry = async () => {
        await queryClient.resetQueries({
            queryKey: ['movie', 'movieData', routeParams.movieId]
        });
    }

    const episodesOrDuration = data !== null
        ? homeStackHelpers.getEpisodeCountsDuration(data.seasons, data.latestData, data.duration, data.type)
        : '';

    const _onScrollToDownload = useCallback(() => {
        !forceClosePlot && setForceClosePlot(true);
    }, [forceClosePlot]);


    return (
        <ScreenLayout paddingSides={5}>
            <View style={[style.container, pageTop]}>
                <ScrollView
                    ref={scrollViewRef}
                    refreshControl={
                        <RefreshControl
                            onRefresh={_onRefresh}
                            refreshing={refreshing}
                            progressBackgroundColor={Colors.PRIMARY}
                            colors={[Colors.BLUE_LIGHT, Colors.THIRD]}
                        />
                    }
                >

                    <MovieTopPoster
                        movieId={routeParams.movieId}
                        title={data ? data.title : routeParams.title}
                        episodesDuration={episodesOrDuration}
                        poster={data ? data.posters[0] : routeParams.posters[0]}
                        rating={data ? data.rating : routeParams.rating}
                        genres={data ? data.genres : []}
                        posters={data ? data.posters : []}
                        widePoster={data?.poster_wide_s3}
                        isLike={isLikeLoading ? !data.userStats.like : (data ? data.userStats.like : false)}
                        onDoubleTap={() => (data !== null && !isError) && _onLike()}
                    />

                    <MovieLikeAndBookmark
                        isLike={isLikeLoading ? !data.userStats.like : (data ? data.userStats.like : false)}
                        isDisLike={isDislikeLoading ? !data.userStats.dislike : (data ? data.userStats.dislike : false)}
                        isFollowed={isFollowLoading ? !data.userStats.follow : (data ? data.userStats.follow : false)}
                        isWatchlist={isWatchListLoading ? !data.userStats.watchlist : (data ? data.userStats.watchlist : false)}
                        onLike={_onLike}
                        onDisLike={_onDisLike}
                        onFollow={_onFollow}
                        onWatchList={_onWatchList}
                        likesCount={data ? data.userStats.likes_count : 0}
                        dislikesCount={data ? data.userStats.dislikes_count : 0}
                        type={data?.type || ""}
                        disable={!data || !data.type.includes('serial') || isPending || isError || isFollowLoading || isWatchListLoading || isLikeLoading || isDislikeLoading}
                    />

                    {
                        (!data || isPending || isError)
                            ? <MovieLoadingAndError
                                isError={isError}
                                retry={_retry}
                            />
                            : <View>
                                <MovieScreenInfoSection
                                    data={data}
                                    forceClosePlot={forceClosePlot}
                                    setForceClosePlot={setForceClosePlot}
                                />
                                <MovieScreenDownloadSection
                                    data={data}
                                    scrollViewRef={scrollViewRef}
                                    onScrollToDownload={_onScrollToDownload}
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
    }
});

MovieScreen.propTypes = {}


export default MovieScreen;
