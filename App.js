import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { registerRootComponent } from 'expo';
import { Alert } from 'react-native';
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
import {
    registerForPushNotifications,
    addNotificationReceivedListener,
    addNotificationResponseListener,
} from './notifications';

const Stack = createNativeStackNavigator();

function App() {
    const [expoPushToken, setExpoPushToken] = useState(null);
    const navigationRef = useRef(null);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        // Register for push notifications
        registerForPushNotifications().then(token => {
            if (token) {
                setExpoPushToken(token);
                console.log('Push token ready:', token);
            }
        });

        // Listen for notifications while app is open
        notificationListener.current = addNotificationReceivedListener(notification => {
            const data = notification.request.content.data;
            console.log('Notification received:', notification.request.content);
            // You could show an in-app alert or update a badge here
        });

        // Listen for notification taps
        responseListener.current = addNotificationResponseListener(response => {
            const data = response.notification.request.content.data;
            console.log('Notification tapped:', data);
            // Navigate to Activity screen when notification is tapped
            if (data?.type === 'qr_notification' && navigationRef.current) {
                navigationRef.current.navigate('Activity');
            }
        });

        return () => {
            if (notificationListener.current) notificationListener.current.remove();
            if (responseListener.current) responseListener.current.remove();
        };
    }, []);

    return (
        <NavigationContainer ref={navigationRef}>
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
                <Stack.Screen name="UserDetails">
                    {(props) => <UserDetailsScreen {...props} expoPushToken={expoPushToken} />}
                </Stack.Screen>
                <Stack.Screen name="Home">
                    {(props) => <HomeScreen {...props} expoPushToken={expoPushToken} />}
                </Stack.Screen>
                <Stack.Screen name="Scan">
                    {(props) => <ScanScreen {...props} expoPushToken={expoPushToken} />}
                </Stack.Screen>
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

