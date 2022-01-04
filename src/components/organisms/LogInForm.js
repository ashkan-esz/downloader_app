import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Text} from "react-native-elements";
import {CustomTextInput} from "../molecules";
import {useForm, Controller} from "react-hook-form";
import {Colors, Typography} from "../../styles";
import {useDispatch, useSelector} from "react-redux";
import {userLogin_api, resetAuthError} from "../../redux/slices/auth.slice";
import PropsTypes from 'prop-types';

const LogInForm = ({extraStyle}) => {
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.auth.isLoading);
    const error = useSelector(state => state.auth.authError);
    const {control, handleSubmit, watch, formState: {errors}} = useForm();
    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const _onPress = () => {
        handleSubmit((data) => {
                dispatch(userLogin_api(data));
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
                    emailInputRef.current.focus()
                }}
                name="username_email"
                defaultValue=""
                rules={{
                    required: {value: true, message: 'This is required'},
                    minLength: {value: 6, message: 'Too short'},
                    maxLength: {value: 50, message: 'Too long'},
                }}
                render={({field: {onChange, value}}) => (
                    <CustomTextInput
                        extraStyle={style.textInput}
                        value={value}
                        placeholder={'Username or Email'}
                        onChangeText={value => onChange(value)}
                        leftIconName={'email'}
                        inputRef={emailInputRef}
                        error={errors.username_email}
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
                    minLength: {value: 8, message: 'Too short'},
                    maxLength: {value: 50, message: 'Too long'},
                    validate: value => value !== watch("username_email") || 'Password cannot be equal with username',
                }}
                render={({field: {onChange, value}}) => (
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

            {
                !!error && <Text style={style.error}>
                    *{error}.
                </Text>
            }

            <Button
                containerStyle={style.createAccountContainer}
                titleStyle={style.titleStyle}
                buttonStyle={style.createAccount}
                title={'Login'}
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
        borderRadius: 25,
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

LogInForm.propTypes = {
    extraStyle: PropsTypes.object,
}

export default LogInForm;
