import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import FormScreen from './screens/FormScreen'
import ScanScreen from './screens/ScanScreen'

const Tab = createBottomTabNavigator()

const Tabs = () => {
    return (
        <Tab.Navigator
            initialRouteName='Scan'
            screenOptions={{
                tabBarActiveTintColor: '#F5CB5C',
                tabBarInactiveTintColor: '#E8EDDF',
                tabBarActiveBackgroundColor: '#242423',
                tabBarInactiveBackgroundColor: '#242423'
            }}>
            <Tab.Screen
                name='Scan'
                component={ScanScreen}
                options={{
                    tabBarLabel: 'Escaner',
                    headerShown: false,
                    tabBarIcon: ({ color,size }) => <FontAwesome size={size} name="barcode" color={color} />,
                }}
            />
            <Tab.Screen
                name='Form'
                component={FormScreen}
                options={{
                    tabBarLabel: 'Formulario',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <FontAwesome size={size} name="pencil" color={color} />,
                }}
            />
        </Tab.Navigator>
    )
}

const Navigation = () => {
    return (
        <NavigationContainer>
            <Tabs />
        </NavigationContainer>
    )
}

export default Navigation