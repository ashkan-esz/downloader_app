import React, {useEffect} from 'react';
import {View, StyleSheet, Platform, UIManager, LayoutAnimation} from 'react-native';
import {Button} from "react-native-elements";
import {SelectTypeCollapsible} from "../atoms";
import {Typography} from "../../styles";
import PropTypes from 'prop-types';


const FilterBox = ({expanded, setExpanded, filters, setFilters}) => {

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
        opacity: expanded ? 1 : 0.5
    }

    const _setTypes = (types) => {
        let temp = {...filters, types};
        setFilters(temp);
    }

    return (
        <View>
            <Button
                containerStyle={[style.buttonContainer, buttonOpacity]}
                titleStyle={style.buttonTitle}
                title={'Filter'}
                type={"clear"}
                onPress={toggleExpand}
            />
            {
                expanded && <View>
                    <SelectTypeCollapsible filters={filters} setTypes={_setTypes}/>
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
        backgroundColor: 'purple'
    },
    buttonTitle: {
        color: '#ffffff',
        fontSize: Typography.getFontSize(20)
    },
    expandedContainer:{
        flex: 1,
        flexDirection: 'row',
        width: '100%',
    }
});

FilterBox.propTypes = {
    expanded: PropTypes.bool.isRequired,
    setExpanded: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
}


export default FilterBox;
