import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {SectionNavBar} from "../molecules";
import HomeTopMovieList from "./movieList/HomeTopMovieList";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import * as movieApis from "../../api/movieApis";


const HomeTopSection = () => {
    const sections = ['inTheaters', 'comingSoon', 'recent', 'update'];
    const [tab, setTab] = useState('inTheaters');
    const [isMounted, setIsMounted] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (isMounted) {
            let keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
                if (data[keys[i]] && data[keys[i]].length > 0) {
                    setTab(keys[i]);
                    break;
                }
            }
        }
    }, [isMounted]);

    async function getData() {
        const types = ['movie', 'serial', 'anime_movie', 'anime_serial'];
        let result = await movieApis.getMultipleStatus(types, 'medium', 6, 1);
        if (result && result !== 'error') {
            return result;
        } else {
            //todo : handle error
            return {
                inTheaters: [],
                comingSoon: [],
                news: [],
                update: [],
            }
        }
    }

    const {data, isPending, isFetching, isError} = useQuery({
        queryKey: ['movie', 'multipleStatus'],
        queryFn: getData,
        placeholderData: {
            inTheaters: [],
            comingSoon: [],
            news: [],
            update: [],
        },
        notifyOnChangeProps: "all",
    });

    useEffect(() => {
        !isFetching && setIsMounted(true);
    }, [isFetching]);

    const _retry = async () => {
        await queryClient.refetchQueries({type: 'active', queryKey: ['movie']});
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
                isLoading={isPending || !isMounted}
                error={isError}
                retry={_retry}
            />
        </View>
    );
};

const style = StyleSheet.create({});


export default HomeTopSection;

