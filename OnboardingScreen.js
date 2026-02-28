import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    Platform,
    FlatList,
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
const SLIDE_WIDTH = width;
const AUTO_SLIDE_INTERVAL = 3500;
const RESUME_DELAY = 5000;

// ─── Slide Data ─────────────────────────────────────────────────────────────
const SLIDES = [
    {
        id: '1',
        heading: 'Your Vehicle.\nOne Scan Away.',
        subtitle: 'Connect instantly and securely through\na smart QR system.',
    },
    {
        id: '2',
        heading: 'Private &\nSecure.',
        subtitle: 'Communicate through masked numbers.\nYour privacy is always protected.',
    },
    {
        id: '3',
        heading: 'Instant\nConnect.',
        subtitle: 'Reach vehicle owners in emergencies\nor parking situations — instantly.',
    },
];

// ─── SVG: Slide 1 — Car + QR (Soft 3D) ─────────────────────────────────────
const CarQrIllustration = ({ floatAnim, pulseQr }) => {
    const carTranslateY = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -6],
    });
    const qrTranslateY = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -14],
    });
    const glowScale = pulseQr.interpolate({
        inputRange: [1, 1.08],
        outputRange: [1, 1.15],
    });

    const svgW = width * 0.85;
    const svgH = 220;

    return (
        <View style={[styles.illustrationContainer, { width: svgW, height: svgH }]}>
            {/* Layer 1: Ground + Shadow (static) */}
            <Svg width={svgW} height={svgH} viewBox="0 0 340 220" style={StyleSheet.absoluteFill}>
                <Defs>
                    <SvgRadialGradient id="groundGlow" cx="50%" cy="20%" r="60%">
                        <Stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.22" />
                        <Stop offset="100%" stopColor="#0A4D4A" stopOpacity="0" />
                    </SvgRadialGradient>
                </Defs>
                <Ellipse cx="175" cy="178" rx="120" ry="10" fill="rgba(0,0,0,0.15)" />
                <Rect x="20" y="170" width="300" height="40" rx="20" fill="url(#groundGlow)" />
            </Svg>

            {/* Layer 2: Car (floats gently) */}
            <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateY: carTranslateY }] }]}>
                <Svg width={svgW} height={svgH} viewBox="0 0 340 220">
                    <Defs>
                        <SvgLinearGradient id="carBody3d" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0%" stopColor="#F0FAF8" />
                            <Stop offset="100%" stopColor="#C8E6E0" />
                        </SvgLinearGradient>
                        <SvgLinearGradient id="carRoof3d" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0%" stopColor="#D4F0EC" />
                            <Stop offset="100%" stopColor="#A0D4CC" />
                        </SvgLinearGradient>
                        <SvgLinearGradient id="windowGlass" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.5" />
                            <Stop offset="100%" stopColor="#339E92" stopOpacity="0.7" />
                        </SvgLinearGradient>
                        <SvgRadialGradient id="wheelGrad" cx="50%" cy="40%" r="50%">
                            <Stop offset="0%" stopColor="#4A5A60" />
                            <Stop offset="100%" stopColor="#1A2328" />
                        </SvgRadialGradient>
                    </Defs>

                    {/* Body */}
                    <Path
                        d="M55 155 L55 130 Q55 120 65 118 L120 108 Q130 96 145 88 L220 82 Q240 82 250 92 L275 108 Q290 110 295 118 L295 130 L295 155 Q295 162 288 162 L62 162 Q55 162 55 155 Z"
                        fill="url(#carBody3d)"
                        stroke="#B2DFDB"
                        strokeWidth="1"
                    />
                    <Path d="M70 118 L275 110" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none" />

                    {/* Roof */}
                    <Path
                        d="M125 108 L145 78 Q150 72 160 72 L210 72 Q225 72 230 78 L255 108 Z"
                        fill="url(#carRoof3d)"
                        stroke="#80CBC4"
                        strokeWidth="1"
                    />
                    <Path d="M150 76 L220 76" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none" />

                    {/* Windows */}
                    <Path d="M135 105 L152 80 Q155 76 160 76 L185 76 L185 105 Z" fill="url(#windowGlass)" />
                    <Path d="M190 76 L215 76 Q220 76 224 80 L245 105 L190 105 Z" fill="url(#windowGlass)" />
                    <Line x1="155" y1="82" x2="165" y2="82" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                    <Line x1="210" y1="82" x2="225" y2="88" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

                    {/* Door line */}
                    <Line x1="188" y1="78" x2="188" y2="155" stroke="#A8D8D0" strokeWidth="0.8" />

                    {/* Bumpers */}
                    <Rect x="60" y="140" width="30" height="8" rx="4" fill="#80CBC4" opacity="0.5" />
                    <Rect x="260" y="140" width="30" height="8" rx="4" fill="#80CBC4" opacity="0.5" />

                    {/* Headlights */}
                    <Rect x="58" y="122" width="14" height="8" rx="4" fill="#FFE082" opacity="0.95" />
                    <Rect x="56" y="120" width="18" height="12" rx="6" fill="#FFD54F" opacity="0.15" />
                    <Rect x="278" y="122" width="14" height="8" rx="4" fill="#EF5350" opacity="0.7" />
                    <Rect x="276" y="120" width="18" height="12" rx="6" fill="#EF5350" opacity="0.12" />

                    {/* Wheels */}
                    <Circle cx="110" cy="162" r="18" fill="url(#wheelGrad)" />
                    <Circle cx="110" cy="162" r="12" fill="#37474F" />
                    <Circle cx="110" cy="162" r="5" fill="#546E7A" />
                    <Circle cx="108" cy="160" r="2" fill="rgba(255,255,255,0.15)" />
                    <Circle cx="240" cy="162" r="18" fill="url(#wheelGrad)" />
                    <Circle cx="240" cy="162" r="12" fill="#37474F" />
                    <Circle cx="240" cy="162" r="5" fill="#546E7A" />
                    <Circle cx="238" cy="160" r="2" fill="rgba(255,255,255,0.15)" />
                </Svg>
            </Animated.View>

            {/* Layer 3: QR (floats + pulses) */}
            <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateY: qrTranslateY }, { scale: glowScale }] }]}>
                <Svg width={svgW} height={svgH} viewBox="0 0 340 220">
                    <Defs>
                        <SvgRadialGradient id="qrGlow" cx="50%" cy="50%" r="50%">
                            <Stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.6" />
                            <Stop offset="100%" stopColor="#5EEAD4" stopOpacity="0" />
                        </SvgRadialGradient>
                    </Defs>
                    <Circle cx="50" cy="65" r="50" fill="url(#qrGlow)" />

                    {/* QR background */}
                    <Rect x="20" y="30" width="60" height="60" rx="8" fill="white" opacity="0.97" />

                    {/* QR pattern */}
                    <Rect x="26" y="36" width="16" height="16" rx="2" fill="#0A4D4A" />
                    <Rect x="30" y="40" width="8" height="8" rx="1" fill="white" />
                    <Rect x="32" y="42" width="4" height="4" rx="0.5" fill="#0A4D4A" />
                    <Rect x="58" y="36" width="16" height="16" rx="2" fill="#0A4D4A" />
                    <Rect x="62" y="40" width="8" height="8" rx="1" fill="white" />
                    <Rect x="64" y="42" width="4" height="4" rx="0.5" fill="#0A4D4A" />
                    <Rect x="26" y="68" width="16" height="16" rx="2" fill="#0A4D4A" />
                    <Rect x="30" y="72" width="8" height="8" rx="1" fill="white" />
                    <Rect x="32" y="74" width="4" height="4" rx="0.5" fill="#0A4D4A" />

                    {/* Data modules */}
                    <Rect x="46" y="36" width="4" height="4" fill="#0D6B5E" />
                    <Rect x="46" y="44" width="4" height="4" fill="#0D6B5E" />
                    <Rect x="50" y="40" width="4" height="4" fill="#0D6B5E" />
                    <Rect x="46" y="52" width="4" height="4" fill="#0D6B5E" />
                    <Rect x="50" y="56" width="4" height="4" fill="#0D6B5E" />
                    <Rect x="54" y="52" width="4" height="4" fill="#0D6B5E" />
                    <Rect x="46" y="60" width="4" height="4" fill="#0D6B5E" />
                    <Rect x="58" y="56" width="4" height="4" fill="#0D6B5E" />
                    <Rect x="62" y="60" width="4" height="4" fill="#0D6B5E" />
                    <Rect x="66" y="64" width="4" height="4" fill="#0D6B5E" />
                    <Rect x="58" y="68" width="4" height="4" fill="#0D6B5E" />
                    <Rect x="66" y="72" width="4" height="4" fill="#0D6B5E" />
                    <Rect x="50" y="48" width="4" height="4" fill="#0D6B5E" />
                    <Rect x="54" y="44" width="4" height="4" fill="#0D6B5E" />
                    <Rect x="62" y="52" width="4" height="4" fill="#0D6B5E" />
                    <Rect x="70" y="56" width="4" height="4" fill="#0D6B5E" />
                    <Rect x="70" y="68" width="4" height="4" fill="#0D6B5E" />

                    {/* Scan lines */}
                    <Path d="M80 60 Q100 62 120 80" stroke="#5EEAD4" strokeWidth="1.5" strokeDasharray="4,4" fill="none" opacity="0.6" />
                    <Path d="M75 70 Q95 75 115 90" stroke="#5EEAD4" strokeWidth="1" strokeDasharray="3,5" fill="none" opacity="0.4" />

                    {/* Particles */}
                    <Circle cx="90" cy="50" r="2" fill="#5EEAD4" opacity="0.5" />
                    <Circle cx="100" cy="70" r="1.5" fill="#5EEAD4" opacity="0.4" />
                    <Circle cx="85" cy="80" r="1" fill="#5EEAD4" opacity="0.3" />
                </Svg>
            </Animated.View>
        </View>
    );
};

