import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ChatBubbleProps {
  text: string;
  role: 'user' | 'ai';
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ text, role }) => {
  const isUser = role === 'user';

  return (
    <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
      <Text style={[styles.bubbleText, isUser ? styles.userBubbleText : styles.aiBubbleText]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: { maxWidth: '80%', borderRadius: 14, padding: 10, marginVertical: 4 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#3b82f6' },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#E8E8ED' },
  bubbleText: { fontSize: 15 },
  userBubbleText: { color: 'white' },
  aiBubbleText: { color: '#111' },
});
