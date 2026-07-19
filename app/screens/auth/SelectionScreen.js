import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    Platform,
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
} from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// ─── Decorative Car + QR SVG ────────────────────────────────────────────────
const CarQrDecoration = ({ floatAnim, pulseQr }) => {
    const carY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
    const qrY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });
    const glowScale = pulseQr.interpolate({ inputRange: [1, 1.08], outputRange: [1, 1.18] });

    const svgW = width * 0.6;
    const svgH = 150;

    return (
        <View style={{ width: svgW, height: svgH, alignItems: 'center', justifyContent: 'center' }}>
            {/* Ground */}
            <Svg width={svgW} height={svgH} viewBox="0 0 260 150" style={StyleSheet.absoluteFill}>
                <Defs>
                    <SvgRadialGradient id="gGlow" cx="50%" cy="20%" r="60%">
                        <Stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.2" />
                        <Stop offset="100%" stopColor="#0A4D4A" stopOpacity="0" />
                    </SvgRadialGradient>
                </Defs>
                <Ellipse cx="130" cy="128" rx="90" ry="8" fill="rgba(0,0,0,0.12)" />
                <Rect x="20" y="120" width="220" height="30" rx="15" fill="url(#gGlow)" />
            </Svg>

            {/* Car */}
            <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateY: carY }] }]}>
                <Svg width={svgW} height={svgH} viewBox="0 0 260 150">
                    <Defs>
                        <SvgLinearGradient id="cb3d" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0%" stopColor="#F0FAF8" />
                            <Stop offset="100%" stopColor="#C8E6E0" />
                        </SvgLinearGradient>
                        <SvgLinearGradient id="cr3d" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0%" stopColor="#D4F0EC" />
                            <Stop offset="100%" stopColor="#A0D4CC" />
                        </SvgLinearGradient>
                        <SvgLinearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.5" />
                            <Stop offset="100%" stopColor="#339E92" stopOpacity="0.7" />
                        </SvgLinearGradient>
                        <SvgRadialGradient id="whl" cx="50%" cy="40%" r="50%">
                            <Stop offset="0%" stopColor="#4A5A60" />
                            <Stop offset="100%" stopColor="#1A2328" />
                        </SvgRadialGradient>
                    </Defs>
                    <Path
                        d="M50 115 L50 95 Q50 87 58 85 L95 78 Q103 68 115 62 L175 58 Q190 58 198 66 L218 78 Q228 80 232 85 L232 95 L232 115 Q232 120 227 120 L55 120 Q50 120 50 115 Z"
                        fill="url(#cb3d)" stroke="#B2DFDB" strokeWidth="0.8"
                    />
                    <Path d="M60 85 L225 80" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
                    <Path
                        d="M100 78 L115 55 Q118 50 125 50 L165 50 Q177 50 180 55 L200 78 Z"
                        fill="url(#cr3d)" stroke="#80CBC4" strokeWidth="0.8"
                    />
                    <Path d="M120 53 L172 53" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" fill="none" />
                    <Path d="M108 76 L120 57 Q122 54 125 54 L148 54 L148 76 Z" fill="url(#wg)" />
                    <Path d="M152 54 L168 54 Q172 54 174 57 L192 76 L152 76 Z" fill="url(#wg)" />
                    <Line x1="122" y1="59" x2="130" y2="59" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
                    <Line x1="150" y1="55" x2="150" y2="115" stroke="#A8D8D0" strokeWidth="0.6" />
                    <Rect x="52" y="100" width="22" height="6" rx="3" fill="#80CBC4" opacity="0.45" />
                    <Rect x="208" y="100" width="22" height="6" rx="3" fill="#80CBC4" opacity="0.45" />
                    <Rect x="52" y="88" width="10" height="6" rx="3" fill="#FFE082" opacity="0.9" />
                    <Rect x="50" y="86" width="14" height="10" rx="5" fill="#FFD54F" opacity="0.12" />
                    <Rect x="220" y="88" width="10" height="6" rx="3" fill="#EF5350" opacity="0.65" />
                    <Circle cx="90" cy="120" r="13" fill="url(#whl)" />
                    <Circle cx="90" cy="120" r="8" fill="#37474F" />
                    <Circle cx="90" cy="120" r="3.5" fill="#546E7A" />
                    <Circle cx="88" cy="118" r="1.5" fill="rgba(255,255,255,0.12)" />
                    <Circle cx="192" cy="120" r="13" fill="url(#whl)" />
                    <Circle cx="192" cy="120" r="8" fill="#37474F" />
                    <Circle cx="192" cy="120" r="3.5" fill="#546E7A" />
                    <Circle cx="190" cy="118" r="1.5" fill="rgba(255,255,255,0.12)" />
                </Svg>
            </Animated.View>

            {/* QR Tag */}
            <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateY: qrY }, { scale: glowScale }] }]}>
                <Svg width={svgW} height={svgH} viewBox="0 0 260 150">
                    <Defs>
                        <SvgRadialGradient id="qG" cx="50%" cy="50%" r="50%">
                            <Stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.55" />
                            <Stop offset="60%" stopColor="#5EEAD4" stopOpacity="0.15" />
                            <Stop offset="100%" stopColor="#5EEAD4" stopOpacity="0" />
                        </SvgRadialGradient>
                    </Defs>
                    <Circle cx="42" cy="42" r="35" fill="url(#qG)" />
                    <Rect x="18" y="18" width="48" height="48" rx="7" fill="white" opacity="0.95" />
                    <Rect x="23" y="23" width="12" height="12" rx="2" fill="#0A4D4A" />
                    <Rect x="26" y="26" width="6" height="6" rx="1" fill="white" />
                    <Rect x="27.5" y="27.5" width="3" height="3" rx="0.5" fill="#0A4D4A" />
                    <Rect x="49" y="23" width="12" height="12" rx="2" fill="#0A4D4A" />
                    <Rect x="52" y="26" width="6" height="6" rx="1" fill="white" />
                    <Rect x="53.5" y="27.5" width="3" height="3" rx="0.5" fill="#0A4D4A" />
                    <Rect x="23" y="49" width="12" height="12" rx="2" fill="#0A4D4A" />
                    <Rect x="26" y="52" width="6" height="6" rx="1" fill="white" />
                    <Rect x="27.5" y="53.5" width="3" height="3" rx="0.5" fill="#0A4D4A" />
                    <Rect x="38" y="23" width="3" height="3" fill="#0D6B5E" />
                    <Rect x="38" y="30" width="3" height="3" fill="#0D6B5E" />
                    <Rect x="42" y="27" width="3" height="3" fill="#0D6B5E" />
                    <Rect x="38" y="38" width="3" height="3" fill="#0D6B5E" />
                    <Rect x="42" y="42" width="3" height="3" fill="#0D6B5E" />
                    <Rect x="46" y="38" width="3" height="3" fill="#0D6B5E" />
                    <Rect x="50" y="42" width="3" height="3" fill="#0D6B5E" />
                    <Rect x="54" y="46" width="3" height="3" fill="#0D6B5E" />
                    <Rect x="42" y="34" width="3" height="3" fill="#0D6B5E" />
                    <Rect x="50" y="50" width="3" height="3" fill="#0D6B5E" />
                    <Rect x="54" y="54" width="3" height="3" fill="#0D6B5E" />
                    <Path d="M66 40 Q80 42 95 55" stroke="#5EEAD4" strokeWidth="1.2" strokeDasharray="3,3" fill="none" opacity="0.5" />
                    <Circle cx="75" cy="35" r="1.5" fill="#5EEAD4" opacity="0.45" />
                    <Circle cx="82" cy="50" r="1" fill="#5EEAD4" opacity="0.35" />
                </Svg>
            </Animated.View>
        </View>
    );
};

