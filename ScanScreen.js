import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width } = Dimensions.get('window');
const SCANNER_SIZE = width - 80;

// ─── Design Tokens ──────────────────────────────────────────────────────────
const C = {
    bg: '#F7FAF9',
    primary: '#6FD3C1',
    primaryDark: '#4DBAA6',
    secondary: '#A8E6CF',
    surfaceLow: '#EFF5F3',
    surfaceLowest: '#ffffff',
    onSurface: '#2c3435',
    onSurfaceVar: '#596061',
    outlineVar: '#acb3b4',
    primaryContainer: '#7fe6db',
    onPrimaryContainer: '#00534d',
    secondaryContainer: '#abf4ac',
    onSecondaryContainer: '#185e27',
};

// ─── Bottom Nav Tabs ────────────────────────────────────────────────────────
const NAV_TABS = [
    { icon: 'home', label: 'Home', key: 'home' },
    { icon: 'qr-code-scanner', label: 'Scan', key: 'scan' },
    { icon: 'directions-car', label: 'Vehicles', key: 'vehicles' },
    { icon: 'history', label: 'Activity', key: 'activity' },
    { icon: 'person', label: 'Profile', key: 'profile' },
];

// ─── Scanner Corner ─────────────────────────────────────────────────────────
const ScannerCorner = ({ style }) => (
    <View style={[styles.cornerBase, style]}>
        <View style={styles.cornerH} />
        <View style={styles.cornerV} />
    </View>
);

