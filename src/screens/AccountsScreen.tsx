import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, type ComponentProps, type ReactNode } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type AccountPage =
  | 'Accounts'
  | 'Certificates'
  | 'Brokers'
  | 'BrokerLogin'
  | 'DemoRegistration'
  | 'RealRegistration'
  | 'BrokerInfo'
  | 'ChangePassword';

type Props = {
  page: AccountPage;
  onChangePage: (page: AccountPage) => void;
  onBack: () => void;
  balance?: number;
  bottomTabs?: ReactNode;
  onLoginSuccess?: () => void;
  onLogout?: () => void;
};

type IconName = ComponentProps<typeof Ionicons>['name'];

const blue = '#3385F6';

const account = {
  name: 'Michael Testing',
  id: '9009096389673',
  server: 'Fury holding Capital',
  accessPoint: 'Access Server',
  mode: 'Hedge',
};

const broker = {
  name: 'Fury holding Capital',
  code: 'Fury holding Capital',
};

const passwordTypes = ['master', 'investor'] as const;
type PasswordType = (typeof passwordTypes)[number];

function Tool({
  icon,
  label,
  onPress,
  color = '#FFFFFF',
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  color?: string;
}) {
  return (
    <Pressable
      style={styles.tool}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={24} color={color} />
    </Pressable>
  );
}

function PasswordField({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <TextInput
      style={styles.passwordField}
      value={value}
      onChangeText={onChangeText}
      placeholder={label}
      placeholderTextColor="#757575"
      accessibilityLabel={label}
      secureTextEntry
      autoCapitalize="none"
      autoCorrect={false}
    />
  );
}

