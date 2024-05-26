import React, {useEffect} from 'react';
import {View, StyleSheet, Platform, UIManager, LayoutAnimation} from 'react-native';
import {Button} from "@rneui/themed";
import {Colors, Typography} from "../../../styles";
import PropTypes from 'prop-types';


const FilterType = ({expanded, setExpanded, types, setTypes}) => {

    useEffect(() => {
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    }

    const buttonOpacity = {
        opacity: expanded ? 1 : 0.7
    }

    return (
        <View>
            <Button
                containerStyle={[style.buttonContainer, buttonOpacity]}
                titleStyle={style.buttonTitle}
                title={'Types'}
                type={"clear"}
                onPress={toggleExpand}
            />
            {
                expanded && <View style={style.typesContainer}>
                    <Button
                        containerStyle={[
                            style.typesButtonContainer,
                            types.length === 2 && style.selectedType
                        ]}
                        titleStyle={style.typesButtonTitle}
                        title={'Movie,Serial'}
                        type={"clear"}
                        onPress={() => setTypes(['movie', 'serial'])}
                    />
                    <Button
                        containerStyle={[
                            style.typesButtonContainer,
                            types.length === 1 && types[0] === 'serial' && style.selectedType
                        ]}
                        titleStyle={style.typesButtonTitle}
                        title={'Serial'}
                        type={"clear"}
                        onPress={() => setTypes(['serial'])}
                    />
                    <Button
                        containerStyle={[
                            style.typesButtonContainer,
                            types.length === 1 && types[0] === 'movie' && style.selectedType
                        ]}
                        titleStyle={style.typesButtonTitle}
                        title={'Movie'}
                        type={"clear"}
                        onPress={() => setTypes(['movie'])}
                    />
                </View>
            }
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
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: 'purple',
        borderRadius: 15,
    },
    buttonTitle: {
        fontSize: Typography.getFontSize(20),
        color: '#ffffff',
        height: '100%',
    },
    typesContainer: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 5,
    },
    typesButtonContainer: {
        backgroundColor: Colors.RED2,
        width: '32.5%',
        height: 35,
        justifyContent: 'center',
        opacity: 0.6
    },
    typesButtonTitle: {
        fontSize: Typography.getFontSize(18),
        color: '#ffffff',
        justifyContent: 'center',
    },
    selectedType: {
        opacity: 1
    }
});

FilterType.propTypes = {
    expanded: PropTypes.bool.isRequired,
    setExpanded: PropTypes.func.isRequired,
    types: PropTypes.array.isRequired,
    setTypes: PropTypes.func.isRequired,
}


export default FilterType;
