import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {SectionNavBar} from "../molecules";
import HomeMovieList from "./movieList/HomeMovieList";
import {useQuery, useQueryClient} from "react-query";
import {useNavigation} from '@react-navigation/native';
import {getTopLikes, getNews, getUpdates, getTimeLine_day} from "../../api";
import {SeeAllButton} from "../atoms";


const HomeTopSection = () => {
    const sections = ['recent', 'updates', 'populars', 'todaySeries'];
    const [tab, setTab] = useState('recent');
    const queryClient = useQueryClient();
    const navigation = useNavigation();

    //todo : fix wasted stale data
    //todo : also fix for section screen

    async function getData({TAB}) {
        let result;
        if (TAB) {
            if (TAB === 'recent') {
                result = await getNews(['movie', 'serial'], 'medium', 0, 3);
            } else if (TAB === 'updates') {
                result = await getUpdates(['movie', 'serial'], 'medium', 0, 3);
            } else if (TAB === 'populars') {
                result = await getTopLikes(['movie', 'serial'], 'medium', 0, 3);
            } else if (TAB === 'todaySeries') {
                result = await getTimeLine_day(0, 0, 3);
            }
        } else {
            if (tab === 'recent') {
                result = await getNews(['movie', 'serial'], 'medium', 0, 3);
            } else if (tab === 'updates') {
                result = await getUpdates(['movie', 'serial'], 'medium', 0, 3);
            } else if (tab === 'populars') {
                result = await getTopLikes(['movie', 'serial'], 'medium', 0, 3);
            } else if (tab === 'todaySeries') {
                result = await getTimeLine_day(0, 0, 3);
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
            let promise1 = queryClient.prefetchQuery(['recent'], () => getData({TAB: 'recent'}));
            promiseArray.push(promise1);
            let promise2 = queryClient.prefetchQuery(['updates'], () => getData({TAB: 'updates'}));
            promiseArray.push(promise2);
            let promise3 = queryClient.prefetchQuery(['populars'], () => getData({TAB: 'populars'}));
            promiseArray.push(promise3);
            let promise4 = queryClient.prefetchQuery(['todaySeries'], () => getData({TAB: 'todaySeries'}));
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
                onPress={() => {
                    navigation.navigate('Section', {startTab: tab});
                }}
            />
        </View>
    );
};

const style = StyleSheet.create({});


export default HomeTopSection;

