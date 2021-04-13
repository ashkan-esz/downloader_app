import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from "react-native-elements";
import {CustomTextInput} from "../molecules";
import {useForm, Controller} from "react-hook-form";
import {homeStackHelpers} from "../../helper";
import {Colors, Typography} from "../../styles";
import PropsTypes from 'prop-types';


const LogInForm = ({extraStyle, onSubmit}) => {
    const {control, handleSubmit, errors} = useForm();
    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    return (
        <View style={extraStyle}>
            <Controller
                control={control}
                onFocus={() => {
                    emailInputRef.current.focus()
                }}
                name="email"
                defaultValue=""
                rules={{
                    required: {value: true, message: 'This is required'},
                    maxLength: {value: 50, message: 'Too Long'},
                    pattern: {value: homeStackHelpers.emailRegex, message: 'Invalid Email'}
                }}
                render={({onChange, value}) => (
                    <CustomTextInput
                        extraStyle={style.textInput}
                        value={value}
                        placeholder={'Email'}
                        onChangeText={value => onChange(value)}
                        leftIconName={'email'}
                        inputRef={emailInputRef}
                        error={errors.email}
                    />
                )}
            />

            <Controller
                control={control}
                onFocus={() => {
                    passwordInputRef.current.focus()
                }}
                name="password"
                defaultValue=""
                rules={{
                    required: {value: true, message: 'This is required'},
                    minLength: {value: 7, message: 'Too Short'},
                    maxLength: {value: 50, message: 'Too Long'},
                }}
                render={({onChange, value}) => (
                    <CustomTextInput
                        extraStyle={style.textInput}
                        value={value}
                        placeholder={'Password'}
                        onChangeText={value => onChange(value)}
                        leftIconName={'lock'}
                        inputRef={passwordInputRef}
                        error={errors.password}
                        secure
                    />
                )}
            />

            <Button
                containerStyle={style.createAccountContainer}
                titleStyle={style.titleStyle}
                buttonStyle={style.createAccount}
                title={'Login'}
                // disabled={} //todo : should be disable while validation and api call
                onPress={handleSubmit(onSubmit)} //todo : async
            />
        </View>
    );
};

const style = StyleSheet.create({
    textInput: {
        marginTop: 13
    },
    createAccountContainer: {
        marginTop: 15,
    },
    createAccount: {
        backgroundColor: Colors.RED,
        borderRadius: 25,
        height: 50,
    },
    titleStyle: {
        fontSize: Typography.getFontSize(20)
    }
});

LogInForm.propTypes = {
    extraStyle: PropsTypes.object,
    onSubmit: PropsTypes.func.isRequired
}

export default LogInForm;
