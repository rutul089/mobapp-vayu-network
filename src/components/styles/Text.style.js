import { StyleSheet } from 'react-native';
import theme from '../../theme';

export const styles = StyleSheet.create({
  text: {
    color: theme.colors.textPrimary,
    marginVertical: 2,
    fontSize: theme.typography.fontSizes.body,
  },
  bodyText: {
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeights.normal,
    fontSize: theme.typography.fontSizes.body,
  },
  helperText: {
    color: theme.colors.textLabel,
    fontWeight: theme.typography.fontWeights.normal,
    fontSize: theme.typography.fontSizes.small,
  },
  largeHeader: {
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeights.extraBold,
    fontSize: theme.typography.fontSizes.h1,
  },
  label: {
    color: theme.colors.textLabel,
    fontWeight: theme.typography.fontWeights.normal,
    fontSize: theme.typography.fontSizes.small,
  },
  input: {
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeights.medium,
    fontSize: theme.typography.fontSizes.small,
  },
  status: {
    color: theme.colors.success,
    fontWeight: theme.typography.fontWeights.medium,
    fontSize: theme.typography.fontSizes.small,
  },
  captionText: {
    color: theme.colors.textLabel,
    fontWeight: theme.typography.fontWeights.normal,
    fontSize: theme.typography.fontSizes.caption,
  },
});