// ─── ScanScreen ─────────────────────────────────────────────────────────────
const ScanScreen = () => {
    const navigation = useNavigation();
    const [permission, requestPermission] = useCameraPermissions();
    const [flashOn, setFlashOn] = useState(false);
    const [scanned, setScanned] = useState(false);

    // Animations
    const fadeIn = useRef(new Animated.Value(0)).current;
    const fadeScanner = useRef(new Animated.Value(0)).current;
    const scanLineAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const fadeNav = useRef(new Animated.Value(0)).current;
    const fadeButtons = useRef(new Animated.Value(0)).current;
    const slideButtons = useRef(new Animated.Value(30)).current;
    const fadeInfo = useRef(new Animated.Value(0)).current;
    const slideInfo = useRef(new Animated.Value(20)).current;

    const isWeb = Platform.OS === 'web';
    const cameraGranted = permission?.granted;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(fadeIn, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(fadeScanner, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.parallel([
                Animated.timing(fadeButtons, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(slideButtons, { toValue: 0, friction: 8, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(fadeInfo, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(slideInfo, { toValue: 0, friction: 8, useNativeDriver: true }),
            ]),
            Animated.timing(fadeNav, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();

        // Scan line animation loop
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanLineAnim, { toValue: 1, duration: 2500, useNativeDriver: true }),
                Animated.timing(scanLineAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
            ])
        ).start();

        // Pulse border glow
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.015, duration: 1200, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const scanLineY = scanLineAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, SCANNER_SIZE - 4],
    });

    const handleBarcodeScanned = (result) => {
        if (scanned) return;
        setScanned(true);
        console.log('QR Scanned:', result.data);
        // Navigate or show result
    };

    const handleSimulateScan = () => {
        if (scanned) return;
        setScanned(true);
        console.log('QR Simulated');
    };

    const handleNavTab = (key) => {
        if (key === 'home') navigation.navigate('Home');
        if (key === 'vehicles') navigation.navigate('Vehicles');
        if (key === 'activity') navigation.navigate('Activity');
        if (key === 'profile') navigation.navigate('Profile');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* ── Header ── */}
            <Animated.View style={[styles.header, { opacity: fadeIn }]}>
                <TouchableOpacity
                    style={styles.headerBtn}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="arrow-back" size={24} color={C.onSurface} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Scan QR</Text>
                <TouchableOpacity
                    style={styles.headerBtn}
                    onPress={() => setFlashOn(!flashOn)}
                    activeOpacity={0.7}
                >
                    <MaterialIcons
                        name={flashOn ? 'flash-on' : 'flash-off'}
                        size={24}
                        color={flashOn ? '#E8A317' : C.onSurfaceVar}
                    />
                </TouchableOpacity>
            </Animated.View>

            {/* ── Scanner Area ── */}
            <Animated.View style={[styles.scannerWrapper, { opacity: fadeScanner, transform: [{ scale: pulseAnim }] }]}>
                <LinearGradient
                    colors={[C.primary, C.primaryDark, C.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.scannerBorder}
                >
                    <View style={styles.scannerInner}>
                        {isWeb ? (
                            <View style={styles.webPlaceholder}>
                                <MaterialIcons name="qr-code-scanner" size={64} color={C.primary} />
                                <Text style={styles.webPlaceholderText}>Camera not available on web</Text>
                                {!scanned && (
                                    <TouchableOpacity style={styles.simulateBtn} onPress={handleSimulateScan} activeOpacity={0.8}>
                                        <Text style={styles.simulateBtnText}>Simulate Scan</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ) : cameraGranted ? (
                            <CameraView
                                style={StyleSheet.absoluteFill}
                                facing="back"
                                enableTorch={flashOn}
                                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                            />
                        ) : (
                            <View style={styles.webPlaceholder}>
                                <MaterialIcons name="camera-alt" size={48} color={C.primary} />
                                <Text style={styles.webPlaceholderText}>Camera access required</Text>
                                <TouchableOpacity style={styles.simulateBtn} onPress={requestPermission} activeOpacity={0.8}>
                                    <Text style={styles.simulateBtnText}>Allow Camera</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Scanner corners */}
                        <ScannerCorner style={styles.cornerTL} />
                        <ScannerCorner style={[styles.cornerTR, { transform: [{ scaleX: -1 }] }]} />
                        <ScannerCorner style={[styles.cornerBL, { transform: [{ scaleY: -1 }] }]} />
                        <ScannerCorner style={[styles.cornerBR, { transform: [{ scaleX: -1 }, { scaleY: -1 }] }]} />

                        {/* Scan line */}
                        {!scanned && (
                            <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanLineY }] }]}>
                                <LinearGradient
                                    colors={['transparent', C.primary, 'transparent']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.scanLineGradient}
                                />
                            </Animated.View>
                        )}
                    </View>
                </LinearGradient>
            </Animated.View>

            {/* ── Instruction Text ── */}
            <Animated.Text style={[styles.instruction, { opacity: fadeScanner }]}>
                Align the QR code within the frame to scan
            </Animated.Text>

            {/* ── Action Buttons ── */}
            <Animated.View style={[styles.actionsRow, { opacity: fadeButtons, transform: [{ translateY: slideButtons }] }]}>
                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                    <View style={styles.actionBtnIcon}>
                        <MaterialIcons name="photo-library" size={22} color={C.onPrimaryContainer} />
                    </View>
                    <Text style={styles.actionBtnText}>Scan from Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                    <View style={[styles.actionBtnIcon, { backgroundColor: C.surfaceLow }]}>
                        <MaterialIcons name="info-outline" size={22} color={C.onSurfaceVar} />
                    </View>
                    <Text style={styles.actionBtnText}>How it works</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* ── Bottom Info Card ── */}
            <Animated.View style={[styles.infoCard, { opacity: fadeInfo, transform: [{ translateY: slideInfo }] }]}>
                <MaterialIcons name="info" size={18} color={C.primary} />
                <Text style={styles.infoCardText}>
                    You can scan any vehicle QR to view details
                </Text>
            </Animated.View>

            {/* ── Bottom Navigation ── */}
            <Animated.View style={[styles.bottomNav, { opacity: fadeNav }]}>
                {NAV_TABS.map((tab) => {
                    const isActive = tab.key === 'scan';
                    return (
                        <TouchableOpacity
                            key={tab.key}
                            style={[styles.navTab, isActive && styles.navTabActive]}
                            activeOpacity={0.7}
                            onPress={() => handleNavTab(tab.key)}
                        >
                            <MaterialIcons
                                name={tab.icon}
                                size={24}
                                color={isActive ? C.onPrimaryContainer : C.onSurfaceVar}
                            />
                            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
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
        alignItems: 'center',
    },

    /* Header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
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
        fontSize: 20,
        fontWeight: '700',
        color: C.onSurface,
        letterSpacing: -0.3,
    },

    /* Scanner */
    scannerWrapper: {
        marginTop: 24,
        borderRadius: 28,
        shadowColor: C.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 10,
    },
    scannerBorder: {
        width: SCANNER_SIZE + 6,
        height: SCANNER_SIZE + 6,
        borderRadius: 26,
        padding: 3,
    },
    scannerInner: {
        flex: 1,
        borderRadius: 23,
        overflow: 'hidden',
        backgroundColor: '#E8F0EE',
    },

    /* Web placeholder */
    webPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 24,
    },
    webPlaceholderText: {
        fontSize: 14,
        fontWeight: '500',
        color: C.onSurfaceVar,
        textAlign: 'center',
    },
    simulateBtn: {
        backgroundColor: C.primary,
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 20,
        marginTop: 8,
    },
    simulateBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#ffffff',
    },

    /* Scanner Corners */
    cornerBase: {
        position: 'absolute',
    },
    cornerH: {
        width: 32,
        height: 4,
        borderRadius: 2,
        backgroundColor: C.primary,
    },
    cornerV: {
        width: 4,
        height: 32,
        borderRadius: 2,
        backgroundColor: C.primary,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    cornerTL: { top: 16, left: 16 },
    cornerTR: { top: 16, right: 16 },
    cornerBL: { bottom: 16, left: 16 },
    cornerBR: { bottom: 16, right: 16 },

    /* Scan Line */
    scanLine: {
        position: 'absolute',
        left: 20,
        right: 20,
        height: 3,
    },
    scanLineGradient: {
        flex: 1,
        borderRadius: 2,
    },

    /* Instruction */
    instruction: {
        fontSize: 14,
        fontWeight: '500',
        color: C.onSurfaceVar,
        textAlign: 'center',
        marginTop: 20,
        paddingHorizontal: 40,
        lineHeight: 20,
    },

    /* Action Buttons */
    actionsRow: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 24,
        paddingHorizontal: 24,
    },
    actionBtn: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: C.surfaceLowest,
        borderRadius: 18,
        paddingVertical: 18,
        paddingHorizontal: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    actionBtnIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: C.primaryContainer,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    actionBtnText: {
        fontSize: 13,
        fontWeight: '600',
        color: C.onSurface,
        textAlign: 'center',
    },

    /* Info Card */
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: C.surfaceLow,
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 18,
        marginTop: 20,
        marginHorizontal: 24,
    },
    infoCardText: {
        fontSize: 13,
        fontWeight: '500',
        color: C.onSurfaceVar,
        flex: 1,
        lineHeight: 18,
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
    navTabActive: {
        backgroundColor: C.primaryContainer,
        borderRadius: 24,
        paddingHorizontal: 18,
        paddingVertical: 6,
    },
    navLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: C.onSurfaceVar,
        marginTop: 2,
        letterSpacing: 0.2,
    },
    navLabelActive: {
        color: C.onPrimaryContainer,
        fontWeight: '600',
    },
});

export default ScanScreen;