// ─── 3D Icon: User/Profile ──────────────────────────────────────────────────
const UserIcon3D = () => (
    <Svg width={52} height={52} viewBox="0 0 52 52">
        <Defs>
            <SvgLinearGradient id="userBg" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.25" />
                <Stop offset="100%" stopColor="#0D6B5E" stopOpacity="0.35" />
            </SvgLinearGradient>
            <SvgRadialGradient id="userGlow" cx="50%" cy="35%" r="50%">
                <Stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.35" />
                <Stop offset="100%" stopColor="#5EEAD4" stopOpacity="0" />
            </SvgRadialGradient>
        </Defs>
        {/* Background circle */}
        <Circle cx="26" cy="26" r="25" fill="url(#userBg)" stroke="#5EEAD4" strokeWidth="1.5" opacity="0.7" />
        <Circle cx="26" cy="26" r="22" fill="url(#userGlow)" />
        {/* Head */}
        <Circle cx="26" cy="19" r="8" fill="#E8F5F3" stroke="#80CBC4" strokeWidth="1" />
        <Circle cx="24" cy="17" r="2" fill="rgba(255,255,255,0.4)" />
        {/* Body/shoulders */}
        <Path
            d="M14 42 Q14 32 26 30 Q38 32 38 42"
            fill="#E8F5F3" stroke="#80CBC4" strokeWidth="1"
        />
        <Path d="M18 34 Q26 32 34 34" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" fill="none" />
        {/* Shadow under head */}
        <Ellipse cx="26" cy="28" rx="5" ry="1.5" fill="rgba(0,0,0,0.06)" />
    </Svg>
);