// ─── SVG: Slide 2 — Shield + Lock (Privacy) ────────────────────────────────
const ShieldIllustration = ({ floatAnim }) => {
    const translateY = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -10],
    });

    return (
        <Animated.View style={[styles.illustrationContainer, { transform: [{ translateY }] }]}>
            <Svg width={width * 0.7} height={200} viewBox="0 0 280 200">
                <Defs>
                    <SvgLinearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.3" />
                        <Stop offset="100%" stopColor="#0D6B5E" stopOpacity="0.6" />
                    </SvgLinearGradient>
                    <SvgRadialGradient id="shieldGlow" cx="50%" cy="40%" r="50%">
                        <Stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.25" />
                        <Stop offset="100%" stopColor="#5EEAD4" stopOpacity="0" />
                    </SvgRadialGradient>
                </Defs>

                <Circle cx="140" cy="95" r="80" fill="url(#shieldGlow)" />

                {/* Shield */}
                <Path
                    d="M140 20 L195 45 Q200 48 200 55 L200 105 Q200 145 140 180 Q80 145 80 105 L80 55 Q80 48 85 45 Z"
                    fill="url(#shieldGrad)"
                    stroke="#5EEAD4"
                    strokeWidth="2"
                />
                <Path
                    d="M140 32 L186 53 Q190 55 190 60 L190 102 Q190 136 140 165 Q90 136 90 102 L90 60 Q90 55 94 53 Z"
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="1"
                />

                {/* Lock */}
                <Rect x="122" y="88" width="36" height="30" rx="4" fill="#E8F5F3" stroke="#80CBC4" strokeWidth="1.5" />
                <Path
                    d="M128 88 L128 78 Q128 68 140 68 Q152 68 152 78 L152 88"
                    fill="none"
                    stroke="#B2DFDB"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                <Circle cx="140" cy="100" r="4" fill="#0A4D4A" />
                <Rect x="138.5" y="102" width="3" height="8" rx="1.5" fill="#0A4D4A" />

                {/* Masked number dots */}
                <Rect x="105" y="125" width="70" height="16" rx="8" fill="rgba(255,255,255,0.12)" />
                <Circle cx="118" cy="133" r="2" fill="#5EEAD4" opacity="0.7" />
                <Circle cx="126" cy="133" r="2" fill="#5EEAD4" opacity="0.7" />
                <Circle cx="134" cy="133" r="2" fill="#5EEAD4" opacity="0.7" />
                <Circle cx="142" cy="133" r="2" fill="#5EEAD4" opacity="0.7" />
                <Circle cx="150" cy="133" r="2" fill="#5EEAD4" opacity="0.5" />
                <Circle cx="158" cy="133" r="2" fill="#5EEAD4" opacity="0.5" />
                <Circle cx="166" cy="133" r="2" fill="#5EEAD4" opacity="0.5" />

                {/* Decorative particles */}
                <Circle cx="60" cy="60" r="3" fill="#5EEAD4" opacity="0.3" />
                <Circle cx="220" cy="70" r="2" fill="#5EEAD4" opacity="0.4" />
                <Circle cx="50" cy="130" r="2" fill="#5EEAD4" opacity="0.25" />
                <Circle cx="230" cy="140" r="3" fill="#5EEAD4" opacity="0.2" />
            </Svg>
        </Animated.View>
    );
};

