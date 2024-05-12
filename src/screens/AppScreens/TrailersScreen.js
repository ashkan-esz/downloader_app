import React, {useMemo, useRef, useState} from 'react';
import {View, StyleSheet, LayoutAnimation, StatusBar} from 'react-native';
import {ScreenLayout} from "../../components/layouts";
import {TrailersMovieList} from "../../components/organisms";
import {FilterType} from "../../components/molecules";
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import {useSelector} from "react-redux";
import * as movieApis from "../../api/movieApis";


const TrailersScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [types, setTypes] = useState(['movie', 'serial', 'anime_movie', 'anime_serial']);
    const flatListRef = useRef();
    const queryClient = useQueryClient();
    const internet = useSelector(state => state.user.internet);

    const containerStyle = useMemo(() => ({
        position: 'absolute',
        width: '100%',
        top: internet ? StatusBar.currentHeight + 60 : StatusBar.currentHeight + 35,
    }), [internet]);

    const _onScroll = () => {
        if (expanded) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setExpanded(false);
        }
    }

    async function getData(pageParam) {
        let result = await movieApis.getTrailers(types, 'medium', pageParam);
        if (result !== 'error') {
            return result;
        } else {
            //todo : handle error
            return [];
        }
    }

    const {data, fetchNextPage, isPending, isFetching, isFetchingNextPage, isError} = useInfiniteQuery({
        queryKey: ['movie', 'trailers', 'trailersScreen', types],
        queryFn: ({pageParam}) => getData(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length % 12 === 0 && lastPage.length !== 0) {
                return allPages.length + 1;
            }
            return null;
        },
        placeholderData: {pages: [[]]},
        notifyOnChangeProps: "all",
    });

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries({
            queryKey: ['movie', 'trailers', 'trailersScreen', types]
        });
        setRefreshing(false);
    };

    return (
        <ScreenLayout paddingSides={10}>
            <View style={containerStyle}>

                <FilterType
                    expanded={expanded}
                    setExpanded={setExpanded}
                    types={types}
                    setTypes={setTypes}
                />

                <TrailersMovieList
                    flatListRef={flatListRef}
                    showScrollTopIcon={(data.pages[0].length > 0)}
                    data={data.pages.flat(1)}
                    isLoading={isPending}
                    isFetching={isFetching}
                    isFetchingNextPage={isFetchingNextPage}
                    onEndReached={fetchNextPage}
                    refreshing={refreshing}
                    onRefresh={_onRefresh}
                    isError={isError}
                    retry={_onRefresh}
                    onScroll={_onScroll}
                />

            </View>
        </ScreenLayout>
    );
};

const style = StyleSheet.create({});


export default TrailersScreen;
