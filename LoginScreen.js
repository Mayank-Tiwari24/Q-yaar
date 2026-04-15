import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
    Keyboard,
    Alert,
    ActivityIndicator,
} from 'react-native';
import API_URL from './config';
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

// ─── 3D Phone Icon (larger, more detail) ────────────────────────────────────
const PhoneIcon3D = ({ size = 140 }) => (
    <Svg width={size} height={size} viewBox="0 0 140 140">
        <Defs>
            <SvgLinearGradient id="phoneBod" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#F0FAF8" />
                <Stop offset="100%" stopColor="#C8E6E0" />
            </SvgLinearGradient>
            <SvgLinearGradient id="phoneScr" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#0D6B5E" stopOpacity="0.85" />
                <Stop offset="100%" stopColor="#073B3A" stopOpacity="0.95" />
            </SvgLinearGradient>
            <SvgRadialGradient id="phoneGlow" cx="50%" cy="38%" r="55%">
                <Stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.35" />
                <Stop offset="60%" stopColor="#5EEAD4" stopOpacity="0.08" />
                <Stop offset="100%" stopColor="#5EEAD4" stopOpacity="0" />
            </SvgRadialGradient>
            <SvgLinearGradient id="phoneHighlight" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </SvgLinearGradient>
        </Defs>
        {/* Outer glow */}
        <Circle cx="70" cy="70" r="65" fill="url(#phoneGlow)" />
        {/* Phone shadow */}
        <Ellipse cx="70" cy="126" rx="24" ry="5" fill="rgba(0,0,0,0.1)" />
        {/* Phone body */}
        <Rect x="38" y="16" width="64" height="108" rx="14" fill="url(#phoneBod)" stroke="#80CBC4" strokeWidth="1.2" />
        {/* Side highlight */}
        <Path d="M42 30 L42 90" stroke="url(#phoneHighlight)" strokeWidth="2" />
        {/* Screen */}
        <Rect x="45" y="30" width="50" height="76" rx="6" fill="url(#phoneScr)" />
        {/* Top notch */}
        <Rect x="58" y="21" width="24" height="4" rx="2" fill="#80CBC4" opacity="0.5" />
        {/* Camera dot */}
        <Circle cx="80" cy="23" r="2" fill="#5EEAD4" opacity="0.35" />
        {/* Home indicator */}
        <Rect x="56" y="114" width="28" height="4" rx="2" fill="#80CBC4" opacity="0.4" />
        {/* Screen content - user avatar */}
        <Circle cx="70" cy="55" r="9" fill="#5EEAD4" opacity="0.55" />
        <Circle cx="68" cy="53" r="2.5" fill="rgba(255,255,255,0.25)" />
        <Path d="M58 78 Q58 68 70 66 Q82 68 82 78" fill="#5EEAD4" opacity="0.35" />
        {/* Lock icon */}
        <Rect x="65" y="84" width="10" height="8" rx="2" fill="#5EEAD4" opacity="0.45" />
        <Path d="M67 84 L67 80 Q67 77 70 77 Q73 77 73 80 L73 84" stroke="#5EEAD4" strokeWidth="1.2" fill="none" opacity="0.45" />
        <Circle cx="70" cy="88" r="1.2" fill="white" opacity="0.5" />
        {/* Shield checkmark */}
        <Path d="M70 96 L65 98 L65 102 Q65 105 70 107 Q75 105 75 102 L75 98 Z" fill="#5EEAD4" opacity="0.3" />
        <Path d="M67 102 L69 104 L73 100" stroke="white" strokeWidth="1" fill="none" opacity="0.4" />
    </Svg>
);

