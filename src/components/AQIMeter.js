import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import images from '../assets/images';
import { Text } from './';
import { RadialSlider } from './AQIGauge';

const AQIMeter = ({
  value = 0,
  radius = 110,
  min = 0,
  max = 300,
  variant = 'speedometer', // non-interactive style
  sliderWidth = 14,
  lineColor = '#E6E6E6',
  linearGradient = [
    { offset: '0%', color: '#4CAF50' },
    { offset: '100%', color: '#4CAF50' },
  ],
}) => {
  const getStatus = val => {
    if (val <= 50) return { label: 'Good', color: '#4CAF50' };
    if (val <= 100) return { label: 'Moderate', color: '#FFEB3B' };
    if (val <= 150) return { label: 'Unhealthy', color: '#FF9800' };
    return { label: 'Hazardous', color: '#F44336' };
  };

  const { label, color } = getStatus(value);

  return (
    <View style={styles.container} pointerEvents="none">
      <RadialSlider
        value={value}
        min={min}
        max={max}
        sliderTrackColor={'#f2f2f2'}
        lineColor={'#f2f2f2'}
        // isHideButtons
        lineSpace={9}
        sliderWidth={13}
        linearGradient={[
          { ...linearGradient[0], color },
          { ...linearGradient[1], color },
        ]}
        stroke={color}
        markerLineSize={5}
        step={0}
        radius={radius}
        customButtonLayout={
          <View style={[styles.statusBadge, { backgroundColor: color }]}>
            <Text style={[styles.statusText]}>{label}</Text>
          </View>
        }
        customCenterLayout={
          <View style={styles.valueWrapper}>
            <Text style={styles.aqiValue}>{value}</Text>
            <Image source={images.icon_leaf} style={[styles.leafIcon]} />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueWrapper: {
    alignItems: 'baseline',
    flexDirection: 'row',
  },
  aqiValue: {
    fontSize: 58,
    fontWeight: '500',
    color: '#1B1B1B',
    lineHeight: 60,
  },
  statusText: {
    fontSize: 14,
    color: 'white',
  },
  leafIcon: {
    height: 25,
    width: 25,
    marginLeft: 5,
    justifyContent: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    top: 15,
  },
});

export default AQIMeter;
