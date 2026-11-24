import Ionicons from '@expo/vector-icons/Ionicons';
import {
  createContext,
  useContext,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AccountsScreen, { type AccountPage } from './AccountsScreen';

type IconName = ComponentProps<typeof Ionicons>['name'];
type InboxSection = 'News' | 'Mailbox';
type UtilitySection = 'Journal' | 'Settings' | 'Economic calendar' | 'Traders Community' | 'About';
type Section = AccountPage | InboxSection | UtilitySection;

type MenuItem = {
  label: string;
  icon: IconName;
  section?: InboxSection | UtilitySection;
};

type Props = {
  onClose: () => void;
  bottomTabs?: ReactNode;
  loggedIn?: boolean;
  onLoginSuccess?: () => void;
  balance?: number;
  onLogout?: () => void;
};

export const SidebarTabsContext = createContext<{
  renderTabs: (closeSidebar: () => void) => ReactNode;
  openTrade: () => void;
} | null>(null);

const blue = '#3385F6';
const ink = '#F5F5F7';
const accountName = 'Michael Testing';
const accountDetail = '9009096389673 · Fury holding Capital';

const menuItems: readonly MenuItem[] = [
  { label: 'Trade', icon: 'trending-up-outline' },
  { label: 'News', icon: 'newspaper-outline', section: 'News' },
  { label: 'Mailbox', icon: 'mail-outline', section: 'Mailbox' },
  { label: 'Journal', icon: 'book-outline', section: 'Journal' },
  { label: 'Settings', icon: 'settings-outline', section: 'Settings' },
  { label: 'Economic calendar', icon: 'calendar-outline', section: 'Economic calendar' },
  { label: 'Traders Community', icon: 'people-outline', section: 'Traders Community' },
  { label: 'About', icon: 'information-circle-outline', section: 'About' },
];

export default function SidebarMenu({ onClose, bottomTabs, loggedIn = false, onLoginSuccess, balance = 4990.09, onLogout }: Props) {
  const [section, setSection] = useState<Section | null>(null);
  const navigation = useContext(SidebarTabsContext);
  const moduleBottomTabs = navigation?.renderTabs?.(onClose) ?? bottomTabs;

  function goBack() {
    if (section === 'BrokerLogin') {
      setSection('Brokers');
      return;
    }
    if (
      section === 'Certificates' ||
      section === 'Brokers' ||
      section === 'ChangePassword'
    ) {
      setSection('Accounts');
    } else if (section === null) {
      onClose();
    } else {
      setSection(null);
    }
  }

  return (
    <Modal
      visible
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={goBack}
    >
      {section === null ? (
        <View style={styles.overlay} accessibilityViewIsModal>
          <SafeAreaView style={styles.drawer}>
            <ScrollView>
              <View style={styles.accountHeader}>
                <View style={styles.accountIcon}>
                  <Ionicons name={loggedIn ? 'trending-up-outline' : 'person-add-outline'} size={26} color="#FFFFFF" />
                </View>

                <View style={styles.accountInfo}>
                  <Text style={styles.accountName}>{loggedIn ? accountName : 'Login to an existing account'}</Text>
                  <Text style={styles.accountDetail}>{loggedIn ? accountDetail : 'or open a demo account'}</Text>

                  <Pressable
                    style={styles.manageButton}
                    onPress={() => setSection(loggedIn ? 'Accounts' : 'Brokers')}
                    accessibilityRole="button"
                  >
                    <Text style={styles.manageText}>{loggedIn ? 'Manage accounts' : 'Get started'}</Text>
                  </Pressable>
                </View>
              </View>

              {menuItems.map(({ label, icon, section: destination }) => {
                const openTrade = navigation?.openTrade;
                const onPress =
                  label === 'Trade' && openTrade
                    ? () => {
                        onClose();
                        openTrade();
                      }
                    : destination
                      ? () => setSection(destination)
                      : undefined;
                const disabled = !onPress;

                return (
                  <Pressable
                    key={label}
                    style={({ pressed }) => [
                      styles.menuRow,
                      pressed && styles.pressedRow,
                    ]}
                    onPress={onPress}
                    disabled={disabled}
                    accessibilityRole="button"
                    accessibilityState={{ disabled }}
                  >
                    <View style={styles.menuIcon}>
                      <Ionicons
                        name={icon}
                        size={24}
                        color={disabled ? '#666872' : '#E4E5E8'}
                      />
                    </View>
                    <Text style={[styles.menuLabel, disabled && styles.mutedLabel]}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </SafeAreaView>

          <Pressable
            style={styles.backdrop}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close sidebar"
          />
        </View>
      ) : section === 'News' || section === 'Mailbox' || section === 'Journal' || section === 'Settings' || section === 'Economic calendar' || section === 'Traders Community' || section === 'About' ? (
        <SafeAreaView style={styles.page}>
          <View style={styles.pageHeader}>
            <Pressable
              style={styles.backButton}
              onPress={goBack}
              accessibilityRole="button"
              accessibilityLabel="Back to sidebar"
            >
              <Ionicons name="arrow-back-outline" size={24} color="#FFFFFF" />
            </Pressable>

            <Text style={styles.pageTitle} accessibilityRole="header">
              {section}
            </Text>
          </View>

          <View style={styles.emptyState}>
            <Ionicons
              name={section === 'News' ? 'newspaper-outline' : section === 'Mailbox' ? 'mail-outline' : section === 'Settings' ? 'settings-outline' : section === 'Journal' ? 'book-outline' : section === 'Economic calendar' ? 'calendar-outline' : section === 'Traders Community' ? 'people-outline' : 'information-circle-outline'}
              size={76}
              color="#B6B6B6"
            />
            <Text style={styles.emptyText}>
              {section === 'News' ? 'No news' : section === 'Mailbox' ? 'No mail' : section === 'Settings' ? 'Trading settings are ready' : section === 'Journal' ? 'No new journal entries' : section === 'Economic calendar' ? 'No events scheduled' : section === 'Traders Community' ? 'Community is available in demo mode' : 'Trading Terminal\nDemo build'}
            </Text>
          </View>

          {moduleBottomTabs}
        </SafeAreaView>
      ) : (
        <AccountsScreen
          page={section}
          onChangePage={setSection}
          onBack={goBack}
          bottomTabs={moduleBottomTabs}
          onLoginSuccess={() => {
            setSection('Accounts');
            onLoginSuccess?.();
          }}
          balance={balance}
          onLogout={() => {
            setSection(null);
            onClose();
            onLogout?.();
          }}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, flexDirection: 'row' },
  drawer: {
    width: '86%',
    maxWidth: 360,
    flexShrink: 0,
    backgroundColor: '#000000',
  },
  backdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.45)' },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingTop: 24,
    paddingHorizontal: 18,
    paddingBottom: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D9D9D9',
  },
  accountIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: blue,
  },
  accountInfo: { flex: 1, paddingTop: 2 },
  accountName: { color: ink, fontSize: 17, fontWeight: '700' },
  accountDetail: { color: '#A4A5AE', fontSize: 14, marginTop: 6 },
  manageButton: {
    minHeight: 44,
    justifyContent: 'center',
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  manageText: { color: blue, fontSize: 15, fontWeight: '700' },
  menuRow: {
    minHeight: 55,
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  pressedRow: { backgroundColor: '#2E2F31' },
  menuIcon: { width: 26, alignItems: 'center' },
  menuLabel: { flex: 1, color: ink, fontSize: 17 },
  mutedLabel: { color: '#949494' },
  page: { flex: 1, backgroundColor: '#000000' },
  pageHeader: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  backButton: {
    width: 52,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptyText: { color: '#A4A5AE', fontSize: 16 },
});