function ChangePasswordScreen({ onBack }: { onBack: () => void }) {
  const [passwordType, setPasswordType] = useState<PasswordType>('master');
  const [typePickerOpen, setTypePickerOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const characterTypes = [/[a-z]/, /[A-Z]/, /[0-9]/].filter((pattern) =>
    pattern.test(newPassword),
  ).length;

  const meetsRequirements =
    newPassword.length >= 8 && characterTypes >= 2;

  const confirmationMatches = confirmation === newPassword;
  const canSubmit =
    currentPassword.length > 0 && meetsRequirements && confirmationMatches;

  const activeSegments = Math.min(
    4,
    Math.max(1, characterTypes + Number(newPassword.length >= 8)),
  );
  const strengthColor = meetsRequirements ? '#208052' : '#D34C43';

  function submitPasswordChange() {
    if (!canSubmit) return;

    setCurrentPassword('');
    setNewPassword('');
    setConfirmation('');

    Alert.alert(
      'Change password',
      'The form passed validation. A connected broker is required to change the password.',
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Tool icon="arrow-back-outline" label="Back to accounts" onPress={onBack} />
        <View style={styles.headerDetails}>
          <Text style={styles.title} accessibilityRole="header">
            Change password
          </Text>
          <Text style={styles.headerSubtitle}>
            {account.id}, {account.name}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.passwordForm}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            style={styles.passwordTypeRow}
            onPress={() => setTypePickerOpen((open) => !open)}
            accessibilityRole="button"
            accessibilityState={{ expanded: typePickerOpen }}
          >
            <Text style={styles.passwordTypeText}>
              Change {passwordType} password
            </Text>
            <Ionicons
              name={typePickerOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
              size={20}
              color="#526178"
            />
          </Pressable>

          {typePickerOpen && (
            <View style={styles.passwordTypeList}>
              {passwordTypes.map((type) => (
                <Pressable
                  key={type}
                  style={styles.menuRow}
                  accessibilityRole="button"
                  accessibilityState={{ selected: type === passwordType }}
                  onPress={() => {
                    setPasswordType(type);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmation('');
                    setTypePickerOpen(false);
                  }}
                >
                  <Text style={styles.menuText}>Change {type} password</Text>
                </Pressable>
              ))}
            </View>
          )}

          <View style={styles.passwordFields}>
            <PasswordField
              label="Current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            {currentPassword.length === 0 && (
              <Text style={styles.validationText}>Password is not specified</Text>
            )}

            <PasswordField
              label="New password"
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <View style={styles.strengthTrack}>
              {[0, 1, 2, 3].map((index) => (
                <View
                  key={index}
                  style={[
                    styles.strengthSegment,
                    index < activeSegments && { backgroundColor: strengthColor },
                  ]}
                />
              ))}
            </View>

            {!meetsRequirements && (
              <Text style={styles.validationText}>
                {newPassword.length === 0
                  ? 'Password is not specified'
                  : 'Use at least 8 characters and two character types.'}
              </Text>
            )}

            <PasswordField
              label="Password confirmation"
              value={confirmation}
              onChangeText={setConfirmation}
            />
            {confirmation.length > 0 && !confirmationMatches && (
              <Text style={styles.validationText}>Passwords do not match</Text>
            )}
          </View>

          <Text style={styles.passwordHint}>
            Use at least 8 characters and at least two of these types:
            lowercase letters, uppercase letters, and digits.
          </Text>
        </ScrollView>

        <Pressable
          style={styles.doneButton}
          onPress={submitPasswordChange}
          disabled={!canSubmit}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canSubmit }}
        >
          <Text style={[styles.doneText, !canSubmit && styles.disabledText]}>
            DONE
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function RegistrationScreen({ real, onBack, onComplete }: { real: boolean; onBack: () => void; onComplete: () => void }) {
  const [firstName, setFirstName] = useState('Michael');
  const [lastName, setLastName] = useState('Testing');
  const [phone, setPhone] = useState('+12345678912');
  const [email, setEmail] = useState('michael@example.com');
  const [hedge, setHedge] = useState(true);
  const title = real ? 'Open a real account' : 'Open a demo account';
  const rows = [
    ['Date of birth', 'Please select'],
    ['Phone', phone],
    ['E-Mail', email],
    ...(real ? [['Gender', 'Not specified'], ['Language', 'English']] : []),
  ];
  return <SafeAreaView style={styles.registrationScreen}>
    <View style={styles.registrationHeader}><Tool icon="arrow-back-outline" label="Back" onPress={onBack} /><View><Text style={styles.registrationTitle}>{title}</Text><Text style={styles.registrationSubtitle}>Personal information</Text></View></View>
    <ScrollView contentContainerStyle={styles.registrationBody} keyboardShouldPersistTaps="handled">
      <View style={styles.registrationBroker}><View style={styles.miniLogo}><Ionicons name="trending-up" size={23} color="#FFFFFF" /></View><View><Text style={styles.registrationBrokerName}>Fury holding Capital-Trade</Text><Text style={styles.registrationBrokerDetail}>Fury holding Capital</Text></View></View>
      <Text style={styles.registrationSection}>PERSONAL INFORMATION</Text>
      <TextInput style={styles.registrationInput} value={firstName} onChangeText={setFirstName} placeholder="First name" placeholderTextColor="#A4A5AE" />
      <TextInput style={styles.registrationInput} value={lastName} onChangeText={setLastName} placeholder="Second name" placeholderTextColor="#A4A5AE" />
      {real && <TextInput style={styles.registrationInput} placeholder="Middle name (optional)" placeholderTextColor="#A4A5AE" />}
      {rows.map(([label, value]) => <Pressable key={label} style={styles.registrationRow}><Text style={styles.registrationLabel}>{label}</Text><Text style={styles.registrationValue}>{value}</Text>{(label === 'Date of birth' || label === 'Gender') && <Ionicons name="chevron-down" size={20} color="#A4A5AE" />}</Pressable>)}
      {real && <Text style={styles.privacyText}>Personal details are used for opening a trade account and are not passed to any third parties. The information is handled securely and confidentially.</Text>}
      <Text style={styles.registrationSection}>ACCOUNT INFORMATION</Text>
      <Pressable style={styles.registrationRow} onPress={() => setHedge((value) => !value)}><Text style={styles.registrationLabel}>Use hedge in trading</Text><Ionicons name={hedge ? 'checkbox' : 'square-outline'} size={28} color={blue} /></Pressable>
      <RegistrationOption label="Server" value="Fury holding Capital-Trade" />
      <RegistrationOption label="Account type" value={real ? 'Preliminary Account' : 'Forex Hedged USD'} />
      {real ? <RegistrationOption label="Country" value="United Kingdom" /> : <><RegistrationOption label="Leverage" value="1:100" /><RegistrationOption label="Deposit" value="100000 USD" /></>}
    </ScrollView>
    <Pressable style={styles.registerButton} onPress={onComplete}><Text style={styles.loginButtonText}>{real ? 'NEXT' : 'REGISTER'}</Text></Pressable>
  </SafeAreaView>;
}

function RegistrationOption({ label, value }: { label: string; value: string }) {
  return <View style={styles.registrationRow}><Text style={styles.registrationLabel}>{label}</Text><Text style={styles.registrationValue}>{value}</Text><Ionicons name="chevron-down" size={20} color="#A4A5AE" /></View>;
}

