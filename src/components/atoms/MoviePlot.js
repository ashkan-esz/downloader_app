import React, {useState, useEffect} from 'react';
import {Animated, View, StyleSheet, Platform, UIManager, LayoutAnimation} from 'react-native';
import PropTypes from 'prop-types';
import {Button, Text} from "react-native-elements";
import {Colors, Typography} from "../../styles";


const MoviePlot = ({summary}) => {
    const [plotLanguage, setPlotLanguage] = useState('english');
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);

    const _onPress = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShowAll((prevState => !prevState));
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
                        ? plotLanguage === 'english'
                            ? 'no summary available.'
                            : 'خلاصه داستان موجود نیست.'
                        : showAll
                            ? summary[plotLanguage]
                            : summary[plotLanguage].slice(0, 250) + '.....'
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
        fontSize: Typography.getFontSize(24),
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
        fontSize: Typography.getFontSize(22),
        marginLeft: -2,
    },
    plotText: {
        marginTop: 5,
        fontSize: Typography.getFontSize(16),
        width: '100%',
        color: '#fff',
    },
    showAllButton: {
        fontSize: Typography.getFontSize(16),
    }
});

MoviePlot.propTypes = {
    summary: PropTypes.object.isRequired,
}


export default MoviePlot;

