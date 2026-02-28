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
    Image,
    Alert,
    Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
    Rect,
    Circle,
    Path,
    Defs,
    LinearGradient as SvgLinearGradient,
    RadialGradient as SvgRadialGradient,
    Stop,
    Line,
} from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

// ─── SVG Icons ──────────────────────────────────────────────────────────────
const BackArrowIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24">
        <Path d="M15 6 L9 12 L15 18" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
);

const UserIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 20 20">
        <Circle cx="10" cy="7" r="3.5" stroke="#5EEAD4" strokeWidth="1.5" fill="none" />
        <Path d="M3 18 Q3 13 10 13 Q17 13 17 18" stroke="#5EEAD4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </Svg>
);

const CalendarIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 20 20">
        <Rect x="2" y="4" width="16" height="14" rx="3" stroke="#5EEAD4" strokeWidth="1.5" fill="none" />
        <Line x1="2" y1="9" x2="18" y2="9" stroke="#5EEAD4" strokeWidth="1" />
        <Line x1="6" y1="2" x2="6" y2="6" stroke="#5EEAD4" strokeWidth="1.5" strokeLinecap="round" />
        <Line x1="14" y1="2" x2="14" y2="6" stroke="#5EEAD4" strokeWidth="1.5" strokeLinecap="round" />
        <Circle cx="7" cy="13" r="1" fill="#5EEAD4" opacity="0.6" />
        <Circle cx="10" cy="13" r="1" fill="#5EEAD4" opacity="0.6" />
        <Circle cx="13" cy="13" r="1" fill="#5EEAD4" opacity="0.6" />
    </Svg>
);

const PhoneIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 20 20">
        <Rect x="5" y="1" width="10" height="18" rx="2.5" stroke="#5EEAD4" strokeWidth="1.5" fill="none" />
        <Rect x="7" y="4" width="6" height="10" rx="1" fill="#5EEAD4" opacity="0.12" />
        <Circle cx="10" cy="16.5" r="1" fill="#5EEAD4" opacity="0.5" />
    </Svg>
);

const EmailIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 20 20">
        <Rect x="1" y="4" width="18" height="12" rx="3" stroke="#5EEAD4" strokeWidth="1.5" fill="none" />
        <Path d="M1 7 L10 13 L19 7" stroke="#5EEAD4" strokeWidth="1.2" fill="none" />
    </Svg>
);

const CarIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 20 20">
        <Path d="M3 13 L3 16 Q3 17 4 17 L6 17 Q7 17 7 16 L7 15 L13 15 L13 16 Q13 17 14 17 L16 17 Q17 17 17 16 L17 13" stroke="#5EEAD4" strokeWidth="1.3" fill="none" />
        <Path d="M4 13 L5 8 Q5.5 7 7 7 L13 7 Q14.5 7 15 8 L16 13" stroke="#5EEAD4" strokeWidth="1.3" fill="none" />
        <Line x1="3" y1="13" x2="17" y2="13" stroke="#5EEAD4" strokeWidth="1" />
        <Circle cx="6" cy="13" r="1" fill="#5EEAD4" opacity="0.5" />
        <Circle cx="14" cy="13" r="1" fill="#5EEAD4" opacity="0.5" />
    </Svg>
);

const IdCardIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 20 20">
        <Rect x="1" y="3" width="18" height="14" rx="3" stroke="#5EEAD4" strokeWidth="1.5" fill="none" />
        <Circle cx="7" cy="9" r="2.5" stroke="#5EEAD4" strokeWidth="1" fill="none" />
        <Path d="M4 15 Q4 12 7 12 Q10 12 10 15" stroke="#5EEAD4" strokeWidth="0.8" fill="none" />
        <Line x1="12" y1="7" x2="17" y2="7" stroke="#5EEAD4" strokeWidth="1" strokeLinecap="round" />
        <Line x1="12" y1="10" x2="17" y2="10" stroke="#5EEAD4" strokeWidth="1" strokeLinecap="round" />
        <Line x1="12" y1="13" x2="15" y2="13" stroke="#5EEAD4" strokeWidth="1" strokeLinecap="round" />
    </Svg>
);

