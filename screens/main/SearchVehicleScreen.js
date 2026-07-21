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
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

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
};

// ─── Bottom Nav Tabs ────────────────────────────────────────────────────────
const NAV_TABS = [
    { icon: 'home', label: 'Home', key: 'home' },
    { icon: 'qr-code-scanner', label: 'Scan', key: 'scan' },
    { icon: 'directions-car', label: 'Vehicles', key: 'vehicles' },
    { icon: 'history', label: 'Activity', key: 'activity' },
    { icon: 'person', label: 'Profile', key: 'profile' },
];

const DEMO_RESULT = {
    number: 'MP 04 AB 1234',
    owner: 'Rahul Sharma',
    type: 'Car',
    model: 'Hyundai i20',
    fuel: 'Petrol',
    city: 'Indore',
};

// ─── SearchVehicleScreen ────────────────────────────────────────────────────
const SearchVehicleScreen = () => {
    const navigation = useNavigation();

    // State
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading | success | not_found

    // Animations
    const fadeHeader = useRef(new Animated.Value(0)).current;
    const fadeContent = useRef(new Animated.Value(0)).current;
    const fadeNav = useRef(new Animated.Value(0)).current;
    const resultAnim = useRef(new Animated.Value(0)).current;
    const resultSlide = useRef(new Animated.Value(20)).current;
    const spinAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeHeader, { toValue: 1, duration: 400, useNativeDriver: true }).start();
        Animated.timing(fadeContent, { toValue: 1, duration: 500, delay: 100, useNativeDriver: true }).start();
        Animated.timing(fadeNav, { toValue: 1, duration: 300, delay: 200, useNativeDriver: true }).start();
    }, []);

    // Loader Spin
    useEffect(() => {
        if (status === 'loading') {
            Animated.loop(
                Animated.timing(spinAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            spinAnim.setValue(0);
        }
    }, [status]);

    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const handleSearch = () => {
        Keyboard.dismiss();
        const cleanQuery = query.replace(/\s+/g, '').toUpperCase();
        if (cleanQuery.length < 4) {
            return; // simple validation
        }

        setStatus('loading');
        resultAnim.setValue(0);
        resultSlide.setValue(20);

        // Simulate API call
        setTimeout(() => {
            if (cleanQuery.includes('MP04AB1234') || cleanQuery === 'MP04AB1234') {
                setStatus('success');
                Animated.parallel([
                    Animated.timing(resultAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
                    Animated.spring(resultSlide, { toValue: 0, friction: 8, useNativeDriver: true }),
                ]).start();
            } else {
                setStatus('not_found');
                Animated.timing(resultAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
            }
        }, 1200);
    };

    const handleTextChange = (text) => {
        setQuery(text.toUpperCase());
        if (status !== 'idle') {
            setStatus('idle');
            resultAnim.setValue(0);
        }
    };

    const handleNavTab = (key) => {
        if (key === 'home') navigation.navigate('Home');
        if (key === 'scan') navigation.navigate('Scan');
        if (key === 'vehicles') navigation.navigate('Vehicles');
        if (key === 'activity') navigation.navigate('Activity');
        if (key === 'profile') navigation.navigate('Profile');
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <StatusBar style="dark" />

                {/* ── Header ── */}
                <Animated.View style={[styles.header, { opacity: fadeHeader }]}>
                    <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
                        <MaterialIcons name="arrow-back" size={24} color={C.onSurface} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Search Vehicle</Text>
                    <View style={styles.headerSpacer} />
                </Animated.View>

                {/* ── Content ── */}
                <Animated.View style={[styles.content, { opacity: fadeContent }]}>
                    
                    {/* Search Input Area */}
                    <Text style={styles.sectionTitle}>Vehicle Lookup</Text>
                    <View style={styles.searchBox}>
                        <MaterialIcons name="search" size={24} color={C.onSurfaceVar} style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="e.g., MP04AB1234"
                            placeholderTextColor="#b0b8b6"
                            value={query}
                            onChangeText={handleTextChange}
                            autoCapitalize="characters"
                            autoCorrect={false}
                            maxLength={10}
                            returnKeyType="search"
                            onSubmitEditing={handleSearch}
                        />
                    </View>

                    <TouchableOpacity 
                        style={[styles.searchBtn, query.length < 4 && styles.searchBtnDisabled]} 
                        activeOpacity={0.8}
                        onPress={handleSearch}
                        disabled={query.length < 4 || status === 'loading'}
                    >
                        {status === 'loading' ? (
                            <Animated.View style={{ transform: [{ rotate: spin }] }}>
                                <MaterialIcons name="autorenew" size={20} color="#fff" />
                            </Animated.View>
                        ) : (
                            <Text style={styles.searchBtnText}>Search Details</Text>
                        )}
                    </TouchableOpacity>

                    {/* States */}
                    <View style={styles.resultArea}>
                        {status === 'idle' && (
                            <View style={styles.emptyState}>
                                <MaterialIcons name="directions-car" size={48} color={C.outlineVar} />
                                <Text style={styles.emptyStateText}>Enter a vehicle number to view details</Text>
                            </View>
                        )}

                        {status === 'loading' && (
                            <View style={styles.loadingState}>
                                {/* Skeleton Card */}
                                <View style={styles.skeletonCard}>
                                    <View style={styles.skeletonRow}><View style={styles.skelAvatar}/><View style={styles.skelLine}/></View>
                                    <View style={styles.skeletonRow}><View style={styles.skelLineSm}/></View>
                                    <View style={styles.skeletonRow}><View style={styles.skelLine}/></View>
                                </View>
                            </View>
                        )}

                        {status === 'not_found' && (
                            <Animated.View style={[styles.emptyState, { opacity: resultAnim }]}>
                                <MaterialIcons name="error-outline" size={48} color={C.error} />
                                <Text style={styles.errorText}>No vehicle found. Please check the number and try again.</Text>
                            </Animated.View>
                        )}

                        {status === 'success' && (
                            <Animated.View style={{ opacity: resultAnim, transform: [{ translateY: resultSlide }] }}>
                                <View style={styles.resultCard}>
                                    <View style={styles.resultHeader}>
                                        <View style={styles.resultIconBox}>
                                            <MaterialIcons name="directions-car" size={24} color={C.onPrimaryContainer} />
                                        </View>
                                        <View>
                                            <Text style={styles.resultPlate}>{DEMO_RESULT.number}</Text>
                                            <Text style={styles.resultOwner}>{DEMO_RESULT.owner}</Text>
                                        </View>
                                    </View>
                                    
                                    <View style={styles.divider} />

                                    <View style={styles.detailsGrid}>
                                        <View style={styles.detailItem}>
                                            <Text style={styles.detailLabel}>Vehicle Type</Text>
                                            <Text style={styles.detailVal}>{DEMO_RESULT.type}</Text>
                                        </View>
                                        <View style={styles.detailItem}>
                                            <Text style={styles.detailLabel}>Model</Text>
                                            <Text style={styles.detailVal}>{DEMO_RESULT.model}</Text>
                                        </View>
                                        <View style={styles.detailItem}>
                                            <Text style={styles.detailLabel}>Fuel Type</Text>
                                            <Text style={styles.detailVal}>{DEMO_RESULT.fuel}</Text>
                                        </View>
                                        <View style={styles.detailItem}>
                                            <Text style={styles.detailLabel}>City</Text>
                                            <Text style={styles.detailVal}>{DEMO_RESULT.city}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.privacyNoteBox}>
                                    <MaterialIcons name="lock" size={14} color={C.onSurfaceVar} style={{marginTop: 2}}/>
                                    <Text style={styles.privacyNote}>
                                        Note: Only limited public information is shown for privacy and security.
                                    </Text>
                                </View>
                            </Animated.View>
                        )}
                    </View>

                </Animated.View>

                {/* ── Bottom Navigation ── */}
                <Animated.View style={[styles.bottomNav, { opacity: fadeNav }]}>
                    {NAV_TABS.map((tab) => {
                        return (
                            <TouchableOpacity
                                key={tab.key}
                                style={styles.navTab}
                                activeOpacity={0.7}
                                onPress={() => handleNavTab(tab.key)}
                            >
                                <MaterialIcons
                                    name={tab.icon}
                                    size={24}
                                    color={C.onSurfaceVar}
                                />
                                <Text style={styles.navLabel}>
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
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
        fontSize: 18,
        fontWeight: '700',
        color: C.onSurface,
        letterSpacing: -0.2,
    },
    headerSpacer: {
        width: 44, // balance back btn
    },

    /* Content */
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: C.onSurface,
        marginBottom: 12,
        marginLeft: 4,
    },

    /* Search Box */
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: C.surfaceLowest,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: C.outlineVar,
        paddingHorizontal: 16,
        height: 56,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
        elevation: 1,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: C.onSurface,
        height: '100%',
        letterSpacing: 1,
    },
    searchBtn: {
        backgroundColor: C.primary,
        borderRadius: 16,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: C.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
    },
    searchBtnDisabled: {
        backgroundColor: '#c4d7d4',
        shadowOpacity: 0,
        elevation: 0,
    },
    searchBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#ffffff',
    },

    /* Result Area */
    resultArea: {
        flex: 1,
        marginTop: 32,
    },
    
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
        paddingHorizontal: 30,
    },
    emptyStateText: {
        fontSize: 14,
        fontWeight: '500',
        color: C.onSurfaceVar,
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 22,
    },
    errorText: {
        fontSize: 14,
        fontWeight: '600',
        color: C.error,
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 22,
    },

    /* Skeleton */
    loadingState: {
        width: '100%',
        alignItems: 'center',
    },
    skeletonCard: {
        width: '100%',
        backgroundColor: C.surfaceLowest,
        borderRadius: 20,
        padding: 20,
        opacity: 0.6,
    },
    skeletonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    skelAvatar: {
        width: 48, height: 48, borderRadius: 14, backgroundColor: C.surfaceLow, marginRight: 16,
    },
    skelLine: {
        height: 16, width: '60%', backgroundColor: C.surfaceLow, borderRadius: 8,
    },
    skelLineSm: {
        height: 16, width: '40%', backgroundColor: C.surfaceLow, borderRadius: 8,
    },

    /* Result Card */
    resultCard: {
        backgroundColor: C.surfaceLowest,
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.04,
        shadowRadius: 20,
        elevation: 3,
        marginBottom: 20,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resultIconBox: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: C.primaryContainer,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    resultPlate: {
        fontSize: 18,
        fontWeight: '800',
        color: C.onSurface,
        letterSpacing: 0.5,
    },
    resultOwner: {
        fontSize: 14,
        fontWeight: '500',
        color: C.onSurfaceVar,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: C.outlineVar,
        marginVertical: 18,
        opacity: 0.6,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: 16,
    },
    detailItem: {
        width: '50%',
    },
    detailLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: C.onSurfaceVar,
        marginBottom: 4,
    },
    detailVal: {
        fontSize: 14,
        fontWeight: '700',
        color: C.onSurface,
    },

    privacyNoteBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 8,
        gap: 8,
    },
    privacyNote: {
        flex: 1,
        fontSize: 12,
        fontWeight: '500',
        color: C.onSurfaceVar,
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
    navLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: C.onSurfaceVar,
        marginTop: 2,
        letterSpacing: 0.2,
    },
});

export default SearchVehicleScreen;
