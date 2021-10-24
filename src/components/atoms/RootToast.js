import React from 'react';
import Toast, {BaseToast} from 'react-native-toast-message';


const RootToast = () => {
    const toastConfig = {
        linkToClipboard: ({text1, props, ...rest}) => (
            <BaseToast
                {...rest}
                style={{
                    borderLeftColor: 'red',
                    height: 40,
                    marginBottom: -20,
                }}
                leadingIconStyle={{
                    width: 30,
                    height: 30,
                }}
                text1Style={{
                    fontSize: 15,
                    fontWeight: 'normal',
                }}
                text1={text1}
                leadingIcon={require('../../assets/icons/link.png')}
                trailingIcon={null}
            />
        ),
    };

    return (
        <Toast
            ref={(ref) => Toast.setRef(ref)}
            config={toastConfig}
        />
    );
};


export default RootToast;
