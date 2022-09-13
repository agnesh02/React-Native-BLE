import React, { useEffect, useState } from 'react';
import { TouchableOpacity, PermissionsAndroid, View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Toaster from '../../Toaster';
import { BleManager, Device } from 'react-native-ble-plx';

const _BleManager = new BleManager();

const ListBleDevicesScreen = function App() {

    const [buttonTextState, setButtonTextState] = useState('Start Scanning')
    const [deviceList, setDeviceList] = useState([])
    const [isScanning, setIsScanning] = useState(false)

    const requestLocationPermission = async function () {

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Permission Localisation Bluetooth',
                message: 'Requirement for Bluetooth',
                buttonNeutral: 'Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Permission Granted. Try scanning again");
        } else {
            console.log("Permission denied");
        }
    }

    const checkScanState = async () => {

        if (buttonTextState === 'Start Scanning') {
            setIsScanning(true)
            startScan()
            console.log("Scanning started")
            setButtonTextState("Stop Scanning")
        }
        else {
            _BleManager.stopDeviceScan()
            setIsScanning(false)
            console.log("Scanning Stopped")
            setButtonTextState("Start Scanning")
        }
    }

    const startScan = async function () {
        deviceList.length = 0
        _BleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error.message)
                if (error.message === "Device is not authorized to use BluetoothLE")
                    requestLocationPermission()
                return
            }

            let deviceInfo = { deviceId: device.id, deviceName: device.name }
            let checkIfAlreadyListed = deviceList
                .map(item => item.deviceId)
                .includes(device.id)

            if (!checkIfAlreadyListed) {
                deviceList.push(deviceInfo)
                setDeviceList(deviceList)
                console.log(deviceList)
            }
        });
    }

    const connectDevice = async function (deviceId) {

        _BleManager.connectToDevice(deviceId, null)
            .then(async (device) => {

                const dev = await _BleManager.discoverAllServicesAndCharacteristicsForDevice(device.id,)
                console.log('isConnected', await dev.isConnected());
                const services = await dev.services();
                console.log('services', services);
                const readableCharacteristics = await dev.characteristicsForService('00001801-0000-1000-8000-00805f9b34fb')
                console.log('readable chars', readableCharacteristics);

                // const readableCharacteristics2 = await dev.characteristicsForService('00001800-0000-1000-8000-00805f9b34fb')
                // console.log('readable chars2', readableCharacteristics2);
                // const readableCharacteristics3 = await dev.characteristicsForService('0000f618-0000-1000-8000-00805f9b34fb')
                // console.log('readable chars3', readableCharacteristics3);

                const readChar = await dev.readCharacteristicForService("00001800-0000-1000-8000-00805f9b34fb", '00002a00-0000-1000-8000-00805f9b34fb')
                console.log(readChar)
            })
            .catch((error) => {
                console.log(error)
            });
    }


    return (
        <View style={styling.container}>
            <View style={styling.buttonContainer}>
                <TouchableOpacity style={styling.button} onPress={() => { checkScanState() }}>
                    <Text style={styling.buttonText}>{buttonTextState}</Text>
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }} >
                <FlatList
                    data={deviceList}
                    keyExtractor={(item) => {
                        return item.deviceId;
                    }}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity>
                                <View style={styling.row}>
                                    <View>
                                        <TouchableOpacity style={styling.nameContainer} onPress={() => connectDevice(item.deviceId)}>
                                            <Text style={styling.nameTxt}>{item.deviceId}</Text>
                                            <Text style={styling.mblTxt}>Mobile</Text>
                                        </TouchableOpacity>
                                        <View style={styling.msgContainer}>
                                            <Text style={styling.msgTxt}>{item.deviceName}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }} />
            </View>

            {isScanning ? <ActivityIndicator style={styling.pBar} size="large" /> : null}

        </View>
    );
}

const styling = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    buttonContainer: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 10,
        borderRadius: 13,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#DCDCDC',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        padding: 10,
    },
    pic: {
        borderRadius: 30,
        width: 60,
        height: 60,
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 280,
    },
    nameTxt: {
        marginLeft: 15,
        fontWeight: '600',
        color: '#222',
        fontSize: 18,
        width: 170,
    },
    mblTxt: {
        fontWeight: '200',
        color: '#777',
        fontSize: 13,
    },
    msgContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    msgTxt: {
        fontWeight: '400',
        color: '#008B8B',
        fontSize: 12,
        marginLeft: 15,
    },
    pBar: {
        borderColor: "black",
        position: "absolute",
        top: 300
    }
});

export default ListBleDevicesScreen