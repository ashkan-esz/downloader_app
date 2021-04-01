import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {ScreenLayout} from "../../components/layouts";
import {ScrollTop} from "../../components/atoms";
import {TrailersMovieList} from "../../components/organisms";
import {useInfiniteQuery, useQueryClient} from "react-query";
import {getTrailers_all} from "../../api";


const TrailersScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [shouldShow, setShouldShow] = useState(false);
    const flatListRef = useRef();
    const queryClient = useQueryClient();

    useEffect(() => {
        setTimeout(() => setShouldShow(true), 5);
    }, []);

    async function getData({pageParam = 1}) {
        let result = await getTrailers_all(pageParam);
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, fetchNextPage, isLoading, isFetchingNextPage, isError} = useInfiniteQuery(
        ['trailers', 'trailersScreen'],
        getData,
        {
            getNextPageParam: (lastPage, allPages) => allPages.length + 1,
            placeholderData: {pages: [[]]},
            keepPreviousData: true,
            refetchInterval: 3 * 60 * 1000,
        });

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries(['trailers', 'trailersScreen']);
        setRefreshing(false);
    };

    return (
        <ScreenLayout paddingSides={10}>
            <View style={style.container}>

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
                />

                <ScrollTop
                    flatListRef={flatListRef}
                    show={(data.pages[0].length > 0 && !isLoading && shouldShow && !isError)}
                    bottom={25}
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
