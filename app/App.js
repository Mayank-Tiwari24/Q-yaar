import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { registerRootComponent } from 'expo';
import { Alert, LogBox } from 'react-native';

// Suppress Expo Go push notification warning (only affects Expo Go, not production APK)
LogBox.ignoreLogs([
    'expo-notifications',
    '`expo-notifications` functionality is not fully supported',
]);
import OnboardingScreen from './screens/auth/OnboardingScreen';
import SelectionScreen from './screens/auth/SelectionScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import UserDetailsScreen from './screens/auth/UserDetailsScreen';
import HomeScreen from './screens/main/HomeScreen';
import ScanScreen from './screens/main/ScanScreen';
import VehiclesScreen from './screens/main/VehiclesScreen';
import ActivityScreen from './screens/main/ActivityScreen';
import ProfileScreen from './screens/main/ProfileScreen';
import SearchVehicleScreen from './screens/main/SearchVehicleScreen';
import MyQRScreen from './screens/main/MyQRScreen';
import ScanResultScreen from './screens/main/ScanResultScreen';
import ChatListScreen from './screens/chat/ChatListScreen';
import ChatScreen from './screens/chat/ChatScreen';
import { UserProvider } from './context/UserContext';
import {
    registerForPushNotifications,
    addNotificationReceivedListener,
    addNotificationResponseListener,
} from './services/notifications';

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
        <UserProvider>
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
                <Stack.Screen name="ScanResult" component={ScanResultScreen} />
                <Stack.Screen name="ChatList" component={ChatListScreen} />
                <Stack.Screen name="Chat" component={ChatScreen} />
            </Stack.Navigator>
        </NavigationContainer>
        </UserProvider>
    );
}

registerRootComponent(App);

