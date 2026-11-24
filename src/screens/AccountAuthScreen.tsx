import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Alert, ImageBackground, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

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
        <Text allowFontScaling={false} style={styles.headerTitle}>Authorize</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.form}>
          <Text allowFontScaling={false} style={styles.brand}>TRADEHUB</Text>
          <Text allowFontScaling={false} style={styles.headline}>Join trader&apos;s community{`\n`}tradehub.local</Text>
          <TextInput allowFontScaling={false} style={styles.input} placeholder="Login" placeholderTextColor="#FFFFFF" accessibilityLabel="Community login" autoCapitalize="none" autoCorrect={false} value={login} onChangeText={(value) => { setLogin(value); setError(''); }} />
          <Text allowFontScaling={false} style={styles.hint}>Latin characters and digits without spaces</Text>
          <View style={styles.passwordRow}>
            <TextInput allowFontScaling={false} style={styles.passwordInput} placeholder="Password" placeholderTextColor="#FFFFFF" accessibilityLabel="Community password" secureTextEntry={!passwordVisible} autoCapitalize="none" autoCorrect={false} value={password} onChangeText={(value) => { setPassword(value); setError(''); }} onSubmitEditing={submit} />
            <Pressable style={styles.eyeButton} onPress={() => setPasswordVisible((current) => !current)} accessibilityRole="button" accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}><Ionicons name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} size={30} color="#2362B7" /></Pressable>
          </View>
          <Text allowFontScaling={false} style={styles.passwordHint}>Use letters and digits without spaces.</Text>
          {!!error && <Text allowFontScaling={false} style={styles.error} accessibilityLiveRegion="polite">{error}</Text>}
          <Text allowFontScaling={false} style={styles.supporting}>Authorize and chat with traders right here and now</Text>
          <Pressable style={styles.primaryButton} onPress={submit} accessibilityRole="button"><Text allowFontScaling={false} style={styles.primaryLabel}>{registering ? 'Register' : 'Sign In'}</Text></Pressable>
          <Text allowFontScaling={false} style={styles.or}>or</Text>
          <Pressable style={styles.googleButton} onPress={() => Alert.alert('Google sign-in', 'Google sign-in is not configured for this local demo.')} accessibilityRole="button"><Text allowFontScaling={false} style={styles.googleG}>G</Text><Text allowFontScaling={false} style={styles.googleLabel}>Sign in with Google</Text></Pressable>
        </View>
        <Pressable style={styles.settingsButton} onPress={() => Alert.alert('Settings', 'Community settings are not available in this local demo.')} accessibilityRole="button" accessibilityLabel="Community settings"><Ionicons name="settings" size={30} color="#FFFFFF" /></Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#4D7EBB' },
  header: { height: 64, flexDirection: 'row', alignItems: 'center', flexShrink: 0, zIndex: 2 },
  backButton: { width: 64, height: 56, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#FFFFFF', fontSize: 25, fontWeight: '500' },
  content: { flex: 1, position: 'relative', overflow: 'visible' },
  form: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  brand: { position: 'absolute', top: -104, left: 0, right: 0, color: '#FFFFFF', fontWeight: '900', fontSize: 34, letterSpacing: -1, textAlign: 'center' },
  headline: { position: 'absolute', top: -45, left: 20, right: 20, color: '#FFFFFF', fontSize: 28, lineHeight: 37, textAlign: 'center' },
  input: { position: 'absolute', top: 117, left: 42, right: 42, height: 72, borderRadius: 5, backgroundColor: '#151515', color: '#FFFFFF', paddingHorizontal: 20, fontSize: 20 },
  hint: { position: 'absolute', top: 205, left: 20, right: 20, color: '#FFFFFF', fontSize: 14, textAlign: 'center' },
  passwordRow: { position: 'absolute', top: 252, left: 42, right: 42, height: 72, borderRadius: 5, flexDirection: 'row', alignItems: 'center', backgroundColor: '#151515' },
  passwordInput: { flex: 1, height: 72, color: '#FFFFFF', paddingLeft: 20, fontSize: 20 },
  eyeButton: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center' },
  passwordHint: { position: 'absolute', top: 338, left: 20, right: 20, color: '#FFFFFF', fontSize: 14, textAlign: 'center' },
  error: { position: 'absolute', top: 362, left: 20, right: 20, color: '#FFE2E2', textAlign: 'center', fontSize: 13 },
  supporting: { position: 'absolute', top: 375, left: 25, right: 25, color: '#FFFFFF', fontSize: 15, lineHeight: 20, textAlign: 'center' },
  primaryButton: { position: 'absolute', top: 442, left: 42, right: 42, height: 62, borderRadius: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFC42C' },
  primaryLabel: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  or: { position: 'absolute', top: 532, left: 0, right: 0, color: '#FFFFFF', fontSize: 20, textAlign: 'center' },
  googleButton: { position: 'absolute', top: 566, left: 42, right: 42, height: 62, borderRadius: 3, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18 },
  googleG: { color: '#4285F4', fontSize: 28, fontWeight: '900' },
  googleLabel: { color: '#5D5D5D', fontSize: 18, fontWeight: '700' },
  settingsButton: { position: 'absolute', zIndex: 4, top: 541, right: 18, width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#087EF5', shadowColor: '#214A84', shadowOpacity: 0.4, shadowRadius: 5, elevation: 7 },
});
