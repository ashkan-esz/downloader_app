import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from "@rneui/themed";
import {Colors, Typography} from "../../../../styles";
import PropTypes from 'prop-types';


const SectionNavBar = ({extraStyle, sections, sectionNames, tab, changedTab, onTabChange}) => {
    return (
        <View style={[style.container, extraStyle]}>
            {sectionNames.map((value) => (
                <Button
                    containerStyle={style.buttonContainer}
                    titleStyle={(changedTab || tab) === sections[sectionNames.indexOf(value)] ?
                        style.activeButtonTitle :
                        style.buttonTitle}
                    title={value.charAt(0).toUpperCase() + value.slice(1)}
                    type={"clear"}
                    key={value}
                    onPress={() => onTabChange(sections[sectionNames.indexOf(value)])}
                />
            ))}
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        marginTop: 5,
    },
    buttonContainer: {
        alignSelf: 'center',
        marginLeft: -4,
    },
    buttonTitle: {
        color: Colors.NAVBAR,
        fontSize: Typography.getFontSize(16),
    },
    activeButtonTitle: {
        color: '#ffffff',
        fontSize: Typography.getFontSize(18),
        marginLeft: -2,
    }
});

SectionNavBar.propTypes = {
    extraStyle: PropTypes.object,
    sections: PropTypes.array.isRequired,
    sectionNames: PropTypes.array.isRequired,
    tab: PropTypes.string.isRequired,
    changedTab: PropTypes.string,
    onTabChange: PropTypes.func.isRequired
};


export default SectionNavBar;

