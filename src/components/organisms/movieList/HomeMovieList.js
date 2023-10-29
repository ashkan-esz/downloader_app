import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "@rneui/themed";
import {useNavigation} from "@react-navigation/native";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {MovieError} from "../../atoms";
import {HomeMovieCard, HomeMovieListPlaceHolder, HomeScreenFlashList} from "../../molecules";
import {getSortedMovies} from "../../../api";
import {Colors, Mixins, Typography} from "../../../styles";
import PropTypes from 'prop-types';

const itemSize = Math.max(Mixins.getWindowHeight(29), 200); //240

const HomeMovieList = ({name, pageType}) => {
    const navigation = useNavigation();
    const queryClient = useQueryClient();

    async function getData() {
        let types = ['movie', 'serial', 'anime_movie', 'anime_serial'];
        let result = await getSortedMovies(pageType, types, 'low', 1);
        if (result !== 'error') {
            return result;
        } else {
            //todo : handle error
            return [];
        }
    }

    const {data, isLoading, isError} = useQuery(
        [pageType, "homeMovieList"],
        getData,
        {placeholderData: []});

    const _retry = async () => {
        await queryClient.refetchQueries([pageType, "homeMovieList"]);
    }

    if (isError) {
        return (
            <View style={style.container}>
                <Text style={style.sectionTitle}>{name}</Text>
                <MovieError
                    containerStyle={style.error}
                    retry={_retry}
                    hideRetry={true}
                />
            </View>
        );
    }

    if (data.length === 0 || isLoading) {
        return (
            <View style={style.container}>
                <Text style={style.sectionTitle}>{name}</Text>
                <HomeMovieListPlaceHolder
                    extraStyle={style.listContainer}
                    number={3}
                    rating={false}
                    latestData={false}
                />
            </View>
        );
    }

    const _keyExtractor = (item) => item._id.toString();
    const _renderItem = ({index, item}) => (
        <HomeMovieCard
            extraStyle={style.movieCard}
            posters={item.posters}
            movieId={item._id}
            title={item.rawTitle}
            type={''}
            rating={0}
            noRating={true}
            like={item.userStats.like}
            dislike={item.userStats.dislike}
            follow={item.userStats.follow}
        />
    );

    return (
        <View style={style.container}>
            <Text style={style.sectionTitle}>{name}</Text>
            <Text
                style={style.seeAll}
                onPress={() => navigation.navigate('MovieListScreen', {
                    name: name,
                    pageType: pageType,
                })
                }>
                See All
            </Text>

            <HomeScreenFlashList
                extraStyle={style.listContainer}
                data={data}
                keyExtractor={_keyExtractor}
                renderItem={_renderItem}
                itemSize={itemSize}
                isError={isError}
                isLoading={isLoading}
            />
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 15,
        paddingBottom: 10,
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: Typography.getFontSize(24)
    },
    seeAll: {
        position: 'absolute',
        right: 5,
        marginTop: 5,
        color: Colors.NAVBAR,
        fontSize: Typography.getFontSize(18)
    },
    listContainer: {
        justifyContent: "space-between",
        marginTop: 20,
        flex: 0,
        flexShrink: 1,
        width: Mixins.WINDOW_WIDTH - 10,
        height: Mixins.getWindowHeight(29),
        minHeight: 200,
    },
    movieCard: {
        marginRight: 6
    },
    error: {
        marginTop: 8,
        height: Mixins.getWindowHeight(25),
        alignItems: 'center',
        justifyContent: 'center',
    }
});

HomeMovieList.propTypes = {
    name: PropTypes.string.isRequired,
    pageType: PropTypes.string.isRequired,
}


export default HomeMovieList;
