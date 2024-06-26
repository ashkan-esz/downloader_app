import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Divider, ListItem, Text} from "@rneui/themed";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import {MyOverlay} from "../atoms";
import {Colors} from "../../styles";
import PropTypes from 'prop-types';


const DeviceSession = ({session, isLoggingOut, noActiveSession, isFirst, isLast, onRemove, isCurrentDevice}) => {
    const [overlay, setOverlay] = useState(false);

    const borderRadius = {
        borderTopLeftRadius: isFirst ? 15 : 0,
        borderTopRightRadius: isFirst ? 15 : 0,
        borderBottomLeftRadius: isLast ? 15 : 0,
        borderBottomRightRadius: isLast ? 15 : 0,
        paddingBottom: isCurrentDevice ? 55 : isLast ? 15 : 0,
    }

    const rightIconOpacity = {
        opacity: isLoggingOut ? 0.2 : 0.6,
    }

    const terminateIconOpacity = {
        opacity: noActiveSession ? 0.4 : 1,
    }

    const overlayMessage = isCurrentDevice
        ? 'Are you sure you want to terminate all other session?'
        : 'Are you sure you want to terminate this session?';

    const getIconName = () => {
        let os = session.DeviceOs.toLowerCase();
        if (os === 'ios') {
            return 'apple';
        }
        // if (os === 'android'){
        //     return "android";
        // }
        if (os === 'android' || os === 'desktop' || os === 'linux' || os === 'ubuntu') {
            return os;
        }
        return 'question';
    }

    const _onRemove = () => {
        if (isCurrentDevice) {
            onRemove('all');
        } else {
            onRemove(session.DeviceId);
        }
    }

    return (
        <ListItem
            containerStyle={[style.container, borderRadius]}
            disabled={isLoggingOut}
        >
            <View style={style.icon}>
                <FontAwesome5
                    name={getIconName()}
                    size={32}
                    color={Colors.RED}
                />
            </View>

            <ListItem.Content>
                <ListItem.Title style={style.title}>
                    {session.DeviceModel}
                </ListItem.Title>
                <ListItem.Subtitle style={style.subtitle}>
                    {session.AppName + ' ' + session.AppVersion}
                </ListItem.Subtitle>
                <ListItem.Subtitle style={style.subtitle2}>
                    {(session.IpLocation || 'unknown location') + ' ' + session.LastUseDate.split('T')[0]}
                </ListItem.Subtitle>

                {
                    (!isLast || isCurrentDevice) && <Divider
                        orientation={"horizontal"}
                        color={Colors.NAVBAR}
                        style={style.divider}
                    />
                }

            </ListItem.Content>

            {
                isCurrentDevice && <View
                    style={style.terminationContainer}
                >
                    <Ionicons
                        name={"hand-left-outline"}
                        size={34}
                        color={'red'}
                        style={[style.terminationIcon, terminateIconOpacity]}
                        disabled={isLoggingOut || noActiveSession}
                        onPress={() => {
                            setOverlay(true);
                        }}
                    />

                    <Text
                        disabled={noActiveSession}
                        onPress={() => {
                            setOverlay(true);
                        }}
                        style={[style.terminationText, terminateIconOpacity]}
                    >
                        Terminate all other sessions
                    </Text>

                </View>
            }

            {
                !isCurrentDevice && <AntDesign
                    name={'close'}
                    size={22}
                    color={Colors.GRAY_DARK}
                    style={[style.rightIcon, rightIconOpacity]}
                    disabled={isLoggingOut}
                    onPress={() => {
                        setOverlay(true);
                    }}
                />
            }

            <MyOverlay
                overlay={overlay}
                setOverlay={setOverlay}
                message={overlayMessage}
                leftOption={'CANCEL'}
                rightOption={'TERMINATE'}
                isLoading={isLoggingOut}
                onRightClick={_onRemove}
            />

        </ListItem>
    );
};

const style = StyleSheet.create({
    container: {
        backgroundColor: Colors.SECONDARY,
        paddingTop: 12,
        paddingBottom: 0,
    },
    icon: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        width: 54,
        height: 54,
        backgroundColor: Colors.PRIMARY,
    },
    rightIcon: {
        position: 'absolute',
        right: 10,
        top: 15,
    },
    title: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    subtitle: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
        marginTop: 3,
    },
    subtitle2: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.4,
        marginTop: 3,
        width: '100%',
    },
    divider: {
        zIndex: 10,
        opacity: 0.9,
        color: Colors.NAVBAR,
        backgroundColor: Colors.NAVBAR,
        width: '200%',
        height: 0.6,
        marginTop: 10,
    },
    terminationContainer: {
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 15,
    },
    terminationIcon: {
        paddingLeft: 30,
    },
    terminationText: {
        fontSize: 18,
        color: 'red',
        marginLeft: 20,
        marginTop: 10,
    }
});

DeviceSession.propTypes = {
    session: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired,
    noActiveSession: PropTypes.bool,
    isLoggingOut: PropTypes.bool.isRequired,
    isFirst: PropTypes.bool,
    isLast: PropTypes.bool,
    isCurrentDevice: PropTypes.bool,
}


export default DeviceSession;
