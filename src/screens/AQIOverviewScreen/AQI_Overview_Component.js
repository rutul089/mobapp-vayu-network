/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import images from '../../assets/images';
import {
  AQIMeter,
  Card,
  PollutantItem,
  Pressable,
  SafeAreaWrapper,
  Stack,
  Text,
  CommonModal,
} from '../../components';
import theme from '../../theme';

const AQI_Overview_Component = ({
  handleBroadcastIconPress = () => {},
  pollutantsData,
  aqiValue,
  tempValue = '-',
  humidityValue = '-',
  connected,
  onModalHide,
  showReconnectModal,
  onTryAgainPress,
}) => {
  return (
    <SafeAreaWrapper
      backgroundColor={theme.colors.background4}
      statusBarColor={theme.colors.background4}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Stack gap={24}>
          <Header
            onBroadcastPress={handleBroadcastIconPress}
            connected={connected}
          />
          <View style={styles.aqiMeterWrapper}>
            <AQIMeter value={aqiValue} max={300} />
          </View>
          <View style={styles.cardsRow}>
            <AQICard
              icon={images.icon_temperature}
              label="Temperature"
              value={`${tempValue}°C`}
            />
            <AQICard
              icon={images.icon_cloud}
              label="Humidity"
              value={`${humidityValue}%`}
            />
          </View>
          <PollutantsDetail pollutantsData={pollutantsData} />
          <HealthTip label={'Health Tip'} />
        </Stack>
      </ScrollView>
      <CommonModal
        isVisible={showReconnectModal}
        onModalHide={onModalHide}
        primaryButtonLabel={'Try Again'}
        secondaryButtonText="Cancel"
        isScrollableContent={true}
        isPrimaryButtonVisible={true}
        showSecondaryButton={true}
        title="Device Disconnected"
        isCancellable={false}
        showCloseIcon={false}
        onPressPrimaryButton={onTryAgainPress}
        onSecondaryPress={onModalHide}
      >
        <Text textAlign="center">
          {
            'Connection lost with your device.\nWould you like to try reconnecting now?'
          }
        </Text>
      </CommonModal>
    </SafeAreaWrapper>
  );
};

const Header = ({ onBroadcastPress, connected }) => (
  <View>
    <Text type="helper-text">Good Morning, Sohil</Text>
    <View style={styles.titleRow}>
      <Text
        weight={theme.typography.fontWeights.medium}
        lineHeight="h1"
        size="h1"
        style={styles.locationText}
      >
        My Office
      </Text>
      <Pressable
        onPress={onBroadcastPress}
        accessibilityLabel="Broadcast Icon Button"
        style={styles.broadcastIcon}
      >
        <Image
          source={
            connected ? images.icon_disconnect : images.icon_start_broadcasting
          }
          style={{ height: 30, width: 30 }}
          tintColor={'#0F9120'}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  </View>
);

const AQICard = ({ icon, label, value }) => (
  <Card
    padding={10}
    style={styles.card}
    cardContainerStyle={styles.cardContainer}
  >
    <View style={{ flexDirection: 'row' }}>
      <View style={styles.iconWrapper}>
        <Image source={icon} resizeMode="contain" style={styles.iconImage} />
      </View>
      <View style={{ marginHorizontal: 15 }}>
        <Text type="caption" size="small">
          {label}
        </Text>
        <Text size="h2">{value}</Text>
      </View>
    </View>
  </Card>
);

const PollutantsDetail = ({ pollutantsData }) => {
  return (
    <Card padding={0}>
      <View style={styles.pollutantsHeader}>
        <Text apfelGrotezkMittel weight={theme.typography.fontWeights.medium}>
          Pollutants
        </Text>
        <Text type="caption" style={styles.updatedText}>
          Updated 1 min ago
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.pollutantsGrid}>
        {pollutantsData?.map((item, index) => (
          <PollutantItem
            name={item.name}
            value={item.value}
            color={item.color}
            key={index}
          />
        ))}
      </View>
    </Card>
  );
};

const HealthTip = ({ label }) => {
  return (
    <Card padding={0}>
      <View style={styles.pollutantsHeader}>
        <Text apfelGrotezkMittel weight={theme.typography.fontWeights.medium}>
          {label}
        </Text>
      </View>
      <View style={styles.divider} />
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 14,
          paddingHorizontal: 12,
        }}
      >
        <Image
          source={images.icon_information}
          style={{ height: 20, width: 20 }}
        />
        <Text lineHeight={20} style={{ maxWidth: '80%', marginLeft: 10 }}>
          Avoid exercising outdoors when pollution levels are high. The vehicals
          on busy highway
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    backgroundColor: '#FAFAFA',
    flexGrow: 1,
  },
  aqiMeterWrapper: {
    marginTop: -24,
    top: 24,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  locationText: {
    width: '80%',
  },
  broadcastIcon: {
    height: 44,
    width: 44,
    resizeMode: 'contain',
    backgroundColor: 'rgba(185, 227, 143, 0.49)',
    borderRadius: theme.sizes.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '48%',
  },
  cardContainer: {
    paddingVertical: 15,
  },
  iconWrapper: {
    backgroundColor: 'rgba(229, 229, 229, 0.49)',
    height: 44,
    width: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    height: theme.sizes.icons.md,
    width: theme.sizes.icons.md,
  },
  pollutantsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  updatedText: {
    maxWidth: '70%',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.borderColor,
  },
  pollutantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 12,
  },
  pollutantItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderColor1,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  pollutantLine: {
    flex: 1,
    height: 3,
    marginHorizontal: 10,
    borderRadius: 10,
    // marginHorizontal: 4,
  },
});

export default AQI_Overview_Component;
