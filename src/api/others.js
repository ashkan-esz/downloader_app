import API from "./index";
import DeviceInfo from 'react-native-device-info';

export const checkUpdateExist = async () => {
    try {
        let deviceAndApp = {
            appName: DeviceInfo.getApplicationName(),
            appVersion: DeviceInfo.getVersion(),
            os: DeviceInfo.getSystemName().replace('iPhone OS', 'iOS').toLowerCase(),
        }

        //handle abi split versions
        let deviceSupportedAbis = await DeviceInfo.supportedAbis();
        let supportedAbis = ["arm64-v8a", "armeabi-v7a", "x86"].filter(abi => deviceSupportedAbis.includes(abi));
        for (let i = 0; i < supportedAbis.length; i++) {
            try {
                let appName = deviceAndApp.appName + '_' + supportedAbis[i];
                let response = await API.get(`/utils/checkAppUpdate/${appName}/${deviceAndApp.os}/${deviceAndApp.appVersion}`);
                let data = response.data.data;
                if (data?.hasUpdate || data?.minVersion) {
                    return data;
                }
            } catch (error2) {

            }
        }

        let response = await API.get(`/utils/checkAppUpdate/${deviceAndApp.appName}/${deviceAndApp.os}/${deviceAndApp.appVersion}`);
        return response.data.data;
    } catch (error) {
        return null;
    }
}

export const getServerMessage = async () => {
    try {
        let response = await API.get('/utils/getMessage');
        return response.data.data;
    } catch (error) {
       return null;
    }
}
