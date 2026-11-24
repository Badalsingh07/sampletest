import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Alert, ImageBackground, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export type AuthMode = 'Register' | 'SignIn';
type Props = { mode: AuthMode; onBack: () => void; onSwitch: (mode: AuthMode) => void; onSuccess?: () => void };
const background = require('../../assets/registration_background.png');

/** Local community access only; broker authentication remains separate. */
export default function AccountAuthScreen({ mode, onBack, onSwitch, onSuccess }: Props) {
  const registering = mode === 'Register';
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');

  function submit() {
    if (!/^[A-Za-z0-9]+$/.test(login)) return setError('Use letters and digits without spaces.');
    if (password.length < 4) return setError('Enter a password with at least 4 characters.');
    setError('');
    setPassword('');
    Alert.alert(registering ? 'Community account created' : 'Community signed in', 'This local community form does not sign you in to the broker account.', [{ text: 'OK', onPress: onSuccess }]);
  }

  return (
    <ImageBackground source={background} resizeMode="cover" style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack} accessibilityRole="button" accessibilityLabel="Back to Messages"><Ionicons name="arrow-back" size={30} color="#FFFFFF" /></Pressable>
        <Text style={styles.headerTitle}>Authorize</Text>
      </View>
      <KeyboardAvoidingView style={styles.content} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.form}>
          <Text style={styles.brand}>TRADEHUB</Text>
          <Text style={styles.headline}>Join trader&apos;s community{`\n`}tradehub.local</Text>
          <TextInput style={styles.input} placeholder="Login" placeholderTextColor="#FFFFFF" accessibilityLabel="Community login" autoCapitalize="none" autoCorrect={false} value={login} onChangeText={(value) => { setLogin(value); setError(''); }} />
          <Text style={styles.hint}>Latin characters and digits without spaces</Text>
          <View style={styles.passwordRow}>
            <TextInput style={styles.passwordInput} placeholder="Password" placeholderTextColor="#FFFFFF" accessibilityLabel="Community password" secureTextEntry={!passwordVisible} autoCapitalize="none" autoCorrect={false} value={password} onChangeText={(value) => { setPassword(value); setError(''); }} onSubmitEditing={submit} />
            <Pressable style={styles.eyeButton} onPress={() => setPasswordVisible((current) => !current)} accessibilityRole="button" accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}><Ionicons name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} size={30} color="#2362B7" /></Pressable>
          </View>
          {!!error && <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text>}
          <Text style={styles.supporting}>Authorize and chat with traders right here and now</Text>
          <Pressable style={styles.primaryButton} onPress={submit} accessibilityRole="button"><Text style={styles.primaryLabel}>{registering ? 'Register' : 'Sign In'}</Text></Pressable>
          <Text style={styles.or}>or</Text>
          <Pressable style={styles.googleButton} onPress={() => Alert.alert('Google sign-in', 'Google sign-in is not configured for this local demo.')} accessibilityRole="button"><Text style={styles.googleG}>G</Text><Text style={styles.googleLabel}>Sign in with Google</Text></Pressable>
          <Pressable style={styles.switchButton} onPress={() => onSwitch(registering ? 'SignIn' : 'Register')} accessibilityRole="button"><Text style={styles.switchText}>{registering ? 'Already have an account? ' : "If you don't have an account, please "}<Text style={styles.switchLink}>{registering ? 'sign in' : 'register'}</Text></Text></Pressable>
          <Text style={styles.footer}>Visit <Text style={styles.switchLink}>tradehub.local</Text> to access community services.</Text>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#4D7EBB' }, header: { height: 64, flexDirection: 'row', alignItems: 'center' }, backButton: { width: 64, height: 56, alignItems: 'center', justifyContent: 'center' }, headerTitle: { color: '#FFFFFF', fontSize: 25, fontWeight: '500' }, content: { flex: 1, justifyContent: 'center' }, form: { width: '100%', maxWidth: 560, alignSelf: 'center', paddingHorizontal: 42, paddingBottom: 34 }, brand: { color: '#FFFFFF', fontWeight: '900', fontSize: 39, letterSpacing: -1, textAlign: 'center', marginBottom: 35 }, headline: { color: '#FFFFFF', fontSize: 28, lineHeight: 37, textAlign: 'center', marginBottom: 58 }, input: { height: 72, borderRadius: 5, backgroundColor: '#151515', color: '#FFFFFF', paddingHorizontal: 20, fontSize: 20 }, hint: { color: '#FFFFFF', fontSize: 14, textAlign: 'center', marginTop: 12, marginBottom: 33 }, passwordRow: { height: 72, borderRadius: 5, flexDirection: 'row', alignItems: 'center', backgroundColor: '#151515' }, passwordInput: { flex: 1, height: 72, color: '#FFFFFF', paddingLeft: 20, fontSize: 20 }, eyeButton: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center' }, error: { color: '#FFE2E2', textAlign: 'center', marginTop: 10, fontSize: 13 }, supporting: { color: '#FFFFFF', fontSize: 15, textAlign: 'center', marginTop: 22, marginBottom: 31 }, primaryButton: { height: 62, borderRadius: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFC42C' }, primaryLabel: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' }, or: { color: '#FFFFFF', fontSize: 20, textAlign: 'center', marginVertical: 18 }, googleButton: { height: 62, borderRadius: 3, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18 }, googleG: { color: '#4285F4', fontSize: 28, fontWeight: '900' }, googleLabel: { color: '#5D5D5D', fontSize: 18, fontWeight: '700' }, switchButton: { alignSelf: 'center', paddingVertical: 26 }, switchText: { color: '#FFFFFF', fontSize: 16, textAlign: 'center' }, switchLink: { color: '#FFDB4F', fontWeight: '700' }, footer: { color: '#FFFFFF', fontSize: 15, textAlign: 'center' },
});
