import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {AntDesign} from "@expo/vector-icons";
import PropTypes from 'prop-types';
import {Text} from "react-native-elements";
import {Typography} from "../../styles";


const TimeLinePaging = ({extraStyle, spacing, setSpacing}) => {

    const getDay = () => {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayNumber = new Date().getDay();
        if (spacing === todayNumber) {
            return daysOfWeek[spacing] + ' - Today';
        } else if (spacing === todayNumber + 1) {
            return daysOfWeek[spacing] + ' - Tomorrow';
        }
        return daysOfWeek[spacing];
    }

    return (
        <View style={[style.container, extraStyle]}>
            <TouchableOpacity
                style={style.leftIcon}
                onPress={() => setSpacing((spacing + 6) % 7)}
                activeOpacity={0.5}
            >
                <AntDesign
                    name="caretleft"
                    size={32}
                    color="red"
                />
            </TouchableOpacity>

            <Text style={style.title}>{getDay()}</Text>

            <TouchableOpacity
                style={style.rightIcon}
                onPress={() => setSpacing((spacing + 1) % 7)}
                activeOpacity={0.5}
            >
                <AntDesign
                    name="caretright"
                    size={32}
                    color="red"
                />
            </TouchableOpacity>
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 15,
        paddingBottom: 20,
    },
    title: {
        color: '#ffffff',
        fontSize: Typography.getFontSize(22),
        position: 'absolute',
        textAlign: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 2,
        zIndex: 1,
    },
    leftIcon: {
        left: 3,
        zIndex: 2,
    },
    rightIcon: {
        position: 'absolute',
        right: 3,
        zIndex: 2,
    }
});

TimeLinePaging.propTypes = {
    extraStyle: PropTypes.object,
    spacing: PropTypes.number.isRequired,
    setSpacing: PropTypes.func.isRequired,
}


export default TimeLinePaging;