// ─── 3D Email Icon (larger, more detail) ────────────────────────────────────
const EmailIcon3D = ({ size = 140 }) => (
    <Svg width={size} height={size} viewBox="0 0 140 140">
        <Defs>
            <SvgLinearGradient id="envBg" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#F0FAF8" />
                <Stop offset="100%" stopColor="#C8E6E0" />
            </SvgLinearGradient>
            <SvgLinearGradient id="envFlap" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#E0F2F0" />
                <Stop offset="100%" stopColor="#B2DFDB" />
            </SvgLinearGradient>
            <SvgRadialGradient id="envGlow" cx="50%" cy="38%" r="55%">
                <Stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.35" />
                <Stop offset="60%" stopColor="#5EEAD4" stopOpacity="0.08" />
                <Stop offset="100%" stopColor="#5EEAD4" stopOpacity="0" />
            </SvgRadialGradient>
            <SvgLinearGradient id="envShadow" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#A0D4CC" stopOpacity="0.3" />
                <Stop offset="100%" stopColor="#A0D4CC" stopOpacity="0" />
            </SvgLinearGradient>
        </Defs>
        {/* Outer glow */}
        <Circle cx="70" cy="70" r="65" fill="url(#envGlow)" />
        {/* Shadow */}
        <Ellipse cx="70" cy="118" rx="38" ry="6" fill="rgba(0,0,0,0.08)" />
        {/* Envelope body */}
        <Rect x="22" y="42" width="96" height="64" rx="10" fill="url(#envBg)" stroke="#80CBC4" strokeWidth="1.2" />
        {/* Depth edge */}
        <Path d="M22 100 Q22 106 32 106 L108 106 Q118 106 118 100" fill="url(#envShadow)" />
        {/* Flap */}
        <Path d="M22 50 L70 82 L118 50" stroke="#80CBC4" strokeWidth="1.2" fill="url(#envFlap)" />
        {/* Inner fold lines */}
        <Path d="M22 106 L50 78" stroke="#A0D4CC" strokeWidth="0.7" fill="none" />
        <Path d="M118 106 L90 78" stroke="#A0D4CC" strokeWidth="0.7" fill="none" />
        {/* @ symbol */}
        <Circle cx="70" cy="68" r="7" stroke="#5EEAD4" strokeWidth="1.5" fill="none" opacity="0.55" />
        <Path d="M77 68 Q77 58 70 58 Q63 58 63 68 Q63 74 70 74 Q74 74 77 71" stroke="#5EEAD4" strokeWidth="1.2" fill="none" opacity="0.45" />
        {/* Highlight */}
        <Path d="M26 44 Q36 42 28 56 Z" fill="rgba(255,255,255,0.2)" />
        {/* Notification badge */}
        <Circle cx="108" cy="38" r="10" fill="#5EEAD4" opacity="0.75" />
        <Circle cx="108" cy="38" r="12" fill="#5EEAD4" opacity="0.15" />
        <Path d="M105 38 L107 40 L112 35" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {/* Floating sparkles */}
        <Circle cx="30" cy="38" r="2" fill="#5EEAD4" opacity="0.2" />
        <Circle cx="115" cy="112" r="1.5" fill="#5EEAD4" opacity="0.15" />
    </Svg>
);

// ─── Small Phone Icon (for input) ───────────────────────────────────────────
const PhoneSmallIcon = () => (
    <Svg width={22} height={22} viewBox="0 0 22 22">
        <Rect x="5" y="2" width="12" height="18" rx="3" fill="none" stroke="#5EEAD4" strokeWidth="1.5" />
        <Rect x="7" y="5" width="8" height="11" rx="1" fill="#5EEAD4" opacity="0.15" />
        <Circle cx="11" cy="18" r="1" fill="#5EEAD4" opacity="0.6" />
    </Svg>
);

// ─── Small Email Icon (for input) ───────────────────────────────────────────
const EmailSmallIcon = () => (
    <Svg width={22} height={22} viewBox="0 0 22 22">
        <Rect x="2" y="5" width="18" height="12" rx="3" fill="none" stroke="#5EEAD4" strokeWidth="1.5" />
        <Path d="M2 8 L11 14 L20 8" stroke="#5EEAD4" strokeWidth="1.2" fill="none" />
    </Svg>
);

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

// ─── OTP Input Box ──────────────────────────────────────────────────────────
const OtpBox = React.forwardRef(({ value, onChangeText, onKeyPress, isFocused, fadeAnim }, ref) => {
    const borderColor = isFocused ? 'rgba(94, 234, 212, 0.6)' : 'rgba(94, 234, 212, 0.15)';
    const bgColor = isFocused ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.06)';

    return (
        <Animated.View style={[styles.otpBoxWrapper, { opacity: fadeAnim }]}>
            <TextInput
                ref={ref}
                style={[styles.otpBox, { borderColor, backgroundColor: bgColor }]}
                value={value}
                onChangeText={onChangeText}
                onKeyPress={onKeyPress}
                keyboardType="number-pad"
                maxLength={1}
                selectionColor="#5EEAD4"
                placeholderTextColor="rgba(255,255,255,0.2)"
            />
        </Animated.View>
    );
});

// ─── Validation helpers ─────────────────────────────────────────────────────
const isPhoneValid = (value) => {
    const digits = value.replace(/[^0-9]/g, '');
    return digits.length === 10;
};

const isEmailValid = (value) => {
    const trimmed = value.trim();
    return trimmed.length > 0 && trimmed.includes('@') && trimmed.indexOf('@') < trimmed.length - 1;
};