// ─── 3D Icon: QR + Car ─────────────────────────────────────────────────────
const QrCarIcon3D = () => (
    <Svg width={52} height={52} viewBox="0 0 52 52">
        <Defs>
            <SvgLinearGradient id="qrIconBg" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.25" />
                <Stop offset="100%" stopColor="#0D6B5E" stopOpacity="0.35" />
            </SvgLinearGradient>
            <SvgRadialGradient id="qrIconGlow" cx="50%" cy="40%" r="50%">
                <Stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.35" />
                <Stop offset="100%" stopColor="#5EEAD4" stopOpacity="0" />
            </SvgRadialGradient>
        </Defs>
        <Circle cx="26" cy="26" r="25" fill="url(#qrIconBg)" stroke="#5EEAD4" strokeWidth="1.5" opacity="0.7" />
        <Circle cx="26" cy="26" r="22" fill="url(#qrIconGlow)" />
        {/* Mini QR */}
        <Rect x="10" y="10" width="20" height="20" rx="3" fill="white" opacity="0.9" />
        <Rect x="13" y="13" width="6" height="6" rx="1" fill="#0A4D4A" />
        <Rect x="14.5" y="14.5" width="3" height="3" rx="0.5" fill="white" />
        <Rect x="21" y="13" width="6" height="6" rx="1" fill="#0A4D4A" />
        <Rect x="22.5" y="14.5" width="3" height="3" rx="0.5" fill="white" />
        <Rect x="13" y="21" width="6" height="6" rx="1" fill="#0A4D4A" />
        <Rect x="14.5" y="22.5" width="3" height="3" rx="0.5" fill="white" />
        <Rect x="21" y="21" width="2" height="2" fill="#0D6B5E" />
        <Rect x="25" y="21" width="2" height="2" fill="#0D6B5E" />
        {/* Mini car */}
        <Path
            d="M22 42 L22 38 Q23 36 26 36 L38 35 Q40 33 42 33 L46 33 Q47 34 47 36 L47 42 Q47 43 46 43 L23 43 Q22 43 22 42 Z"
            fill="#E8F5F3" stroke="#80CBC4" strokeWidth="0.6"
        />
        <Circle cx="27" cy="43" r="2.5" fill="#263238" />
        <Circle cx="27" cy="43" r="1.5" fill="#37474F" />
        <Circle cx="43" cy="43" r="2.5" fill="#263238" />
        <Circle cx="43" cy="43" r="1.5" fill="#37474F" />
        {/* Glow accent */}
        <Circle cx="20" cy="20" r="4" fill="rgba(94,234,212,0.15)" />
    </Svg>
);

