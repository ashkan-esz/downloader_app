import React, {useMemo, useState} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl, StatusBar} from 'react-native';
import {HomeAvatarAndSearch} from "../../components/molecules";
import {
    HomeTopSection,
    HomeTrailersList,
    HomeMovieList,
    HomeTimeLineSection
} from "../../components/organisms";
import {ScreenLayout} from "../../components/layouts";
import {useQueryClient} from "@tanstack/react-query";
import {Mixins} from "../../styles";
import {useSelector} from "react-redux";


const HomeScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const queryClient = useQueryClient();
    const internet = useSelector(state => state.user.internet);

    const containerStyle = useMemo(() => ({
        top: internet ? StatusBar.currentHeight + 5 : StatusBar.currentHeight - 20,
        height: internet ? Mixins.WINDOW_HEIGHT - 40 : Mixins.WINDOW_HEIGHT - 60,
    }), [internet]);

    const _onRefresh = async () => {
        setRefreshing(true);
        const sections = ['multipleStatus', 'timeLine', 'trailers'];
        let promiseArray = [];
        for (let i = 0; i < sections.length; i++) {
            let query = queryClient.refetchQueries({queryKey: [sections[i]]});
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

                    <HomeTopSection/>
                    <HomeTimeLineSection/>
                    <HomeTrailersList/>
                    {/*<HomeMovieList*/}
                    {/*    name={'Top'}*/}
                    {/*    pageType={'top'}*/}
                    {/*/>*/}
                    <HomeMovieList
                        name={'Top Anime'}
                        pageType={'animeTopAiring'}
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
