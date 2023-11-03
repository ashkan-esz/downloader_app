import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text} from "@rneui/themed";
import {Image} from "expo-image";
import {Colors, Mixins, Typography} from "../../../styles";
import PropTypes from 'prop-types';


const HomeTrailersListPlaceHolders = ({extraStyle, number}) => {
    const getPlaceHolders = () => {
        let array = [];
        for (let i = 0; i < number; i++) {
            array.push(
                <View style={style.trailerContainer} key={i}>
                    <Image
                        style={style.image}
                        source={require('../../../assets/images/loadingImage.png')}
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
            <Text style={style.sectionTitle}>New Trailers</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={[style.scrollView, extraStyle]}
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
    extraStyle: PropTypes.object,
    number: PropTypes.number.isRequired,
};


export default HomeTrailersListPlaceHolders;
