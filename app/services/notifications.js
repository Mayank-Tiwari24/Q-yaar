// ─── Q Yaar — Push Notification Helper ──────────────────────────────────────
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

// Set up Android notification channel
if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
        name: 'Q Yaar Notifications',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#5EEAD4',
        sound: 'default',
    });
}

/**
 * Register for push notifications and return the Expo push token
 * @returns {string|null} Expo push token or null if not available
 */
export async function registerForPushNotifications() {
    let token = null;

    try {
        // Push notifications only work on physical devices with dev builds
        if (!Device.isDevice) {
            console.log('Push notifications require a physical device');
            return null;
        }

        // Check existing permissions
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        // Ask for permission if not granted
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Push notification permission not granted');
            return null;
        }

        // Get the Expo push token
        const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
        const pushToken = await Notifications.getExpoPushTokenAsync({
            projectId,
        });
        token = pushToken.data;
        console.log('Expo Push Token:', token);
    } catch (error) {
        // This will happen in Expo Go (SDK 53+) — push notifications need a dev build
        console.log('Push notifications not available (Expo Go limitation):', error.message);
        console.log('Push notifications will work once you build a development/production APK.');
    }

    return token;
}

/**
 * Register push token with the backend for a specific QR
 * @param {string} qrId - The QR code ID
 * @param {string} expoPushToken - The Expo push token
 * @param {string} apiUrl - The API base URL
 */
export async function registerTokenWithBackend(qrId, expoPushToken, apiUrl) {
    try {
        const response = await fetch(`${apiUrl}/qr/${qrId}/push-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ expoPushToken }),
        });
        const data = await response.json();
        if (data.success) {
            console.log('Push token registered with backend for QR:', qrId);
        } else {
            console.error('Failed to register push token:', data.message);
        }
        return data;
    } catch (error) {
        console.error('Error registering push token with backend:', error);
        return { success: false };
    }
}

/**
 * Add a notification received listener
 * @param {Function} callback - Called when a notification is received while app is foregrounded
 * @returns {Object} subscription - Call .remove() to unsubscribe
 */
export function addNotificationReceivedListener(callback) {
    return Notifications.addNotificationReceivedListener(callback);
}

/**
 * Add a notification response listener (when user taps on notification)
 * @param {Function} callback - Called when user taps on a notification
 * @returns {Object} subscription - Call .remove() to unsubscribe
 */
export function addNotificationResponseListener(callback) {
    return Notifications.addNotificationResponseReceivedListener(callback);
}
