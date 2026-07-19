import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    Platform,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
    Rect,
    Circle,
    Ellipse,
    Path,
    Defs,
    LinearGradient as SvgLinearGradient,
    RadialGradient as SvgRadialGradient,
    Stop,
    Line,
    G,
} from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width } = Dimensions.get('window');
const CAMERA_SIZE = width - 80;

// ─── Back Arrow Icon ────────────────────────────────────────────────────────
const BackArrowIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24">
        <Path
            d="M15 6 L9 12 L15 18"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
    </Svg>
);

// ─── 3D QR Package Illustration ─────────────────────────────────────────────
const QRPackageIcon = ({ size = 130 }) => (
    <Svg width={size} height={size} viewBox="0 0 130 130">
        <Defs>
            <SvgRadialGradient id="qrGlow" cx="50%" cy="40%" r="55%">
                <Stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.35" />
                <Stop offset="60%" stopColor="#5EEAD4" stopOpacity="0.08" />
                <Stop offset="100%" stopColor="#5EEAD4" stopOpacity="0" />
            </SvgRadialGradient>
            <SvgLinearGradient id="boxFront" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#F0FAF8" />
                <Stop offset="100%" stopColor="#C8E6E0" />
            </SvgLinearGradient>
            <SvgLinearGradient id="boxSide" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#B2DFDB" />
                <Stop offset="100%" stopColor="#A0D4CC" />
            </SvgLinearGradient>
            <SvgLinearGradient id="boxTop" x1="0" y1="1" x2="0" y2="0">
                <Stop offset="0%" stopColor="#E0F2F0" />
                <Stop offset="100%" stopColor="#F0FAF8" />
            </SvgLinearGradient>
            <SvgLinearGradient id="qrFace" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#FFFFFF" />
                <Stop offset="100%" stopColor="#E8F5F3" />
            </SvgLinearGradient>
        </Defs>
        {/* Outer glow */}
        <Circle cx="65" cy="65" r="60" fill="url(#qrGlow)" />
        {/* Shadow */}
        <Ellipse cx="65" cy="118" rx="30" ry="5" fill="rgba(0,0,0,0.08)" />

        {/* Box body — front face */}
        <Path d="M30 55 L30 100 L75 105 L75 60 Z" fill="url(#boxFront)" stroke="#80CBC4" strokeWidth="0.8" />
        {/* Box body — right side */}
        <Path d="M75 60 L75 105 L100 95 L100 50 Z" fill="url(#boxSide)" stroke="#80CBC4" strokeWidth="0.8" />
        {/* Box body — top (open lid tilted back) */}
        <Path d="M30 55 L75 60 L100 50 L55 45 Z" fill="url(#boxTop)" stroke="#80CBC4" strokeWidth="0.8" />

        {/* Open flap — tilted up */}
        <Path d="M30 55 L55 45 L55 20 L30 30 Z" fill="#E8F5E9" stroke="#80CBC4" strokeWidth="0.6" opacity="0.8" />
        <Path d="M55 20 L55 45 L100 50 L80 25 Z" fill="#E0F2F0" stroke="#80CBC4" strokeWidth="0.6" opacity="0.7" />

        {/* QR card rising out of box */}
        <G>
            <Rect x="42" y="28" width="36" height="36" rx="4" fill="url(#qrFace)" stroke="#80CBC4" strokeWidth="0.8" />
            {/* QR pattern top-left */}
            <Rect x="46" y="32" width="8" height="8" rx="1" stroke="#0D6B5E" strokeWidth="1" fill="none" />
            <Rect x="48" y="34" width="4" height="4" rx="0.5" fill="#0D6B5E" />
            {/* QR pattern top-right */}
            <Rect x="66" y="32" width="8" height="8" rx="1" stroke="#0D6B5E" strokeWidth="1" fill="none" />
            <Rect x="68" y="34" width="4" height="4" rx="0.5" fill="#0D6B5E" />
            {/* QR pattern bottom-left */}
            <Rect x="46" y="52" width="8" height="8" rx="1" stroke="#0D6B5E" strokeWidth="1" fill="none" />
            <Rect x="48" y="54" width="4" height="4" rx="0.5" fill="#0D6B5E" />
            {/* QR center data dots */}
            <Rect x="57" y="35" width="3" height="3" fill="#0D6B5E" opacity="0.6" />
            <Rect x="61" y="39" width="2" height="2" fill="#0D6B5E" opacity="0.5" />
            <Rect x="56" y="42" width="3" height="2" fill="#0D6B5E" opacity="0.5" />
            <Rect x="61" y="44" width="3" height="3" fill="#0D6B5E" opacity="0.6" />
            <Rect x="57" y="48" width="2" height="3" fill="#0D6B5E" opacity="0.4" />
            <Rect x="62" y="50" width="3" height="2" fill="#0D6B5E" opacity="0.5" />
            <Rect x="67" y="44" width="3" height="3" fill="#0D6B5E" opacity="0.4" />
            <Rect x="51" y="44" width="2" height="3" fill="#0D6B5E" opacity="0.5" />
            <Rect x="48" y="48" width="3" height="2" fill="#0D6B5E" opacity="0.4" />
        </G>

        {/* Sparkle effects */}
        <Circle cx="38" cy="25" r="2" fill="#5EEAD4" opacity="0.4" />
        <Circle cx="90" cy="35" r="1.5" fill="#5EEAD4" opacity="0.3" />
        <Circle cx="25" cy="70" r="1.8" fill="#5EEAD4" opacity="0.2" />
        {/* Shine on QR card */}
        <Path d="M44 30 L46 28 L46 40 L44 42 Z" fill="rgba(255,255,255,0.2)" />
    </Svg>
);

