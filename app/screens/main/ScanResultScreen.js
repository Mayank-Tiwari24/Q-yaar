import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Animated,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import API_URL from '../../config/api';
import { useUser } from '../../context/UserContext';

// ─── Design Tokens ──────────────────────────────────────────────────────────
const C = {
    bg: '#F7FAF9',
    primary: '#6FD3C1',
    primaryDark: '#4DBAA6',
    surfaceLow: '#EFF5F3',
    surfaceLowest: '#ffffff',
    onSurface: '#2c3435',
    onSurfaceVar: '#596061',
    outlineVar: '#e0e6e4',
    primaryContainer: '#DDF4EF',
    onPrimaryContainer: '#00534d',
    error: '#FF6B6B',
};

const ScanResultScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { qrId } = route.params || {};
    const { mobileNumber, userData } = useUser();

    const [loading, setLoading] = useState(true);
    const [vehicleData, setVehicleData] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    
    // Notification Modal State
    const [notifyModalVisible, setNotifyModalVisible] = useState(false);
    const [notifyMessage, setNotifyMessage] = useState('');

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        if (!qrId) {
            Alert.alert('Error', 'Invalid QR Code');
            navigation.goBack();
            return;
        }
        fetchVehicleDetails();
    }, [qrId]);

    const fetchVehicleDetails = async () => {
        try {
            const res = await fetch(`${API_URL}/qr/${qrId}`);
            const data = await res.json();
            
            if (data.success && data.data) {
                setVehicleData(data.data);
                Animated.parallel([
                    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
                    Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: true }),
                ]).start();
            } else {
                Alert.alert('Error', data.message || 'Vehicle details not found');
                navigation.goBack();
            }
        } catch (err) {
            console.error('Fetch vehicle error:', err);
            Alert.alert('Connection Error', 'Could not fetch details. Please try again.');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const handleStartChat = async () => {
        if (!mobileNumber) {
            Alert.alert('Error', 'Please login first to use chat feature.');
            return;
        }

        setActionLoading(true);
        try {
            const res = await fetch(`${API_URL}/chat/initiate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qrId, scannerMobile: mobileNumber }),
            });
            const data = await res.json();

            if (data.success) {
                navigation.navigate('Chat', {
                    sessionId: data.data.sessionId,
                    mobileNumber,
                    ownerName: data.data.ownerName,
                    vehicleNumber: data.data.vehicleNumber,
                    role: 'scanner',
                });
            } else {
                Alert.alert('Chat Error', data.message || 'Unable to start chat.');
            }
        } catch (err) {
            console.error('Chat initiate error:', err);
            Alert.alert('Connection Error', 'Could not connect to server.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSendNotification = async () => {
        if (!notifyMessage.trim()) return;

        setActionLoading(true);
        try {
            const senderName = userData?.vehicles?.[0]?.vehicleData?.ownerName || 'Someone';
            const res = await fetch(`${API_URL}/qr/${qrId}/notify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: notifyMessage, senderName }),
            });
            const data = await res.json();

            if (data.success) {
                setNotifyModalVisible(false);
                setNotifyMessage('');
                Alert.alert('Success', 'Notification sent to the vehicle owner!');
            } else {
                Alert.alert('Error', data.message || 'Could not send notification.');
            }
        } catch (err) {
            console.error('Notify error:', err);
            Alert.alert('Connection Error', 'Failed to send notification.');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <StatusBar style="dark" />
                <ActivityIndicator size="large" color={C.primary} />
                <Text style={styles.loadingText}>Fetching vehicle details...</Text>
            </View>
        );
    }

    if (!vehicleData) return null;

    const vData = vehicleData.vehicleData || {};

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
                    <MaterialIcons name="arrow-back" size={24} color={C.onSurface} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Scanned Vehicle</Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Content */}
            <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                
                {/* Vehicle Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.iconBox}>
                            <MaterialIcons name="directions-car" size={28} color={C.onPrimaryContainer} />
                        </View>
                        <View style={styles.cardHeaderTexts}>
                            <Text style={styles.plateNumber}>{vData.vehicleNumber || 'Unknown'}</Text>
                            <Text style={styles.ownerName}>{vData.ownerName || 'Unknown Owner'}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.detailsRow}>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Model</Text>
                            <Text style={styles.detailValue}>{vData.model || '--'}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Fuel Type</Text>
                            <Text style={styles.detailValue}>{vData.fuel || '--'}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Color</Text>
                            <Text style={styles.detailValue}>{vData.color || '--'}</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.actionTitle}>What do you want to do?</Text>

                {/* Actions */}
                <TouchableOpacity 
                    style={[styles.actionBtn, styles.btnNotify]} 
                    activeOpacity={0.8}
                    onPress={() => setNotifyModalVisible(true)}
                    disabled={actionLoading}
                >
                    <Ionicons name="notifications" size={22} color="#fff" style={styles.btnIcon} />
                    <Text style={styles.btnTextWhite}>Send Notification</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.actionBtn, styles.btnChat]} 
                    activeOpacity={0.8}
                    onPress={handleStartChat}
                    disabled={actionLoading}
                >
                    {actionLoading && !notifyModalVisible ? (
                        <ActivityIndicator size="small" color={C.primaryDark} />
                    ) : (
                        <>
                            <Ionicons name="chatbubbles" size={22} color={C.primaryDark} style={styles.btnIcon} />
                            <Text style={styles.btnTextPrimary}>Start Chat</Text>
                        </>
                    )}
                </TouchableOpacity>

            </Animated.View>

            {/* Notification Modal */}
            <Modal
                visible={notifyModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setNotifyModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setNotifyModalVisible(false); }}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>Send Notification</Text>
                                    <Text style={styles.modalSub}>The owner will receive this message as a push notification.</Text>
                                    
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="e.g., Your car is blocking mine..."
                                        placeholderTextColor={C.onSurfaceVar}
                                        value={notifyMessage}
                                        onChangeText={setNotifyMessage}
                                        multiline
                                        maxLength={150}
                                        autoFocus
                                    />
                                    
                                    <View style={styles.modalActions}>
                                        <TouchableOpacity 
                                            style={styles.modalCancel} 
                                            onPress={() => setNotifyModalVisible(false)}
                                        >
                                            <Text style={styles.modalCancelText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={[styles.modalSend, !notifyMessage.trim() && { opacity: 0.5 }]} 
                                            onPress={handleSendNotification}
                                            disabled={!notifyMessage.trim() || actionLoading}
                                        >
                                            {actionLoading ? (
                                                <ActivityIndicator size="small" color="#fff" />
                                            ) : (
                                                <Text style={styles.modalSendText}>Send</Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </KeyboardAvoidingView>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    center: { justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, fontSize: 14, color: C.onSurfaceVar, fontWeight: '500' },
    
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 56 : 44,
        paddingBottom: 16,
        backgroundColor: C.surfaceLowest,
        borderBottomWidth: 1,
        borderColor: C.outlineVar,
    },
    headerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.surfaceLow, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: C.onSurface },
    headerSpacer: { width: 40 },

    content: { padding: 20, flex: 1 },
    
    card: {
        backgroundColor: C.surfaceLowest,
        borderRadius: 20,
        padding: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
        elevation: 4,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center' },
    iconBox: { width: 56, height: 56, borderRadius: 16, backgroundColor: C.primaryContainer, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    cardHeaderTexts: { flex: 1 },
    plateNumber: { fontSize: 20, fontWeight: '800', color: C.onSurface, letterSpacing: 0.5 },
    ownerName: { fontSize: 15, fontWeight: '500', color: C.onSurfaceVar, marginTop: 4 },
    divider: { height: 1, backgroundColor: C.outlineVar, marginVertical: 20 },
    detailsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    detailItem: { flex: 1 },
    detailLabel: { fontSize: 12, fontWeight: '600', color: C.onSurfaceVar, marginBottom: 4 },
    detailValue: { fontSize: 15, fontWeight: '700', color: C.onSurface },

    actionTitle: { fontSize: 16, fontWeight: '700', color: C.onSurface, marginBottom: 16, marginLeft: 4 },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: 16,
        marginBottom: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    btnNotify: { backgroundColor: C.primaryDark, shadowColor: C.primaryDark },
    btnChat: { backgroundColor: C.surfaceLowest, borderWidth: 1.5, borderColor: C.primaryDark, shadowColor: '#000' },
    btnIcon: { marginRight: 8 },
    btnTextWhite: { fontSize: 16, fontWeight: '700', color: '#fff' },
    btnTextPrimary: { fontSize: 16, fontWeight: '700', color: C.primaryDark },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
    modalContainer: { width: '100%' },
    modalContent: { backgroundColor: C.surfaceLowest, borderRadius: 24, padding: 24, elevation: 10 },
    modalTitle: { fontSize: 18, fontWeight: '700', color: C.onSurface, marginBottom: 8 },
    modalSub: { fontSize: 13, color: C.onSurfaceVar, marginBottom: 20, lineHeight: 18 },
    modalInput: { backgroundColor: C.surfaceLow, borderRadius: 12, padding: 16, minHeight: 100, textAlignVertical: 'top', fontSize: 15, color: C.onSurface, marginBottom: 24 },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
    modalCancel: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
    modalCancelText: { fontSize: 15, fontWeight: '600', color: C.onSurfaceVar },
    modalSend: { backgroundColor: C.primaryDark, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', minWidth: 90 },
    modalSendText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});

export default ScanResultScreen;
