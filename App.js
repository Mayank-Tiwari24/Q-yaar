import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { registerRootComponent } from 'expo';
import OnboardingScreen from './OnboardingScreen';
import SelectionScreen from './SelectionScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import UserDetailsScreen from './UserDetailsScreen';
import HomeScreen from './HomeScreen';
import ScanScreen from './ScanScreen';
import VehiclesScreen from './VehiclesScreen';
import ActivityScreen from './ActivityScreen';
import ProfileScreen from './ProfileScreen';
import SearchVehicleScreen from './SearchVehicleScreen';
import MyQRScreen from './MyQRScreen';

const Stack = createNativeStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <StatusBar style="light" />
            <Stack.Navigator
                initialRouteName="Onboarding"
                screenOptions={{
                    headerShown: false,
                    animation: 'fade_from_bottom',
                }}
            >
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                <Stack.Screen name="AccountSelection" component={SelectionScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Scan" component={ScanScreen} />
                <Stack.Screen name="Vehicles" component={VehiclesScreen} />
                <Stack.Screen name="Activity" component={ActivityScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="SearchVehicle" component={SearchVehicleScreen} />
                <Stack.Screen name="MyQR" component={MyQRScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

registerRootComponent(App);
