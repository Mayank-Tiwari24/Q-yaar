import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    Platform,
    ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// ─── Design Tokens (M3 Light Theme from Stitch) ────────────────────────────
const C = {
    bg: '#f8fafa',
    surfaceLow: '#f0f4f4',
    surfaceHigh: '#e3e9ea',
    surfaceHighest: '#dde4e4',
    surfaceLowest: '#ffffff',
    primary: '#006b64',
    primaryDim: '#005e57',
    primaryContainer: '#7fe6db',
    onPrimary: '#e2fffa',
    onPrimaryContainer: '#00534d',
    secondary: '#286c34',
    secondaryContainer: '#abf4ac',
    onSecondaryContainer: '#185e27',
    tertiaryContainer: '#64b5f6',
    onTertiaryContainer: '#00314f',
    onSurface: '#2c3435',
    onSurfaceVar: '#596061',
    outlineVar: '#acb3b4',
};

// ─── Static Data ────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
    { icon: 'qr-code-scanner', label: 'Scan QR', bg: C.primaryContainer, color: C.onPrimaryContainer, nav: 'Scan' },
    { icon: 'directions-car', label: 'My Vehicles', bg: C.secondaryContainer, color: C.onSecondaryContainer, nav: 'Vehicles' },
    { icon: 'visibility', label: 'View QR', bg: C.tertiaryContainer, color: C.onTertiaryContainer, nav: 'MyQR' },
    { icon: 'receipt-long', label: 'Vehicle Details', bg: C.surfaceHighest, color: C.onSurfaceVar, nav: 'SearchVehicle' },
];

const REMINDERS = [
    { icon: 'shield', title: 'Insurance expires in 20 days', sub: 'Renewal due: Oct 24', bg: '#fff7e6', color: '#b36b00' },
    { icon: 'eco', title: 'PUC expires in 35 days', sub: 'Next test: Nov 08', bg: '#fff1f0', color: '#cf1322' },
];

const ACTIVITIES = [
    { icon: 'qr-code-2', title: 'QR scanned • Today', sub: '4:30 PM • Main Parking Entrance' },
    { icon: 'history', title: 'QR viewed • Yesterday', sub: '9:10 PM • Profile Access' },
];

const NAV_TABS = [
    { icon: 'home', label: 'Home', key: 'home' },
    { icon: 'qr-code-scanner', label: 'Scan', key: 'scan' },
    { icon: 'directions-car', label: 'Vehicles', key: 'vehicles' },
    { icon: 'history', label: 'Activity', key: 'activity' },
    { icon: 'person', label: 'Profile', key: 'profile' },
];

// ─── Greeting Helper ────────────────────────────────────────────────────────
const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
};

