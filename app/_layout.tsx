import { Stack } from 'expo-router';
import React from 'react';

export default function Layout() {
  return (
    <Stack>
      {/* Your single chat screen */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