// ─── SVG: Slide 3 — Instant Connect ────────────────────────────────────────
const ConnectIllustration = ({ floatAnim }) => {
    const translateY = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -10],
    });

    return (
        <Animated.View style={[styles.illustrationContainer, { transform: [{ translateY }] }]}>
            <Svg width={width * 0.7} height={200} viewBox="0 0 280 200">
                <Defs>
                    <SvgLinearGradient id="phoneGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0%" stopColor="#E8F5F3" />
                        <Stop offset="100%" stopColor="#C8E6E0" />
                    </SvgLinearGradient>
                    <SvgRadialGradient id="connectGlow" cx="50%" cy="50%" r="50%">
                        <Stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.3" />
                        <Stop offset="100%" stopColor="#5EEAD4" stopOpacity="0" />
                    </SvgRadialGradient>
                </Defs>

                <Circle cx="140" cy="100" r="80" fill="url(#connectGlow)" />

                {/* Phone */}
                <Rect x="110" y="40" width="60" height="120" rx="10" fill="url(#phoneGrad)" stroke="#80CBC4" strokeWidth="1.5" />
                <Rect x="116" y="52" width="48" height="90" rx="4" fill="#0A4D4A" opacity="0.8" />
                <Rect x="130" y="146" width="20" height="4" rx="2" fill="#80CBC4" opacity="0.5" />
                <Rect x="132" y="44" width="16" height="2" rx="1" fill="#80CBC4" opacity="0.4" />

                {/* Notification bell */}
                <Path d="M136 75 Q136 68 140 68 Q144 68 144 75 L146 82 L134 82 Z" fill="#5EEAD4" opacity="0.9" />
                <Circle cx="140" cy="85" r="2" fill="#5EEAD4" opacity="0.8" />
                <Line x1="134" y1="82" x2="146" y2="82" stroke="#5EEAD4" strokeWidth="1" opacity="0.6" />

                {/* Notification lines */}
                <Rect x="124" y="92" width="32" height="3" rx="1.5" fill="rgba(94,234,212,0.4)" />
                <Rect x="126" y="99" width="28" height="3" rx="1.5" fill="rgba(94,234,212,0.25)" />
                <Rect x="128" y="106" width="24" height="3" rx="1.5" fill="rgba(94,234,212,0.15)" />

                {/* Signal waves */}
                <Path d="M172 75 Q180 70 180 80" stroke="#5EEAD4" strokeWidth="1.5" fill="none" opacity="0.6" />
                <Path d="M178 68 Q190 62 190 85" stroke="#5EEAD4" strokeWidth="1.5" fill="none" opacity="0.4" />
                <Path d="M184 60 Q200 52 200 92" stroke="#5EEAD4" strokeWidth="1.5" fill="none" opacity="0.25" />
                <Path d="M108 75 Q100 70 100 80" stroke="#5EEAD4" strokeWidth="1.5" fill="none" opacity="0.6" />
                <Path d="M102 68 Q90 62 90 85" stroke="#5EEAD4" strokeWidth="1.5" fill="none" opacity="0.4" />
                <Path d="M96 60 Q80 52 80 92" stroke="#5EEAD4" strokeWidth="1.5" fill="none" opacity="0.25" />

                {/* Small car icon */}
                <Path
                    d="M200 155 L200 148 Q202 145 207 145 L225 143 Q228 140 232 140 L245 140 Q250 140 252 143 L258 145 Q262 146 262 148 L262 155 Q262 158 260 158 L202 158 Q200 158 200 155 Z"
                    fill="rgba(255,255,255,0.15)"
                    stroke="#5EEAD4"
                    strokeWidth="0.8"
                    opacity="0.5"
                />
                <Circle cx="212" cy="158" r="4" fill="#5EEAD4" opacity="0.3" />
                <Circle cx="250" cy="158" r="4" fill="#5EEAD4" opacity="0.3" />

                {/* Particles */}
                <Circle cx="70" cy="55" r="2" fill="#5EEAD4" opacity="0.3" />
                <Circle cx="210" cy="60" r="2.5" fill="#5EEAD4" opacity="0.35" />
                <Circle cx="65" cy="130" r="1.5" fill="#5EEAD4" opacity="0.2" />
                <Circle cx="215" cy="140" r="2" fill="#5EEAD4" opacity="0.25" />
            </Svg>
        </Animated.View>
    );
};

