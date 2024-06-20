import React, {useState, useEffect} from 'react';
import {Animated, View, StyleSheet, Platform, UIManager, LayoutAnimation} from 'react-native';
import {Button, Text} from "@rneui/themed";
import {Colors} from "../../styles";
import PropTypes from 'prop-types';


const MoviePlot = ({summary, forceClosePlot, setForceClosePlot}) => {
    const [plotLanguage, setPlotLanguage] = useState('english');
    const [showAll, setShowAll] = useState(false);

    const plot = showAll
        ? summary[plotLanguage]
        : summary[plotLanguage].slice(0, 250) + (summary[plotLanguage].length > 250 ? ' .....' : '');

    const plot_empty = plotLanguage === 'english'
        ? 'no summary available.'
        : 'خلاصه داستان موجود نیست.';

    useEffect(() => {
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);

    useEffect(() => {
        if (forceClosePlot && showAll) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setShowAll(false);
        }
    }, [forceClosePlot]);

    const _onPress = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShowAll((prevState => !prevState));
        forceClosePlot && setForceClosePlot(false);
    }

    const plotPadding = {
        paddingRight: plotLanguage === 'persian' ? 9 : 5,
    }

    const showAllButtonContainer = {
        marginTop: 0,
        marginLeft: -6,
        alignSelf: plotLanguage === 'english' ? 'flex-start' : 'flex-end',
    };

    return (
        <View style={style.container}>
            <Text style={style.section}>
                PLOT
            </Text>

            <View style={style.buttonGroup}>
                <Button
                    containerStyle={style.buttonContainer}
                    titleStyle={plotLanguage === 'english' ?
                        style.activeButtonTitle :
                        style.buttonTitle}
                    title={"English"}
                    type={"clear"}
                    onPress={() => setPlotLanguage('english')}
                />
                <Button
                    containerStyle={style.buttonContainer}
                    titleStyle={plotLanguage === 'persian' ?
                        style.activeButtonTitle :
                        style.buttonTitle}
                    title={"Persian"}
                    type={"clear"}
                    onPress={() => setPlotLanguage('persian')}
                />
            </View>

            <Animated.Text style={[style.plotText, plotPadding]}>
                {
                    summary[plotLanguage].length === 0
                        ? plot_empty
                        : plot
                }
            </Animated.Text>
            {
                summary[plotLanguage].length > 251 && <Button
                    containerStyle={showAllButtonContainer}
                    titleStyle={style.showAllButton}
                    title={showAll ? 'Show less' : 'Read more'}
                    type={"clear"}
                    onPress={_onPress}
                />
            }
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        width: '100%',
        paddingLeft: 10,
        zIndex: -1,
    },
    section: {
        fontSize: 24,
        color: Colors.SectionHeader,
    },
    buttonGroup: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    buttonContainer: {
        alignSelf: 'center',
        marginLeft: -4,
    },
    buttonTitle: {
        color: Colors.NAVBAR,
    },
    activeButtonTitle: {
        color: '#ffffff',
        fontSize: 18,
        marginLeft: -2,
    },
    plotText: {
        marginTop: 5,
        fontSize: 16,
        width: '100%',
        color: '#fff',
    },
    showAllButton: {
        fontSize: 14,
    }
});

MoviePlot.propTypes = {
    summary: PropTypes.object.isRequired,
}


export default MoviePlot;

