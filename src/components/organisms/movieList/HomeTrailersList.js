import React, {useCallback, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from "@rneui/themed";
import {MovieError} from "../../atoms";
import {HomeScreenFlashList, HomeTrailer, HomeTrailersListPlaceHolder} from "../../molecules";
import {useNavigation} from "@react-navigation/native";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getTrailers} from "../../../api";
import {Colors, Mixins, Typography} from "../../../styles";

const itemSize = Math.max(Mixins.getWindowHeight(20), 208) + 60; //268

const HomeTrailersList = () => {
    const navigation = useNavigation();
    const queryClient = useQueryClient();

    const [onScreenViewItems, setOnScreenViewItems] = useState([]);

    const handleVieweableItemsChanged = useCallback(({viewableItems}) => {
        setOnScreenViewItems(viewableItems.map(item => item.index));
    }, []);

    async function getData() {
        let result = await getTrailers(['movie', 'serial', 'anime_movie', 'anime_serial'], 'medium', 1);
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, isLoading, isError} = useQuery(
        ["trailers"],
        getData,
        {placeholderData: []});

    const _retry = async () => {
        await queryClient.refetchQueries(["trailers"]);
    }

    if (isError) {
        return (
            <View style={style.container}>
                <Text style={style.sectionTitle}>New Trailer</Text>
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
            <HomeTrailersListPlaceHolder
                extraStyle={style.listContainer}
                number={3}
            />
        );
    }

    const _keyExtractor = (item) => item._id.toString();
    const _renderItem = ({index, item}) => (
        <HomeTrailer
            isOnScreenView={onScreenViewItems.includes(index)}
            posters={item.posters}
            trailer={item.trailers ? item.trailers[0].url : ''}
            title={item.rawTitle}
            genres={item.genres}
            type={item.type}
            movieId={item._id}
            rating={item.rating.imdb || item.rating.myAnimeList}
            like={item.userStats.like_movie}
            dislike={item.userStats.dislike_movie}
        />
    );

    return (
        <View style={style.container}>
            <Text style={style.sectionTitle}>New Trailers</Text>
            <Text
                style={style.seeAll}
                onPress={() => navigation.navigate('Trailers')}>
                See All
            </Text>

            <HomeScreenFlashList
                extraStyle={style.listContainer}
                onViewableItemsChanged={handleVieweableItemsChanged}
                data={data.slice(0, 9)}
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
    },
    listContainer: {
        marginTop: 20,
        width: Mixins.WINDOW_WIDTH - 10,
        height: Mixins.getWindowHeight(20) + 60,
        minHeight: 208,
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
    error: {
        marginTop: 20,
        height: Mixins.getWindowHeight(18),
        alignItems: 'center',
        justifyContent: 'center',
    }
});


export default HomeTrailersList;
