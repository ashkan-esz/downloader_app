import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "@rneui/themed";
import {useNavigation} from "@react-navigation/native";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {MovieError} from "../../atoms";
import {HomeMovieCard, HomeMovieCardPlaceHolder, HomeScreenFlashList} from "../../molecules";
import * as movieApis from "../../../api/movieApis";
import {Colors, Mixins, Typography} from "../../../styles";
import PropTypes from 'prop-types';
import Entypo from 'react-native-vector-icons/Entypo';
import {moviesDataLevel, movieTypes} from "../../../utils";
import {sectionTypes} from "../../../screens/AppScreens/MovieListScreen/SectionListScreen/SectionScreen";

const itemSize = Math.max(Mixins.getWindowHeight(29), 200) + 20; //260

const HomeMovieList = ({name, pageType, extraStyle}) => {
    const navigation = useNavigation();
    const queryClient = useQueryClient();

    async function getData() {
        let result = pageType === "updates"
            ? await movieApis.getUpdates(movieTypes.all, moviesDataLevel.low, 1)
            : await movieApis.getSortedMovies(pageType, movieTypes.all, moviesDataLevel.low, 1);
        if (result !== 'error') {
            return result.slice(0, 6);
        } else {
            throw new Error();
        }
    }

    const {data, isPending, isFetching, isError} = useQuery({
        queryKey: ['movie', pageType, "homeMovieList"],
        queryFn: getData,
        placeholderData: [],
        notifyOnChangeProps: "all",
    });

    const justifyContent = useMemo(() => ({
        justifyContent: data?.length < 3 ? 'flex-start' : undefined,
        marginRight: data?.length < 3 ? 5 : 6,
    }), [data?.length]);

    const _retry = async () => {
        await queryClient.refetchQueries({
            queryKey: ['movie', pageType, "homeMovieList"]
        });
    }

    const _onNavigate = useCallback(() => {
        if (sectionTypes.news.includes(pageType)) {
            navigation.navigate('Section', {
                startTab: pageType,
                tabs: sectionTypes.news,
                tabNames: sectionTypes.news,
            });
        } else if (sectionTypes.upcoming.includes(pageType)) {
            navigation.navigate('Section', {
                startTab: pageType,
                tabs: sectionTypes.upcoming,
                tabNames: sectionTypes.upcoming_names,
            });
        } else if (sectionTypes.rank.includes(pageType)) {
            navigation.navigate('Section', {
                startTab: pageType,
                tabs: sectionTypes.rank,
                tabNames: sectionTypes.rank_names,
            });
        } else {
            navigation.navigate('MovieListScreen', {
                name: name,
                pageType: pageType,
            })
        }
    }, [name, pageType]);

    if (isError) {
        return (
            <View style={[style.container, extraStyle]}>
                <Text style={style.sectionTitle}>{name}</Text>
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
            <View style={[style.container, extraStyle]}>
                <Text style={style.sectionTitle}>{name}</Text>
                <View style={style.listContainer}>
                    {
                        Array.apply(null, Array(3)).map((item, index) => (
                                <HomeMovieCardPlaceHolder extraStyle={style.movieCard} key={index}/>
                            )
                        )
                    }
                </View>
            </View>
        );
    }

    const _keyExtractor = (item) => item._id.toString();
    const _renderItem = ({index, item}) => (
        <HomeMovieCard
            extraStyle={justifyContent}
            posters={item.posters}
            movieId={item._id}
            title={item.rawTitle}
            type={item.type}
            rating={item.rating}
            follow={item.userStats?.follow || false}
            watchList={item.userStats?.watchlist || false}
            latestData={item.latestData}
            nextEpisode={item.nextEpisode}
        />
    );

    return (
        <View style={[style.container, extraStyle]}>
            <Text style={style.sectionTitle}>{name}</Text>
            <Text
                style={style.seeAll}
                onPress={_onNavigate}>
                See more
            </Text>
            <Entypo name="chevron-small-right" style={style.seeAllIcon} size={30} color={Colors.THIRD}
                    onPress={_onNavigate}/>

            <HomeScreenFlashList
                extraStyle={style.listContainer}
                data={data}
                keyExtractor={_keyExtractor}
                renderItem={_renderItem}
                itemSize={itemSize}
                isError={isError}
                isLoading={isPending}
            />
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        paddingBottom: 10,
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: Typography.getFontSize(24)
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
    listContainer: {
        justifyContent: "space-between",
        marginTop: 20,
        flex: 0,
        flexShrink: 1,
        width: Mixins.WINDOW_WIDTH - 10,
        height: itemSize,
        minHeight: 220,
        flexDirection: 'row',
        alignItems: 'center',
    },
    movieCard: {
        marginRight: 6
    },
    error: {
        marginTop: 8,
        height: itemSize,
        minHeight: 220,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

HomeMovieList.propTypes = {
    extraStyle: PropTypes.object,
    name: PropTypes.string.isRequired,
    pageType: PropTypes.string.isRequired,
}


export default HomeMovieList;