// ─── Main Login Screen ──────────────────────────────────────────────────────
const LoginScreen = () => {
    const navigation = useNavigation();

    // Input mode: 'phone' only (email login not supported yet)
    const [inputMode, setInputMode] = useState('phone');
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Animations
    const fadeHeader = useRef(new Animated.Value(0)).current;
    const fadeIcon = useRef(new Animated.Value(0)).current;
    const fadeForm = useRef(new Animated.Value(0)).current;
    const fadeBack = useRef(new Animated.Value(0)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;
    const scaleButton = useRef(new Animated.Value(1)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const buttonOpacity = useRef(new Animated.Value(0.4)).current;
    const inputBorderAnim = useRef(new Animated.Value(0)).current;

    // ── Validation ──
    const isValid = inputMode === 'phone' ? isPhoneValid(inputValue) : isEmailValid(inputValue);

    // Animate button opacity + input border on validity change
    useEffect(() => {
        Animated.parallel([
            Animated.timing(buttonOpacity, {
                toValue: isValid ? 1 : 0.4,
                duration: 250,
                useNativeDriver: false,
            }),
            Animated.timing(inputBorderAnim, {
                toValue: isValid ? 1 : 0,
                duration: 250,
                useNativeDriver: false,
            }),
        ]).start();
    }, [isValid]);

    useEffect(() => {
        // Staggered entrance
        Animated.sequence([
            Animated.timing(fadeBack, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(fadeIcon, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(fadeHeader, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(fadeForm, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start();

        // Float loop
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, { toValue: 1, duration: 2200, useNativeDriver: true }),
                Animated.timing(floatAnim, { toValue: 0, duration: 2200, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const iconTranslateY = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -10],
    });

    const inputBorderColor = inputBorderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(94, 234, 212, 0.12)', 'rgba(94, 234, 212, 0.5)'],
    });

    // ── Shake animation ──
    const triggerShake = () => {
        shakeAnim.setValue(0);
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -1, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -1, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
        ]).start();
    };

    const shakeTranslateX = shakeAnim.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [-8, 0, 8],
    });

    // Toggle input mode
    const switchMode = (mode) => {
        if (mode !== inputMode) {
            setInputMode(mode);
            setInputValue('');
            setShowOtp(false);
            setOtp(['', '', '', '']);
        }
    };

    // Handle phone input — only allow numeric digits, max 10
    const handleInputChange = (text) => {
        if (inputMode === 'phone') {
            const digits = text.replace(/[^0-9]/g, '');
            if (digits.length <= 10) {
                setInputValue(digits);
            }
        } else {
            setInputValue(text);
        }
    };

    // Handle Login with mobile number
    const handleLogin = async () => {
        if (!isValid) {
            triggerShake();
            return;
        }

        Keyboard.dismiss();
        setIsLoading(true);
        setErrorMsg('');

        try {
            const response = await fetch(`${API_URL}/qr/user/${inputValue}`);
            const data = await response.json();

            if (data.success && data.data.vehicles.length > 0) {
                // User found with registered vehicles
                navigation.reset({
                    index: 0,
                    routes: [{
                        name: 'Home',
                        params: {
                            mobileNumber: inputValue,
                            userData: data.data,
                        },
                    }],
                });
            } else {
                // No vehicles found for this number
                setErrorMsg('No account found with this number. Please register first.');
                triggerShake();
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMsg('Connection error. Please try again.');
            triggerShake();
        } finally {
            setIsLoading(false);
        }
    };

    // Button press animations
    const handlePressIn = () => {
        if (isValid) {
            Animated.spring(scaleButton, { toValue: 0.94, friction: 5, useNativeDriver: true }).start();
        }
    };
    const handlePressOut = () => {
        Animated.spring(scaleButton, { toValue: 1, friction: 5, useNativeDriver: true }).start();
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

            <KeyboardAvoidingView
                style={styles.flex1}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
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

                    {/* 3D Animated Icon — larger */}
                    <Animated.View
                        style={[
                            styles.iconContainer,
                            {
                                opacity: fadeIcon,
                                transform: [{ translateY: iconTranslateY }],
                            },
                        ]}
                    >
                        {inputMode === 'phone' ? <PhoneIcon3D size={140} /> : <EmailIcon3D size={140} />}
                    </Animated.View>

                    {/* Heading */}
                    <Animated.View style={[styles.headingContainer, { opacity: fadeHeader }]}>
                        <Text style={styles.heading}>Welcome Back</Text>
                        <Text style={styles.subheading}>
                            Enter your {inputMode === 'phone' ? 'mobile number' : 'email'} to continue.
                        </Text>
                    </Animated.View>

                    {/* Input mode toggle */}
                    <Animated.View style={[styles.toggleContainer, { opacity: fadeForm }]}>
                        <TouchableOpacity
                            style={[styles.toggleTab, inputMode === 'phone' && styles.toggleTabActive]}
                            onPress={() => switchMode('phone')}
                            activeOpacity={0.7}
                        >
                            <PhoneSmallIcon />
                            <Text style={[styles.toggleText, inputMode === 'phone' && styles.toggleTextActive]}>
                                Mobile
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.toggleTab, inputMode === 'email' && styles.toggleTabActive]}
                            onPress={() => switchMode('email')}
                            activeOpacity={0.7}
                        >
                            <EmailSmallIcon />
                            <Text style={[styles.toggleText, inputMode === 'email' && styles.toggleTextActive]}>
                                Email
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Input field with animated border */}
                    <Animated.View style={{ opacity: fadeForm }}>
                        <Animated.View
                            style={[
                                styles.inputContainer,
                                {
                                    borderColor: inputBorderColor,
                                },
                            ]}
                        >
                            <View style={styles.inputIconWrapper}>
                                {inputMode === 'phone' ? <PhoneSmallIcon /> : <EmailSmallIcon />}
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder={inputMode === 'phone' ? 'Enter Mobile Number' : 'Enter Email Address'}
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                value={inputValue}
                                onChangeText={handleInputChange}
                                keyboardType={inputMode === 'phone' ? 'phone-pad' : 'email-address'}
                                autoCapitalize="none"
                                selectionColor="#5EEAD4"
                                maxLength={inputMode === 'phone' ? 10 : undefined}
                            />
                            {/* Digit counter for phone */}
                            {inputMode === 'phone' && inputValue.length > 0 && (
                                <Text style={[
                                    styles.digitCounter,
                                    isValid && styles.digitCounterValid,
                                ]}>
                                    {inputValue.length}/10
                                </Text>
                            )}
                        </Animated.View>
                    </Animated.View>

                    {/* Get OTP Button with shake + animated opacity */}
                    <Animated.View
                        style={[
                            styles.buttonContainer,
                            {
                                opacity: fadeForm,
                                transform: [
                                    { scale: scaleButton },
                                    { translateX: shakeTranslateX },
                                ],
                            },
                        ]}
                    >
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            <Animated.View
                                style={[
                                    styles.getOtpButton,
                                    { opacity: buttonOpacity },
                                ]}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#073B3A" size="small" />
                                ) : (
                                    <Text style={[
                                        styles.getOtpText,
                                        !isValid && styles.buttonTextDisabled,
                                    ]}>
                                        Login
                                    </Text>
                                )}
                            </Animated.View>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Error message */}
                    {errorMsg !== '' && (
                        <Animated.View style={[styles.errorContainer, { opacity: fadeForm }]}>
                            <Text style={styles.errorText}>{errorMsg}</Text>
                        </Animated.View>
                    )}

                    {/* Info text */}
                    <Animated.View style={[styles.infoContainer, { opacity: fadeForm }]}>
                        <Text style={styles.infoText}>
                            Enter the mobile number you used while registering your QR code.
                        </Text>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
    },
    flex1: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingBottom: 40,
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
        top: '40%',
        right: -30,
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(94, 234, 212, 0.025)',
    },

    /* Back button */
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 8,
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
        marginBottom: 28,
    },
    heading: {
        fontSize: 30,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 0.5,
        lineHeight: 38,
    },
    subheading: {
        fontSize: 15,
        fontWeight: '400',
        color: 'rgba(255, 255, 255, 0.55)',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 22,
    },

    /* Toggle */
    toggleContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: 16,
        padding: 4,
        marginBottom: 20,
    },
    toggleTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 22,
        borderRadius: 13,
        gap: 8,
    },
    toggleTabActive: {
        backgroundColor: 'rgba(94, 234, 212, 0.15)',
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.4)',
    },
    toggleTextActive: {
        color: '#5EEAD4',
        fontWeight: '600',
    },

    /* Input */
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: 'rgba(94, 234, 212, 0.12)',
        paddingHorizontal: 16,
        height: 56,
        marginBottom: 20,
    },
    inputIconWrapper: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '500',
        height: '100%',
    },
    digitCounter: {
        fontSize: 12,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.3)',
        marginLeft: 4,
    },
    digitCounterValid: {
        color: '#5EEAD4',
    },

    /* Button */
    buttonContainer: {
        marginBottom: 24,
    },
    getOtpButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    getOtpText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#073B3A',
        letterSpacing: 0.5,
    },
    buttonTextDisabled: {
        color: 'rgba(7, 59, 58, 0.5)',
    },

    /* OTP Section */
    otpSection: {
        alignItems: 'center',
    },
    otpLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    otpRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 14,
        marginBottom: 20,
    },
    otpBoxWrapper: {},
    otpBox: {
        width: 58,
        height: 62,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: 'rgba(94, 234, 212, 0.15)',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    /* Error */
    errorContainer: {
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
        borderRadius: 14,
        padding: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    errorText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#FCA5A5',
        textAlign: 'center',
        lineHeight: 18,
    },

    /* Info */
    infoContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    infoText: {
        fontSize: 13,
        fontWeight: '400',
        color: 'rgba(255, 255, 255, 0.35)',
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default LoginScreen;
