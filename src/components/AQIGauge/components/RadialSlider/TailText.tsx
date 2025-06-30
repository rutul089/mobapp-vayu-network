import React from 'react';
import { Text as SVGText, G, TSpan } from 'react-native-svg';
import { useRadialSlider } from './hooks';
import type { RadialSliderProps, TextTailProps } from './types';
import { Colors } from '../../theme';

const TailText = (props: TextTailProps) => {
  const { unit = '', min, max } = props;
  const { startPoint, endPoint } = useRadialSlider(props as RadialSliderProps);

  return (
    <>
      <G transform={`translate(${5}, ${30})`}>
        <SVGText fill={'#9CA3AB'} fontSize={14}>
          <TSpan x={startPoint.x} y={startPoint.y}>
            {`${min} ${unit}`}
          </TSpan>
        </SVGText>
      </G>
      <G transform={`translate(${-20}, ${30})`}>
        <SVGText fill={'#9CA3AB'} fontSize={14}>
          <TSpan x={endPoint.x} y={endPoint.y}>
            {`${max} ${unit}`}
          </TSpan>
        </SVGText>
      </G>
    </>
  );
};

export default TailText;
