import React from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import images from '../assets/images';
import { Button, Pressable, Spacing, Text } from './';
import { theme } from '../theme';

const screenHeight = Dimensions.get('window').height;
/**
 * @typedef {Object} CommonModalProps
 * @property {boolean} isVisible - Controls whether the modal is visible.
 * @property {string} [title] - Optional title displayed at the top of the modal.
 * @property {boolean} [showCloseIcon=true] - Whether to show the close (X) icon.
 * @property {React.ReactNode} [children] - Content to render inside the modal.
 * @property {boolean} [isPrimaryButtonVisible=false] - Show the primary action button.
 * @property {string} [primaryButtonLabel="Submit"] - Label for the primary action button.
 * @property {() => void} [onPressPrimaryButton] - Callback when the primary button is pressed.
 * @property {Object} [modalContentStyle] - Style object for modal content container.
 * @property {boolean} [isScrollableContent] - Whether the modal content should be scrollable.
 * @property {Object} [modalContainerStyle] - Style object for the outer modal container.
 * @property {() => void} [onModalHide=() => {}] - Callback when the modal is dismissed.
 * @property {boolean} [isTextCenter=true] - Whether the title text should be center aligned.
 * @property {boolean} [showSecondaryButton] - Whether to show a secondary (link) button.
 * @property {string} [secondaryButtonText] - Text for the secondary button.
 * @property {() => void} [onSecondaryPress] - Callback when the secondary button is pressed.
 * @property {number} [modalHeight] - Custom modal height in pixels.
 * @property {boolean} [enableSwipe=false] - Enable swipe-to-dismiss gesture.
 * @property {boolean} [showsVerticalScrollIndicator=false] - Show scroll indicator in scrollable content.
 * @property {boolean} [bounces=false] - Enable bounce effect for scrollable content.
 * @property {Object} [rest] - Additional props passed to the underlying Modal component.
 */

/**
 * CommonModal - A customizable bottom sheet modal with optional title, buttons, and scrollable content.
 *
 * @param {CommonModalProps} props - Props for configuring the modal behavior and appearance.
 */

const CommonModal = ({
  isVisible,
  title = '',
  showCloseIcon = true,
  children,
  isPrimaryButtonVisible = false,
  primaryButtonLabel = 'Submit',
  onPressPrimaryButton,
  modalContentStyle,
  isScrollableContent,
  modalContainerStyle,
  onModalHide = () => {},
  isTextCenter = true,
  showSecondaryButton,
  secondaryButtonText,
  onSecondaryPress,
  modalHeight,
  enableSwipe = false,
  showsVerticalScrollIndicator = false,
  bounces = false,
  isCancellable = true,
  primaryBgColor,
  restPrimaryButtonProp,
  tittleColor = theme.colors.textPrimary,
  restSecondaryButtonProp,
  ...rest
}) => {
  const iModalContentStyle = StyleSheet.flatten([
    styles.modalContainer,
    { maxHeight: modalHeight || screenHeight * 0.7 }, // Apply custom height
    modalContentStyle,
  ]);
  const iModalContainerStyle = StyleSheet.flatten([
    styles.container,
    modalContainerStyle,
  ]);

  const additionHeight =
    Platform.OS === 'ios' ? 0 : StatusBar.currentHeight ?? 0;

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={isCancellable === false ? undefined : onModalHide}
      onBackButtonPress={isCancellable === false ? undefined : onModalHide}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      swipeDirection={enableSwipe && isCancellable !== false ? 'down' : null}
      onSwipeComplete={isCancellable === false ? undefined : onModalHide}
      backdropTransitionOutTiming={1}
      style={styles.modal}
      {...rest}
    >
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.select({
          ios: 0,
          android: -additionHeight,
        })}
        style={styles.keyboardAvoidingView}
      >
        <View style={iModalContainerStyle}>
          {showCloseIcon && (
            <Pressable onPress={onModalHide} style={styles.closeBtn}>
              <Image
                source={images.closeRound}
                style={styles.closeImg}
                resizeMode="contain"
              />
            </Pressable>
          )}
          <View style={iModalContentStyle}>
            {title && (
              <>
                <Text
                  size={'h4'}
                  apfelGrotezkMittel={true}
                  textAlign={isTextCenter ? 'center' : 'left'}
                  color={tittleColor}
                >
                  {title}
                </Text>
                <Spacing size="sm" />
              </>
            )}
            {isScrollableContent ? (
              <ScrollView
                bounces={bounces}
                showsVerticalScrollIndicator={showsVerticalScrollIndicator}
              >
                {children}
              </ScrollView>
            ) : (
              children
            )}
            {isPrimaryButtonVisible && (
              <>
                <Spacing size="lg" />
                <Button
                  label={primaryButtonLabel}
                  onPress={onPressPrimaryButton}
                  borderRadius={8}
                  {...restPrimaryButtonProp}
                />
              </>
            )}
            {showSecondaryButton && (
              <>
                <Spacing size="md" />
                <Button
                  label={secondaryButtonText}
                  variant="link"
                  onPress={onSecondaryPress}
                  borderRadius={8}
                  {...restSecondaryButtonProp}
                />
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CommonModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  closeBtn: {
    top: -10,
    // alignSelf: "center",
    padding: 6,
    zIndex: 1,
    left: -15,
  },
  closeImg: {
    height: 48,
    width: 48,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  modalContainer: {
    padding: 24,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    paddingBottom: Platform.select({
      ios: 24,
      android: 12,
    }),
  },
});
