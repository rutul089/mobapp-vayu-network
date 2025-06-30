import { Platform } from 'react-native';
import typography from './typography';
import sizes from './sizes';
import colors from './colors';

const isIos = () => {
  return Platform.OS === 'ios';
};

const theme = {
  sizes,
  typography,
  isIos,
  colors,
};

export { theme };
export default theme;
