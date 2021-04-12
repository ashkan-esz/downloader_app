import React from 'react';
import {View, StyleSheet, ActivityIndicator, ScrollView} from 'react-native';
import {Image, Text} from "react-native-elements";
import {Colors, Mixins, Typography} from "../../../styles";
import PropTypes from 'prop-types';


const HomeTrailersListPlaceHolders = ({number}) => {
    const getPlaceHolders = () => {
        let array = [];
        for (let i = 0; i < number; i++) {
            array.push(
                <View style={style.trailerContainer} key={i}>
                    <Image
                        style={style.image}
                        source={null}
                        PlaceholderContent={<ActivityIndicator size={'large'} color={'blue'}/>}
                    />
                    <Text style={style.title} numberOfLines={1}>
                        Loading....
                    </Text>
                </View>
            );
        }
        return array;
    };

    return (
        <View style={style.container}>
            <Text style={style.sectionTitle}>New Trailer</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={style.scrollView}
            >
                {getPlaceHolders()}
            </ScrollView>
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 15,
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: Typography.getFontSize(24)
    },
    scrollView: {
        marginTop: 20
    },
    trailerContainer: {
        alignItems: 'center',
        marginRight: 10,
        width: Mixins.getWindowWidth(68),
    },
    image: {
        width: Mixins.getWindowWidth(68),
        height: Mixins.getWindowHeight(20),
        minHeight: 155,
        borderRadius: 5
    },
    title: {
        fontSize: Typography.getFontSize(18),
        color: Colors.TextColor,
        textAlign: 'center',
        marginTop: 5
    },
});

HomeTrailersListPlaceHolders.propTypes = {
    number: PropTypes.number.isRequired,
};


export default HomeTrailersListPlaceHolders;