// ─── Arrow Icon ─────────────────────────────────────────────────────────────
const ArrowIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 20 20">
        <Path
            d="M7 4 L13 10 L7 16"
            stroke="#5EEAD4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
    </Svg>
);

// ─── Reusable 3D Option Card ────────────────────────────────────────────────
const OptionCard = ({ icon, title, subtitle, slideAnim, fadeAnim, floatAnim, onPress, delay }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    const iconFloat = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -4],
    });

    const handlePressIn = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, { toValue: 0.96, friction: 5, useNativeDriver: true }),
            Animated.timing(glowAnim, { toValue: 1, duration: 150, useNativeDriver: false }),
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
            Animated.timing(glowAnim, { toValue: 0, duration: 250, useNativeDriver: false }),
        ]).start();
    };

    const borderColor = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(94, 234, 212, 0.12)', 'rgba(94, 234, 212, 0.45)'],
    });

    const cardShadowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.08, 0.2],
    });

    return (
        <Animated.View
            style={[
                styles.cardOuter,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                },
            ]}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onPress}
            >
                <Animated.View
                    style={[
                        styles.card,
                        {
                            borderColor: borderColor,
                            shadowOpacity: cardShadowOpacity,
                        },
                    ]}
                >
                    {/* Icon with float */}
                    <Animated.View style={[styles.cardIconContainer, { transform: [{ translateY: iconFloat }] }]}>
                        {icon}
                    </Animated.View>

                    {/* Text */}
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>{title}</Text>
                        <Text style={styles.cardSubtitle}>{subtitle}</Text>
                    </View>

                    {/* Arrow */}
                    <View style={styles.cardArrow}>
                        <ArrowIcon />
                    </View>
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
};

