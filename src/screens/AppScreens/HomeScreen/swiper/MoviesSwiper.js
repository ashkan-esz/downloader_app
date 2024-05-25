import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useQuery, useQueryClient} from "@tanstack/react-query";
import * as movieApis from "../../../../api/movieApis";
import {MovieError} from "../../../../components/atoms";
import Animated from "react-native-reanimated";
import SwiperItem, {SRC_WIDTH, CARD_LENGTH, SIDECARD_LENGTH, SPACING} from "./SwiperItem";
import ScalingDot from "./ScalingDot";
import {moviesDataLevel, movieTypes} from "../../../../utils";


const _snapToInterval = CARD_LENGTH + SIDECARD_LENGTH - 2 * SPACING;

const MoviesSwiper = () => {
    const queryClient = useQueryClient();
    // const scrollX = useSharedValue(0);
    const [activeIndex, setActiveIndex] = useState(0);

    async function getData() {
        let result = await movieApis.getNews(movieTypes.all, moviesDataLevel.low, 1);
        if (result !== 'error') {
            return result.slice(0, 6);
        } else {
            throw new Error();
        }
    }

    const {data, isFetching, isError} = useQuery({
        queryKey: ['movie', 'news', 1],
        queryFn: getData,
        placeholderData: [{_id: "0"}, {_id: "1"}, {_id: "2"}],
        notifyOnChangeProps: "all",
    });

    const _retry = async () => {
        await queryClient.refetchQueries({
            queryKey: ['movie', 'news', 1]
        });
    }

    if (isError) {
        return (
            <View style={styles.container}>
                <MovieError
                    containerStyle={styles.error}
                    retry={_retry}
                    autoRetry={false}
                />
            </View>
        );
    }

    if (data.length === 0 && !isFetching) {
        return null;
    }

    return (
        <Animated.View style={styles.container}>
            <Animated.FlatList
                scrollEventThrottle={32}
                showsHorizontalScrollIndicator={false}
                decelerationRate={0.4}
                pagingEnabled={true}
                disableIntervalMomentum={true}
                disableScrollViewPanResponder={true}
                snapToAlignment={"center"}
                data={data}
                horizontal={true}
                renderItem={({item, index}) => (
                    <SwiperItem index={index} item={item} activeIndex={activeIndex} length={data.length}
                                isLoading={isFetching}/>
                )
                }
                keyExtractor={(item) => item._id}
                onScroll={(event) => {
                    // scrollX.value = event.nativeEvent.contentOffset.x;
                    let tt = event.nativeEvent.contentOffset.x - SIDECARD_LENGTH + 2 * SPACING;
                    let temp = Math.ceil(tt / _snapToInterval);
                    if (activeIndex !== temp) {
                        setActiveIndex(temp);
                    }
                    // setActiveIndex(tt / _snapToInterval);
                }}
            />

            <View style={styles.pagingContainer}>
                {data.map((_, index) => {
                    return <ScalingDot key={`dot-${index}`} index={index} activeIndex={activeIndex}/>;
                })}
            </View>

        </Animated.View>
    );

};

const styles = StyleSheet.create({
    container: {
        width: SRC_WIDTH,
        flex: 1,
        marginTop: 20,
        paddingBottom: 10,
    },
    pagingContainer: {
        marginTop: 10,
        justifyContent: "center",
        flexWrap: "wrap",
        flex: 1,
        flexDirection: "row",
        gap: 3,
    },
    error: {
        marginTop: 0,
        height: 175,
        alignItems: 'center',
        justifyContent: 'center',
        width: SRC_WIDTH - 20,
    }
});

MoviesSwiper.propTypes = {}


export default MoviesSwiper;
