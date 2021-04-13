import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, LayoutAnimation} from 'react-native';
import {ScreenLayout} from "../../components/layouts";
import {TrailersMovieList} from "../../components/organisms";
import {FilterBox} from "../../components/molecules";
import {ScrollTop} from "../../components/atoms";
import {useInfiniteQuery, useQueryClient} from "react-query";
import {getTrailers} from "../../api";


const TrailersScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [shouldShow, setShouldShow] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [filters, setFilters] = useState({
        types: ['movie', 'serial'],
        imdbScore: [0, 10],
        genres: null,
    });
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
        let result = await getTrailers(filters.types, pageParam);
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, fetchNextPage, isLoading, isFetchingNextPage, isError} = useInfiniteQuery(
        ['trailers', 'trailersScreen', filters.types],
        getData,
        {
            getNextPageParam: (lastPage, allPages) => allPages.length + 1,
            placeholderData: {pages: [[]]},
            refetchInterval: 3 * 60 * 1000,
        });

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries(['trailers', 'trailersScreen', filters.types]);
        setRefreshing(false);
    };

    return (
        <ScreenLayout paddingSides={10}>
            <View style={style.container}>

                <FilterBox
                    expanded={expanded}
                    setExpanded={setExpanded}
                    filters={filters}
                    setFilters={setFilters}
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
                    bottom={expanded ? 110 : 65}
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
        top: 75,
    }
});


export default TrailersScreen;
