import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {HomeAvatarAndSearch} from "../../components/molecules";
import {
    HomeTopSection,
    HomeTrailersList,
    HomeSoonList,
    HomeTimeLineSection
} from "../../components/organisms";
import {ScreenLayout} from "../../components/layouts";
import {useQueryClient} from "react-query";
import {Mixins} from "../../styles";


const HomeScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const queryClient = useQueryClient();

    const _onRefresh = async () => {
        setRefreshing(true);
        const sections = ['recent', 'updates', 'populars', 'todaySeries', 'trailers'];
        let promiseArray = [];
        for (let i = 0; i < sections.length; i++) {
            let query = queryClient.refetchQueries([sections[i]]);
            promiseArray.push(query);
        }
        await Promise.all(promiseArray);
        setRefreshing(false);
    };

    return (
        <ScreenLayout paddingSides={10}>
            <View style={style.container}>
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
                    <HomeSoonList/>


                </ScrollView>
            </View>
        </ScreenLayout>
    );
};

const style = StyleSheet.create({
    container: {
        top: 30,
        height: Mixins.WINDOW_HEIGHT - 40
    },
    avatar_searchBar: {
        marginTop: 0
    }
});


export default HomeScreen;
