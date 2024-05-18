import React, {useMemo, useState} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl, StatusBar} from 'react-native';
import {HomeAvatarAndSearch} from "../../../components/molecules";
import {
    HomeTrailersList,
    HomeMovieList,
    HomeTimeLineSection
} from "../../../components/organisms";
import {ScreenLayout} from "../../../components/layouts";
import {useQueryClient} from "@tanstack/react-query";
import {Mixins} from "../../../styles";
import {useSelector} from "react-redux";
import MoviesSwiper from "./swiper/MoviesSwiper";


const HomeScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const queryClient = useQueryClient();
    const internet = useSelector(state => state.user.internet);

    const containerStyle = useMemo(() => ({
        top: internet ? StatusBar.currentHeight + 5 : 10,
        height: internet ? Mixins.WINDOW_HEIGHT - 5 : Mixins.WINDOW_HEIGHT - StatusBar.currentHeight + 5,
    }), [internet]);

    const _onRefresh = async () => {
        setRefreshing(true);
        const sections = ['news', 'updates', 'timeLine', 'trailers', 'home-notification'];
        let promiseArray = [];
        for (let i = 0; i < sections.length; i++) {
            let query = queryClient.refetchQueries({queryKey: ["movie", sections[i]]});
            promiseArray.push(query);
        }
        await Promise.all(promiseArray);
        setRefreshing(false);
    };

    return (
        <ScreenLayout paddingSides={10}>
            <View style={containerStyle}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={_onRefresh}
                            colors={['blue', 'red']}
                        />
                    }
                >

                    <HomeAvatarAndSearch
                        extraStyle={style.avatar_searchBar}
                    />

                    <MoviesSwiper/>
                    <HomeTimeLineSection/>
                    <HomeMovieList
                        name={'Updates'}
                        pageType={'updates'}
                    />
                    <HomeTrailersList/>
                    <HomeMovieList
                        name={'Coming Soon'}
                        pageType={'comingSoon'}
                    />
                    <HomeMovieList
                        name={'Coming Soon Anime'}
                        pageType={'animeTopComingSoon'}
                    />
                    <HomeMovieList
                        name={'Top Airing Anime'}
                        pageType={'animeTopAiring'}
                    />
                    <HomeMovieList
                        name={'Follow Month'}
                        pageType={'follow_month'}
                    />

                </ScrollView>
            </View>
        </ScreenLayout>
    );
};

const style = StyleSheet.create({
    avatar_searchBar: {
        marginTop: 0
    }
});


export default HomeScreen;
