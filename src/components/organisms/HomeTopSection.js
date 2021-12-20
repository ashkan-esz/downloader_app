import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {SectionNavBar} from "../molecules";
import HomeMovieList from "./movieList/HomeMovieList";
import {useQuery, useQueryClient} from "react-query";
import {useNavigation} from '@react-navigation/native';
import {getSortedMovies, getNews, getUpdates} from "../../api";
import {SeeAllButton} from "../atoms";


const HomeTopSection = () => {
    const sections = ['inTheaters', 'comingSoon', 'recent', 'updates'];
    const [tab, setTab] = useState('inTheaters');
    const queryClient = useQueryClient();
    const navigation = useNavigation();

    //todo : fix wasted stale data
    //todo : also fix for section screen

    async function getData({TAB}) {
        const types = ['movie', 'serial', 'anime_movie', 'anime_serial'];
        let result;
        if (TAB) {
            if (TAB === 'inTheaters') {
                result = await getSortedMovies('inTheaters', types, 'medium', 1);
            } else if (TAB === 'comingSoon') {
                result = await getSortedMovies('comingSoon', types, 'medium', 1);
            } else if (TAB === 'recent') {
                result = await getNews(types, 'medium', 1);
            } else if (TAB === 'updates') {
                result = await getUpdates(types, 'medium', 1);
            }
        } else {
            if (tab === 'inTheaters') {
                result = await getSortedMovies('inTheaters', types, 'medium', 1);
            } else if (tab === 'comingSoon') {
                result = await getSortedMovies('comingSoon', types, 'medium', 1);
            } else if (tab === 'recent') {
                result = await getNews(types, 'medium', 1);
            } else if (tab === 'updates') {
                result = await getUpdates(types, 'medium', 1);
            }
        }


        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    //prefetch data
    useEffect(() => {
        async function prefetchData() {
            let promiseArray = [];
            let promise1 = queryClient.prefetchQuery(['inTheaters'], () => getData({TAB: 'inTheaters'}));
            promiseArray.push(promise1);
            let promise2 = queryClient.prefetchQuery(['comingSoon'], () => getData({TAB: 'comingSoon'}));
            promiseArray.push(promise2);
            let promise3 = queryClient.prefetchQuery(['recent'], () => getData({TAB: 'recent'}));
            promiseArray.push(promise3);
            let promise4 = queryClient.prefetchQuery(['updates'], () => getData({TAB: 'updates'}));
            promiseArray.push(promise4);
            await Promise.all(promiseArray);
        }

        prefetchData();
    }, []);

    const {data, isLoading, isError} = useQuery(
        [tab],
        getData,
        {
            placeholderData: [],
            refetchInterval: 3 * 60 * 1000,
            refetchIntervalInBackground: true,
        });

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
            <HomeMovieList
                loadedData={data}
                tab={tab}
                isLoading={isLoading}
                error={isError}
                retry={_retry}
            />
            <SeeAllButton
                disabled={data.length < 4}
                onPress={() => {
                    navigation.navigate('Section', {startTab: tab});
                }}
            />
        </View>
    );
};

const style = StyleSheet.create({});


export default HomeTopSection;