// ─── HomeScreen ─────────────────────────────────────────────────────────────
const HomeScreen = () => {
    const navigation = useNavigation();

    // Animations
    const fadeHeader = useRef(new Animated.Value(0)).current;
    const fadeHero = useRef(new Animated.Value(0)).current;
    const slideHero = useRef(new Animated.Value(30)).current;
    const fadeActions = useRef(new Animated.Value(0)).current;
    const slideActions = useRef(new Animated.Value(30)).current;
    const fadeReminders = useRef(new Animated.Value(0)).current;
    const slideReminders = useRef(new Animated.Value(30)).current;
    const fadeActivity = useRef(new Animated.Value(0)).current;
    const slideActivity = useRef(new Animated.Value(30)).current;
    const fadeQr = useRef(new Animated.Value(0)).current;
    const slideQr = useRef(new Animated.Value(30)).current;
    const fadeNav = useRef(new Animated.Value(0)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(fadeHeader, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.parallel([
                Animated.timing(fadeHero, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.spring(slideHero, { toValue: 0, friction: 8, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(fadeActions, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(slideActions, { toValue: 0, friction: 8, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(fadeReminders, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(slideReminders, { toValue: 0, friction: 8, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(fadeActivity, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(slideActivity, { toValue: 0, friction: 8, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(fadeQr, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(slideQr, { toValue: 0, friction: 8, useNativeDriver: true }),
            ]),
            Animated.timing(fadeNav, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();

        // Progress bar (non-native for width)
        Animated.timing(progressAnim, {
            toValue: 1,
            duration: 1200,
            delay: 800,
            useNativeDriver: false,
        }).start();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* ── Header ── */}
            <Animated.View style={[styles.header, { opacity: fadeHeader }]}>
                <View style={styles.headerLeft}>
                    <LinearGradient colors={[C.primaryContainer, '#5AD4C4']} style={styles.avatar}>
                        <Text style={styles.avatarText}>M</Text>
                    </LinearGradient>
                    <View>
                        <Text style={styles.greeting}>{getGreeting()}, Mayank 👋</Text>
                        <Text style={styles.vehicleInfo}>
                            KA 01 MJ 1234 • <Text style={styles.activeStatus}>Active</Text>
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.notifBtn} activeOpacity={0.7}>
                    <MaterialIcons name="notifications" size={24} color={C.primary} />
                </TouchableOpacity>
            </Animated.View>

            {/* ── Content ── */}
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} bounces={true}>

                {/* Hero Card */}
                <Animated.View style={{ opacity: fadeHero, transform: [{ translateY: slideHero }] }}>
                    <LinearGradient
                        colors={[C.primary, C.primaryDim]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.hero}
                    >
                        <View style={styles.heroDecor} />
                        <Text style={styles.heroLabel}>Vehicle Efficiency</Text>
                        <Text style={styles.heroValue}>84%</Text>
                        <View style={styles.progressTrack}>
                            <Animated.View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: progressAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0%', '84%'],
                                        }),
                                    },
                                ]}
                            />
                        </View>
                        <Text style={styles.heroMsg}>
                            Your vehicle is in optimal condition. Check reminders below.
                        </Text>
                    </LinearGradient>
                </Animated.View>

                {/* Quick Actions */}
                <Animated.View style={{ opacity: fadeActions, transform: [{ translateY: slideActions }] }}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionsGrid}>
                        {QUICK_ACTIONS.map((a, i) => (
                            <TouchableOpacity key={i} style={styles.actionCard} activeOpacity={0.7} onPress={() => a.nav && navigation.navigate(a.nav)}>
                                <View style={[styles.actionIcon, { backgroundColor: a.bg }]}>
                                    <MaterialIcons name={a.icon} size={24} color={a.color} />
                                </View>
                                <Text style={styles.actionLabel}>{a.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>

                {/* Vehicle Reminders */}
                <Animated.View style={{ opacity: fadeReminders, transform: [{ translateY: slideReminders }] }}>
                    <View style={styles.remindersCard}>
                        <View style={styles.remindersHead}>
                            <Text style={styles.remindersTitle}>Vehicle Reminders</Text>
                            <MaterialIcons name="event-note" size={22} color={C.outlineVar} />
                        </View>
                        {REMINDERS.map((r, i) => (
                            <TouchableOpacity key={i} style={styles.reminderRow} activeOpacity={0.7}>
                                <View style={[styles.reminderIcon, { backgroundColor: r.bg }]}>
                                    <MaterialIcons name={r.icon} size={20} color={r.color} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.reminderTitle}>{r.title}</Text>
                                    <Text style={styles.reminderSub}>{r.sub}</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={20} color={C.outlineVar} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>

                {/* Recent Activity */}
                <Animated.View style={{ opacity: fadeActivity, transform: [{ translateY: slideActivity }] }}>
                    <View style={styles.activityHead}>
                        <Text style={styles.activityTitle}>Recent Activity</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAll}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    {ACTIVITIES.map((a, i) => (
                        <View key={i} style={styles.activityRow}>
                            <View style={styles.activityIcon}>
                                <MaterialIcons name={a.icon} size={20} color={C.onSurfaceVar} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.activityItemTitle}>{a.title}</Text>
                                <Text style={styles.activityItemSub}>{a.sub}</Text>
                            </View>
                        </View>
                    ))}
                </Animated.View>

                {/* QR Access Card */}
                <Animated.View style={{ opacity: fadeQr, transform: [{ translateY: slideQr }] }}>
                    <View style={styles.qrCard}>
                        <View style={styles.qrCardHead}>
                            <View style={styles.qrIconBox}>
                                <MaterialIcons name="qr-code" size={36} color={C.primary} />
                            </View>
                            <View>
                                <Text style={styles.qrCardTitle}>My Vehicle QR</Text>
                                <Text style={styles.qrCardSub}>Share for easy identification</Text>
                            </View>
                        </View>
                        <View style={styles.qrBtns}>
                            <TouchableOpacity style={styles.qrViewBtn} activeOpacity={0.8} onPress={() => navigation.navigate('MyQR')}>
                                <MaterialIcons name="visibility" size={18} color={C.onPrimary} />
                                <Text style={styles.qrViewText}>View QR</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.qrDlBtn} activeOpacity={0.8} onPress={() => navigation.navigate('MyQR')}>
                                <MaterialIcons name="download" size={18} color={C.onSecondaryContainer} />
                                <Text style={styles.qrDlText}>Download</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>

                {/* Bottom spacing */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* ── Bottom Navigation ── */}
            <Animated.View style={[styles.bottomNav, { opacity: fadeNav }]}>
                {NAV_TABS.map((tab) => {
                    const isActive = tab.key === 'home';
                    return (
                        <TouchableOpacity
                            key={tab.key}
                            style={[styles.navTab, isActive && styles.navTabActive]}
                            activeOpacity={0.7}
                            onPress={() => {
                                if (tab.key === 'scan') navigation.navigate('Scan');
                                if (tab.key === 'vehicles') navigation.navigate('Vehicles');
                                if (tab.key === 'activity') navigation.navigate('Activity');
                                if (tab.key === 'profile') navigation.navigate('Profile');
                            }}
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
    },

    /* Header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 56 : 44,
        paddingBottom: 8,
        backgroundColor: C.bg,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '700',
        color: C.onPrimaryContainer,
    },
    greeting: {
        fontSize: 18,
        fontWeight: '700',
        color: C.onSurface,
        letterSpacing: -0.3,
    },
    vehicleInfo: {
        fontSize: 12,
        fontWeight: '500',
        color: C.onSurfaceVar,
        marginTop: 1,
    },
    activeStatus: {
        color: C.secondary,
        fontWeight: '700',
    },
    notifBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },

    /* Scroll */
    scroll: {
        paddingHorizontal: 20,
        paddingTop: 16,
    },

    /* Hero */
    hero: {
        borderRadius: 20,
        padding: 24,
        overflow: 'hidden',
        marginBottom: 28,
        shadowColor: '#006b64',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 8,
    },
    heroDecor: {
        position: 'absolute',
        right: -32,
        top: -32,
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    heroLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: 'rgba(226,255,250,0.8)',
        marginBottom: 4,
    },
    heroValue: {
        fontSize: 36,
        fontWeight: '800',
        color: '#ffffff',
        letterSpacing: -1,
        marginBottom: 16,
    },
    progressTrack: {
        width: '100%',
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.2)',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: '#abf4ac',
    },
    heroMsg: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(226,255,250,0.9)',
        marginTop: 16,
        lineHeight: 20,
    },

    /* Quick Actions */
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: C.onSurfaceVar,
        marginBottom: 14,
        marginLeft: 2,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 14,
        marginBottom: 28,
    },
    actionCard: {
        width: (width - 40 - 14) / 2,
        backgroundColor: C.surfaceLow,
        borderRadius: 18,
        padding: 20,
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    actionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: C.onSurface,
    },

    /* Reminders */
    remindersCard: {
        backgroundColor: C.surfaceLow,
        borderRadius: 18,
        padding: 20,
        marginBottom: 28,
    },
    remindersHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    remindersTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: C.onSurface,
    },
    reminderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        backgroundColor: C.surfaceLowest,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
    },
    reminderIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reminderTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: C.onSurface,
    },
    reminderSub: {
        fontSize: 12,
        color: C.onSurfaceVar,
        marginTop: 2,
    },

    /* Activity */
    activityHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    activityTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: C.onSurface,
    },
    viewAll: {
        fontSize: 14,
        fontWeight: '700',
        color: C.primary,
    },
    activityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 10,
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: C.surfaceHigh,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityItemTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: C.onSurface,
    },
    activityItemSub: {
        fontSize: 12,
        color: C.onSurfaceVar,
        marginTop: 2,
    },

    /* QR Card */
    qrCard: {
        backgroundColor: C.surfaceLow,
        borderRadius: 18,
        padding: 20,
        marginTop: 18,
        borderWidth: 1,
        borderColor: 'rgba(172,179,180,0.1)',
    },
    qrCardHead: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 20,
    },
    qrIconBox: {
        backgroundColor: C.surfaceLowest,
        padding: 10,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    qrCardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: C.onSurface,
    },
    qrCardSub: {
        fontSize: 13,
        color: C.onSurfaceVar,
        marginTop: 2,
    },
    qrBtns: {
        flexDirection: 'row',
        gap: 12,
    },
    qrViewBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: C.primary,
        borderRadius: 24,
        paddingVertical: 12,
    },
    qrViewText: {
        fontSize: 14,
        fontWeight: '700',
        color: C.onPrimary,
    },
    qrDlBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: C.secondaryContainer,
        borderRadius: 24,
        paddingVertical: 12,
    },
    qrDlText: {
        fontSize: 14,
        fontWeight: '700',
        color: C.onSecondaryContainer,
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
        backgroundColor: 'rgba(248,250,250,0.95)',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        shadowColor: '#006b64',
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

export default HomeScreen;
