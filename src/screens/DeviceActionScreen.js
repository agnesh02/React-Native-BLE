import React from "react";
import {Text, View, TouchableOpacity, StyleSheet} from "react-native"

const DeviceaActionScreen = function({navigation}){
    return(
        <View>
            <TouchableOpacity onPress={ ()=> {navigation.navigate("List Devices")} }>
                <Text>This is Device Action Screen. Go to device list screen</Text>
            </TouchableOpacity>
        </View>
    )
}

const styling = StyleSheet.create({

})

export default DeviceaActionScreen