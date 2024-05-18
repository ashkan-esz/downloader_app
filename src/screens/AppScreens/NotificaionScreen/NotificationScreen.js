import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import {ScreenLayout} from "../../../components/layouts";
import {CustomFlashList,} from "../../../components/molecules";
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import {useSelector} from "react-redux";
import * as profileApis from "../../../api/profileApis";
import {Mixins} from "../../../styles";
import NotificationItem from "./NotificationItem";

const itemSize = 90;

const NotificationScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef();
    const queryClient = useQueryClient();
    const internet = useSelector(state => state.user.internet);

    const containerStyle = useMemo(() => ({
        position: 'absolute',
        width: '100%',
        top: internet ? StatusBar.currentHeight + 60 : StatusBar.currentHeight + 10,
    }), [internet]);

    const listStyle = useMemo(() => ({
        height: internet ? Mixins.WINDOW_HEIGHT - 70 : Mixins.WINDOW_HEIGHT - 95,
    }), [internet]);

    async function getData(pageParam) {
        let skip = (pageParam - 1) * 12;
        let result = await profileApis.getNotification(skip, 12, {});
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, fetchNextPage, isPending, isFetching, isFetchingNextPage, isError} = useInfiniteQuery({
        queryKey: ['notification'],
        queryFn: ({pageParam}) => getData(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length % 12 === 0 && lastPage.length !== 0) {
                return allPages.length + 1;
            }
            return null;
        },
        placeholderData: {pages: [[]]},
        gcTime: 2 * 60 * 1000,
        staleTime: 2 * 60 * 1000,
        notifyOnChangeProps: "all",
    });

    useEffect(() => {
        if (data.pages.flat(1).length > 0 && data.pages.flat(1).length <= 12 && data.pages[0][0].status !== 2) {
            setTimeout(() => {
                profileApis.batchUpdateNotificationStatus(data.pages[0][0].id, {status: 2});
                queryClient.setQueryData(['movie', 'home-notification'], (oldData) => {
                    return [];
                });
            }, 200);
        }
    }, [data.pages.flat(1).length]);

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries({
            queryKey: ['notification'],
        });
        setRefreshing(false);
    };

    const _retry = async () => {
        await queryClient.refetchQueries({
            queryKey: ['notification'],
        });
    };

    const keyExtractor = (item) => item.id;
    const renderItem = ({item}) => (
        <NotificationItem
            creatorId={item.creatorId}
            image={item.creatorImage}
            entityId={item.entityId}
            entityTypeId={item.entityTypeId}
            subEntityTypeId={item.subEntityTypeId}
            message={item.message}
            status={item.status}
            date={item.date}
        />
    );

    return (
        <ScreenLayout paddingSides={10}>
            <View style={containerStyle}>
                <CustomFlashList
                    flatListRef={flatListRef}
                    extraStyle={listStyle}
                    showScrollTopIcon={data.pages[0].length > 0}
                    initialNumToRender={2}
                    data={data.pages.flat(1)}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    itemSize={itemSize}
                    onEndReached={fetchNextPage}
                    onRefresh={_onRefresh}
                    refreshing={refreshing}
                    isError={isError}
                    retry={_retry}
                    isLoading={isPending}
                    isFetching={isFetching}
                    isFetchingNextPage={isFetchingNextPage}
                />
            </View>
        </ScreenLayout>
    );
};

const style = StyleSheet.create({});


export default NotificationScreen;
