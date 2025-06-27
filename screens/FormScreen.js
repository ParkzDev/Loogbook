import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, Platform } from 'react-native';

export default function Explorer() {
    const [numpla, setNumpla] = useState('')
    const [nomveh, setNomveh] = useState('')
    const [nomopr, setNomopr] = useState('')
    const [kmveh, setKmveh] = useState('')
    const [obsreg, setObsreg] = useState('')
    const isFocused = useIsFocused()

    const sendData = async () => {
        try {
            const storageData = await AsyncStorage.getItem('LastCodebar')
            if (storageData !== null && kmveh !== '') {
                const json = await JSON.parse(storageData)

                fetch('http://192.168.1.249:8001/api/v1/logboot/insertlogbook', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ cveveh: json.cveveh, fecreg: json.fecreg.trim(), kmveh: kmveh, obsreg: obsreg }),
                })
                .then(async res => {
                    const data = await res.json()
                    if (res.status !== 201) {
                        Alert.alert('Error al Registrar Movimiento', data.message)
                    } else {
                        Alert.alert('Movimiento Registrado', data.message)
                        await AsyncStorage.removeItem('LastCodebar')
                        setNumpla('')
                        setNomveh('')
                        setNomopr('')
                        setKmveh('')
                        setObsreg('')
                    }
                })
            } else {
                Alert.alert('Datos incompletos', 'Se esta intentando enviar la información, pero falta escanear el codigo de barras o escribir el kilometraje del vehiculo.')
            }
        } catch (err) {
            alert(err)
        }
    }

    const getDriverData = async () => {
        try {
            const storageData = await AsyncStorage.getItem('LastCodebar')
            if (storageData !== null) {
                const json = await JSON.parse(storageData)
                fetch('http://192.168.1.249:8001/api/v1/logboot/getdriverdata', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    body: JSON.stringify({ numpla: json.numpla.trim(), }),
                })
                .then(async res => {
                    const data = await res.json()
                    if (res.status !== 200) {
                        setNumpla('')
                        setNomveh('')
                        setNomopr('')
                        await AsyncStorage.removeItem('LastCodebar')
                        Alert.alert('Codigo invalido', `Tipo de respuesta: ${res.type} \nEstatus: ${res.status} \nRespuesta: ${data.message}`)
                    } else {
                        console.info(data)
                        setNumpla(data.numpla)
                        setNomveh(data.nomveh)
                        setNomopr(data.nomopr)
                        data.fecreg = new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit' })
                        await AsyncStorage.setItem('LastCodebar', JSON.stringify(data))
                    }
                })     
            } else {
                setNumpla('')
                setNomveh('')
                setNomopr('')
            }
        } catch (err) {
            alert('Codigo no detectado.')
        }
    }

    if (isFocused) {
        getDriverData()
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={style.keyboardAvoidingView}
        >
            <ScrollView contentContainerStyle={style.scrollContainer}>
                <SafeAreaView style={style.container}>
                    <SafeAreaView style={style.titleContainer}>
                        <Text style={style.textTitle}>Bitacora de Kilometraje!</Text>
                    </SafeAreaView>
                    <SafeAreaView style={style.stepContainer}>
                        <Text type="subtitle" style={style.textSubTitle}>Placa Vehiculo</Text>
                        <Text>
                            <TextInput
                                style={style.input}
                                editable={false}
                                value={numpla}
                            />
                        </Text>
                    </SafeAreaView>
                    <SafeAreaView style={style.stepContainer}>
                        <Text type="subtitle" style={style.textSubTitle}>Ruta</Text>
                        <Text>
                            <TextInput
                                style={style.input}
                                editable={false}
                                value={nomveh}
                            />
                        </Text>
                    </SafeAreaView>
                    <SafeAreaView style={style.stepContainer}>
                        <Text type="subtitle" style={style.textSubTitle}>Conductor</Text>
                        <Text>
                            <TextInput
                                style={style.input}
                                editable={false}
                                value={nomopr}
                            />
                        </Text>
                    </SafeAreaView>
                    <SafeAreaView style={style.stepContainer}>
                        <Text type="subtitle" style={style.textSubTitle}>Kilometraje</Text>
                        <Text>
                            <TextInput
                                style={style.input}
                                editable={true}
                                keyboardType='numeric'
                                value={kmveh}
                                onChangeText={value => { setKmveh(value) }}
                            />
                        </Text>
                    </SafeAreaView>
                    <SafeAreaView style={style.stepContainer}>
                        <Text type="subtitle" style={style.textSubTitle}>Comentarios</Text>
                        <Text>
                            <TextInput
                                style={style.inputMultiLine}
                                editable={true}
                                value={obsreg}
                                onChangeText={value => { setObsreg(value) }}
                                multiline={true}

                            />
                        </Text>
                    </SafeAreaView>
                    <Pressable style={style.btn} onPress={sendData}>
                        <Text style={style.text}>Registrar Movimiento</Text>
                    </Pressable>
                </SafeAreaView>
            </ScrollView>
        </KeyboardAvoidingView>
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
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textTitle: {
        textAlign: 'center',
        fontSize: 26,
        fontWeight: '800',
        color: '#333533'
    },
    textSubTitle: {
        color: '#333533',
        fontSize: 16,
        marginStart: 10,
    },
    stepContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 2
    },
    input: {
        width: 400,
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderColor: '#333533',
        borderRadius: 10,
        backgroundColor: '#fff'
    },
    inputMultiLine: {
        width: 400,
        height: 80,
        margin: 12,
        borderWidth: 1,
        borderColor: '#333533',
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 10
    },
    btn: {
        width: 250,
        backgroundColor: '#fcbf49',
        height: 50,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        borderColor: '#333533'
    },
    text: {
        color: '#333533',
        fontSize: 16,
        fontWeight: '500'
    },
    keyboardAvoidingView: { flex: 1 },
    scrollContainer: { flexGrow: 1, justifyContent: 'center' },
})
