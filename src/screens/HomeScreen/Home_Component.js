import React from 'react';
import { Text, View, ImageBackground } from 'react-native';
import images from '../../assets/images';
import { Button } from '../../components';

const Home_Component = ({ onPress }) => {
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={images.dummy_map} style={{ flex: 1 }}>
        <View style={{ position: 'absolute', bottom: 50, left: 50 }}>
          <Button label={'Next'} borderRadius={5} onPress={onPress} />
        </View>
      </ImageBackground>
    </View>
  );
};

export default Home_Component;
