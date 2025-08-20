import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

interface ChatInputRowProps {
  input: string;
  setInput: (text: string) => void;
  listening: boolean;
  handleMicPress: () => void;
  handleSend: () => void;
}

export const ChatInputRow: React.FC<ChatInputRowProps> = ({
  input,
  setInput,
  listening,
  handleMicPress,
  handleSend,
}) => (
  <View style={styles.inputRow}>
    <Pressable
      onPress={handleMicPress}
      style={[styles.iconBtn, listening && styles.iconBtnActive]}
    >
      <MaterialIcons name={listening ? 'mic-off' : 'mic'} size={22} />
    </Pressable>

    <TextInput
      placeholder="Type your question"
      value={input}
      onChangeText={setInput}
      style={styles.input}
      multiline
    />

    <Pressable onPress={handleSend} style={styles.sendBtn}>
      <MaterialIcons name="send" size={22} />
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#DDD',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#FAFAFA',
  },
  iconBtn: {
    height: 40,
    width: 40,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  iconBtnActive: { backgroundColor: '#E7FFF6', borderColor: '#C8F6E7' },
  sendBtn: {
    height: 40,
    width: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#DDD',
  },
});