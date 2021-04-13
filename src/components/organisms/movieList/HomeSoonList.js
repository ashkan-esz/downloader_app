import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text} from "react-native-elements";
import {MovieError} from "../../atoms";
import {HomeMovieCard, HomeMovieListPlaceHolder} from "../../molecules";
import {getNews} from "../../../api";
import {homeStackHelpers} from "../../../helper";
import {Colors, Mixins, Typography} from "../../../styles";
import {useQuery} from "react-query";


const HomeSoonList = () => {
    async function getData() {
        let result = await getNews(['movie', 'serial'], 'low', 1); //todo : replace with soon api
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

    if (isError) {
        return (
            <View style={style.container}>
                <Text style={style.sectionTitle}>Soon</Text>
                <MovieError containerStyle={style.error}/>
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
                    data.map((item) => {
                        return (
                            <HomeMovieCard
                                extraStyle={style.movieCard}
                                poster={homeStackHelpers.getPoster(item.poster)}
                                id={item._id}
                                title={item.rawTitle || homeStackHelpers.getTitleSnakeCase(item.title)}
                                type={''}
                                rating={0}
                                noRating={true}
                                key={item.title}
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
        marginTop: 20,
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
        marginTop: -10,
        height: Mixins.getWindowHeight(25),
        alignItems: 'center',
        justifyContent: 'center',
    }
});


export default HomeSoonList;