// ─── Main Selection Screen ──────────────────────────────────────────────────
const SelectionScreen = () => {
    const navigation = useNavigation();
    const fadeAppName = useRef(new Animated.Value(0)).current;
    const fadeHeading = useRef(new Animated.Value(0)).current;
    const fadeIllustration = useRef(new Animated.Value(0)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;
    const pulseQr = useRef(new Animated.Value(1)).current;

    // Card animations
    const card1Slide = useRef(new Animated.Value(50)).current;
    const card1Fade = useRef(new Animated.Value(0)).current;
    const card2Slide = useRef(new Animated.Value(50)).current;
    const card2Fade = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Staggered entrance
        Animated.sequence([
            // App name
            Animated.timing(fadeAppName, { toValue: 1, duration: 500, useNativeDriver: true }),
            // Illustration
            Animated.timing(fadeIllustration, { toValue: 1, duration: 500, useNativeDriver: true }),
            // Heading
            Animated.timing(fadeHeading, { toValue: 1, duration: 500, useNativeDriver: true }),
            // Card 1
            Animated.parallel([
                Animated.spring(card1Slide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
                Animated.timing(card1Fade, { toValue: 1, duration: 400, useNativeDriver: true }),
            ]),
            // Card 2
            Animated.parallel([
                Animated.spring(card2Slide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
                Animated.timing(card2Fade, { toValue: 1, duration: 400, useNativeDriver: true }),
            ]),
        ]).start();

        // Float loop
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
                Animated.timing(floatAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
            ])
        ).start();

        // QR pulse
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseQr, { toValue: 1.08, duration: 1500, useNativeDriver: true }),
                Animated.timing(pulseQr, { toValue: 1, duration: 1500, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const handleAlreadyUser = () => {
        navigation.navigate('Login');
    };

    const handleRegisterNew = () => {
        navigation.navigate('Register');
    };

    return (
        <LinearGradient
            colors={['#073B3A', '#0A4D4A', '#0D6B5E', '#0A4D4A', '#073B3A']}
            locations={[0, 0.25, 0.5, 0.75, 1]}
            style={styles.container}
        >
            {/* Background decor */}
            <View style={styles.bgDecor1} />
            <View style={styles.bgDecor2} />
            <View style={styles.bgDecor3} />

            {/* App Name */}
            <Animated.View style={[styles.appNameContainer, { opacity: fadeAppName }]}>
                <Text style={styles.appName}>Q YAAR</Text>
            </Animated.View>

            {/* Decorative Car + QR */}
            <Animated.View style={[styles.decorContainer, { opacity: fadeIllustration }]}>
                <CarQrDecoration floatAnim={floatAnim} pulseQr={pulseQr} />
            </Animated.View>

            {/* Heading */}
            <Animated.View style={[styles.headingContainer, { opacity: fadeHeading }]}>
                <Text style={styles.heading}>Let's Get You Started</Text>
                <Text style={styles.subheading}>Choose how you'd like to continue.</Text>
            </Animated.View>

            {/* Option Cards */}
            <View style={styles.cardsContainer}>
                <OptionCard
                    icon={<UserIcon3D />}
                    title="Already a User"
                    subtitle="Login and manage your vehicle QR."
                    slideAnim={card1Slide}
                    fadeAnim={card1Fade}
                    floatAnim={floatAnim}
                    onPress={handleAlreadyUser}
                />
                <OptionCard
                    icon={<QrCarIcon3D />}
                    title="Register New QR"
                    subtitle="Create and activate your vehicle QR."
                    slideAnim={card2Slide}
                    fadeAnim={card2Fade}
                    floatAnim={floatAnim}
                    onPress={handleRegisterNew}
                />
            </View>

            {/* Footer */}
            <Animated.Text style={[styles.footer, { opacity: fadeHeading }]}>
                Your vehicle, one scan away.
            </Animated.Text>
        </LinearGradient>
    );
};

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingBottom: Platform.OS === 'ios' ? 40 : 32,
        paddingHorizontal: 24,
        overflow: 'hidden',
    },

    /* Background decor */
    bgDecor1: {
        position: 'absolute',
        top: -60,
        right: -60,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(94, 234, 212, 0.04)',
    },
    bgDecor2: {
        position: 'absolute',
        bottom: -40,
        left: -80,
        width: 260,
        height: 260,
        borderRadius: 130,
        backgroundColor: 'rgba(94, 234, 212, 0.03)',
    },
    bgDecor3: {
        position: 'absolute',
        top: '35%',
        left: '50%',
        marginLeft: -100,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(94, 234, 212, 0.025)',
    },

    /* App name */
    appNameContainer: {
        marginBottom: 4,
        marginTop: 8,
    },
    appName: {
        fontSize: 22,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 6,
        textTransform: 'uppercase',
        textShadowColor: 'rgba(94, 234, 212, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 12,
    },

    /* Illustration */
    decorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 4,
    },

    /* Heading */
    headingContainer: {
        alignItems: 'center',
        marginBottom: 12,
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
        fontSize: 15,
        fontWeight: '400',
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
        marginTop: 8,
    },

    /* Cards */
    cardsContainer: {
        width: '100%',
        gap: 16,
        marginBottom: 8,
    },
    cardOuter: {
        width: '100%',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 22,
        paddingVertical: 18,
        paddingHorizontal: 18,
        borderWidth: 1,
        borderColor: 'rgba(94, 234, 212, 0.15)',
    },
    cardIconContainer: {
        marginRight: 14,
    },
    cardTextContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.3,
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 13,
        fontWeight: '400',
        color: 'rgba(255, 255, 255, 0.55)',
        lineHeight: 18,
    },
    cardArrow: {
        marginLeft: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(94, 234, 212, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    /* Footer */
    footer: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.3)',
        textAlign: 'center',
        marginTop: 4,
    },
});

export default SelectionScreen;
