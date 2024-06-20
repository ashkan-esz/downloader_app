import React, {useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from "@rneui/themed";
import {MovieScreenQualityCollapsible, MovieScreenSeasonCollapsible} from "../atoms";
import {Colors} from "../../styles";
import {LinearGradient} from "expo-linear-gradient";
import PropTypes from 'prop-types';

//todo : check section list

const MovieScreenDownloadSection = ({data, scrollViewRef, onScrollToDownload}) => {
    const sectionRef = useRef(null);
    const cyanGradient = ['rgba(34,193,195,1)', 'rgba(253,187,45,1)'];
    const [downloadPosition, setDownloadPosition] = useState(0);

    const numberOfLinks = data.type.includes('movie')
        ? data.qualities.map(item => item.links.concat(item.torrentLinks)).flat(1).length
        : data.seasons.map(item => item.episodes.map(e => e.links.concat(e.torrentLinks)).flat(1)).flat(1).length;

    const _scrollToDownload = () => {
        if (scrollViewRef && scrollViewRef.current) {
            if (downloadPosition > 0) {
                onScrollToDownload();
                setTimeout(() => {
                    scrollViewRef.current.scrollTo({
                        y: downloadPosition,
                        animated: true,
                    });
                }, 20);
            }
        }
    }

    return (
        <View style={style.container}>

            <View
                ref={sectionRef}
                onLayout={({nativeEvent}) => {
                    setTimeout(() => {
                        if (sectionRef.current) {
                            sectionRef.current.measure((x, y, width, height, pageX, pageY) => {
                                setDownloadPosition(pageY - height - 40);
                            });
                        }
                    }, 5);
                }}
            >
                <Text style={style.section}>
                    DOWNLOAD
                </Text>
            </View>

            <View style={style.infoContainer}>
                <Text style={style.infoText}>{'\u2022'}
                    <Text style={style.infoText}> No VPN </Text>
                </Text>
                <Text style={style.infoText}>{'\u2022'}
                    <Text style={style.infoText}> Long press to share </Text>
                </Text>
            </View>

            {
                numberOfLinks === 0
                    ? <TouchableOpacity activeOpacity={0.7}>
                        <LinearGradient
                            colors={cyanGradient}
                            start={[0, 0]}
                            end={[1, 1]}
                            locations={[0, 1]}
                            style={style.headerGradient}
                        >
                            <Text style={style.headerText}>
                                No link available
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    : data.type.includes('serial')
                        ? <MovieScreenSeasonCollapsible
                            scrollToDownload={_scrollToDownload}
                            latestData={data.latestData}
                            seasons={data.seasons}
                            rawTitle={data.rawTitle}
                        />
                        : <MovieScreenQualityCollapsible
                            scrollToDownload={_scrollToDownload}
                            qualities={data.qualities}
                            rawTitle={data.rawTitle}
                        />
            }

        </View>
    );
};

const style = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
    },
    section: {
        fontSize: 24,
        color: Colors.SectionHeader,
        marginBottom: 10,
    },
    infoContainer: {
        backgroundColor: Colors.SECONDARY,
        height: 70,
        justifyContent: 'center',
        marginBottom: 20,
        borderRadius: 5,
    },
    infoText: {
        fontSize: 14,
        color: Colors.WARNING,
        marginLeft: 5,
        marginTop: 2,
        marginBottom: 2,
    },
    headerGradient: {
        height: 45,
        borderRadius: 7,
        paddingLeft: 5,
        paddingTop: 8,
        marginBottom: 10,
    },
    headerText: {
        fontSize: 18,
        color: '#fff',
    }
});

MovieScreenDownloadSection.propTypes = {
    data: PropTypes.object.isRequired,
    scrollViewRef: PropTypes.object,
    onScrollToDownload: PropTypes.func.isRequired,
}


export default MovieScreenDownloadSection;