// ─── Step Badge ─────────────────────────────────────────────────────────────
const StepCard = ({ number, text, fadeAnim, slideAnim }) => (
    <Animated.View
        style={[
            styles.stepCard,
            {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
            },
        ]}
    >
        <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>{number}</Text>
        </View>
        <Text style={styles.stepText}>{text}</Text>
    </Animated.View>
);

// ─── Scanning Frame Corners ─────────────────────────────────────────────────
const ScanCorners = () => {
    const cornerLen = 28;
    const cornerThick = 3;
    return (
        <View style={styles.scanCornersContainer}>
            {/* Top-left */}
            <View style={[styles.cornerTL]}>
                <View style={[styles.cornerH, { width: cornerLen, height: cornerThick }]} />
                <View style={[styles.cornerV, { width: cornerThick, height: cornerLen }]} />
            </View>
            {/* Top-right */}
            <View style={[styles.cornerTR]}>
                <View style={[styles.cornerH, { width: cornerLen, height: cornerThick }]} />
                <View style={[styles.cornerV, { width: cornerThick, height: cornerLen }]} />
            </View>
            {/* Bottom-left */}
            <View style={[styles.cornerBL]}>
                <View style={[styles.cornerH, { width: cornerLen, height: cornerThick }]} />
                <View style={[styles.cornerV, { width: cornerThick, height: cornerLen }]} />
            </View>
            {/* Bottom-right */}
            <View style={[styles.cornerBR]}>
                <View style={[styles.cornerH, { width: cornerLen, height: cornerThick }]} />
                <View style={[styles.cornerV, { width: cornerThick, height: cornerLen }]} />
            </View>
        </View>
    );
};