function BrokerInfoScreen({ onBack }: { onBack: () => void }) {
  const details = [
    ['Registration Number', '2026-00767'], ['Company', 'Fury holding Capital'], ['Registration Address', 'Demo Tower, Market Street, London, United Kingdom'], ['Status', 'Demo broker'], ['Offices Location', 'London'], ['Website', 'furyholdingcapital.example'], ['Generic Email', 'support@furyholdingcapital.example'], ['Phone', '+995 594732590'],
  ];
  return <SafeAreaView style={styles.registrationScreen}><View style={styles.registrationHeader}><Tool icon="arrow-back-outline" label="Back" onPress={onBack} /><Text style={styles.registrationTitle}>Broker Information</Text></View><ScrollView>{details.map(([label, value]) => <View key={label} style={styles.infoRow}><Text style={[styles.infoValue, label.includes('Email') || label === 'Website' || label === 'Phone' ? styles.infoLink : undefined]}>{value}</Text><Text style={styles.registrationLabel}>{label}</Text></View>)}</ScrollView><View style={styles.problemButton}><Text style={styles.problemText}>REPORT A PROBLEM TO THE BROKER</Text></View></SafeAreaView>;
}

export default function AccountsScreen({
  page,
  onChangePage,
  onBack,
  balance = 5000,
  bottomTabs,
  onLoginSuccess,
  onLogout,
}: Props) {
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountRemoved, setAccountRemoved] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const amount = balance.toFixed(2).replace(/\B(?=(\d{3})+\.)/g, ' ');
  const brokerMatches = `${broker.name} ${broker.code}`
    .toLowerCase()
    .includes(query.trim().toLowerCase());

  function showProperties() {
    Alert.alert(
      'Properties',
      `${account.id} — ${account.name}\n\n` +
        `USD ${amount}, ${account.mode}\n` +
        `Access point: ${account.accessPoint}`,
    );
  }

  function openBrokers() {
    setQuery('');
    onChangePage('Brokers');
  }

  function showBroker() {
    setLoginError('');
    onChangePage('BrokerLogin');
  }

  function showBrokerInfo() {
    onChangePage('BrokerInfo');
  }

  function signInBroker() {
    if (login === account.id && password === 'Pass@1234') {
      setAccountRemoved(false);
      setPassword('');
      setLoginError('');
      onLoginSuccess?.();
      onChangePage('Accounts');
      return;
    }
    setLoginError('Use the supplied demo login and password.');
  }

  function openChangePassword() {
    setMenuOpen(false);
    onChangePage('ChangePassword');
  }

  function confirmClearPassword() {
    setMenuOpen(false);

    Alert.alert(
      'Clear saved password',
      `Clear the saved password for account ${account.id}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () =>
            Alert.alert('Clear saved password', 'This demo account has no saved password.'),
        },
      ],
      { cancelable: true },
    );
  }

  function confirmDeleteAccount() {
    setMenuOpen(false);

    Alert.alert(
      'Delete account',
      `Remove demo account ${account.id} from this account list?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            setAccountRemoved(true);
            onLogout?.();
          },
        },
      ],
      { cancelable: true },
    );
  }

  const accountActions = [
    { label: 'Change password', onPress: openChangePassword },
    { label: 'Clear saved password', onPress: confirmClearPassword },
    { label: 'Delete account', onPress: confirmDeleteAccount },
  ];

  if (page === 'ChangePassword') {
    return <ChangePasswordScreen onBack={onBack} />;
  }

  if (page === 'DemoRegistration' || page === 'RealRegistration') {
    return <RegistrationScreen real={page === 'RealRegistration'} onBack={() => onChangePage('BrokerLogin')} onComplete={() => { onLoginSuccess?.(); onChangePage('Accounts'); }} />;
  }

  if (page === 'BrokerInfo') {
    return <BrokerInfoScreen onBack={() => onChangePage('Brokers')} />;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Tool
            icon={page === 'Accounts' ? 'menu-outline' : 'arrow-back-outline'}
            label={page === 'Accounts' ? 'Open sidebar' : 'Back to accounts'}
            onPress={onBack}
          />

          <Text style={[styles.title, styles.headerDetails]} accessibilityRole="header">
            {page === 'BrokerLogin' ? broker.name : page}
          </Text>

          {page === 'Accounts' && (
            <>
              <Tool
                icon="ribbon-outline"
                label="Certificates"
                onPress={() => onChangePage('Certificates')}
              />
              <Tool icon="add-outline" label="Find a broker" onPress={openBrokers} />
              {!accountRemoved && (
                <Tool
                  icon="ellipsis-vertical"
                  label="Account options"
                  onPress={() => setMenuOpen(true)}
                />
              )}
            </>
          )}

          {page === 'Certificates' && (
            <Tool
              icon="add-outline"
              label="Add certificate"
              onPress={() =>
                Alert.alert('Add certificate', 'Certificate import requires a certificate service.')
              }
            />
          )}
        </View>

        {page === 'Accounts' && (
          <ScrollView style={styles.body}>
            {accountRemoved ? (
              <Text style={styles.empty}>No accounts</Text>
            ) : (
              <>
                <View style={styles.blueBand} />
                <View style={styles.card}>
                  <View style={styles.accountIcon}>
                    <Ionicons name="trending-up-outline" size={36} color={blue} />
                  </View>

                  <Text style={styles.accountName}>{account.name}</Text>
                  <Text style={styles.accountDetails}>
                    {account.id} · {account.server}{'\n'}
                    {account.accessPoint} · {account.mode}
                  </Text>

                  <View style={styles.balanceRow}>
                    <Text style={styles.balance}>{amount} USD</Text>
                    <View style={styles.infoButton}>
                      <Tool
                        icon="information-circle-outline"
                        label="Account properties"
                        onPress={showProperties}
                        color="#526178"
                      />
                    </View>
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        )}

        {page === 'Certificates' && (
          <View style={styles.body}>
            <Text style={styles.empty}>No installed certificates</Text>
          </View>
        )}

        {page === 'Brokers' && (
          <>
            <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
              <View style={styles.search}>
                <Ionicons name="search-outline" size={22} color="#526178" />
                <TextInput
                  style={styles.searchInput}
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Find broker"
                  placeholderTextColor="#526178"
                  accessibilityLabel="Find broker"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {brokerMatches ? (
                <View style={styles.brokerRow}>
                  <Pressable
                    style={styles.brokerItem}
                    accessibilityRole="button"
                    onPress={showBroker}
                  >
                    <Ionicons name="trending-up-outline" size={28} color={blue} />
                    <View style={styles.brokerText}>
                      <Text style={styles.brokerName}>{broker.name}</Text>
                      <Text style={styles.brokerCode}>{broker.code}</Text>
                    </View>
                  </Pressable>

                  <Tool
                    icon="information-circle-outline"
                    label="Broker information"
                    onPress={showBrokerInfo}
                    color="#526178"
                  />
                </View>
              ) : (
                <Text style={styles.empty}>No matching brokers</Text>
              )}
            </ScrollView>

            <Pressable
              style={styles.footer}
              accessibilityRole="button"
              onPress={() =>
                Alert.alert('Broker search', 'The demo lists one sample broker.')
              }
            >
              <Text style={styles.footerText}>Can’t find your broker?</Text>
            </Pressable>
          </>
        )}

        {page === 'BrokerLogin' && (
          <View style={styles.loginScreen}>
            <View style={styles.loginTopSpace} />
            <Pressable style={styles.accountChoice} onPress={() => onChangePage('DemoRegistration')}>
              <View style={styles.choiceIcon}><Ionicons name="school-outline" size={27} color="#FFFFFF" /></View>
              <View style={styles.grow}><Text style={styles.choiceTitle}>Open a demo account</Text><Text style={styles.choiceDetail}>To learn trading and test your strategies</Text></View><Ionicons name="chevron-forward" size={30} color="#A4A5AE" />
            </Pressable>
            <Pressable style={styles.accountChoice} onPress={() => onChangePage('RealRegistration')}>
              <View style={styles.choiceIcon}><Ionicons name="trending-up-outline" size={27} color="#FFFFFF" /></View>
              <View style={styles.grow}><Text style={styles.choiceTitle}>Open a real account</Text><Text style={styles.choiceDetail}>For live trading, identification is required</Text></View><Ionicons name="chevron-forward" size={30} color="#A4A5AE" />
            </Pressable>
            <Text style={styles.loginHeading}>Login to an existing account</Text>
            <View style={styles.loginRow}><Text style={styles.loginLabel}>Type</Text><Text style={styles.loginValue}>Trade account</Text><Ionicons name="chevron-down" size={23} color="#A4A5AE" /></View>
            <TextInput style={styles.loginInput} value={login} onChangeText={setLogin} keyboardType="number-pad" placeholder="Login" placeholderTextColor="#A4A5AE" />
            <TextInput style={styles.loginInput} value={password} onChangeText={setPassword} secureTextEntry placeholder="Password" placeholderTextColor="#A4A5AE" />
            <View style={styles.loginRow}><Text style={styles.loginLabel}>Server</Text><Text style={styles.loginValue}>{broker.code}-Trade</Text><Ionicons name="chevron-down" size={23} color="#A4A5AE" /></View>
            <View style={styles.saveRow}><Text style={styles.loginLabel}>Save password</Text><Ionicons name="checkbox" size={30} color={blue} /></View>
            {loginError ? <Text style={styles.loginError}>{loginError}</Text> : null}
            <Pressable onPress={() => Alert.alert('Forgot password?', 'To recover your password, contact the broker: Fury holding Capital.', [{ text: 'Skip', style: 'cancel' }, { text: 'Contact Broker' }])}><Text style={styles.forgotPassword}>Forgot password?</Text></Pressable>
            <Pressable style={styles.loginButton} onPress={signInBroker}><Text style={styles.loginButtonText}>LOGIN</Text></Pressable>
          </View>
        )}

        {page !== 'BrokerLogin' && bottomTabs}

        {page === 'Accounts' && menuOpen && !accountRemoved && (
          <View style={styles.menuOverlay} accessibilityViewIsModal>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setMenuOpen(false)}
              accessibilityRole="button"
              accessibilityLabel="Close account options"
            />

            <View style={styles.menu}>
              {accountActions.map(({ label, onPress }, index) => (
                <Pressable
                  key={label}
                  style={[styles.menuRow, index > 0 && styles.menuDivider]}
                  onPress={onPress}
                  accessibilityRole="button"
                >
                  <Text style={styles.menuText}>{label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000000' },
  content: { flex: 1, position: 'relative' },
  body: { flex: 1, backgroundColor: '#000000' },
  header: { minHeight: 56, flexDirection: 'row', alignItems: 'center' },
  headerDetails: { flex: 1 },
  title: { color: '#FFFFFF', fontSize: 19, fontWeight: '600' },
  headerSubtitle: { color: '#FFFFFF', fontSize: 14, marginTop: 2 },
  tool: {
    width: 46,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueBand: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 116,
    backgroundColor: '#000000',
  },
  card: {
    margin: 12,
    padding: 18,
    borderRadius: 14,
    backgroundColor: '#2E2F31',
    alignItems: 'center',
    elevation: 3,
  },
  accountIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountName: { marginTop: 12, color: '#F5F5F7', fontSize: 19, fontWeight: '700' },
  accountDetails: {
    marginTop: 16,
    color: '#A4A5AE',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  balanceRow: {
    width: '100%',
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  balance: {
    color: '#F5F5F7',
    fontSize: 23,
    fontWeight: '600',
    paddingHorizontal: 46,
    textAlign: 'center',
  },
  infoButton: { position: 'absolute', right: 0 },
  empty: {
    marginTop: 28,
    paddingHorizontal: 16,
    color: '#A4A5AE',
    fontSize: 16,
    textAlign: 'center',
  },
  menuOverlay: { ...StyleSheet.absoluteFill, zIndex: 10 },
  menu: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 224,
    maxWidth: '92%',
    borderRadius: 6,
    backgroundColor: '#2E2F31',
    elevation: 8,
  },
  menuRow: {
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D9E2EE',
  },
  menuText: { color: '#F5F5F7', fontSize: 16 },
  search: {
    margin: 12,
    paddingHorizontal: 12,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
    backgroundColor: '#18191C',
  },
  searchInput: { flex: 1, minHeight: 48, color: '#F5F5F7', fontSize: 16 },
  brokerRow: {
    marginHorizontal: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#363842',
  },
  brokerItem: {
    flex: 1,
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brokerText: { flex: 1 },
  brokerName: { color: '#F5F5F7', fontSize: 17, fontWeight: '700' },
  brokerCode: { color: blue, marginTop: 3 },
  footer: { padding: 16, backgroundColor: '#2E2F31', alignItems: 'center' },
  footerText: { color: '#FFFFFF', fontWeight: '700' },
  loginScreen: { flex: 1, backgroundColor: '#000000' },
  loginTopSpace: { height: 42 },
  accountChoice: { minHeight: 80, flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 16, borderBottomWidth: 1, borderColor: '#363842' },
  choiceIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: blue, alignItems: 'center', justifyContent: 'center' },
  grow: { flex: 1 },
  choiceTitle: { color: '#F5F5F7', fontSize: 18 },
  choiceDetail: { color: '#A4A5AE', fontSize: 14, marginTop: 2, maxWidth: 250 },
  loginHeading: { color: '#FFFFFF', fontSize: 19, fontWeight: '700', textAlign: 'center', paddingVertical: 18, borderBottomWidth: 1, borderColor: '#363842' },
  loginRow: { minHeight: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10, borderBottomWidth: 1, borderColor: '#363842' },
  loginLabel: { flex: 1, color: '#A4A5AE', fontSize: 17 },
  loginValue: { color: '#F5F5F7', fontSize: 17 },
  loginInput: { minHeight: 50, marginHorizontal: 16, color: '#F5F5F7', fontSize: 17, borderBottomWidth: 1, borderColor: '#363842' },
  saveRow: { minHeight: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderColor: '#363842' },
  loginError: { color: '#FF6B6B', paddingHorizontal: 24, paddingTop: 9, fontSize: 13 },
  forgotPassword: { color: blue, textAlign: 'center', fontSize: 16, marginTop: 15 },
  loginButton: { minHeight: 50, marginHorizontal: 16, marginTop: 16, borderRadius: 26, backgroundColor: blue, alignItems: 'center', justifyContent: 'center' },
  loginButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  registrationScreen: { flex: 1, backgroundColor: '#000000' },
  registrationHeader: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 8 },
  registrationTitle: { color: '#F5F5F7', fontSize: 18, fontWeight: '600' },
  registrationSubtitle: { color: '#A4A5AE', fontSize: 14, marginTop: 1 },
  registrationBody: { paddingBottom: 84 },
  registrationBroker: { minHeight: 102, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16 },
  miniLogo: { width: 46, height: 46, borderRadius: 23, backgroundColor: blue, alignItems: 'center', justifyContent: 'center' },
  registrationBrokerName: { color: '#F5F5F7', fontSize: 18 },
  registrationBrokerDetail: { color: '#F5F5F7', fontSize: 16, marginTop: 3 },
  registrationSection: { backgroundColor: '#2E2F31', color: '#B8BAC2', fontSize: 14, paddingHorizontal: 16, paddingVertical: 11 },
  registrationInput: { minHeight: 48, marginHorizontal: 16, color: '#F5F5F7', fontSize: 17, borderBottomWidth: 1, borderColor: '#363842', textAlign: 'right' },
  registrationRow: { minHeight: 48, marginHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderColor: '#363842' },
  registrationLabel: { flex: 1, color: '#A4A5AE', fontSize: 16 },
  registrationValue: { color: '#F5F5F7', fontSize: 16, textAlign: 'right' },
  privacyText: { color: '#A4A5AE', fontSize: 13, lineHeight: 18, padding: 16 },
  registerButton: { position: 'absolute', left: 16, right: 16, bottom: 16, minHeight: 50, borderRadius: 26, backgroundColor: blue, alignItems: 'center', justifyContent: 'center' },
  infoRow: { minHeight: 88, padding: 16, borderBottomWidth: 1, borderColor: '#363842', justifyContent: 'center' },
  infoValue: { color: '#F5F5F7', fontSize: 17, lineHeight: 24, marginBottom: 4 },
  infoLink: { color: blue, textDecorationLine: 'underline' },
  problemButton: { minHeight: 64, backgroundColor: '#2E2F31', alignItems: 'center', justifyContent: 'center' },
  problemText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  passwordForm: { padding: 18, paddingBottom: 28 },
  passwordTypeRow: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#D0D5DC',
  },
  passwordTypeText: { flex: 1, color: '#526178', fontSize: 17 },
  passwordTypeList: { backgroundColor: '#F0F5FC', borderRadius: 6 },
  passwordFields: { marginTop: 12 },
  passwordField: {
    minHeight: 54,
    marginTop: 12,
    color: '#172B44',
    fontSize: 17,
    borderBottomWidth: 1,
    borderBottomColor: '#D0D5DC',
  },
  validationText: { marginTop: 4, color: '#B83C34', fontSize: 14 },
  strengthTrack: { flexDirection: 'row', gap: 4 },
  strengthSegment: { flex: 1, height: 4, backgroundColor: '#D0D5DC' },
  passwordHint: {
    marginTop: 28,
    color: '#526178',
    fontSize: 14,
    lineHeight: 20,
  },
  doneButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F6F9',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D0D5DC',
  },
  doneText: { color: '#0564C4', fontSize: 17, fontWeight: '700' },
  disabledText: { color: '#767676' },
});
