import { ChatBubble } from '@/components/ChatBubble';
import { ChatInputRow } from '@/components/ChatInputRow';
import { StatusBar } from 'expo-status-bar';

import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
const MOCK_REPLIES = [
  "That's an interesting question!",
  "I'll have to think more about that.",
  "Can you tell me more?",
  "Here's a quick thought on that...",
  "Great question. Let's explore it.",
];

const getMockReply = () =>
  MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];

const keepLast5Turns = (msgs: any[]) => msgs.slice(-10); // 1 turn = user + AI

export default function HomeScreen() {
  const [recognizerActive, setRecognizerActive] = useState(false);
  const [messages, setMessages] = useState([
    { id: 'welcome', role: 'ai', text: 'Hi! Ask me anything — type or tap the mic.' },
  ]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  // Speech recognition events
  useSpeechRecognitionEvent('start', () => setListening(true));
  useSpeechRecognitionEvent('end', () => setListening(false));
  useSpeechRecognitionEvent('error', (event) => {
    console.log("error code:", event.error, "error message:", event.message);
    setListening(false);
  });
  useSpeechRecognitionEvent('result', (e: any) => {
    const latest = e.results?.[0]?.transcript ?? '';
    setInput(latest);
  });

  useEffect(() => {
    const t = setTimeout(
      () => listRef.current?.scrollToEnd?.({ animated: true }),
      50
    );
    return () => clearTimeout(t);
  }, [messages, loading]);

  const startListening = async () => {
    if (recognizerActive) return; 
    const { granted } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!granted) return;

    setRecognizerActive(true);
    setListening(true);

    ExpoSpeechRecognitionModule.start({
      lang: 'en-US',
      interimResults: true,
      continuous: false,
    });
  };

  const stopListening = () => {
    if (!recognizerActive) return;
    ExpoSpeechRecognitionModule.stop();
    setListening(false);
    setRecognizerActive(false);
  };

  let lastMicPress = 0;
  const handleMicPress = () => {
    const now = Date.now();
    if (now - lastMicPress < 500) return; // ignore rapid taps
    lastMicPress = now;
    
    if (listening) stopListening();
    else startListening();
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { id: String(Date.now()) + '-u', role: 'user', text: trimmed };
    setMessages((prev) => keepLast5Turns([...prev, userMsg]));
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const aiMsg = { id: String(Date.now()) + '-ai', role: 'ai', text: getMockReply() };
      setMessages((prev) => keepLast5Turns([...prev, aiMsg]));
      setLoading(false);
    }, 900);
  };

  const renderItem = ({ item }: any) => <ChatBubble text={item.text} role={item.role} />;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <FlatList
        ref={listRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd?.({ animated: true })
        }
      />

      {loading && (
        <View style={styles.typingRow}>
          <ActivityIndicator size="small" />
          <Text style={styles.typingText}>AI is typing…</Text>
        </View>
      )}

      <ChatInputRow
        input={input}
        setInput={setInput}
        listening={listening}
        handleMicPress={handleMicPress}
        handleSend={handleSend}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F9', paddingTop: 10 },
  listContent: { padding: 12, paddingBottom: 8 },
  typingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 },
  typingText: { fontSize: 12, color: '#555' },
});
