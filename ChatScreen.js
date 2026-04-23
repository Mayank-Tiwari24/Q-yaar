import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    Platform,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
    Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { io } from 'socket.io-client';
import API_URL from './config';

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
    error: '#FF6B6B',
};

// Socket URL (strip /api from API_URL)
const SOCKET_URL = API_URL.replace('/api', '');

// ─── Time Formatter ─────────────────────────────────────────────────────────
const formatMsgTime = (dateStr) => {
    const d = new Date(dateStr);
    const hours = d.getHours();
    const mins = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    return `${h}:${mins} ${ampm}`;
};

// ─── ChatScreen ─────────────────────────────────────────────────────────────
const ChatScreen = ({ route }) => {
    const navigation = useNavigation();
    const { sessionId, mobileNumber, ownerName, vehicleNumber, role } = route?.params || {};

    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [sessionData, setSessionData] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [limitReached, setLimitReached] = useState(false);
    const [sessionStatus, setSessionStatus] = useState('ACTIVE');
    const flatListRef = useRef(null);
    const socketRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Animations
    const fadeHeader = useRef(new Animated.Value(0)).current;
    const fadeContent = useRef(new Animated.Value(0)).current;

    // ─── Fetch Messages ─────────────────────────────────────────────────
    const fetchMessages = useCallback(async () => {
        try {
            const res = await fetch(
                `${API_URL}/chat/messages/${sessionId}?mobile=${mobileNumber}`
            );
            const data = await res.json();
            if (data.success) {
                setMessages(data.data.messages);
                setSessionData(data.data.session);
                setSessionStatus(data.data.session.status);

                // Check if scanner limit reached
                if (
                    role === 'scanner' &&
                    !data.data.session.ownerHasReplied &&
                    data.data.session.scannerMessageCount >= 3
                ) {
                    setLimitReached(true);
                } else {
                    setLimitReached(false);
                }
            }
        } catch (err) {
            console.error('Fetch messages error:', err);
        }
    }, [sessionId, mobileNumber, role]);

    // ─── Socket.io Setup ────────────────────────────────────────────────
    useEffect(() => {
        fetchMessages();

        // Connect socket
        const socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
            socket.emit('join_session', sessionId);
        });

        // Receive messages in real-time
        socket.on('receive_message', (data) => {
            setMessages((prev) => [...prev, data]);

            // If we're scanner and received a message from owner, reset limit
            if (role === 'scanner' && data.senderMobile !== mobileNumber) {
                setLimitReached(false);
            }
        });

        // Typing indicator
        socket.on('user_typing', (data) => {
            if (data.mobile !== mobileNumber) {
                setIsTyping(data.isTyping);
            }
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        // Animations
        Animated.timing(fadeHeader, { toValue: 1, duration: 400, useNativeDriver: true }).start();
        Animated.timing(fadeContent, { toValue: 1, duration: 500, delay: 100, useNativeDriver: true }).start();

        return () => {
            socket.emit('leave_session', sessionId);
            socket.disconnect();
        };
    }, [sessionId]);

    // ─── Send Message ───────────────────────────────────────────────────
    const handleSend = async () => {
        const text = inputText.trim();
        if (!text) return;

        if (sessionStatus !== 'ACTIVE') {
            if (Platform.OS === 'web') {
                window.alert('This chat session has ended.');
            } else {
                Alert.alert('Session Ended', 'This chat session has expired or been blocked.');
            }
            return;
        }

        setInputText('');

        try {
            const res = await fetch(`${API_URL}/chat/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    senderMobile: mobileNumber,
                    text,
                }),
            });

            const data = await res.json();

            if (data.success) {
                const newMsg = data.data;
                setMessages((prev) => [...prev, newMsg]);

                // Emit via socket for real-time delivery
                socketRef.current?.emit('send_message', {
                    ...newMsg,
                    sessionId,
                });

                // Update scanner count locally
                if (role === 'scanner') {
                    const newCount = (sessionData?.scannerMessageCount || 0) + 1;
                    if (!sessionData?.ownerHasReplied && newCount >= 3) {
                        setLimitReached(true);
                    }
                }
            } else if (data.limitReached) {
                setLimitReached(true);
                if (Platform.OS === 'web') {
                    window.alert(data.message);
                } else {
                    Alert.alert('Message Limit', data.message);
                }
            } else {
                console.error('Send failed:', data.message);
            }
        } catch (err) {
            console.error('Send message error:', err);
        }
    };

    // ─── Typing Handler ─────────────────────────────────────────────────
    const handleTyping = (text) => {
        setInputText(text);

        socketRef.current?.emit('typing', {
            sessionId,
            mobile: mobileNumber,
            isTyping: true,
        });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socketRef.current?.emit('typing', {
                sessionId,
                mobile: mobileNumber,
                isTyping: false,
            });
        }, 1500);
    };

    // ─── Block Handler ──────────────────────────────────────────────────
    const handleBlock = () => {
        const doBlock = async () => {
            try {
                const res = await fetch(`${API_URL}/chat/block/${sessionId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mobile: mobileNumber }),
                });
                const data = await res.json();
                if (data.success) {
                    setSessionStatus('BLOCKED');
                    if (Platform.OS !== 'web') {
                        Alert.alert('Blocked', 'This person can no longer contact you via this QR.');
                    }
                }
            } catch (err) {
                console.error('Block error:', err);
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm('Block this user? They will no longer be able to message you.')) {
                doBlock();
            }
        } else {
            Alert.alert(
                'Block User',
                'Are you sure? This person will no longer be able to message you via this QR.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Block', style: 'destructive', onPress: doBlock },
                ]
            );
        }
    };

    // ─── Render Message Bubble ──────────────────────────────────────────
    const renderMessage = ({ item }) => {
        const isMe = item.senderMobile === mobileNumber;

        return (
            <View style={[styles.msgRow, isMe && styles.msgRowMe]}>
                <View style={[styles.msgBubble, isMe ? styles.msgBubbleMe : styles.msgBubbleOther]}>
                    <Text style={[styles.msgText, isMe && styles.msgTextMe]}>
                        {item.text}
                    </Text>
                    <Text style={[styles.msgTime, isMe && styles.msgTimeMe]}>
                        {formatMsgTime(item.createdAt)}
                    </Text>
                </View>
            </View>
        );
    };

    const isDisabled = sessionStatus !== 'ACTIVE' || limitReached;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={0}
        >
            <StatusBar style="dark" />

            {/* ── Header ── */}
            <Animated.View style={[styles.header, { opacity: fadeHeader }]}>
                <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
                    <MaterialIcons name="arrow-back" size={24} color={C.onSurface} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {ownerName || 'Chat'}
                    </Text>
                    <Text style={styles.headerSub} numberOfLines={1}>
                        {vehicleNumber ? `🚗 ${vehicleNumber}` : ''}
                        {isTyping ? '  •  typing...' : ''}
                    </Text>
                </View>
                {role === 'owner' && sessionStatus === 'ACTIVE' && (
                    <TouchableOpacity style={styles.blockBtn} onPress={handleBlock} activeOpacity={0.7}>
                        <MaterialIcons name="block" size={20} color={C.error} />
                    </TouchableOpacity>
                )}
            </Animated.View>

            {/* ── Status Banner ── */}
            {sessionStatus === 'EXPIRED' && (
                <View style={styles.statusBanner}>
                    <MaterialIcons name="schedule" size={16} color="#B8860B" />
                    <Text style={styles.statusBannerText}>
                        This session has expired. Scan the QR again to start a new chat.
                    </Text>
                </View>
            )}
            {sessionStatus === 'BLOCKED' && (
                <View style={[styles.statusBanner, { backgroundColor: '#FFF0F0' }]}>
                    <MaterialIcons name="block" size={16} color={C.error} />
                    <Text style={[styles.statusBannerText, { color: C.error }]}>
                        This chat has been blocked.
                    </Text>
                </View>
            )}

            {/* ── Messages ── */}
            <Animated.View style={[styles.messagesContainer, { opacity: fadeContent }]}>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.messagesList}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
                    ListEmptyComponent={
                        <View style={styles.emptyChat}>
                            <MaterialIcons name="waving-hand" size={40} color={C.primary} />
                            <Text style={styles.emptyChatText}>Say hello! 👋</Text>
                            <Text style={styles.emptyChatSub}>
                                Send a message to start the conversation
                            </Text>
                        </View>
                    }
                />
            </Animated.View>

            {/* ── Limit Warning ── */}
            {limitReached && sessionStatus === 'ACTIVE' && (
                <View style={styles.limitBanner}>
                    <MaterialIcons name="info" size={16} color="#B8860B" />
                    <Text style={styles.limitText}>
                        Message limit reached. Wait for the owner to reply.
                    </Text>
                </View>
            )}

            {/* ── Input Bar ── */}
            {sessionStatus === 'ACTIVE' && (
                <View style={styles.inputBar}>
                    <TextInput
                        style={styles.input}
                        placeholder={limitReached ? 'Wait for reply...' : 'Type a message...'}
                        placeholderTextColor="#9EAAA6"
                        value={inputText}
                        onChangeText={handleTyping}
                        multiline
                        maxLength={500}
                        editable={!limitReached}
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, (!inputText.trim() || isDisabled) && styles.sendBtnDisabled]}
                        activeOpacity={0.7}
                        onPress={handleSend}
                        disabled={!inputText.trim() || isDisabled}
                    >
                        <MaterialIcons name="send" size={22} color="#ffffff" />
                    </TouchableOpacity>
                </View>
            )}
        </KeyboardAvoidingView>
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
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 56 : 44,
        paddingBottom: 12,
        backgroundColor: C.surfaceLowest,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    headerBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: C.surfaceLow,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerInfo: {
        flex: 1,
        marginLeft: 14,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: C.onSurface,
        letterSpacing: -0.2,
    },
    headerSub: {
        fontSize: 13,
        fontWeight: '500',
        color: C.onSurfaceVar,
        marginTop: 1,
    },
    blockBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF0F0',
        alignItems: 'center',
        justifyContent: 'center',
    },

    /* Status Banners */
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FFF8E1',
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    statusBannerText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#B8860B',
        flex: 1,
    },

    /* Messages */
    messagesContainer: {
        flex: 1,
    },
    messagesList: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    msgRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    msgRowMe: {
        justifyContent: 'flex-end',
    },
    msgBubble: {
        maxWidth: '78%',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    msgBubbleMe: {
        backgroundColor: C.primary,
        borderBottomRightRadius: 6,
    },
    msgBubbleOther: {
        backgroundColor: C.surfaceLowest,
        borderBottomLeftRadius: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    msgText: {
        fontSize: 15,
        fontWeight: '500',
        color: C.onSurface,
        lineHeight: 20,
    },
    msgTextMe: {
        color: '#ffffff',
    },
    msgTime: {
        fontSize: 10,
        fontWeight: '500',
        color: '#9EAAA6',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    msgTimeMe: {
        color: 'rgba(255,255,255,0.7)',
    },

    /* Empty Chat */
    emptyChat: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
    },
    emptyChatText: {
        fontSize: 18,
        fontWeight: '700',
        color: C.onSurface,
        marginTop: 16,
    },
    emptyChatSub: {
        fontSize: 14,
        fontWeight: '500',
        color: C.onSurfaceVar,
        marginTop: 4,
    },

    /* Limit Banner */
    limitBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FFF8E1',
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    limitText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#B8860B',
        flex: 1,
    },

    /* Input Bar */
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingBottom: Platform.OS === 'ios' ? 28 : 16,
        backgroundColor: C.surfaceLowest,
        borderTopWidth: 1,
        borderTopColor: C.outlineVar + '30',
    },
    input: {
        flex: 1,
        backgroundColor: C.surfaceLow,
        borderRadius: 24,
        paddingHorizontal: 18,
        paddingVertical: 12,
        fontSize: 15,
        fontWeight: '500',
        color: C.onSurface,
        maxHeight: 100,
        marginRight: 10,
    },
    sendBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: C.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: C.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    sendBtnDisabled: {
        backgroundColor: '#c8ddd8',
        shadowOpacity: 0,
        elevation: 0,
    },
});

export default ChatScreen;
