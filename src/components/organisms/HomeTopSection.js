import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from "react-native-elements";
import {SectionNavBar} from "../molecules";
import HomeMovieList from "./movieList/HomeMovieList";
import {useQuery, useQueryClient} from "react-query";
import {useNavigation} from '@react-navigation/native';
import {getTops_byLike_all, getNews_all, getUpdates_all, getTimeLine_today} from "../../api";
import {Colors, Typography} from "../../styles";


const HomeTopSection = () => {
    const sections = ['recent', 'updates', 'populars', 'todaySeries'];
    const [tab, setTab] = useState('recent');
    const navigation = useNavigation();
    const queryClient = useQueryClient();

    //todo : fix wasted stale data
    //todo : also fix for section screen

    async function getData({TAB}) {
        let result;
        if (TAB) {
            if (TAB === 'recent') {
                result = await getNews_all('medium', 0, 3);
            } else if (TAB === 'updates') {
                result = await getUpdates_all('medium', 0, 3);
            } else if (TAB === 'populars') {
                result = await getTops_byLike_all('medium', 0, 3);
            } else if (TAB === 'todaySeries') {
                result = await getTimeLine_today(0, 3);
            }
        } else {
            if (tab === 'recent') {
                result = await getNews_all('medium', 0, 3);
            } else if (tab === 'updates') {
                result = await getUpdates_all('medium', 0, 3);
            } else if (tab === 'populars') {
                result = await getTops_byLike_all('medium', 0, 3);
            } else if (tab === 'todaySeries') {
                result = await getTimeLine_today(0, 3);
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
            <Button
                containerStyle={style.buttonContainer}
                titleStyle={style.buttonTitle}
                title={'See All'}
                type={"clear"}
                onPress={() => {
                    navigation.navigate('Section', {startTab: tab});
                }}
            />
        </View>
    );
};

const style = StyleSheet.create({
    buttonContainer: {
        alignSelf: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%',
        height: 35,
        marginTop: 15,
        backgroundColor: Colors.RED2
    },
    buttonTitle: {
        color: '#ffffff',
        fontSize: Typography.getFontSize(20)
    }
});


export default HomeTopSection;

