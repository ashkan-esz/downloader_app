import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import React, {useEffect} from "react";
import {getWindowWidth} from "../../../../styles/mixins";
import {StyleSheet} from "react-native";
import {Colors} from "../../../../styles";
import SwiperCard from "./SwiperCard";
import {MyShimmerPlaceHolder} from "../../../../components/atoms";


export const SRC_WIDTH = getWindowWidth(100);
export const CARD_LENGTH = Math.min(getWindowWidth(60), 400);
export const SPACING = SRC_WIDTH * 0.02;
export const SIDECARD_LENGTH = (SRC_WIDTH * 0.18) / 2;

const SwiperItem = ({isLoading, index, item, activeIndex, length}) => {
    const size = useSharedValue(0.7);

    useEffect(() => {
        if (activeIndex === index) {
            size.value = withTiming(1, {
                duration: 150,
                easing: Easing.ease,
            });
        } else {
            if (size.value !== "0.7") {
                size.value = withTiming(0.7, {
                    duration: 200,
                    easing: Easing.ease,
                });
            }
        }
    }, [activeIndex])

    const cardStyle = useAnimatedStyle(() => {
        return {
            transform: [{scaleY: size.value}],
        }
    })

    return (
        <Animated.View style={[styles.card, cardStyle, index === activeIndex && styles.activeCard, {
            marginLeft: index === 0 ? SIDECARD_LENGTH : SPACING,
            marginRight: index === length - 1 ? SIDECARD_LENGTH + 5 : SPACING,
        }]}>

            {
                isLoading
                    ? <MyShimmerPlaceHolder extraStyle={styles.placeHolder}/>
                    : <SwiperCard
                        movieId={item._id}
                        posters={item.posters}
                        title={item.rawTitle}
                        year={item.year}
                        type={item.type}
                        latestData={item.latestData}
                        rating={item.rating.imdb || item.rating.myAnimeList}
                        like={item.userStats.like}
                        dislike={item.userStats.dislike}
                        follow={item.userStats.follow}
                    />
            }
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    card: {
        width: CARD_LENGTH,
        height: 150,
        overflow: "hidden",
        borderRadius: 15,
    },
    activeCard: {
        borderWidth: 2,
        borderColor: Colors.THIRD,
        shadowColor: Colors.THIRD,
        shadowOffset: {
            width: 2,
            height: 7,
        },
        shadowOpacity: 0.21,
        shadowRadius: 8,
        elevation: 11,
    },
    placeHolder: {
        width: Math.min(getWindowWidth(60), 400),
        height: 140,
        minHeight: 190,
        borderRadius: 5,
    },
})

export default SwiperItem;