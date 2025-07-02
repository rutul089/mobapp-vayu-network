export const PrimaryColors = {
  primary: '#1D95F0',
  primaryLight: '#3DADFF',
  primaryDark: '#021F40',
  black1: '#151515',
};

export const accentColors = {
  danger: '#D32F2F',
  primary: '#5F9CC0',
  primaryDark: '#113E60',
  primaryLight: '#C1E0F1',
};

export const NeutralColors = {
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#F5F7FA',
  gray200: '#E1E5EA',
  gray300: '#C7CCD5',
  gray400: '#9FA6B2',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#222222',
};

export const StatusColors = {
  success: '#28C76F',
  warning: '#FFA800',
  error: '#EA5455',
  info: '#00CFE8',
};

export const BackgroundColors = {
  background: '#F6F8FA',
  background2: '#FFFFFF',
  background3: '#F9F9F9',
  background4: '#FAFAFA',
};

export const TextColors = {
  textPrimary: '#151515',
  textSecondary: '#9CA3AB',
  textInverse: '#FFFFFF',
  textLabel: '#828282',
  placeHolder: '#828282',
  statusText: '#0F9120',
};

export const statusColor = {
  error: '#FF0000',
  success: '#5FC52E',
};

export const borderColor = {
  borderColor: '#EFEFEF',
  borderColor1: '#E5E5E5',
};

// Combined Colors
const colors = {
  ...PrimaryColors,
  ...accentColors,
  ...NeutralColors,
  ...StatusColors,
  ...BackgroundColors,
  ...TextColors,
  ...statusColor,
  ...borderColor,
  inputBorder: 'rgba(0, 0, 0, 0.12)',
  yellow: '#FFE100',
  gray: '#6c6c6c',
  lightGray1: '#dfe1e0',
  green: '#349437',
};

export default colors;
