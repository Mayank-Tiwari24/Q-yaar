import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    Platform,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import API_URL from './config';

const { width } = Dimensions.get('window');

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
    tertiaryContainer: '#64b5f6',
    onTertiaryContainer: '#00314f',
};

// ─── Bottom Nav ─────────────────────────────────────────────────────────────
const NAV_TABS = [
    { icon: 'home', label: 'Home', key: 'home' },
    { icon: 'qr-code-scanner', label: 'Scan', key: 'scan' },
    { icon: 'directions-car', label: 'Vehicles', key: 'vehicles' },
    { icon: 'history', label: 'Activity', key: 'activity' },
    { icon: 'person', label: 'Profile', key: 'profile' },
];

// ─── VehiclesScreen ─────────────────────────────────────────────────────────
const VehiclesScreen = ({ route }) => {
    const navigation = useNavigation();
    const userData = route?.params?.userData || null;
    const mobileNumber = route?.params?.mobileNumber || '';

    // Transform backend data to vehicle cards
    const vehicles = useMemo(() => {
        if (!userData?.vehicles?.length) return [];
        return userData.vehicles.map((v, i) => ({
            id: v.qrId,
            number: v.vehicleData?.vehicleNumber || 'Unknown',
            model: v.vehicleData?.model || 'Not Specified',
            owner: v.vehicleData?.ownerName || 'Unknown',
            color: v.vehicleData?.color || null,
            fuel: v.vehicleData?.fuel || null,
            status: v.status === 'USED' ? 'Active' : 'Inactive',
            scanCount: v.scanCount || 0,
            type: 'car', // default, can be enhanced later
            claimedAt: v.claimedAt,
        }));
    }, [userData]);

    // Animations
    const fadeHeader = useRef(new Animated.Value(0)).current;
    const fadeNav = useRef(new Animated.Value(0)).current;
    const cardAnims = useRef(
        Array.from({ length: Math.max(vehicles.length, 1) }, () => ({
            opacity: new Animated.Value(0),
            slide: new Animated.Value(40),
        }))
    ).current;
    const fadeFab = useRef(new Animated.Value(0)).current;
    const scaleFab = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        // Header fade
        Animated.timing(fadeHeader, { toValue: 1, duration: 400, useNativeDriver: true }).start();

        // Stagger cards
        const cardSequence = cardAnims.slice(0, vehicles.length).map((anim, i) =>
            Animated.parallel([
                Animated.timing(anim.opacity, { toValue: 1, duration: 400, delay: i * 120, useNativeDriver: true }),
                Animated.spring(anim.slide, { toValue: 0, friction: 8, delay: i * 120, useNativeDriver: true }),
            ])
        );
        Animated.stagger(120, cardSequence).start();

        // FAB
        Animated.parallel([
            Animated.timing(fadeFab, { toValue: 1, duration: 400, delay: 600, useNativeDriver: true }),
            Animated.spring(scaleFab, { toValue: 1, friction: 6, delay: 600, useNativeDriver: true }),
        ]).start();

        // Nav
        Animated.timing(fadeNav, { toValue: 1, duration: 300, delay: 500, useNativeDriver: true }).start();
    }, []);

    const handleNavTab = (key) => {
        if (key === 'home') navigation.navigate('Home');
        if (key === 'scan') navigation.navigate('Scan');
        if (key === 'activity') navigation.navigate('Activity', { mobileNumber, userData });
        if (key === 'profile') navigation.navigate('Profile');
    };

    // ─── Empty State ────────────────────────────────────────────────────
    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
                <MaterialIcons name="directions-car" size={48} color={C.primary} />
            </View>
            <Text style={styles.emptyTitle}>No vehicles added yet 🚗</Text>
            <Text style={styles.emptySub}>Add your first vehicle to get started</Text>
            <TouchableOpacity style={styles.emptyBtn} activeOpacity={0.8}>
                <MaterialIcons name="add" size={20} color="#fff" />
                <Text style={styles.emptyBtnText}>Add Vehicle</Text>
            </TouchableOpacity>
        </View>
    );

    // ─── Vehicle Card ───────────────────────────────────────────────────
    const renderCard = (vehicle, index) => {
        const anim = cardAnims[index] || { opacity: new Animated.Value(1), slide: new Animated.Value(0) };
        const iconName = vehicle.type === 'motorcycle' ? 'two-wheeler' : 'directions-car';

        return (
            <Animated.View
                key={vehicle.id}
                style={[
                    styles.vehicleCard,
                    { opacity: anim.opacity, transform: [{ translateY: anim.slide }] },
                ]}
            >
                <TouchableOpacity style={styles.cardTouchable} activeOpacity={0.7}>
                    {/* Top Row: Icon + Info + Status */}
                    <View style={styles.cardTopRow}>
                        <View style={styles.cardIconCircle}>
                            <MaterialIcons name={iconName} size={26} color={C.onPrimaryContainer} />
                        </View>
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardNumber}>{vehicle.number}</Text>
                            <Text style={styles.cardModel}>{vehicle.model} • {vehicle.owner}</Text>
                        </View>
                        <View style={styles.statusBadge}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>{vehicle.status}</Text>
                        </View>
                    </View>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <MaterialIcons name="qr-code-scanner" size={14} color={C.onSurfaceVar} />
                            <Text style={styles.statText}>{vehicle.scanCount} scans</Text>
                        </View>
                        {vehicle.color && (
                            <View style={styles.statItem}>
                                <MaterialIcons name="palette" size={14} color={C.onSurfaceVar} />
                                <Text style={styles.statText}>{vehicle.color}</Text>
                            </View>
                        )}
                        {vehicle.fuel && (
                            <View style={styles.statItem}>
                                <MaterialIcons name="local-gas-station" size={14} color={C.onSurfaceVar} />
                                <Text style={styles.statText}>{vehicle.fuel}</Text>
                            </View>
                        )}
                    </View>

                    {/* Divider */}
                    <View style={styles.cardDivider} />

                    {/* Action Row */}
                    <View style={styles.cardActions}>
                        <TouchableOpacity style={styles.cardActionBtn} activeOpacity={0.7}>
                            <MaterialIcons name="visibility" size={18} color={C.onPrimaryContainer} />
                            <Text style={styles.cardActionText}>Details</Text>
                        </TouchableOpacity>
                        <View style={styles.actionSep} />
                        <TouchableOpacity style={styles.cardActionBtn} activeOpacity={0.7} onPress={() => navigation.navigate('MyQR')}>
                            <MaterialIcons name="qr-code" size={18} color={C.onPrimaryContainer} />
                            <Text style={styles.cardActionText}>View QR</Text>
                        </TouchableOpacity>
                        <View style={styles.actionSep} />
                        <TouchableOpacity style={styles.cardActionBtn} activeOpacity={0.7}>
                            <MaterialIcons name="edit" size={18} color={C.onSurfaceVar} />
                            <Text style={[styles.cardActionText, { color: C.onSurfaceVar }]}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* ── Header ── */}
            <Animated.View style={[styles.header, { opacity: fadeHeader }]}>
                <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
                    <MaterialIcons name="arrow-back" size={24} color={C.onSurface} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Vehicles</Text>
                <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
                    <MaterialIcons name="add" size={24} color={C.onSurface} />
                </TouchableOpacity>
            </Animated.View>

            {/* ── Vehicle Count ── */}
            <Animated.View style={[styles.countRow, { opacity: fadeHeader }]}>
                <Text style={styles.countText}>
                    {vehicles.length} {vehicles.length === 1 ? 'Vehicle' : 'Vehicles'} registered
                </Text>
            </Animated.View>

            {/* ── Content ── */}
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                {vehicles.length === 0 ? renderEmpty() : vehicles.map((v, i) => renderCard(v, i))}
                <View style={{ height: 120 }} />
            </ScrollView>

            {/* ── FAB ── */}
            <Animated.View style={[styles.fab, { opacity: fadeFab, transform: [{ scale: scaleFab }] }]}>
                <TouchableOpacity activeOpacity={0.8}>
                    <LinearGradient
                        colors={[C.primary, C.primaryDark]}
                        style={styles.fabInner}
                    >
                        <MaterialIcons name="add" size={28} color="#ffffff" />
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>

            {/* ── Bottom Navigation ── */}
            <Animated.View style={[styles.bottomNav, { opacity: fadeNav }]}>
                {NAV_TABS.map((tab) => {
                    const isActive = tab.key === 'vehicles';
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

    /* Count */
    countRow: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 4,
    },
    countText: {
        fontSize: 13,
        fontWeight: '500',
        color: C.onSurfaceVar,
    },

    /* Scroll */
    scroll: {
        paddingHorizontal: 20,
        paddingTop: 12,
    },

    /* Vehicle Card */
    vehicleCard: {
        marginBottom: 16,
        borderRadius: 20,
        backgroundColor: C.surfaceLowest,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    cardTouchable: {
        padding: 20,
    },
    cardTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardIconCircle: {
        width: 50,
        height: 50,
        borderRadius: 16,
        backgroundColor: C.primaryContainer,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardInfo: {
        flex: 1,
        marginLeft: 14,
    },
    cardNumber: {
        fontSize: 17,
        fontWeight: '700',
        color: C.onSurface,
        letterSpacing: 0.5,
    },
    cardModel: {
        fontSize: 13,
        fontWeight: '500',
        color: C.onSurfaceVar,
        marginTop: 2,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F9EE',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        gap: 5,
    },
    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#34C759',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1B8A3A',
    },

    /* Stats Row */
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginTop: 12,
        paddingLeft: 64,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 12,
        fontWeight: '500',
        color: C.onSurfaceVar,
    },

    /* Divider */
    cardDivider: {
        height: 1,
        backgroundColor: '#F0F3F2',
        marginVertical: 16,
    },

    /* Card Actions */
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardActionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 4,
    },
    cardActionText: {
        fontSize: 13,
        fontWeight: '600',
        color: C.onPrimaryContainer,
    },
    actionSep: {
        width: 1,
        height: 20,
        backgroundColor: '#E8EDEC',
    },

    /* Empty State */
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
        paddingHorizontal: 40,
    },
    emptyIconCircle: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: C.surfaceLow,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: C.onSurface,
        textAlign: 'center',
        marginBottom: 8,
    },
    emptySub: {
        fontSize: 14,
        fontWeight: '500',
        color: C.onSurfaceVar,
        textAlign: 'center',
        marginBottom: 28,
        lineHeight: 20,
    },
    emptyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: C.primary,
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 24,
    },
    emptyBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#ffffff',
    },

    /* FAB */
    fab: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 100 : 88,
        right: 24,
    },
    fabInner: {
        width: 56,
        height: 56,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: C.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
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

export default VehiclesScreen;
