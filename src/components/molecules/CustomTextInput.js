import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Input, Text} from "@rneui/themed";
import {Colors, Mixins} from "../../styles";
import PropsTypes from "prop-types";
import {Entypo, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";


const CustomTextInput = ({
                             value,
                             placeholder,
                             extraStyle,
                             leftIconName,
                             iconType,
                             onChangeText,
                             inputRef,
                             error,
                             secure
                         }) => {


    const [hidden, setHidden] = useState(secure || false);

    const inputPadding = {
        paddingLeft: leftIconName ? 5 : 25,
    };

    const LeftIcon = () => {
        let iconProps = {
            name: leftIconName,
            size: 30,
            color: 'black',
            style: style.leftIcon,
            testID: 'left-icon',
        };
        return iconType === 'entypo'
            ? <Entypo {...iconProps} />
            : <MaterialIcons  {...iconProps} />
    }

    return (
        <View>
            <Input
                containerStyle={[style.container, extraStyle]}
                inputContainerStyle={style.inputContainer}
                inputStyle={[style.input, inputPadding]}
                placeholder={placeholder}
                leftIcon={<LeftIcon/>}
                rightIcon={
                    secure &&
                    <MaterialCommunityIcons
                        name={hidden ? 'eye' : 'eye-off'}
                        size={30}
                        color={'black'}
                        style={style.rightIcon}
                        onPress={() => setHidden(!hidden)}
                        testID={'right-icon'}
                    />
                }

                value={value}
                onChangeText={onChangeText}
                ref={inputRef}
                secureTextEntry={hidden}
                keyboardAppearance={'dark'}
                testID={placeholder.toLowerCase() + '-input'}
            />
            {error &&
                <Text
                    style={style.error}
                    testID={placeholder.toLowerCase() + '-error'}>
                    *{error.message}.
                </Text>}
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        height: 50,
        ...Mixins.padding(0)
    },
    inputContainer: {
        backgroundColor: Colors.SECONDARY,
        borderRadius: 25,
        borderBottomWidth: 0,
        height: '100%',
    },
    input: {
        color: '#ffffff',
    },
    leftIcon: {
        paddingLeft: 10,
    },
    rightIcon: {
        paddingRight: 5,
        opacity: 0.5
    },
    error: {
        color: 'red',
        marginTop: 5,
        paddingLeft: 20
    }
});

CustomTextInput.propTypes = {
    value: PropsTypes.string.isRequired,
    extraStyle: PropsTypes.object,
    placeholder: PropsTypes.string.isRequired,
    leftIconName: PropsTypes.string,
    iconType: PropsTypes.string,
    onChangeText: PropsTypes.func.isRequired,
    inputRef: PropsTypes.object,
    error: PropsTypes.object,
    secure: PropsTypes.bool
}

export default CustomTextInput;
