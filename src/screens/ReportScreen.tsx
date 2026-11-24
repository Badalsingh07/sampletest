import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

type ReportTab = 'Summary' | 'Profit & Loss' | 'Long & Short' | 'Symbols';

const blue = '#55A5FF';
const green = '#79C653';
const coral = '#F2704C';
const muted = '#A6A8B1';
const line = '#656871';

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return <View style={styles.metric}><Text style={[styles.metricValue, { color }]}>{value}</Text><Text style={styles.metricLabel}>● {label}</Text></View>;
}

function Ring() {
  return (
    <View style={styles.ringWrap}>
      <Metric label="Gross Loss" value="-84.90" color={coral} />
      <Svg width={170} height={170} viewBox="0 0 170 170">
        <Circle cx={85} cy={85} r={66} stroke={coral} strokeWidth={13} fill="none" />
        <Path d="M 85 19 A 66 66 0 0 1 145 112" stroke={green} strokeWidth={13} fill="none" />
      </Svg>
      <View style={styles.ringCenter}><Text style={styles.loss}>-9.91</Text><Text style={styles.ringLabel}>Total</Text></View>
      <Metric label="Gross Profit" value="+74.99" color={green} />
    </View>
  );
}

function BarChart() {
  const grid = [20, 55, 90, 125, 160];
  return (
    <View style={styles.chartWrap}>
      <Svg width="100%" height={205} viewBox="0 0 340 205" preserveAspectRatio="none">
        {grid.map((y) => <Line key={y} x1={0} y1={y} x2={320} y2={y} stroke={line} strokeWidth={1} />)}
        <Rect x={18} y={60} width={9} height={100} fill={green} />
        <Rect x={31} y={52} width={9} height={108} fill={coral} />
        <Path d="M 0 160 L 75 160 L 105 52 L 140 105 L 235 105 L 250 160 L 320 160" stroke={blue} strokeWidth={3} fill="none" />
      </Svg>
      <View style={styles.axis}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <Text key={`${day}-${index}`} style={styles.axisText}>{day}</Text>)}</View>
    </View>
  );
}

function Summary() {
  return <ScrollView contentContainerStyle={styles.content}>
    <Ring />
    <View style={styles.metricGrid}>
      <Metric label="Commissions" value="0.00" color={green} />
      <Metric label="Swaps" value="0.00" color={green} />
      <Metric label="Dividends" value="0.00" color={green} />
    </View>
    <Text style={styles.sectionTitle}>Performance</Text>
    {['Sharp Ratio                 -0.03', 'Profit Factor                  0.88', 'Recovery Factor              -0.13'].map((item) => <View key={item} style={styles.stat}><Text style={styles.statLabel}>{item}</Text><View style={styles.track}><View style={styles.fill} /></View></View>)}
    <Text style={styles.sectionTitle}>Weekly result</Text>
    <BarChart />
    <View style={styles.balanceCard}><Text style={styles.balanceText}>4 990.09</Text><Text style={styles.metricLabel}>● Balance</Text><Text style={[styles.balanceText, { marginTop: 14 }]}>4 990.09</Text><Text style={styles.metricLabel}>● Equity</Text></View>
  </ScrollView>;
}

function TabBody({ tab }: { tab: ReportTab }) {
  if (tab === 'Summary') return <Summary />;
  const title = tab === 'Profit & Loss' ? 'Profit & Loss' : tab === 'Long & Short' ? 'Long & Short' : 'Symbols';
  const labels = tab === 'Symbols' ? ['XAUUSD   +10.27', 'EURUSD   +2.29', 'XAGUSD   +2.60', 'BTCUSD   -17.47'] : tab === 'Long & Short' ? ['Long   5 (33.33%)', 'Short  10 (66.67%)'] : ['Gross profit  +74.99', 'Gross loss  -84.90', 'Net profit  -9.91'];
  return <ScrollView contentContainerStyle={styles.content}><Text style={styles.sectionTitle}>{title}</Text>{labels.map((value, index) => <View key={value} style={styles.listMetric}><Text style={[styles.listValue, { color: index % 2 === 0 ? green : coral }]}>{value}</Text><View style={[styles.longBar, { width: `${80 - index * 13}%`, backgroundColor: index % 2 === 0 ? green : coral }]} /></View>)}<Ring /><BarChart /></ScrollView>;
}

export default function ReportScreen({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<ReportTab>('Summary');
  const tabs: ReportTab[] = ['Summary', 'Profit & Loss', 'Long & Short', 'Symbols'];
  return <View style={styles.screen}>
    <View style={styles.header}><Pressable style={styles.tool} onPress={onBack}><Ionicons name="arrow-back-outline" size={29} color="#fff" /></Pressable><Text style={styles.title}>Report</Text><Ionicons name="print-outline" size={26} color="#fff" /><View style={styles.tool}><Ionicons name="download-outline" size={27} color="#fff" /></View></View>
    <View style={styles.tabs}>{tabs.map((name) => <Pressable key={name} onPress={() => setTab(name)} style={[styles.tab, tab === name && styles.activeTab]}><Text style={styles.tabText}>{name}</Text></Pressable>)}</View>
    <TabBody tab={tab} />
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' }, header: { height: 58, flexDirection: 'row', alignItems: 'center', gap: 15, paddingRight: 12 }, tool: { width: 54, height: 54, alignItems: 'center', justifyContent: 'center' }, title: { flex: 1, color: '#fff', fontSize: 25, fontWeight: '600' }, tabs: { flexDirection: 'row', backgroundColor: '#2D3C4D' }, tab: { flex: 1, minHeight: 55, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 3, borderColor: 'transparent' }, activeTab: { borderColor: blue }, tabText: { color: '#fff', fontSize: 14, textAlign: 'center' }, content: { padding: 24, paddingBottom: 55, gap: 22 }, ringWrap: { height: 190, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }, ringCenter: { position: 'absolute', width: 170, left: '25%', alignItems: 'center' }, loss: { color: '#FF6267', fontSize: 25 }, ringLabel: { color: '#fff', fontSize: 16, marginTop: 7 }, metric: { gap: 5 }, metricValue: { fontSize: 20 }, metricLabel: { color: muted, fontSize: 13 }, metricGrid: { flexDirection: 'row', justifyContent: 'space-between' }, sectionTitle: { color: '#fff', fontSize: 19, fontWeight: '600', marginTop: 8 }, stat: { gap: 8 }, statLabel: { color: '#fff', fontSize: 15 }, track: { height: 2, backgroundColor: '#B6BAC2' }, fill: { width: '18%', height: 7, marginTop: -3, borderWidth: 1, borderColor: green }, chartWrap: { height: 235 }, axis: { flexDirection: 'row', justifyContent: 'space-between', paddingRight: 22 }, axisText: { color: '#fff' }, balanceCard: { marginTop: 12, borderTopWidth: 1, borderColor: line, paddingTop: 20 }, balanceText: { color: '#fff', fontSize: 25 }, listMetric: { gap: 10, marginVertical: 8 }, listValue: { fontSize: 20 }, longBar: { height: 12, opacity: 0.9 },
});
