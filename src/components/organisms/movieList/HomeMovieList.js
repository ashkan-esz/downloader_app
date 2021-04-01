import React from 'react';
import {View, StyleSheet} from 'react-native';
import {MovieError} from "../../atoms";
import {HomeMovieCard, HomeMovieListPlaceHolder} from "../../molecules";
import {getPoster, getRating, getTitleSnakeCase} from "../../../utils";
import {Mixins} from "../../../styles";
import PropTypes from 'prop-types';


const HomeMovieList = ({loadedData, tab, isLoading, error, retry}) => {

    if (error) {
        return (
            <MovieError
                containerStyle={style.error}
                retry={retry}
            />
        );
    }

    if (loadedData.length === 0 || isLoading) {
        return (
            <HomeMovieListPlaceHolder number={3}/>
        );
    }

    return (
        <View style={style.container}>
            {loadedData.map(((item, index) => (
                <HomeMovieCard
                    key={index}
                    id={item._id}
                    title={item.rawTitle || getTitleSnakeCase(item.title)}
                    poster={getPoster(item.poster)}
                    type={item.type}
                    tab={tab}
                    latestData={item.latestData}
                    nextEpisode={item.nextEpisode}
                    rating={getRating(item.rating)}
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
        marginTop: 11,
        alignItems: 'center',
    },
    error: {
        marginTop: 0,
        height: Mixins.getWindowHeight(25),
        alignItems: 'center',
        justifyContent: 'center',
    }
});

HomeMovieList.propTypes = {
    loadedData: PropTypes.array.isRequired,
    tab: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    retry: PropTypes.func.isRequired
};


export default HomeMovieList;
