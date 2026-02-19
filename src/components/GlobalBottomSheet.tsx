import React, {
  useCallback,
  forwardRef,
  useMemo,
  useRef,
  useImperativeHandle,
} from 'react';
import { Text, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { Colors, Sizes } from '../styles';
import { Fonts } from '../constants';
import LinearGradient from 'react-native-linear-gradient';

export const GlobalBottomSheet = forwardRef<any, any>(
  ({ title, children, onClose = () => {} }, ref) => {
    const modalRef = useRef<any>(null);
    useImperativeHandle(ref, () => modalRef.current);
    const snapPoints = useMemo(() => ['25%', '50%'], []);

    const handleClose = useCallback(() => {
      if (modalRef.current) {
        modalRef.current.dismiss();
      }
      onClose();
    }, [onClose]);

    const renderBackdrop = useCallback(
      props => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
          opacity={0.5}
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={modalRef}
        snapPoints={snapPoints}
        onDismiss={handleClose}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView
          style={{
            backgroundColor: 'transparent',
            padding: 20,
          }}
        >
          {title && (
            <Text
              style={{
                fontFamily: Fonts.fontSemiBold,
                color: Colors.BLACK_FONT,
                textAlign: 'left',
                fontSize: 16,
              }}
            >
              {title}
            </Text>
          )}

          {children}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);
