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
    Switch,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

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
    errorContainer: '#FFF0F0',
};

// ─── Bottom Nav Tabs ────────────────────────────────────────────────────────
const NAV_TABS = [
    { icon: 'home', label: 'Home', key: 'home' },
    { icon: 'qr-code-scanner', label: 'Scan', key: 'scan' },
    { icon: 'directions-car', label: 'Vehicles', key: 'vehicles' },
    { icon: 'history', label: 'Activity', key: 'activity' },
    { icon: 'person', label: 'Profile', key: 'profile' },
];

// ─── ProfileScreen ──────────────────────────────────────────────────────────
const ProfileScreen = () => {
    const navigation = useNavigation();

    // Animations
    const fadeHeader = useRef(new Animated.Value(0)).current;
    const fadeContent = useRef(new Animated.Value(0)).current;
    const slideContent = useRef(new Animated.Value(30)).current;
    const fadeNav = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeHeader, { toValue: 1, duration: 400, useNativeDriver: true }).start();
        Animated.parallel([
            Animated.timing(fadeContent, { toValue: 1, duration: 500, delay: 100, useNativeDriver: true }),
            Animated.spring(slideContent, { toValue: 0, friction: 8, delay: 100, useNativeDriver: true }),
        ]).start();
        Animated.timing(fadeNav, { toValue: 1, duration: 300, delay: 300, useNativeDriver: true }).start();
    }, []);

    const handleNavTab = (key) => {
        if (key === 'home') navigation.navigate('Home');
        if (key === 'scan') navigation.navigate('Scan');
        if (key === 'vehicles') navigation.navigate('Vehicles');
        if (key === 'activity') navigation.navigate('Activity');
    };

    const handleLogout = () => {
        // Simple navigation reset to Onboarding/Selection
        navigation.reset({ index: 0, routes: [{ name: 'Selection' }] });
    };

    // ─── Render Helpers ─────────────────────────────────────────────────────
    const renderOptionRow = (icon, title, isLast = false, rightElement = null) => (
        <TouchableOpacity style={styles.optionRow} activeOpacity={0.7} disabled={rightElement !== null}>
            <View style={styles.optionIconBox}>
                <MaterialIcons name={icon} size={20} color={C.onPrimaryContainer} />
            </View>
            <Text style={styles.optionText}>{title}</Text>
            {rightElement || <MaterialIcons name="chevron-right" size={20} color="#b0b8b6" />}
        </TouchableOpacity>
    );

    const renderDivider = () => <View style={styles.divider} />;

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* ── Header ── */}
            <Animated.View style={[styles.header, { opacity: fadeHeader }]}>
                <Text style={styles.headerTitle}>Profile</Text>
            </Animated.View>

            {/* ── Content ── */}
            <Animated.ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                bounces={true}
                style={{ opacity: fadeContent, transform: [{ translateY: slideContent }] }}
            >
                {/* 1. Top Profile Section */}
                <View style={styles.profileCard}>
                    <TouchableOpacity style={styles.editIconBtn} activeOpacity={0.7}>
                        <MaterialIcons name="edit" size={18} color={C.onSurfaceVar} />
                    </TouchableOpacity>
                    <View style={styles.avatarWrap}>
                        <LinearGradient colors={[C.primary, C.primaryDark]} style={styles.avatar}>
                            <Text style={styles.avatarInitials}>MT</Text>
                        </LinearGradient>
                    </View>
                    <Text style={styles.profileName}>Mayank Tiwari</Text>
                    <Text style={styles.profileSubtitle}>Vehicle Owner</Text>
                </View>

                {/* 2. User Info Blocks */}
                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <MaterialIcons name="phone" size={20} color={C.primaryDark} style={styles.statIcon} />
                        <Text style={styles.statLabel}>Phone</Text>
                        <Text style={styles.statValue}>+91 98765 43210</Text>
                    </View>
                    <View style={styles.statBox}>
                        <MaterialIcons name="location-on" size={20} color={C.primaryDark} style={styles.statIcon} />
                        <Text style={styles.statLabel}>City</Text>
                        <Text style={styles.statValue}>Indore</Text>
                    </View>
                    <View style={styles.statBox}>
                        <MaterialIcons name="directions-car" size={20} color={C.primaryDark} style={styles.statIcon} />
                        <Text style={styles.statLabel}>Vehicles</Text>
                        <Text style={styles.statValue}>2 Added</Text>
                    </View>
                </View>

                {/* 3. Account Options */}
                <Text style={styles.sectionTitle}>Account</Text>
                <View style={styles.cardBlock}>
                    {renderOptionRow('person', 'Edit Profile')}
                    {renderDivider()}
                    {renderOptionRow('directions-car', 'Manage Vehicles')}
                    {renderDivider()}
                    {renderOptionRow('security', 'Privacy Settings')}
                    {renderDivider()}
                    {renderOptionRow('description', 'Terms & Privacy Policy', true)}
                </View>

                {/* 4. App Settings */}
                <Text style={styles.sectionTitle}>Settings</Text>
                <View style={styles.cardBlock}>
                    {renderOptionRow('notifications-active', 'Notifications', false, (
                        <Switch
                            trackColor={{ false: '#e0e6e4', true: C.primary }}
                            thumbColor="#ffffff"
                            value={true}
                            disabled={true} // visual only
                        />
                    ))}
                    {renderDivider()}
                    {renderOptionRow('dark-mode', 'Dark Mode', false, (
                        <Switch
                            trackColor={{ false: '#e0e6e4', true: C.primary }}
                            thumbColor="#ffffff"
                            value={false}
                            disabled={true} // disabled for now per spec
                        />
                    ))}
                    {renderDivider()}
                    {renderOptionRow('language', 'Language')}
                </View>

                {/* 5. App Info */}
                <View style={styles.infoBlock}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>App Version</Text>
                        <Text style={styles.infoValue}>v1.0.0</Text>
                    </View>
                    <View style={[styles.infoRow, { marginTop: 6 }]}>
                        <Text style={styles.infoLabel}>QR Status</Text>
                        <View style={styles.statusBadge}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusValue}>Active</Text>
                        </View>
                    </View>
                </View>

                {/* 6. Logout */}
                <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8} onPress={handleLogout}>
                    <MaterialIcons name="logout" size={20} color={C.error} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                <View style={{ height: 120 }} />
            </Animated.ScrollView>

            {/* ── Bottom Navigation ── */}
            <Animated.View style={[styles.bottomNav, { opacity: fadeNav }]}>
                {NAV_TABS.map((tab) => {
                    const isActive = tab.key === 'profile';
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
    },

    /* Header */
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: C.onSurface,
        letterSpacing: -0.2,
    },

    /* Scroll */
    scroll: {
        paddingHorizontal: 20,
        paddingTop: 4,
    },

    /* Top Profile Section */
    profileCard: {
        backgroundColor: C.surfaceLowest,
        borderRadius: 24,
        alignItems: 'center',
        paddingVertical: 28,
        paddingHorizontal: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
        elevation: 2,
    },
    editIconBtn: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: C.surfaceLow,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarWrap: {
        padding: 4,
        backgroundColor: '#ffffff',
        borderRadius: 48,
        shadowColor: C.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 6,
        marginBottom: 16,
    },
    avatar: {
        width: 76,
        height: 76,
        borderRadius: 38,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitials: {
        fontSize: 26,
        fontWeight: '800',
        color: '#ffffff',
        letterSpacing: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '700',
        color: C.onSurface,
        marginBottom: 4,
    },
    profileSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: C.primary,
    },

    /* User Stats Row */
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 28,
    },
    statBox: {
        flex: 1,
        backgroundColor: C.surfaceLowest,
        borderRadius: 18,
        padding: 14,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 1,
    },
    statIcon: {
        marginBottom: 8,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: C.onSurfaceVar,
        marginBottom: 2,
    },
    statValue: {
        fontSize: 13,
        fontWeight: '700',
        color: C.onSurface,
        textAlign: 'center',
    },

    /* Sections */
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: C.onSurfaceVar,
        marginBottom: 12,
        marginLeft: 6,
        letterSpacing: 0.2,
    },
    cardBlock: {
        backgroundColor: C.surfaceLowest,
        borderRadius: 20,
        paddingHorizontal: 16,
        marginBottom: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 1,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    optionIconBox: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: C.primaryContainer,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    optionText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: C.onSurface,
    },
    divider: {
        height: 1,
        backgroundColor: C.outlineVar,
        marginLeft: 50,
        opacity: 0.7,
    },

    /* App Info */
    infoBlock: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 24,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: C.onSurfaceVar,
    },
    infoValue: {
        fontSize: 13,
        fontWeight: '600',
        color: C.onSurface,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: '#34C759',
    },
    statusValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1B8A3A',
    },

    /* Logout */
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: C.errorContainer,
        borderRadius: 20,
        paddingVertical: 16,
        marginBottom: 20,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '700',
        color: C.error,
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

export default ProfileScreen;
