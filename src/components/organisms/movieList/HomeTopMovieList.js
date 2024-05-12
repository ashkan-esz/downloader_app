import React from 'react';
import {View, StyleSheet} from 'react-native';
import {MovieError, MyShimmerPlaceHolder, SeeAllButton} from "../../atoms";
import {HomeMovieCard, HomeMovieCardPlaceHolder} from "../../molecules";
import {Mixins} from "../../../styles";
import PropTypes from 'prop-types';
import {useNavigation} from "@react-navigation/native";


const HomeTopMovieList = ({loadedData, tab, isLoading, error, retry}) => {
    const navigation = useNavigation();

    if (error) {
        return (
            <MovieError
                containerStyle={style.error}
                retry={retry}
            />
        );
    }

    if (isLoading) {
        return (
            <View style={style.container}>
                {
                    Array.apply(null, Array(3)).map((item, index) => (
                            <HomeMovieCardPlaceHolder key={index}/>
                        )
                    )
                }

                <MyShimmerPlaceHolder extraStyle={style.buttonPlaceHolder}/>
            </View>
        );
    }

    if (!isLoading && loadedData.length === 0) {
        return (
            <MovieError
                containerStyle={style.notFound}
                errorMessage={"No Title Found!"}
            />
        );
    }

    return (
        <View style={style.container}>
            {loadedData.slice(0, 3).map(((item) => (
                <HomeMovieCard
                    key={item._id.toString() + tab}
                    movieId={item._id}
                    title={item.rawTitle}
                    posters={item.posters}
                    type={item.type}
                    tab={tab}
                    latestData={item.latestData}
                    nextEpisode={item.nextEpisode}
                    rating={item.rating.imdb || item.rating.myAnimeList}
                    follow={item.userStats?.follow || false}
                />
            )))}

            <SeeAllButton
                onPress={() => {
                    navigation.navigate('Section', {startTab: tab});
                }}
            />
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: 8,
        alignItems: 'center',
        marginBottom: 40,
    },
    error: {
        marginTop: 8,
        height: Mixins.getWindowHeight(25),
        alignItems: 'center',
        justifyContent: 'center',
    },
    notFound: {
        alignItems: 'center',
        justifyContent: 'center',
        height: Mixins.getWindowHeight(33),
        marginTop: 8,
    },
    buttonPlaceHolder: {
        alignSelf: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%',
        height: 35,
        position: 'absolute',
        bottom: -46,
        borderRadius: 4,
    }
});

HomeTopMovieList.propTypes = {
    loadedData: PropTypes.array.isRequired,
    tab: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    retry: PropTypes.func.isRequired
};


export default HomeTopMovieList;
