/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import images from '../../assets/images';
import {
  PollutantItem,
  Pressable,
  SafeAreaWrapper,
  Spacing,
  Text,
} from '../../components';
import theme from '../../theme';

const AQI_Insight_Component = ({
  onBackHandlePress,
  sectionDesc,
  status,
  aqi,
  onAttachmentPress,
  pollutantsData,
  onNextPress,
}) => {
  return (
    <SafeAreaWrapper
      statusBarColor={theme.colors.green}
      barStyle="light-content"
    >
      <View style={styles.container}>
        <Header title="Central park, LA" onPress={onBackHandlePress} />
        <View style={styles.content}>
          <TopSection sectionDesc={sectionDesc} />
          <BottomSection
            status={status}
            aqi={aqi}
            onPress={onAttachmentPress}
            pollutantsData={pollutantsData}
            onNextPress={onNextPress}
          />
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

const Header = ({ onPress, title }) => {
  return (
    <View style={styles.headerWrapper}>
      <Pressable onPress={onPress}>
        <Image
          source={images.icon_back}
          resizeMode="contain"
          style={styles.iconStyle}
        />
      </Pressable>
      <View style={styles.titleWrapper}>
        <Text color="white" textAlign="center">
          {title}
        </Text>
      </View>
      <View style={{ width: theme.sizes.icons.xxl }} />
      {/* spacer to balance layout */}
    </View>
  );
};

const TopSection = ({ sectionDesc }) => {
  return (
    <View style={styles.topSection}>
      <Text
        size={42}
        color="white"
        textAlign="center"
        style={styles.messageText}
      >
        {sectionDesc}
      </Text>
    </View>
  );
};

const BottomSection = ({
  status,
  aqi,
  onPress,
  pollutantsData,
  onNextPress,
}) => {
  return (
    <View style={styles.bottomSection}>
      <ScrollView
        contentContainerStyle={styles.scrollWrapper}
        showsVerticalScrollIndicator={false}
      >
        <BottomHeader status={status} aqi={aqi} onPress={onPress} />
        <Spacing size="lg" />
        <Image
          source={images.dummy_graph}
          style={{ height: 140, width: '100%' }}
          resizeMode="contain"
        />
        <View style={styles.borderStyle} />
        <Spacing size="md" />
        <View style={{ paddingHorizontal: theme.sizes.spacing.lg - 10 }}>
          <Text apfelGrotezkMittel weight={theme.typography.fontWeights.medium}>
            Pollutants
          </Text>
          <View style={styles.pollutantsGrid}>
            {pollutantsData?.map((item, index) => (
              <PollutantItem
                name={item.name}
                value={item.value}
                color={item.color}
                key={index}
                containerStyle={{ width: '32%' }}
                lineStyle={{ marginHorizontal: 5 }}
                fontSize={'small'}
              />
            ))}
          </View>
        </View>
        <Spacing size="md" />
        <Pressable style={styles.sendButton} onPress={onNextPress}>
          <Image source={images.icon_sent} style={styles.sendIcon} />
        </Pressable>
      </ScrollView>
    </View>
  );
};

const BottomHeader = ({ status, aqi, onPress }) => {
  return (
    <View style={styles.bottomRow}>
      <View style={styles.liveWrapper}>
        <Image
          source={images.icon_online}
          resizeMode="contain"
          style={styles.liveIcon}
        />
        <Text size="small">{status}</Text>
      </View>
      <View style={styles.aqiWrapper}>
        <Text size={38}>{aqi}</Text>
        <Text size="small">AQI</Text>
      </View>
      <Pressable style={styles.attachmentWrapper} onPress={onPress}>
        <Image
          source={images.icon_attachment}
          resizeMode="contain"
          style={styles.attachmentIcon}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.green,
  },
  content: {
    flex: 1,
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.sizes.padding,
    paddingVertical: theme.sizes.spacing.sm,
  },
  iconStyle: {
    height: theme.sizes.icons.xxl,
    width: theme.sizes.icons.xxl,
  },
  titleWrapper: {
    flex: 1,
    paddingHorizontal: 10,
  },
  topSection: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    width: '65%',
  },
  bottomSection: {
    flex: 0.75,
    backgroundColor: 'white',
    borderTopLeftRadius: theme.sizes.spacing.lg,
    borderTopRightRadius: theme.sizes.spacing.lg,
    paddingVertical: 5,
  },
  bottomRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.sizes.spacing.lg - 10,
    justifyContent: 'space-between',
    alignItems: 'flex-end', // better than baseline for mixed content
    // alignItems: 'baseline',
  },
  liveWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    top: -9,
  },
  liveIcon: {
    height: 12,
    width: 12,
  },
  aqiWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flex: 1,
    paddingHorizontal: theme.sizes.spacing.md,
    justifyContent: 'center',
  },
  attachmentWrapper: {
    justifyContent: 'flex-end',
    top: -5,
  },
  attachmentIcon: {
    height: 20,
    width: 20,
  },
  scrollWrapper: {
    flexGrow: 1,
    paddingVertical: theme.sizes.spacing.lg,
    paddingHorizontal: 10,
  },
  borderStyle: {
    height: 2,
    backgroundColor: theme.colors.borderColor,
    marginTop: theme.sizes.spacing.sm,
  },
  pollutantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    // paddingHorizontal: 15,
    paddingTop: 12,
  },
  sendButton: {
    height: 84,
    width: 84,
    borderRadius: 42,
    backgroundColor: '#050F0F',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    height: 42,
    width: 42,
  },
});

export default AQI_Insight_Component;
