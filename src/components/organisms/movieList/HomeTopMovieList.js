import React from 'react';
import {View, StyleSheet} from 'react-native';
import {MovieError} from "../../atoms";
import {HomeMovieCard, HomeMovieListPlaceHolder} from "../../molecules";
import {Mixins} from "../../../styles";
import PropTypes from 'prop-types';


const HomeTopMovieList = ({loadedData, tab, isLoading, error, retry}) => {

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
            <HomeMovieListPlaceHolder
                extraStyle={style.container}
                number={3}
            />
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
                    like={item.userStats.like_movie}
                    dislike={item.userStats.dislike_movie}
                    save={item.userStats.save}
                />
            )))}
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
