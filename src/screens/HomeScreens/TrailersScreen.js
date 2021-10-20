import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, LayoutAnimation} from 'react-native';
import {ScreenLayout} from "../../components/layouts";
import {TrailersMovieList} from "../../components/organisms";
import {FilterType} from "../../components/molecules";
import {ScrollTop} from "../../components/atoms";
import {useInfiniteQuery, useQueryClient} from "react-query";
import {getTrailers} from "../../api";


const TrailersScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [shouldShow, setShouldShow] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [types, setTypes] = useState(['movie', 'serial']);
    const flatListRef = useRef();
    const queryClient = useQueryClient();

    useEffect(() => {
        setTimeout(() => setShouldShow(true), 5);
    }, []);

    const _onScroll = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(false);
    }

    async function getData({pageParam = 1}) {
        let result = await getTrailers(types, pageParam);
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, fetchNextPage, isLoading, isFetchingNextPage, isError} = useInfiniteQuery(
        ['trailers', 'trailersScreen', types],
        getData,
        {
            getNextPageParam: (lastPage, allPages) => allPages.length + 1,
            placeholderData: {pages: [[]]},
            refetchInterval: 3 * 60 * 1000,
        });

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries(['trailers', 'trailersScreen', types]);
        setRefreshing(false);
    };

    return (
        <ScreenLayout paddingSides={10}>
            <View style={style.container}>

                <FilterType
                    expanded={expanded}
                    setExpanded={setExpanded}
                    types={types}
                    setTypes={setTypes}
                />

                <TrailersMovieList
                    flatListRef={flatListRef}
                    data={data.pages.flat(1)}
                    isLoading={isLoading || !shouldShow}
                    isFetchingNextPage={isFetchingNextPage}
                    onEndReached={fetchNextPage}
                    refreshing={refreshing}
                    onRefresh={_onRefresh}
                    isError={isError}
                    retry={_onRefresh}
                    onScroll={_onScroll}
                />

                <ScrollTop
                    flatListRef={flatListRef}
                    show={(data.pages[0].length > 0 && !isLoading && shouldShow && !isError)}
                    bottom={expanded ? 105 : 65}
                    right={10}
                />

            </View>
        </ScreenLayout>
    );
};

const style = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        top: 85,
    }
});


export default TrailersScreen;
