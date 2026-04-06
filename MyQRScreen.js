import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    Platform,
    Share,
    Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';

const { width } = Dimensions.get('window');

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
};

// ─── Bottom Nav Tabs ────────────────────────────────────────────────────────
const NAV_TABS = [
    { icon: 'home', label: 'Home', key: 'home' },
    { icon: 'qr-code-scanner', label: 'Scan', key: 'scan' },
    { icon: 'directions-car', label: 'Vehicles', key: 'vehicles' },
    { icon: 'history', label: 'Activity', key: 'activity' },
    { icon: 'person', label: 'Profile', key: 'profile' },
];

const DEMO_VEHICLE = 'MP04AB1234';
const QR_VALUE = `https://qyaar.app/v/${DEMO_VEHICLE}`;

// ─── MyQRScreen ─────────────────────────────────────────────────────────────
const MyQRScreen = () => {
    const navigation = useNavigation();

    // Animations
    const fadeHeader = useRef(new Animated.Value(0)).current;
    const qrScale = useRef(new Animated.Value(0.8)).current;
    const qrFade = useRef(new Animated.Value(0)).current;
    const contentFade = useRef(new Animated.Value(0)).current;
    const contentSlide = useRef(new Animated.Value(20)).current;
    const fadeNav = useRef(new Animated.Value(0)).current;

    let qrRef = useRef();

    useEffect(() => {
        // Header
        Animated.timing(fadeHeader, { toValue: 1, duration: 400, useNativeDriver: true }).start();

        // QR Card Pop
        Animated.parallel([
            Animated.timing(qrFade, { toValue: 1, duration: 500, delay: 100, useNativeDriver: true }),
            Animated.spring(qrScale, { toValue: 1, friction: 6, tension: 40, delay: 100, useNativeDriver: true }),
        ]).start();

        // Actions & Info Slide up
        Animated.parallel([
            Animated.timing(contentFade, { toValue: 1, duration: 400, delay: 250, useNativeDriver: true }),
            Animated.spring(contentSlide, { toValue: 0, friction: 8, delay: 250, useNativeDriver: true }),
        ]).start();

        // Bottom Nav
        Animated.timing(fadeNav, { toValue: 1, duration: 300, delay: 350, useNativeDriver: true }).start();
    }, []);

    const handleDownload = () => {
        // In a real app, this would use expo-file-system and expo-media-library
        // For demo, we just alert.
        if (Platform.OS === 'web') {
            window.alert('Download started...');
        } else {
            Alert.alert("Download Complete", "Your QR code has been saved to the gallery.");
        }
    };

    const handleShare = async () => {
        try {
            if (Platform.OS === 'web') {
                if (navigator.share) {
                    await navigator.share({
                        title: 'My Q Yaar QR',
                        text: `Scan my vehicle QR code here: ${QR_VALUE}`,
                        url: QR_VALUE,
                    });
                } else {
                    window.alert('Share not supported on this browser.');
                }
            } else {
                await Share.share({
                    message: `Scan my vehicle QR code to contact me: ${QR_VALUE}`,
                });
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleNavTab = (key) => {
        if (key === 'home') navigation.navigate('Home');
        if (key === 'scan') navigation.navigate('Scan');
        if (key === 'vehicles') navigation.navigate('Vehicles');
        if (key === 'activity') navigation.navigate('Activity');
        if (key === 'profile') navigation.navigate('Profile');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* ── Header ── */}
            <Animated.View style={[styles.header, { opacity: fadeHeader }]}>
                <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
                    <MaterialIcons name="arrow-back" size={24} color={C.onSurface} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My QR</Text>
                <View style={styles.headerSpacer} />
            </Animated.View>

            {/* ── Main Content ── */}
            <View style={styles.content}>
                
                {/* QR Card */}
                <Animated.View 
                    style={[
                        styles.qrCard, 
                        { opacity: qrFade, transform: [{ scale: qrScale }] }
                    ]}
                >
                    <View style={styles.qrCodeWrapper}>
                        <QRCode
                            value={QR_VALUE}
                            size={width * 0.55}
                            color={C.onSurface}
                            backgroundColor="transparent"
                            getRef={(c) => (qrRef = c)}
                        />
                    </View>
                    <Text style={styles.plateText}>{DEMO_VEHICLE}</Text>
                </Animated.View>

                {/* Actions & Meta */}
                <Animated.View style={{ opacity: contentFade, transform: [{ translateY: contentSlide }] }}>
                    
                    {/* Action Buttons */}
                    <View style={styles.actionsRow}>
                        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8} onPress={handleDownload}>
                            <MaterialIcons name="file-download" size={20} color={C.onPrimaryContainer} />
                            <Text style={styles.actionBtnText}>Download</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.actionBtnPrimary} activeOpacity={0.8} onPress={handleShare}>
                            <MaterialIcons name="share" size={20} color="#ffffff" />
                            <Text style={styles.actionBtnPrimaryText}>Share QR</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Instruction Text */}
                    <Text style={styles.instructionText}>
                        Place this QR on your vehicle for easy access
                    </Text>

                    {/* Meta Info Card */}
                    <View style={styles.metaCard}>
                        <View style={styles.metaRow}>
                            <MaterialIcons name="check-circle" size={18} color="#34C759" />
                            <Text style={styles.metaLabel}>Status</Text>
                            <View style={{flex:1}}/>
                            <Text style={styles.metaValueHighlight}>Active</Text>
                        </View>
                        <View style={styles.metaDivider} />
                        <View style={styles.metaRow}>
                            <MaterialIcons name="link" size={18} color={C.onSurfaceVar} />
                            <Text style={styles.metaLabel}>Linked to</Text>
                            <View style={{flex:1}}/>
                            <Text style={styles.metaValue}>Primary Vehicle</Text>
                        </View>
                    </View>
                </Animated.View>

            </View>

            {/* ── Bottom Navigation ── */}
            <Animated.View style={[styles.bottomNav, { opacity: fadeNav }]}>
                {NAV_TABS.map((tab) => {
                    return (
                        <TouchableOpacity
                            key={tab.key}
                            style={styles.navTab}
                            activeOpacity={0.7}
                            onPress={() => handleNavTab(tab.key)}
                        >
                            <MaterialIcons
                                name={tab.icon}
                                size={24}
                                color={C.onSurfaceVar}
                            />
                            <Text style={styles.navLabel}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </Animated.View>
        </View>
    );
};

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: C.bg,
    },

    /* Header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 56 : 44,
        paddingBottom: 8,
    },
    headerBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: C.surfaceLow,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: C.onSurface,
        letterSpacing: -0.2,
    },
    headerSpacer: {
        width: 44,
    },

    /* Content Area */
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 32,
        alignItems: 'center',
    },

    /* QR Card */
    qrCard: {
        width: '100%',
        backgroundColor: C.surfaceLowest,
        borderRadius: 32,
        paddingVertical: 40,
        paddingHorizontal: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.05,
        shadowRadius: 24,
        elevation: 6,
        marginBottom: 32,
    },
    qrCodeWrapper: {
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 24,
        shadowColor: C.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 2,
        marginBottom: 24,
    },
    plateText: {
        fontSize: 22,
        fontWeight: '800',
        color: C.onSurface,
        letterSpacing: 1,
    },

    /* Actions */
    actionsRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
        width: '100%',
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: C.primaryContainer,
        height: 54,
        borderRadius: 20,
        gap: 8,
    },
    actionBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: C.onPrimaryContainer,
    },
    actionBtnPrimary: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: C.primary,
        height: 54,
        borderRadius: 20,
        gap: 8,
        shadowColor: C.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 4,
    },
    actionBtnPrimaryText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#ffffff',
    },

    /* Instructions */
    instructionText: {
        fontSize: 14,
        fontWeight: '500',
        color: C.onSurfaceVar,
        textAlign: 'center',
        marginBottom: 32,
    },

    /* Meta Info Card */
    metaCard: {
        backgroundColor: C.surfaceLowest,
        borderRadius: 20,
        padding: 16,
        width: '100%',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    metaLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: C.onSurfaceVar,
    },
    metaValue: {
        fontSize: 14,
        fontWeight: '600',
        color: C.onSurface,
    },
    metaValueHighlight: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1B8A3A', // Green active color
    },
    metaDivider: {
        height: 1,
        backgroundColor: C.outlineVar,
        marginVertical: 12,
        opacity: 0.5,
    },

    /* Bottom Nav */
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: Platform.OS === 'ios' ? 28 : 16,
        backgroundColor: 'rgba(247,250,249,0.95)',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        shadowColor: '#6FD3C1',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.06,
        shadowRadius: 24,
        elevation: 16,
    },
    navTab: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        paddingHorizontal: 14,
    },
    navLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: C.onSurfaceVar,
        marginTop: 2,
        letterSpacing: 0.2,
    },
});

export default MyQRScreen;
