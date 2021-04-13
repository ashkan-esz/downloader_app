import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Text} from "react-native-elements";
import {MovieError} from "../../atoms";
import {HomeTrailer, HomeTrailersListPlaceHolder} from "../../molecules";
import {useNavigation} from "@react-navigation/native";
import {useQuery} from "react-query";
import {getTrailers} from "../../../api";
import {homeStackHelpers} from "../../../helper";
import {Colors, Mixins, Typography} from "../../../styles";


const HomeTrailersList = () => {
    const navigation = useNavigation();

    async function getData() {
        let result = await getTrailers(['movie', 'serial'], 1);
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

    return (
        <View style={style.container}>
            <Text style={style.sectionTitle}>New Trailers</Text>
            <Text
                style={style.seeAll}
                onPress={() => navigation.navigate('Trailers')}>
                See All</Text>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={style.scrollView}
                data={data}
                keyExtractor={(item => item.title)}
                renderItem={({item}) => (
                    <HomeTrailer
                        poster={homeStackHelpers.getPoster(item.poster)}
                        trailer={homeStackHelpers.getTrailer(item.trailers, '720')}
                        title={item.rawTitle || homeStackHelpers.getTitleSnakeCase(item.title)}
                        genres={item.genres}
                        type={item.type}
                        extraData={{
                            id: item._id,
                            rating: homeStackHelpers.getRating(item.rating),
                        }}
                    />
                )}
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
