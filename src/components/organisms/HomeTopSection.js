import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {SectionNavBar} from "../molecules";
import HomeTopMovieList from "./movieList/HomeTopMovieList";
import {useQuery, useQueryClient} from "react-query";
import {useNavigation} from '@react-navigation/native';
import {getMultipleStatus} from "../../api";
import {SeeAllButton} from "../atoms";


const HomeTopSection = () => {
    const sections = ['inTheaters', 'comingSoon', 'recent', 'update'];
    const [tab, setTab] = useState('inTheaters');
    const [isMounted, setIsMounted] = useState(false);
    const queryClient = useQueryClient();
    const navigation = useNavigation();

    useEffect(() => {
        if (isMounted) {
            if (data.inTheaters.length === 0) {
                if (data.comingSoon.length > 0) {
                    setTab('comingSoon');
                } else {
                    setTab('recent');
                }
            }
        }
    }, [isMounted]);

    async function getData() {
        const types = ['movie', 'serial', 'anime_movie', 'anime_serial'];
        let result = await getMultipleStatus(types, 'medium', 6, 1);
        if (result && result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, isLoading, isFetching, isError} = useQuery(
        ['multipleStatus'],
        getData,
        {
            placeholderData: {
                inTheaters: [],
                comingSoon: [],
                news: [],
                update: [],
            },
            keepPreviousData: true,
        });

    useEffect(() => {
        !isFetching && setIsMounted(true);
    }, [isFetching]);

    const _retry = async () => {
        await queryClient.refetchQueries({active: true});
    };

    return (
        <View>
            <SectionNavBar
                sections={sections}
                tab={tab}
                onTabChange={setTab}
            />
            <HomeTopMovieList
                loadedData={data[tab.replace('recent', 'news')]}
                tab={tab}
                isLoading={isLoading || !isMounted}
                error={isError}
                retry={_retry}
            />
            <SeeAllButton
                onPress={() => {
                    navigation.navigate('Section', {startTab: tab});
                }}
            />
        </View>
    );
};

const style = StyleSheet.create({});


export default HomeTopSection;

