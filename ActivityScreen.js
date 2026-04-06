import React, { useEffect, useRef, useState } from 'react';
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
import { MaterialIcons } from '@expo/vector-icons';
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
};

// ─── Bottom Nav Tabs ────────────────────────────────────────────────────────
const NAV_TABS = [
    { icon: 'home', label: 'Home', key: 'home' },
    { icon: 'qr-code-scanner', label: 'Scan', key: 'scan' },
    { icon: 'directions-car', label: 'Vehicles', key: 'vehicles' },
    { icon: 'history', label: 'Activity', key: 'activity' },
    { icon: 'person', label: 'Profile', key: 'profile' },
];

// ─── Demo Data ──────────────────────────────────────────────────────────────
const ACTIVITY_DATA = [
    {
        title: 'Today',
        data: [
            {
                id: '1',
                icon: 'qr-code-scanner',
                title: 'QR Scanned',
                description: 'Someone viewed your vehicle QR',
                time: '4:32 PM',
                bgColor: '#E6F8F5',
                iconColor: '#2C8E7C',
            },
            {
                id: '2',
                icon: 'visibility',
                title: 'QR Viewed',
                description: 'You opened your vehicle QR',
                time: '2:10 PM',
                bgColor: '#F0F5F4',
                iconColor: '#596061',
            },
        ],
    },
    {
        title: 'Yesterday',
        data: [
            {
                id: '3',
                icon: 'directions-car',
                title: 'Vehicle Added',
                description: 'New vehicle “Honda City” added',
                time: '6:45 PM',
                bgColor: '#E8F5E9',
                iconColor: '#2E7D32',
            },
            {
                id: '4',
                icon: 'person',
                title: 'Profile Updated',
                description: 'You updated your details',
                time: '10:15 AM',
                bgColor: '#E3F2FD',
                iconColor: '#1565C0',
            },
        ],
    },
];

// ─── ActivityScreen ─────────────────────────────────────────────────────────
const ActivityScreen = () => {
    const navigation = useNavigation();
    const [activities] = useState(ACTIVITY_DATA);

    // Animations
    const fadeHeader = useRef(new Animated.Value(0)).current;
    const fadeNav = useRef(new Animated.Value(0)).current;
    const listAnim = useRef(new Animated.Value(0)).current;
    const listSlide = useRef(new Animated.Value(40)).current;

    useEffect(() => {
        Animated.timing(fadeHeader, { toValue: 1, duration: 400, useNativeDriver: true }).start();
        Animated.parallel([
            Animated.timing(listAnim, { toValue: 1, duration: 500, delay: 100, useNativeDriver: true }),
            Animated.spring(listSlide, { toValue: 0, friction: 8, delay: 100, useNativeDriver: true }),
        ]).start();
        Animated.timing(fadeNav, { toValue: 1, duration: 300, delay: 300, useNativeDriver: true }).start();
    }, []);

    const handleNavTab = (key) => {
        if (key === 'home') navigation.navigate('Home');
        if (key === 'scan') navigation.navigate('Scan');
        if (key === 'vehicles') navigation.navigate('Vehicles');
        if (key === 'profile') navigation.navigate('Profile');
    };

    // ─── Empty State ────────────────────────────────────────────────────────
    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>👀</Text>
            <Text style={styles.emptyTitle}>Nothing here yet</Text>
            <Text style={styles.emptySub}>Your activity will appear here</Text>
        </View>
    );

    // ─── List Content ───────────────────────────────────────────────────────
    const renderContent = () => {
        return activities.map((section, sectionIndex) => (
            <View key={section.title} style={styles.sectionContainer}>
                <Text style={styles.sectionHeader}>{section.title}</Text>
                <View style={styles.cardBlock}>
                    {section.data.map((item, index) => {
                        const isLast = index === section.data.length - 1;
                        return (
                            <TouchableOpacity key={item.id} style={styles.activityItem} activeOpacity={0.7}>
                                <View style={styles.itemTopRow}>
                                    <View style={[styles.iconBox, { backgroundColor: item.bgColor }]}>
                                        <MaterialIcons name={item.icon} size={22} color={item.iconColor} />
                                    </View>
                                    <View style={styles.itemInfo}>
                                        <Text style={styles.itemTitle}>{item.title}</Text>
                                        <Text style={styles.itemDesc} numberOfLines={1}>{item.description}</Text>
                                    </View>
                                    <Text style={styles.itemTime}>{item.time}</Text>
                                </View>
                                {!isLast && <View style={styles.divider} />}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        ));
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* ── Header ── */}
            <Animated.View style={[styles.header, { opacity: fadeHeader }]}>
                <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
                    <MaterialIcons name="arrow-back" size={24} color={C.onSurface} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Activity</Text>
                <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
                    <MaterialIcons name="tune" size={24} color={C.onSurface} />
                </TouchableOpacity>
            </Animated.View>

            {/* ── Content ── */}
            <Animated.ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                bounces={true}
                style={{ opacity: listAnim, transform: [{ translateY: listSlide }] }}
            >
                {activities.length === 0 ? renderEmpty() : renderContent()}
                <View style={{ height: 120 }} />
            </Animated.ScrollView>

            {/* ── Bottom Navigation ── */}
            <Animated.View style={[styles.bottomNav, { opacity: fadeNav }]}>
                {NAV_TABS.map((tab) => {
                    const isActive = tab.key === 'activity';
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
        fontSize: 20,
        fontWeight: '700',
        color: C.onSurface,
        letterSpacing: -0.3,
    },

    /* Scroll */
    scroll: {
        paddingHorizontal: 20,
        paddingTop: 16,
    },

    /* Empty State */
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    emptyEmoji: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: C.onSurface,
        marginBottom: 8,
    },
    emptySub: {
        fontSize: 14,
        color: C.onSurfaceVar,
        textAlign: 'center',
    },

    /* List Elements */
    sectionContainer: {
        marginBottom: 24,
    },
    sectionHeader: {
        fontSize: 15,
        fontWeight: '700',
        color: C.onSurfaceVar,
        marginBottom: 12,
        marginLeft: 4,
        letterSpacing: 0.3,
    },
    cardBlock: {
        backgroundColor: C.surfaceLowest,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
        elevation: 2,
    },
    activityItem: {
        padding: 16,
    },
    itemTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemInfo: {
        flex: 1,
        marginLeft: 14,
        marginRight: 8,
    },
    itemTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: C.onSurface,
        marginBottom: 3,
    },
    itemDesc: {
        fontSize: 13,
        color: C.onSurfaceVar,
    },
    itemTime: {
        fontSize: 12,
        fontWeight: '500',
        color: '#9EAAA6',
        alignSelf: 'flex-start',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: C.outlineVar,
        marginLeft: 72, // Aligns with text
        marginTop: 16,
        opacity: 0.6,
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

export default ActivityScreen;
