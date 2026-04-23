import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    Platform,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import API_URL from './config';
import { useUser } from './UserContext';

const { width } = Dimensions.get('window');

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
    { icon: 'chat', label: 'Chats', key: 'chats' },
    { icon: 'person', label: 'Profile', key: 'profile' },
];

// ─── Time Formatter ─────────────────────────────────────────────────────────
const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
};

// ─── ChatListScreen ─────────────────────────────────────────────────────────
const ChatListScreen = ({ route }) => {
    const navigation = useNavigation();
    const { mobileNumber: ctxMobile } = useUser();
    const mobileNumber = ctxMobile || route?.params?.mobileNumber || '';

    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Animations
    const fadeHeader = useRef(new Animated.Value(0)).current;
    const fadeNav = useRef(new Animated.Value(0)).current;
    const listAnim = useRef(new Animated.Value(0)).current;
    const listSlide = useRef(new Animated.Value(40)).current;

    const fetchChats = useCallback(async () => {
        if (!mobileNumber) {
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`${API_URL}/chat/list/${mobileNumber}`);
            const data = await res.json();
            if (data.success) {
                setChats(data.data);
            } else {
                setChats([]);
            }
        } catch (err) {
            console.error('Fetch chats error:', err);
        } finally {
            setLoading(false);
        }
    }, [mobileNumber]);

    // Refetch when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchChats();
        }, [fetchChats])
    );

    useEffect(() => {
        Animated.timing(fadeHeader, { toValue: 1, duration: 400, useNativeDriver: true }).start();
        Animated.parallel([
            Animated.timing(listAnim, { toValue: 1, duration: 500, delay: 100, useNativeDriver: true }),
            Animated.spring(listSlide, { toValue: 0, friction: 8, delay: 100, useNativeDriver: true }),
        ]).start();
        Animated.timing(fadeNav, { toValue: 1, duration: 300, delay: 300, useNativeDriver: true }).start();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchChats();
        setRefreshing(false);
    }, [fetchChats]);

    const handleNavTab = (key) => {
        if (key === 'home') navigation.navigate('Home');
        if (key === 'scan') navigation.navigate('Scan');
        if (key === 'vehicles') navigation.navigate('Vehicles');
        if (key === 'profile') navigation.navigate('Profile');
    };

    const openChat = (chat) => {
        navigation.navigate('Chat', {
            sessionId: chat.sessionId,
            mobileNumber,
            ownerName: chat.otherPartyName,
            vehicleNumber: chat.vehicleNumber,
            role: chat.role,
        });
    };

    // ─── Empty State ────────────────────────────────────────────────────
    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
                <MaterialIcons name="chat-bubble-outline" size={48} color={C.primary} />
            </View>
            <Text style={styles.emptyTitle}>No chats yet</Text>
            <Text style={styles.emptySub}>
                Scan someone's vehicle QR to start a conversation. Your chats will appear here.
            </Text>
            <TouchableOpacity
                style={styles.emptyBtn}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Scan')}
            >
                <MaterialIcons name="qr-code-scanner" size={20} color="#fff" />
                <Text style={styles.emptyBtnText}>Scan QR</Text>
            </TouchableOpacity>
        </View>
    );

    // ─── Chat Item ──────────────────────────────────────────────────────
    const renderChatItem = (chat, index) => {
        const isExpired = chat.status === 'EXPIRED';
        const isBlocked = chat.status === 'BLOCKED';

        return (
            <TouchableOpacity
                key={chat.sessionId}
                style={styles.chatItem}
                activeOpacity={0.7}
                onPress={() => openChat(chat)}
            >
                <View style={styles.chatAvatar}>
                    <MaterialIcons
                        name={chat.role === 'owner' ? 'person' : 'directions-car'}
                        size={24}
                        color={C.onPrimaryContainer}
                    />
                </View>
                <View style={styles.chatInfo}>
                    <View style={styles.chatTopRow}>
                        <Text style={styles.chatName} numberOfLines={1}>
                            {chat.otherPartyName}
                        </Text>
                        <Text style={styles.chatTime}>
                            {formatTime(chat.lastMessage?.timestamp)}
                        </Text>
                    </View>
                    <View style={styles.chatBottomRow}>
                        <Text style={styles.chatVehicle} numberOfLines={1}>
                            {chat.vehicleNumber ? `🚗 ${chat.vehicleNumber}` : ''}
                        </Text>
                        {isExpired && (
                            <View style={styles.expiredBadge}>
                                <Text style={styles.expiredText}>Expired</Text>
                            </View>
                        )}
                        {isBlocked && (
                            <View style={[styles.expiredBadge, { backgroundColor: '#FFF0F0' }]}>
                                <Text style={[styles.expiredText, { color: '#FF6B6B' }]}>Blocked</Text>
                            </View>
                        )}
                    </View>
                    {chat.lastMessage?.text ? (
                        <Text style={styles.chatLastMsg} numberOfLines={1}>
                            {chat.lastMessage.senderMobile === mobileNumber ? 'You: ' : ''}
                            {chat.lastMessage.text}
                        </Text>
                    ) : (
                        <Text style={[styles.chatLastMsg, { fontStyle: 'italic' }]}>
                            No messages yet
                        </Text>
                    )}
                </View>
                {chat.unreadCount > 0 && !isExpired && (
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>
                            {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
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
                <Text style={styles.headerTitle}>Chats</Text>
                <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7} onPress={onRefresh}>
                    <MaterialIcons name="refresh" size={24} color={C.onSurface} />
                </TouchableOpacity>
            </Animated.View>

            {/* ── Content ── */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={C.primary} />
                </View>
            ) : (
                <Animated.ScrollView
                    contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    style={{ opacity: listAnim, transform: [{ translateY: listSlide }] }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} colors={[C.primary]} />
                    }
                >
                    {chats.length === 0 ? renderEmpty() : (
                        <View style={styles.chatList}>
                            {chats.map((chat, i) => renderChatItem(chat, i))}
                        </View>
                    )}
                    <View style={{ height: 120 }} />
                </Animated.ScrollView>
            )}

            {/* ── Bottom Navigation ── */}
            <Animated.View style={[styles.bottomNav, { opacity: fadeNav }]}>
                {NAV_TABS.map((tab) => {
                    const isActive = tab.key === 'chats';
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
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
        paddingTop: 12,
    },

    /* Chat List */
    chatList: {
        backgroundColor: C.surfaceLowest,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
        elevation: 2,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: C.outlineVar + '40',
    },
    chatAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: C.primaryContainer,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatInfo: {
        flex: 1,
        marginLeft: 14,
    },
    chatTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    chatName: {
        fontSize: 16,
        fontWeight: '700',
        color: C.onSurface,
        flex: 1,
        marginRight: 8,
    },
    chatTime: {
        fontSize: 12,
        fontWeight: '500',
        color: '#9EAAA6',
    },
    chatBottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    chatVehicle: {
        fontSize: 12,
        fontWeight: '500',
        color: C.onSurfaceVar,
    },
    chatLastMsg: {
        fontSize: 13,
        fontWeight: '500',
        color: '#8A9492',
        lineHeight: 18,
    },
    expiredBadge: {
        backgroundColor: '#FFF8E1',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    expiredText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#B8860B',
    },
    unreadBadge: {
        backgroundColor: C.primary,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    unreadText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#ffffff',
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

export default ChatListScreen;
