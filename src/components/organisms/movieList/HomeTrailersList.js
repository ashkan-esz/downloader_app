import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Text} from "react-native-elements";
import {MovieError} from "../../atoms";
import {HomeTrailer, HomeTrailersListPlaceHolder} from "../../molecules";
import {useNavigation} from "@react-navigation/native";
import {useQuery} from "react-query";
import {getTrailers_all} from "../../../api";
import {getPoster, getRating, getTitleSnakeCase, getTrailer} from "../../../utils";
import {Colors, Mixins, Typography} from "../../../styles";


const HomeTrailersList = () => {
    const navigation = useNavigation();

    async function getData() {
        let result = await getTrailers_all(1);
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
            <Text style={style.sectionTitle}>New Trailer</Text>
            <Text
                style={style.seeAll}
                onPress={() => navigation.navigate('Trailers')}>
                See All</Text>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                style={style.scrollView}
                data={data}
                keyExtractor={(item => item.title)}
                renderItem={({item}) => (
                    <HomeTrailer
                        poster={getPoster(item.poster)}
                        trailer={getTrailer(item.trailers, '360')}
                        title={item.rawTitle || getTitleSnakeCase(item.title)}
                        genres={item.genres}
                        type={item.type}
                        extraData={{
                            id: item._id,
                            rating: getRating(item.rating),
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
        marginTop: 20,
    },
    scrollView: {
        marginTop: 20
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: Typography.getFontSize(22)
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
