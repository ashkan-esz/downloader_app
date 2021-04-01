import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text} from "react-native-elements";
import {MovieError} from "../../atoms";
import {HomeMovieCard, HomeMovieListPlaceHolder} from "../../molecules";
import {getNews_all} from "../../../api";
import {getPoster, getTitleSnakeCase} from "../../../utils";
import {Colors, Mixins, Typography} from "../../../styles";


const HomeSoonList = () => {
    const [loadedData, setLoadedData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    async function getData() {
        setIsLoading(true);
        setError(false);
        let result = await getNews_all('low', 1); //todo : replace with soon api
        if (result !== 'error') {
            setLoadedData(result);
        } else {
            setLoadedData([]);
            setError(true);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getData();
    }, []);

    if (error) {
        return (
            <MovieError containerStyle={style.error}/>
        );
    }

    if (loadedData.length === 0 || isLoading) {
        return (
            <HomeMovieListPlaceHolder number={3} rating={false}/>
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
            <ScrollView //todo : check flatList
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={style.scrollView}
            >
                {
                    loadedData.map((item) => {
                        return (
                            <HomeMovieCard
                                extraStyle={style.movieCard}
                                poster={getPoster(item.poster)}
                                id={item._id}
                                title={item.rawTitle || getTitleSnakeCase(item.title)}
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
        marginTop: 5,
        paddingBottom: 10,
    },
    scrollView: {
        marginTop: 20,
        justifyContent: "space-between",
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
        fontSize: Typography.getFontSize(16)
    },
    movieCard: {
        marginRight: 6
    },
    error: {
        marginTop: 0,
        height: Mixins.getWindowHeight(25),
        alignItems: 'center',
        justifyContent: 'center',
    }
});


export default HomeSoonList;
