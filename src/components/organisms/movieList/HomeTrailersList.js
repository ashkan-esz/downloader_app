import React, {useCallback, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text} from "@rneui/themed";
import {MovieError} from "../../atoms";
import {HomeScreenFlashList, HomeTrailer, HomeTrailerCardPlaceHolder} from "../../molecules";
import {useNavigation} from "@react-navigation/native";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import * as movieApis from "../../../api/movieApis";
import {Colors, Mixins} from "../../../styles";
import Entypo from 'react-native-vector-icons/Entypo';
import {moviesDataLevel, movieTypes} from "../../../utils";

const itemSize = Math.max(Mixins.getWindowHeight(20), 208) + 60; //268

const HomeTrailersList = () => {
    const navigation = useNavigation();
    const queryClient = useQueryClient();

    const [onScreenViewItems, setOnScreenViewItems] = useState([]);

    const handleVieweableItemsChanged = useCallback(({viewableItems}) => {
        setOnScreenViewItems(viewableItems.map(item => item.index));
    }, []);

    async function getData() {
        let result = await movieApis.getTrailers(movieTypes.all, moviesDataLevel.medium, 1);
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, isPending, isError} = useQuery({
        queryKey: ['movie', "trailers", 1],
        queryFn: getData,
        placeholderData: [],
    });

    const _retry = async () => {
        await queryClient.refetchQueries({queryKey: ["movie", "trailers", 1]});
    }

    if (isError) {
        return (
            <View style={style.container}>
                <Text style={style.sectionTitle}>New Trailers</Text>
                <MovieError
                    containerStyle={style.error}
                    retry={_retry}
                    hideRetry={true}
                />
            </View>
        );
    }

    if (data.length === 0 || isPending) {
        return (
            <View style={style.container}>
                <Text style={style.sectionTitle}>New Trailers</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={style.placeHolderScrollView}
                >
                    {
                        Array.apply(null, Array(3)).map((item, index) => (
                                <HomeTrailerCardPlaceHolder key={index}/>
                            )
                        )
                    }
                </ScrollView>
            </View>
        );
    }

    const _keyExtractor = (item) => item._id.toString();
    const _renderItem = ({index, item}) => (
        <HomeTrailer
            isOnScreenView={onScreenViewItems.includes(index)}
            posters={item.posters}
            widePoster={item.poster_wide_s3}
            trailers={item.trailers}
            title={item.rawTitle}
            genres={item.genres}
            type={item.type}
            movieId={item._id}
            rating={item.rating}
            follow={item.userStats?.follow || false}
            watchList={item.userStats?.watchlist || false}
        />
    );

    return (
        <View style={style.container}>
            <Text style={style.sectionTitle}>New Trailers</Text>
            <Text
                style={style.seeAll}
                onPress={() => navigation.navigate('Trailers')}>
                See more
            </Text>
            <Entypo name="chevron-small-right" style={style.seeAllIcon} size={30} color={Colors.THIRD}
                    onPress={() => navigation.navigate('Trailers')}/>

            <HomeScreenFlashList
                extraStyle={style.listContainer}
                onViewableItemsChanged={handleVieweableItemsChanged}
                data={data.slice(0, 6)}
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
    },
    listContainer: {
        marginTop: 20,
        width: Mixins.WINDOW_WIDTH - 10,
        height: Mixins.getWindowHeight(20) + 60,
        minHeight: 208,
        flexDirection: 'row',
        alignItems: 'center',
    },
    placeHolderScrollView: {
        marginTop: 20
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: 24,
    },
    seeAll: {
        position: 'absolute',
        right: 20,
        marginTop: 5,
        color: Colors.THIRD,
        fontSize: 18,
    },
    seeAllIcon: {
        position: 'absolute',
        right: -8,
        marginTop: 4,
    },
    error: {
        marginTop: 20,
        height: Mixins.getWindowHeight(20) + 40,
        alignItems: 'center',
        justifyContent: 'center',
    }
});


export default HomeTrailersList;
