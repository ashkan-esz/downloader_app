import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from "react-native-elements";
import {CustomTextInput} from "../molecules";
import {useForm, Controller} from "react-hook-form";
const passwordStrength = require('check-password-strength');
import {emailRegex} from "../../utils";
import {Colors, Typography} from '../../styles';
import PropsTypes from "prop-types";


const SignUpForm = ({extraStyle, onSubmit}) => {
    const style = StyleSheet.create({
        container: {
            ...extraStyle
        },
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

    const {control, handleSubmit, watch, errors} = useForm();
    const userNameInputRef = useRef();
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const confirmPasswordInputRef = useRef();

    return (
        <View style={style.container}>
            <Controller
                control={control}
                onFocus={() => {
                    userNameInputRef.current.focus()
                }}
                name="userName"
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
                        placeholder={'User Name'}
                        onChangeText={value => onChange(value)}
                        inputRef={userNameInputRef}
                        leftIconName={'user'}
                        iconType={'entypo'}
                        error={errors.userName}
                    />
                )}
            />


            <Controller
                control={control}
                onFocus={() => {
                    emailInputRef.current.focus();
                }}
                name="email"
                defaultValue=""
                rules={{
                    required: {value: true, message: 'This is required'},
                    maxLength: {value: 50, message: 'Too Long'},
                    pattern: {value: emailRegex, message: 'Invalid Email'}
                }}
                render={({onChange, value}) => (
                    <CustomTextInput
                        extraStyle={style.textInput}
                        value={value}
                        placeholder={'Email'}
                        onChangeText={value => onChange(value)}
                        inputRef={emailInputRef}
                        leftIconName={'email'}
                        error={errors.email}
                    />
                )}
            />


            <Controller
                control={control}
                onFocus={() => {
                    passwordInputRef.current.focus();
                }}
                name="password"
                defaultValue=""
                rules={{
                    required: {value: true, message: 'This is required'},
                    minLength: {value: 7, message: 'Too Short'},
                    maxLength: {value: 50, message: 'Too Long'},
                    validate: (value) => (
                        passwordStrength(value).value === 'Medium' ||
                        passwordStrength(value).value === 'Strong') ||
                        'Weak'
                }}
                render={({onChange, value}) => (
                    <CustomTextInput
                        extraStyle={style.textInput}
                        value={value}
                        placeholder={'Password'}
                        onChangeText={value => onChange(value)}
                        inputRef={passwordInputRef}
                        leftIconName={'lock'}
                        error={errors.password}
                        secure
                    />
                )}
            />


            <Controller
                control={control}
                onFocus={() => {
                    confirmPasswordInputRef.current.focus();
                }}
                name="confirmPassword"
                defaultValue=""
                rules={{
                    required: {value: true, message: 'This is required'},
                    validate: value => value === watch("password") || 'password dont match'
                }}
                render={({onChange, value}) => (
                    <CustomTextInput
                        extraStyle={style.textInput}
                        value={value}
                        placeholder={'Confirm Password'}
                        onChangeText={value => onChange(value)}
                        inputRef={confirmPasswordInputRef}
                        leftIconName={'lock'}
                        error={errors.confirmPassword}
                        secure
                    />
                )}
            />

            <Button
                containerStyle={style.createAccountContainer}
                titleStyle={style.titleStyle}
                buttonStyle={style.createAccount}
                title={'Create Account'}
                // disabled={} //todo : should be disable while validation and api call
                onPress={handleSubmit(onSubmit)} //todo : async
            />
        </View>
    );
};

SignUpForm.propTypes = {
    extraStyle: PropsTypes.object,
    onSubmit: PropsTypes.func
}

export default SignUpForm;
