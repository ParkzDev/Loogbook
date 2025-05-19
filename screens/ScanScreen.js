import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { Alert, Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, Text } from 'react-native'

export default function ScanScreen() {
    const [permission, requestPermission] = useCameraPermissions()
    const isPermissionGranted = Boolean(permission?.granted)
    const [scanned, setScanned] = useState(false)
    const isFocused = useIsFocused()
    const navigation = useNavigation()

    if (isPermissionGranted === null) {
        return (
            <SafeAreaView style={style.container}>
                <Pressable style={[style.btn]} onPress={requestPermission}>
                    <Text>Se requieren permisos de camara</Text>
                </Pressable>
            </SafeAreaView>
        )
    }

    if (isPermissionGranted === false) {
        return (
            <SafeAreaView style={style.container}>
                <Pressable style={[style.btn]} onPress={requestPermission}>
                    <Text>No se otorgaron permisos de camara</Text>
                </Pressable>
            </SafeAreaView>
        )
    }

    const handleBarCodeScanned = async (data) => {
        setScanned(true)
        try {
            await AsyncStorage.setItem('LastCodebar', JSON.stringify({ numpla: data }))
            Alert.alert('Codigo Detectado', `El codigo ${data} se guardo correctamente, puede proceder con el llenado del formulario`,
                [{
                    text: 'Ok',
                    onPress: () => {
                        navigation.navigate('Form')
                    }
                }],)
        } catch (e) {
            alert(`A ocurrido un error al guardar el codigo ${data}`)
        }
    }

    const newScan = async () => {
        await AsyncStorage.removeItem('LastCodebar')
        setScanned(false)
    }

    return (
        <SafeAreaView style={style.container}>
            {Platform.OS === "android" ? <StatusBar hidden /> : null}
            {!scanned && isPermissionGranted && isFocused && (
                <CameraView
                    style={style.camStyle}
                    facing="back"
                    barcodeScannerSettings={
                        {
                            barcodeTypes: ['code128']
                        }
                    }
                    onBarcodeScanned={
                        ({ data }) => {
                            handleBarCodeScanned(data)
                        }
                    }
                />
            )}
            {scanned &&
                <SafeAreaView style={style.container}>
                    <Pressable onPress={newScan} style={style.btn}>
                        <Text style={style.text}>Escanear</Text>
                    </Pressable>
                </SafeAreaView>
            }
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CFDBD5',
        alignItems: 'center',
        justifyContent: 'center',
        rowGap: 20,
    },
    camStyle: {
        position: 'absolute',
        width: 250,
        height: 600
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500'
    },
    btn: {
        width: 250,
        height: 80,
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5CB5C",
        borderRadius: 15
    }
})