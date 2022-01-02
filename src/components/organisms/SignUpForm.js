import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Text} from "react-native-elements";
import {CustomTextInput} from "../molecules";
import {useForm, Controller} from "react-hook-form";
import {Colors, Typography} from '../../styles';
import {useDispatch, useSelector} from "react-redux";
import {userSignup_api, resetAuthError} from "../../redux/slices/auth.slice";
import PropsTypes from "prop-types";

const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/;

const SignUpForm = ({extraStyle}) => {
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.auth.isLoading);
    const error = useSelector(state => state.auth.authError);
    const {control, handleSubmit, watch, formState: {errors}} = useForm();
    const userNameInputRef = useRef();
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const confirmPasswordInputRef = useRef();

    const _onPress = () => {
        handleSubmit((data) => {
                dispatch(userSignup_api(data));
            }
        )();
    }

    React.useEffect(() => {
        const subscription = watch((value, {name, type}) => {
            dispatch(resetAuthError());
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    return (
        <View style={extraStyle}>
            <Controller
                control={control}
                onFocus={() => {
                    userNameInputRef.current.focus()
                }}
                name="username"
                defaultValue=""
                rules={{
                    required: {value: true, message: 'This is required'},
                    minLength: {value: 6, message: 'Too short'},
                    maxLength: {value: 50, message: 'Too long'},
                    validate: (value) => !!value.toString().match(/^[a-z|0-9_]+$/g) || 'Only a-z, 0-9, and underscores are allowed',
                }}
                render={({field: {onChange, value}}) => (
                    <CustomTextInput
                        extraStyle={style.textInput}
                        value={value}
                        placeholder={'User Name'}
                        onChangeText={value => onChange(value)}
                        inputRef={userNameInputRef}
                        leftIconName={'user'}
                        iconType={'entypo'}
                        error={errors.username}
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
                    maxLength: {value: 50, message: 'Too long'},
                    pattern: {value: emailRegex, message: 'Invalid Email'}
                }}
                render={({field: {onChange, value}}) => (
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
                    minLength: {value: 8, message: 'Too short'},
                    maxLength: {value: 50, message: 'Too long'},
                    validate: {
                        v1: (value) => value !== watch("username") || 'Password cannot be equal with username',
                        v2: (value) => value.toString().match(/[0-9]/) !== null || 'Password must contain a number',
                        v3: (value) => value.toString().match(/[A-Z]/) !== null || 'Password must contain an uppercase',
                    }
                }}
                render={({field: {onChange, value}}) => (
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
                    validate: value => value === watch("password") || 'Password dont match',
                }}
                render={({field: {onChange, value}}) => (
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

            {
                !!error && <Text style={style.error}>
                    *{error}.
                </Text>
            }

            <Button
                containerStyle={style.createAccountContainer}
                titleStyle={style.titleStyle}
                buttonStyle={style.createAccount}
                title={'Create Account'}
                loading={isLoading}
                loadingProps={{
                    size: "large",
                    animating: true,
                }}
                onPress={_onPress}
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
    },
    error: {
        color: 'red',
        marginTop: 10,
        paddingLeft: 20
    }
});

SignUpForm.propTypes = {
    extraStyle: PropsTypes.object,
}

export default SignUpForm;