const CheckIcon = () => (
    <Svg width={16} height={16} viewBox="0 0 16 16">
        <Circle cx="8" cy="8" r="7" fill="#5EEAD4" />
        <Path d="M5 8 L7 10 L11 6" stroke="#073B3A" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const UploadIcon = () => (
    <Svg width={32} height={32} viewBox="0 0 32 32">
        <Path d="M16 20 L16 8" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" />
        <Path d="M12 12 L16 8 L20 12" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <Path d="M6 22 L6 24 Q6 26 8 26 L24 26 Q26 26 26 24 L26 22" stroke="#5EEAD4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </Svg>
);

// ─── Decorative Header Icon ─────────────────────────────────────────────────
const FormHeaderIcon = ({ size = 90 }) => (
    <Svg width={size} height={size} viewBox="0 0 90 90">
        <Defs>
            <SvgRadialGradient id="formGlow" cx="50%" cy="40%" r="55%">
                <Stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.3" />
                <Stop offset="100%" stopColor="#5EEAD4" stopOpacity="0" />
            </SvgRadialGradient>
            <SvgLinearGradient id="clipBg" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#F0FAF8" />
                <Stop offset="100%" stopColor="#C8E6E0" />
            </SvgLinearGradient>
        </Defs>
        <Circle cx="45" cy="45" r="40" fill="url(#formGlow)" />
        {/* Clipboard */}
        <Rect x="24" y="18" width="42" height="56" rx="6" fill="url(#clipBg)" stroke="#80CBC4" strokeWidth="1" />
        <Rect x="35" y="14" width="20" height="8" rx="3" fill="#B2DFDB" stroke="#80CBC4" strokeWidth="0.8" />
        {/* Lines */}
        <Line x1="32" y1="34" x2="58" y2="34" stroke="#0D6B5E" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <Line x1="32" y1="42" x2="52" y2="42" stroke="#0D6B5E" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        <Line x1="32" y1="50" x2="55" y2="50" stroke="#0D6B5E" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        <Line x1="32" y1="58" x2="48" y2="58" stroke="#0D6B5E" strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />
        {/* Checkmarks */}
        <Path d="M53 41 L55 43 L59 39" stroke="#5EEAD4" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
        <Path d="M53 49 L55 51 L59 47" stroke="#5EEAD4" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
    </Svg>
);

// ─── Validation helpers ─────────────────────────────────────────────────────
const isPhoneValid = (v) => /^\d{10}$/.test(v);
const isEmailValid = (v) => {
    const t = v.trim();
    return t.length > 0 && t.includes('@') && t.indexOf('@') < t.length - 1;
};

// ─── Main Screen ────────────────────────────────────────────────────────────
const UserDetailsScreen = () => {
    const navigation = useNavigation();

    // Form state
    const [fullName, setFullName] = useState('');
    const [dob, setDob] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [mobile, setMobile] = useState('');
    const [mobileVerified, setMobileVerified] = useState(false);
    const [email, setEmail] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [licenseImage, setLicenseImage] = useState(null);

    // Animations
    const fadeIn = useRef(new Animated.Value(0)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const buttonOpacity = useRef(new Animated.Value(0.4)).current;
    const scaleButton = useRef(new Animated.Value(1)).current;

    // Computed validity
    const allValid =
        fullName.trim().length > 0 &&
        dob !== null &&
        isPhoneValid(mobile) &&
        mobileVerified &&
        isEmailValid(email) &&
        emailVerified &&
        vehicleNumber.trim().length > 0 &&
        licenseImage !== null;

    useEffect(() => {
        Animated.timing(fadeIn, { toValue: 1, duration: 600, useNativeDriver: true }).start();
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, { toValue: 1, duration: 2200, useNativeDriver: true }),
                Animated.timing(floatAnim, { toValue: 0, duration: 2200, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    useEffect(() => {
        Animated.timing(buttonOpacity, {
            toValue: allValid ? 1 : 0.4,
            duration: 250,
            useNativeDriver: false,
        }).start();
    }, [allValid]);

    const iconTranslateY = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -8],
    });

    const shakeX = shakeAnim.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [-8, 0, 8],
    });

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

    // ── Handlers ──

    const handleMobileChange = (text) => {
        const digits = text.replace(/[^0-9]/g, '');
        if (digits.length <= 10) {
            setMobile(digits);
            if (mobileVerified) setMobileVerified(false);
        }
    };

    const handleVerifyMobile = () => {
        if (!isPhoneValid(mobile)) return;
        // Simulate OTP verified
        setMobileVerified(true);
    };

    const handleEmailChange = (text) => {
        setEmail(text);
        if (emailVerified) setEmailVerified(false);
    };

    const handleVerifyEmail = () => {
        if (!isEmailValid(email)) return;
        // Simulate verified
        setEmailVerified(true);
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDob(selectedDate);
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        const d = date.getDate().toString().padStart(2, '0');
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
    };

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please allow access to your photo library.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
            allowsEditing: true,
            aspect: [4, 3],
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setLicenseImage(result.assets[0].uri);
        }
    };

    const handleSubmit = () => {
        if (!allValid) {
            triggerShake();
            return;
        }
        Keyboard.dismiss();
        console.log('Submitting:', { fullName, dob, mobile, email, vehicleNumber, licenseImage });
        // Navigate to success screen (placeholder)
        // navigation.navigate('Success');
        Alert.alert('Success!', 'Your QR has been activated successfully.');
    };

    const handlePressIn = () => {
        if (allValid) {
            Animated.spring(scaleButton, { toValue: 0.94, friction: 5, useNativeDriver: true }).start();
        }
    };
    const handlePressOut = () => {
        Animated.spring(scaleButton, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    };

    // ── Field border color based on content ──
    const borderValid = 'rgba(94, 234, 212, 0.45)';
    const borderDefault = 'rgba(94, 234, 212, 0.12)';

    return (
        <LinearGradient
            colors={['#073B3A', '#0A4D4A', '#0D6B5E', '#0A4D4A', '#073B3A']}
            locations={[0, 0.25, 0.5, 0.75, 1]}
            style={styles.container}
        >
            <View style={styles.bgDecor1} />
            <View style={styles.bgDecor2} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {/* Back button */}
                <Animated.View style={[styles.backButton, { opacity: fadeIn }]}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        style={styles.backTouchable}
                    >
                        <BackArrowIcon />
                    </TouchableOpacity>
                </Animated.View>

                {/* Header icon */}
                <Animated.View style={[styles.iconContainer, { opacity: fadeIn, transform: [{ translateY: iconTranslateY }] }]}>
                    <FormHeaderIcon size={90} />
                </Animated.View>

                {/* Heading */}
                <Animated.View style={[styles.headingContainer, { opacity: fadeIn }]}>
                    <Text style={styles.heading}>Complete Your Details</Text>
                    <Text style={styles.subheading}>Fill in the information below to activate your QR.</Text>
                </Animated.View>

                {/* ── Full Name ── */}
                <Animated.View style={[styles.fieldContainer, { opacity: fadeIn }]}>
                    <Text style={styles.fieldLabel}>Full Name</Text>
                    <View style={[styles.inputRow, fullName.trim().length > 0 && { borderColor: borderValid }]}>
                        <View style={styles.inputIcon}><UserIcon /></View>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Full Name"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            value={fullName}
                            onChangeText={setFullName}
                            selectionColor="#5EEAD4"
                        />
                    </View>
                </Animated.View>

                {/* ── Date of Birth ── */}
                <Animated.View style={[styles.fieldContainer, { opacity: fadeIn }]}>
                    <Text style={styles.fieldLabel}>Date of Birth</Text>
                    <TouchableOpacity
                        style={[styles.inputRow, dob && { borderColor: borderValid }]}
                        onPress={() => setShowDatePicker(true)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.inputIcon}><CalendarIcon /></View>
                        <Text style={[styles.inputText, !dob && styles.placeholder]}>
                            {dob ? formatDate(dob) : 'Select Date of Birth'}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={dob || new Date(2000, 0, 1)}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                            maximumDate={new Date()}
                            themeVariant="dark"
                        />
                    )}
                </Animated.View>

                {/* ── Mobile Number ── */}
                <Animated.View style={[styles.fieldContainer, { opacity: fadeIn }]}>
                    <Text style={styles.fieldLabel}>Mobile Number</Text>
                    <View style={[styles.inputRow, isPhoneValid(mobile) && { borderColor: borderValid }]}>
                        <View style={styles.inputIcon}><PhoneIcon /></View>
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder="Enter Mobile Number"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            value={mobile}
                            onChangeText={handleMobileChange}
                            keyboardType="phone-pad"
                            maxLength={10}
                            selectionColor="#5EEAD4"
                        />
                        {mobileVerified ? (
                            <View style={styles.verifiedBadge}>
                                <CheckIcon />
                                <Text style={styles.verifiedText}>Verified</Text>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={[styles.verifyButton, !isPhoneValid(mobile) && styles.verifyDisabled]}
                                onPress={handleVerifyMobile}
                                disabled={!isPhoneValid(mobile)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.verifyButtonText, !isPhoneValid(mobile) && styles.verifyTextDisabled]}>
                                    Verify
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {mobile.length > 0 && !isPhoneValid(mobile) && (
                        <Text style={styles.hintText}>{mobile.length}/10 digits</Text>
                    )}
                </Animated.View>

                {/* ── Email Address ── */}
                <Animated.View style={[styles.fieldContainer, { opacity: fadeIn }]}>
                    <Text style={styles.fieldLabel}>Email Address</Text>
                    <View style={[styles.inputRow, isEmailValid(email) && { borderColor: borderValid }]}>
                        <View style={styles.inputIcon}><EmailIcon /></View>
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder="Enter Email Address"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            value={email}
                            onChangeText={handleEmailChange}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            selectionColor="#5EEAD4"
                        />
                        {emailVerified ? (
                            <View style={styles.verifiedBadge}>
                                <CheckIcon />
                                <Text style={styles.verifiedText}>Verified</Text>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={[styles.verifyButton, !isEmailValid(email) && styles.verifyDisabled]}
                                onPress={handleVerifyEmail}
                                disabled={!isEmailValid(email)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.verifyButtonText, !isEmailValid(email) && styles.verifyTextDisabled]}>
                                    Verify
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </Animated.View>

                {/* ── Vehicle Number ── */}
                <Animated.View style={[styles.fieldContainer, { opacity: fadeIn }]}>
                    <Text style={styles.fieldLabel}>Vehicle Number</Text>
                    <View style={[styles.inputRow, vehicleNumber.trim().length > 0 && { borderColor: borderValid }]}>
                        <View style={styles.inputIcon}><CarIcon /></View>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Vehicle Number"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            value={vehicleNumber}
                            onChangeText={setVehicleNumber}
                            autoCapitalize="characters"
                            selectionColor="#5EEAD4"
                        />
                    </View>
                </Animated.View>

                {/* ── Driving License Upload ── */}
                <Animated.View style={[styles.fieldContainer, { opacity: fadeIn }]}>
                    <Text style={styles.fieldLabel}>Driving License</Text>

                    {licenseImage ? (
                        <View style={styles.imagePreviewContainer}>
                            <Image source={{ uri: licenseImage }} style={styles.imagePreview} />
                            <TouchableOpacity
                                style={styles.changeImageButton}
                                onPress={handlePickImage}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.changeImageText}>Change Photo</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.uploadBox}
                            onPress={handlePickImage}
                            activeOpacity={0.7}
                        >
                            <UploadIcon />
                            <Text style={styles.uploadText}>Upload License Photo</Text>
                            <Text style={styles.uploadHint}>Tap to select from gallery</Text>
                        </TouchableOpacity>
                    )}
                </Animated.View>

                {/* ── Submit Button ── */}
                <Animated.View
                    style={[
                        styles.submitContainer,
                        {
                            transform: [{ scale: scaleButton }, { translateX: shakeX }],
                        },
                    ]}
                >
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        onPress={handleSubmit}
                    >
                        <Animated.View style={[styles.submitButton, { opacity: buttonOpacity }]}>
                            <Text style={[styles.submitText, !allValid && styles.submitTextDisabled]}>
                                Submit & Activate QR
                            </Text>
                        </Animated.View>
                    </TouchableOpacity>
                </Animated.View>

                <View style={{ height: 30 }} />
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
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingBottom: 20,
    },
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

    /* Back */
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

    /* Header icon */
    iconContainer: {
        alignItems: 'center',
        marginBottom: 0,
    },

    /* Heading */
    headingContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    heading: {
        fontSize: 26,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 0.4,
    },
    subheading: {
        fontSize: 14,
        fontWeight: '400',
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'center',
        marginTop: 6,
        lineHeight: 20,
    },

    /* Fields */
    fieldContainer: {
        marginBottom: 18,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 8,
        marginLeft: 4,
        letterSpacing: 0.3,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: 'rgba(94, 234, 212, 0.12)',
        paddingHorizontal: 14,
        height: 52,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#FFFFFF',
        fontWeight: '500',
        height: '100%',
    },
    inputText: {
        flex: 1,
        fontSize: 15,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    placeholder: {
        color: 'rgba(255,255,255,0.3)',
    },
    hintText: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.3)',
        marginTop: 4,
        marginLeft: 4,
    },

    /* Verify button */
    verifyButton: {
        backgroundColor: 'rgba(94, 234, 212, 0.2)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        marginLeft: 8,
    },
    verifyDisabled: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
    },
    verifyButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#5EEAD4',
    },
    verifyTextDisabled: {
        color: 'rgba(255,255,255,0.25)',
    },

    /* Verified badge */
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginLeft: 8,
    },
    verifiedText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#5EEAD4',
    },

    /* Upload */
    uploadBox: {
        borderWidth: 1.5,
        borderColor: 'rgba(94, 234, 212, 0.2)',
        borderStyle: 'dashed',
        borderRadius: 18,
        paddingVertical: 28,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
    },
    uploadText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#5EEAD4',
        marginTop: 10,
    },
    uploadHint: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.3)',
        marginTop: 4,
    },

    /* Image preview */
    imagePreviewContainer: {
        borderRadius: 18,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        borderWidth: 1.5,
        borderColor: 'rgba(94, 234, 212, 0.35)',
    },
    imagePreview: {
        width: '100%',
        height: 180,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    changeImageButton: {
        paddingVertical: 10,
        alignItems: 'center',
    },
    changeImageText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#5EEAD4',
    },

    /* Submit */
    submitContainer: {
        marginTop: 8,
    },
    submitButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#073B3A',
        letterSpacing: 0.5,
    },
    submitTextDisabled: {
        color: 'rgba(7, 59, 58, 0.5)',
    },
});

export default UserDetailsScreen;
