import React, {useCallback, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Text} from "react-native-elements";
import {MovieError} from "../../atoms";
import {HomeTrailer, HomeTrailersListPlaceHolder} from "../../molecules";
import {useNavigation} from "@react-navigation/native";
import {useQuery} from "react-query";
import {getTrailers} from "../../../api";
import {Colors, Mixins, Typography} from "../../../styles";


const HomeTrailersList = () => {
    const navigation = useNavigation();

    const [onScreenViewItems, setOnScreenViewItems] = useState([]);

    const handleVieweableItemsChanged = useCallback(({viewableItems}) => {
        setOnScreenViewItems(viewableItems.map(item => item.index));
    }, []);

    async function getData() {
        let result = await getTrailers(['movie', 'serial', 'anime_movie', 'anime_serial'], 1);
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

    if (isError) {
        return (
            <View style={style.container}>
                <Text style={style.sectionTitle}>New Trailer</Text>
                <MovieError containerStyle={style.error}/>
            </View>
        );
    }

    if (data.length === 0 || isLoading) {
        return (
            <HomeTrailersListPlaceHolder number={3}/>
        );
    }

    const _keyExtractor = (item) => item.title;
    const _renderItem = ({index, item}) => (
        <HomeTrailer
            isOnScreenView={onScreenViewItems.includes(index)}
            posters={item.posters}
            trailer={item.trailers ? item.trailers[0].link : ''}
            title={item.rawTitle}
            genres={item.genres}
            type={item.type}
            extraData={{
                id: item._id,
                rating: item.rating.imdb || item.rating.myAnimeList,
            }}
        />
    );

    return (
        <View style={style.container}>
            <Text style={style.sectionTitle}>New Trailers</Text>
            <Text
                style={style.seeAll}
                onPress={() => navigation.navigate('Trailers')}>
                See All</Text>
            <FlatList
                onViewableItemsChanged={handleVieweableItemsChanged}
                horizontal
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={style.scrollView}
                data={data}
                keyExtractor={_keyExtractor}
                renderItem={_renderItem}
            />
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 15,
    },
    scrollView: {
        marginTop: 20
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
        marginTop: 0,
        height: Mixins.getWindowHeight(20),
        alignItems: 'center',
        justifyContent: 'center',
    }
});


export default HomeTrailersList;