// ─── Main Onboarding Screen ─────────────────────────────────────────────────
const OnboardingScreen = () => {
    const navigation = useNavigation();
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);
    const autoSlideTimer = useRef(null);
    const isUserSwiping = useRef(false);
    const resumeTimer = useRef(null);

    // Animation refs
    const fadeAppName = useRef(new Animated.Value(0)).current;
    const fadeContent = useRef(new Animated.Value(0)).current;
    const slideButton = useRef(new Animated.Value(60)).current;
    const fadeButton = useRef(new Animated.Value(0)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;
    const scaleButton = useRef(new Animated.Value(1)).current;
    const pulseQr = useRef(new Animated.Value(1)).current;
    const fadeDots = useRef(new Animated.Value(0)).current;

    // Per-slide text fade
    const slideFades = useRef(SLIDES.map(() => new Animated.Value(0))).current;

    // Dot animated values (width + opacity)
    const dotWidths = useRef(SLIDES.map((_, i) => new Animated.Value(i === 0 ? 28 : 8))).current;
    const dotOpacities = useRef(SLIDES.map((_, i) => new Animated.Value(i === 0 ? 1 : 0.25))).current;

    // ── Animate dots ──
    const animateDots = useCallback((newIndex) => {
        SLIDES.forEach((_, i) => {
            const isActive = i === newIndex;
            Animated.parallel([
                Animated.timing(dotWidths[i], {
                    toValue: isActive ? 28 : 8,
                    duration: 300,
                    useNativeDriver: false,
                }),
                Animated.timing(dotOpacities[i], {
                    toValue: isActive ? 1 : 0.25,
                    duration: 300,
                    useNativeDriver: false,
                }),
            ]).start();
        });
    }, [dotWidths, dotOpacities]);

    // ── Slide text fade ──
    const animateSlideText = useCallback((index) => {
        // Reset all slide fades first
        slideFades.forEach((anim) => anim.setValue(0));
        Animated.timing(slideFades[index], {
            toValue: 1,
            duration: 450,
            useNativeDriver: true,
        }).start();
    }, [slideFades]);

    // ── Auto-slide ──
    const startAutoSlide = useCallback(() => {
        if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
        autoSlideTimer.current = setInterval(() => {
            if (isUserSwiping.current) return;
            setActiveIndex((prev) => {
                const next = (prev + 1) % SLIDES.length;
                try {
                    flatListRef.current?.scrollToIndex({ index: next, animated: true });
                } catch (e) {
                    // ignore scroll errors
                }
                return next;
            });
        }, AUTO_SLIDE_INTERVAL);
    }, []);

    const stopAutoSlide = useCallback(() => {
        if (autoSlideTimer.current) {
            clearInterval(autoSlideTimer.current);
            autoSlideTimer.current = null;
        }
    }, []);

    // ── Entrance animations ──
    useEffect(() => {
        slideFades[0].setValue(1);

        Animated.sequence([
            Animated.timing(fadeAppName, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(fadeContent, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }),
            Animated.timing(fadeDots, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.parallel([
                Animated.spring(slideButton, {
                    toValue: 0,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeButton, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        // Floating animation
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

        startAutoSlide();

        return () => {
            stopAutoSlide();
            if (resumeTimer.current) clearTimeout(resumeTimer.current);
        };
    }, []);

    // ── React to active index ──
    useEffect(() => {
        animateDots(activeIndex);
        animateSlideText(activeIndex);
    }, [activeIndex]);

    // ── FlatList callbacks ──
    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const idx = viewableItems[0].index;
            if (idx != null) setActiveIndex(idx);
        }
    }).current;

    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const onScrollBeginDrag = useCallback(() => {
        isUserSwiping.current = true;
        stopAutoSlide();
        if (resumeTimer.current) clearTimeout(resumeTimer.current);
        resumeTimer.current = setTimeout(() => {
            isUserSwiping.current = false;
            startAutoSlide();
        }, RESUME_DELAY);
    }, [stopAutoSlide, startAutoSlide]);

    // ── Button handlers ──
    const handlePressIn = () => {
        Animated.spring(scaleButton, { toValue: 0.93, friction: 5, useNativeDriver: true }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleButton, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    };

    const handleGetStarted = () => {
        stopAutoSlide();
        navigation.navigate('AccountSelection');
    };

    // ── Render illustration for each slide ──
    const getIllustration = (index) => {
        switch (index) {
            case 0:
                return <CarQrIllustration floatAnim={floatAnim} pulseQr={pulseQr} />;
            case 1:
                return <ShieldIllustration floatAnim={floatAnim} />;
            case 2:
                return <ConnectIllustration floatAnim={floatAnim} />;
            default:
                return null;
        }
    };

    // ── Render slide ──
    const renderSlide = ({ item, index }) => (
        <View style={styles.slideContainer}>
            {getIllustration(index)}
            <Animated.View style={[styles.textContainer, { opacity: slideFades[index] }]}>
                <Text style={styles.heading}>{item.heading}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
            </Animated.View>
        </View>
    );

    return (
        <LinearGradient
            colors={['#073B3A', '#0A4D4A', '#0D6B5E', '#0A4D4A', '#073B3A']}
            locations={[0, 0.25, 0.5, 0.75, 1]}
            style={styles.container}
        >
            {/* Background decor */}
            <View style={styles.bgDecor1} />
            <View style={styles.bgDecor2} />

            {/* App Name */}
            <Animated.View style={[styles.appNameContainer, { opacity: fadeAppName }]}>
                <Text style={styles.appName}>Q YAAR</Text>
            </Animated.View>

            {/* Swipeable Slides */}
            <Animated.View style={[styles.slidesArea, { opacity: fadeContent }]}>
                <FlatList
                    ref={flatListRef}
                    data={SLIDES}
                    renderItem={renderSlide}
                    keyExtractor={(item) => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    bounces={false}
                    snapToInterval={SLIDE_WIDTH}
                    decelerationRate="fast"
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    onScrollBeginDrag={onScrollBeginDrag}
                    getItemLayout={(_, index) => ({
                        length: SLIDE_WIDTH,
                        offset: SLIDE_WIDTH * index,
                        index,
                    })}
                />
            </Animated.View>

            {/* Pagination Dots */}
            <Animated.View style={[styles.dotsContainer, { opacity: fadeDots }]}>
                {SLIDES.map((_, i) => (
                    <Animated.View
                        key={i}
                        style={[
                            styles.dot,
                            {
                                width: dotWidths[i],
                                opacity: dotOpacities[i],
                                backgroundColor: '#5EEAD4',
                            },
                        ]}
                    />
                ))}
            </Animated.View>

            {/* CTA Button */}
            <Animated.View
                style={[
                    styles.buttonWrapper,
                    {
                        opacity: fadeButton,
                        transform: [{ translateY: slideButton }, { scale: scaleButton }],
                    },
                ]}
            >
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.9}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={handleGetStarted}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Terms */}
            <Animated.Text style={[styles.terms, { opacity: fadeButton }]}>
                By continuing, you agree to our Terms & Privacy Policy
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
        overflow: 'hidden',
    },

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

    /* App name — enhanced with glow */
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

    /* Slides */
    slidesArea: {
        flex: 1,
        width: '100%',
    },
    slideContainer: {
        width: SLIDE_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },

    illustrationContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
    },

    textContainer: {
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    heading: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 42,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '400',
        color: 'rgba(255, 255, 255, 0.65)',
        textAlign: 'center',
        lineHeight: 24,
        marginTop: 16,
        paddingHorizontal: 16,
    },

    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 5,
    },

    buttonWrapper: {
        width: '100%',
        paddingHorizontal: 40,
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 18,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    buttonText: {
        color: '#0A4D4A',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.8,
    },

    terms: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.35)',
        textAlign: 'center',
        marginTop: 4,
        paddingHorizontal: 24,
    },
});

export default OnboardingScreen;
