import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Platform, UIManager, LayoutAnimation} from 'react-native';
import PropTypes from 'prop-types';
import {Button} from "react-native-elements";
import {Colors, Typography} from "../../styles";


const SelectTypeCollapsible = ({filters, setTypes}) => {
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    }

    const onSelectType = (types) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setTypes(types);
        setExpanded(false);
    }

    return (
        <View>
            <Button
                containerStyle={style.buttonContainer}
                titleStyle={style.buttonTitle}
                title={'Types'}
                type={"clear"}
                onPress={toggleExpand}
            />
            {
                expanded && <View>
                    <Button
                        containerStyle={[
                            style.typesContainer,
                            filters.types.length === 2 && style.selectedType
                        ]}
                        titleStyle={style.buttonTitle}
                        title={'Movie,Serial'}
                        type={"clear"}
                        onPress={() => onSelectType(['movie', 'serial'])}
                    />
                    <Button
                        containerStyle={[
                            style.typesContainer,
                            style.marginTop,
                            filters.types.length === 1 && filters.types[0] === 'serial' && style.selectedType
                        ]}
                        titleStyle={style.buttonTitle}
                        title={'Serial'}
                        type={"clear"}
                        onPress={() => onSelectType(['serial'])}
                    />
                    <Button
                        containerStyle={[
                            style.typesContainer,
                            style.marginTop,
                            filters.types.length === 1 && filters.types[0] === 'movie' && style.selectedType
                        ]}
                        titleStyle={style.buttonTitle}
                        title={'Movie'}
                        type={"clear"}
                        onPress={() => onSelectType(['movie'])}
                    />
                </View>
            }
        </View>
    );
};

const style = StyleSheet.create({
    buttonContainer: {
        alignSelf: 'flex-start',
        justifyContent: 'center',
        flex: 1,
        height: 35,
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: 'red',
        width: '30%',
    },
    buttonTitle: {
        color: '#ffffff',
        fontSize: Typography.getFontSize(16)
    },
    typesContainer: {
        backgroundColor: Colors.RED,
        width: '30%',
        opacity: 0.6
    },
    marginTop: {
        marginTop: 5,
    },
    selectedType: {
        opacity: 1
    }
});

SelectTypeCollapsible.propTypes = {
    filters: PropTypes.object.isRequired,
    setTypes: PropTypes.func.isRequired,
}


export default SelectTypeCollapsible;