// ─── Main Register Screen ───────────────────────────────────────────────────
const RegisterScreen = () => {
    const navigation = useNavigation();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanSuccess, setScanSuccess] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const scanProcessed = useRef(false);

    // Animations
    const fadeBack = useRef(new Animated.Value(0)).current;
    const fadeIcon = useRef(new Animated.Value(0)).current;
    const fadeHeader = useRef(new Animated.Value(0)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;
    const fadeCamera = useRef(new Animated.Value(0)).current;
    const scanLineAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const successFade = useRef(new Animated.Value(0)).current;
    const successScale = useRef(new Animated.Value(0.5)).current;

    // Step animations
    const step1Fade = useRef(new Animated.Value(0)).current;
    const step1Slide = useRef(new Animated.Value(30)).current;
    const step2Fade = useRef(new Animated.Value(0)).current;
    const step2Slide = useRef(new Animated.Value(30)).current;

    // Shared success logic (defined before useEffect so it can be called from setTimeout)
    const triggerScanSuccess = (scannedQrId) => {
        if (scanProcessed.current) return;
        scanProcessed.current = true;
        setScanSuccess(true);

        // Animate success overlay
        Animated.parallel([
            Animated.timing(successFade, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.spring(successScale, { toValue: 1, friction: 6, useNativeDriver: true }),
        ]).start();

        // Start countdown
        let count = 5;
        setCountdown(count);
        const timer = setInterval(() => {
            count -= 1;
            setCountdown(count);
            if (count <= 0) {
                clearInterval(timer);
                navigation.replace('UserDetails', { qrId: scannedQrId });
            }
        }, 1000);
    };


    useEffect(() => {
        // Staggered entrance
        Animated.sequence([
            Animated.timing(fadeBack, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(fadeIcon, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(fadeHeader, { toValue: 1, duration: 400, useNativeDriver: true }),
            // Steps slide up
            Animated.parallel([
                Animated.timing(step1Fade, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(step1Slide, { toValue: 0, friction: 8, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(step2Fade, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(step2Slide, { toValue: 0, friction: 8, useNativeDriver: true }),
            ]),
            // Camera fade in
            Animated.timing(fadeCamera, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start();

        // Floating QR icon
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, { toValue: 1, duration: 2200, useNativeDriver: true }),
                Animated.timing(floatAnim, { toValue: 0, duration: 2200, useNativeDriver: true }),
            ])
        ).start();

        // Scanning line loop
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanLineAnim, { toValue: 1, duration: 2500, useNativeDriver: true }),
                Animated.timing(scanLineAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
            ])
        ).start();

        // Border pulse
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.02, duration: 1200, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
            ])
        ).start();

    }, []);

    const iconTranslateY = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -10],
    });

    const scanLineY = scanLineAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, CAMERA_SIZE - 6],
    });

    // Camera permission
    const handleRequestPermission = async () => {
        await requestPermission();
    };

    const cameraGranted = permission?.granted;
    const isWeb = Platform.OS === 'web';

    // State for web QR input
    const [webQrInput, setWebQrInput] = useState('');

    // Handle barcode scanned (camera - mobile only)
    const handleBarcodeScanned = (result) => {
        console.log('QR scanned:', result.data);
        // The QR holds a URL like http://.../qr/UUID
        const segments = result.data.split('/');
        const qrId = segments.pop() || result.data; // fallback
        triggerScanSuccess(qrId);
    };

    // Handle web QR input submit
    const handleWebQrSubmit = () => {
        const input = webQrInput.trim();
        if (!input) return;
        // Extract qrId from URL or use as-is
        const segments = input.split('/');
        const qrId = segments.pop() || input;
        triggerScanSuccess(qrId);
    };

    return (
        <LinearGradient
            colors={['#073B3A', '#0A4D4A', '#0D6B5E', '#0A4D4A', '#073B3A']}
            locations={[0, 0.25, 0.5, 0.75, 1]}
            style={styles.container}
        >
            {/* Background decorations */}
            <View style={styles.bgDecor1} />
            <View style={styles.bgDecor2} />
            <View style={styles.bgDecor3} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {/* Back button */}
                <Animated.View style={[styles.backButton, { opacity: fadeBack }]}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        style={styles.backTouchable}
                    >
                        <BackArrowIcon />
                    </TouchableOpacity>
                </Animated.View>

                {/* 3D QR Package — floating */}
                <Animated.View
                    style={[
                        styles.iconContainer,
                        {
                            opacity: fadeIcon,
                            transform: [{ translateY: iconTranslateY }],
                        },
                    ]}
                >
                    <QRPackageIcon size={130} />
                </Animated.View>

                {/* Heading */}
                <Animated.View style={[styles.headingContainer, { opacity: fadeHeader }]}>
                    <Text style={styles.heading}>Activate Your QR</Text>
                    <Text style={styles.subheading}>Follow the steps below to get started.</Text>
                </Animated.View>

                {/* Step cards */}
                <View style={styles.stepsContainer}>
                    <StepCard
                        number="1"
                        text="Open your QR package."
                        fadeAnim={step1Fade}
                        slideAnim={step1Slide}
                    />
                    <StepCard
                        number="2"
                        text="Scan the QR code using the camera below."
                        fadeAnim={step2Fade}
                        slideAnim={step2Slide}
                    />
                </View>

                {/* Camera section */}
                <Animated.View
                    style={[
                        styles.cameraSection,
                        {
                            opacity: fadeCamera,
                            transform: [{ scale: pulseAnim }],
                        },
                    ]}
                >
                    <View style={styles.cameraWrapper}>
                        {isWeb ? (
                            /* Web: no camera — ask user to open on mobile */
                            <View style={styles.permissionBox}>
                                <Svg width={40} height={40} viewBox="0 0 40 40">
                                    <Rect x="4" y="4" width="32" height="32" rx="6" stroke="#5EEAD4" strokeWidth="2" fill="none" />
                                    <Rect x="10" y="10" width="8" height="8" rx="1.5" stroke="#5EEAD4" strokeWidth="1.5" fill="none" />
                                    <Rect x="12" y="12" width="4" height="4" rx="0.5" fill="#5EEAD4" />
                                    <Rect x="22" y="10" width="8" height="8" rx="1.5" stroke="#5EEAD4" strokeWidth="1.5" fill="none" />
                                    <Rect x="24" y="12" width="4" height="4" rx="0.5" fill="#5EEAD4" />
                                    <Rect x="10" y="22" width="8" height="8" rx="1.5" stroke="#5EEAD4" strokeWidth="1.5" fill="none" />
                                    <Rect x="12" y="24" width="4" height="4" rx="0.5" fill="#5EEAD4" />
                                </Svg>
                                <Text style={[styles.permissionTitle, { marginTop: 14 }]}>Camera Required</Text>
                                <Text style={styles.permissionText}>
                                    Please open this app on your mobile device or tablet to scan QR codes using the camera.
                                </Text>
                            </View>
                        ) : cameraGranted ? (
                            <CameraView
                                style={styles.camera}
                                facing="back"
                                barcodeScannerSettings={{
                                    barcodeTypes: ['qr'],
                                }}
                                onBarcodeScanned={scanSuccess ? undefined : handleBarcodeScanned}
                            />
                        ) : (
                            <View style={styles.permissionBox}>
                                <Text style={styles.permissionTitle}>Camera Access</Text>
                                <Text style={styles.permissionText}>
                                    We need camera access to scan your QR code.
                                </Text>
                                <TouchableOpacity
                                    style={styles.permissionButton}
                                    onPress={handleRequestPermission}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.permissionButtonText}>Allow Camera</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Scanning overlay */}
                        {cameraGranted && (
                            <>
                                <ScanCorners />
                                {/* Animated scan line */}
                                <Animated.View
                                    style={[
                                        styles.scanLine,
                                        {
                                            transform: [{ translateY: scanLineY }],
                                        },
                                    ]}
                                />
                            </>
                        )}
                    </View>

                    {/* Helper text */}
                    <Text style={styles.helperText}>
                        Align the QR code within the frame.
                    </Text>
                </Animated.View>

                {/* Success overlay */}
                {scanSuccess && (
                    <Animated.View style={[styles.successOverlay, { opacity: successFade }]}>
                        <Animated.View style={[styles.successContent, { transform: [{ scale: successScale }] }]}>
                            <View style={styles.successCheckCircle}>
                                <Svg width={40} height={40} viewBox="0 0 40 40">
                                    <Circle cx="20" cy="20" r="18" fill="#5EEAD4" />
                                    <Path d="M13 20 L18 25 L28 15" stroke="#073B3A" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                </Svg>
                            </View>
                            <Text style={styles.successTitle}>QR Scanned Successfully!</Text>
                            <Text style={styles.successSubtext}>Redirecting in {countdown}s...</Text>
                        </Animated.View>
                    </Animated.View>
                )}
            </ScrollView>
        </LinearGradient>
    );
};

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingBottom: 40,
        alignItems: 'center',
    },

    /* Background decor */
    bgDecor1: {
        position: 'absolute',
        top: -80,
        right: -50,
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: 'rgba(94, 234, 212, 0.04)',
    },
    bgDecor2: {
        position: 'absolute',
        bottom: -60,
        left: -90,
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: 'rgba(94, 234, 212, 0.03)',
    },
    bgDecor3: {
        position: 'absolute',
        top: '45%',
        right: -30,
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(94, 234, 212, 0.025)',
    },

    /* Back button */
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 4,
    },
    backTouchable: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    /* Icon */
    iconContainer: {
        alignItems: 'center',
        marginVertical: 4,
    },

    /* Heading */
    headingContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    heading: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 0.5,
        lineHeight: 36,
    },
    subheading: {
        fontSize: 14,
        fontWeight: '400',
        color: 'rgba(255, 255, 255, 0.55)',
        textAlign: 'center',
        marginTop: 6,
        lineHeight: 20,
    },

    /* Steps */
    stepsContainer: {
        width: '100%',
        marginBottom: 24,
        gap: 12,
    },
    stepCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: 'rgba(94, 234, 212, 0.12)',
    },
    stepBadge: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'rgba(94, 234, 212, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    stepBadgeText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#5EEAD4',
    },
    stepText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.75)',
        lineHeight: 20,
    },

    /* Camera section */
    cameraSection: {
        alignItems: 'center',
        width: '100%',
    },
    cameraWrapper: {
        width: CAMERA_SIZE,
        height: CAMERA_SIZE,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(94, 234, 212, 0.3)',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    camera: {
        flex: 1,
    },

    /* Permission */
    permissionBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    permissionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    permissionText: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 18,
    },
    permissionButton: {
        backgroundColor: '#5EEAD4',
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 14,
    },
    permissionButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#073B3A',
    },

    /* Scan overlay */
    scanCornersContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    cornerTL: {
        position: 'absolute',
        top: 16,
        left: 16,
    },
    cornerTR: {
        position: 'absolute',
        top: 16,
        right: 16,
        transform: [{ scaleX: -1 }],
    },
    cornerBL: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        transform: [{ scaleY: -1 }],
    },
    cornerBR: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        transform: [{ scaleX: -1 }, { scaleY: -1 }],
    },
    cornerH: {
        backgroundColor: '#5EEAD4',
        borderRadius: 2,
    },
    cornerV: {
        backgroundColor: '#5EEAD4',
        borderRadius: 2,
        position: 'absolute',
        top: 0,
        left: 0,
    },

    /* Scan line */
    scanLine: {
        position: 'absolute',
        left: 20,
        right: 20,
        height: 2,
        backgroundColor: '#5EEAD4',
        borderRadius: 1,
        opacity: 0.6,
    },

    helperText: {
        fontSize: 13,
        fontWeight: '400',
        color: 'rgba(255, 255, 255, 0.4)',
        textAlign: 'center',
        marginTop: 16,
    },

    /* Success overlay */
    successOverlay: {
        alignItems: 'center',
        marginTop: 28,
        paddingBottom: 20,
    },
    successContent: {
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 22,
        paddingVertical: 28,
        paddingHorizontal: 32,
        borderWidth: 1,
        borderColor: 'rgba(94, 234, 212, 0.25)',
        width: '100%',
    },
    successCheckCircle: {
        marginBottom: 14,
    },
    successTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    successSubtext: {
        fontSize: 14,
        fontWeight: '400',
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'center',
        marginTop: 6,
    },
});

export default RegisterScreen;
