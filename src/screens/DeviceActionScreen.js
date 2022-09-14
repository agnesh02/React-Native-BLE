import React from "react";
import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native"
import base64 from 'react-native-base64'
import { _BleManager, connectDevice } from '../components/BleManager';
import Toaster from "../components/Toaster";

const DeviceaActionScreen = function ({ route }) {

    const { data, deviceId, deviceName } = route.params

    const readData = async function () {
        try {
            console.log("Reading characteristics from '00002a00-0000-1000-8000-00805f9b34fb' of '00001800-0000-1000-8000-00805f9b34fb' ")
            const readChar = await data.readCharacteristicForService("00001800-0000-1000-8000-00805f9b34fb", '00002a00-0000-1000-8000-00805f9b34fb')
            console.log("success")
            const encodedSample = readChar.value
            console.log("Decoding read value")
            const decodedSample = base64.decode(encodedSample)
            console.log(decodedSample)
        }
        catch (e) {
            console.log(e.message)
            Toaster(e.message)
        }
    }

    const reconnect = async function(){
        const connection = await connectDevice(deviceId) 
        if(connection != "Connection error")
            Toaster("Reconnected with the device successfully")  
    }

    return (
        <View style={styling.header}>
            <View style={styling.avatarOutline} >
                <Image style={styling.avatar} source={require('../../assets/ble_connected.png')} />
            </View>

            <ScrollView style={{ marginTop: 180 }}>
                <View style={styling.body}>
                    <View style={styling.bodyContent}>
                        <Text style={styling.name}>{deviceId}</Text>
                        <Text style={styling.info}>{deviceName}</Text>

                        <View style={styling.buttonContainer}>
                            <TouchableOpacity style={styling.button} onPress={() => { readData() }}>
                                <Text style={styling.buttonText}>Read data</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styling.button} onPress={() => { }} >
                                <Text style={styling.buttonText}>Write data</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styling.button} onPress={() => { }} >
                                <Text style={styling.buttonText}>Notify</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styling.button2} onPress={() => { reconnect() }} >
                                <Text style={styling.buttonText}>Reconnect</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

        </View>
    )
}

const styling = StyleSheet.create({
    header: {
        flex: 1,
        backgroundColor: "white"
    },
    avatarOutline: {
        width: 120,
        height: 120,
        borderRadius: 73,
        borderWidth: 4,
        borderColor: "#19d219",
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 30,
        padding: 65
    },
    avatar: {
        width: 120,
        height: 120,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 5
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center'
    },
    name: {
        fontSize: 23,
        color: "black",
        fontWeight: "900"
    },
    info: {
        fontSize: 19,
        color: "black",
        marginTop: 5
    },
    buttonContainer: {
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 51,
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 8,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10
    },
    button2: {
        backgroundColor: 'green',
        width: '100%',
        padding: 8,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 80
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    }
})

export default DeviceaActionScreen