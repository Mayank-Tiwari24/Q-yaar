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
            </Stack.Navigator>
        </NavigationContainer>
    );
}

registerRootComponent(App);
