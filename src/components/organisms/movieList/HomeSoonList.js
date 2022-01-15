import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text} from "react-native-elements";
import {MovieError} from "../../atoms";
import {HomeMovieCard, HomeMovieListPlaceHolder} from "../../molecules";
import {getNews} from "../../../api";
import {Colors, Mixins, Typography} from "../../../styles";
import {useQuery, useQueryClient} from "react-query";


const HomeSoonList = () => {
    const queryClient = useQueryClient();

    async function getData() {
        let result = await getNews(['movie', 'serial', 'anime_movie', 'anime_serial'], 'low', 1); //todo : replace with soon api
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, isLoading, isError} = useQuery(
        ["soon"],
        getData,
        {placeholderData: []});

    const _retry = async () => {
        await queryClient.refetchQueries(["soon"]);
    }

    if (isError) {
        return (
            <View style={style.container}>
                <Text style={style.sectionTitle}>Soon</Text>
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
                <Text style={style.sectionTitle}>Soon</Text>
                <HomeMovieListPlaceHolder extraStyle={{marginTop: 20}} number={3} rating={false}/>
            </View>
        );
    }

    return (
        <View style={style.container}>
            <Text style={style.sectionTitle}>Soon</Text>
            <Text
                style={style.seeAll}
                onPress={() => { //todo
                }}>
                See All</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={style.scrollView}
            >
                {
                    data.slice(0, 3).map((item) => {
                        return (
                            <HomeMovieCard
                                extraStyle={style.movieCard}
                                posters={item.posters}
                                id={item._id}
                                title={item.rawTitle}
                                type={''}
                                rating={0}
                                noRating={true}
                                key={item._id.toString()}
                            />
                        );
                    })
                }
            </ScrollView>
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 15,
        paddingBottom: 10,
    },
    scrollView: {
        marginTop: 8,
        justifyContent: "space-between",
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
        fontSize: Typography.getFontSize(16)
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


export default HomeSoonList;
