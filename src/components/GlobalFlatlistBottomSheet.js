import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { Colors, Sizes } from '../styles';

export const GlobalFlatlistBottomSheet = forwardRef(
  ({ title, data, renderItem, onClose }, ref) => {
    const [visible, setVisible] = useState(false);

    const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

    const handleClose = useCallback(() => {
      if (ref?.current) {
        ref.current.dismiss();
      }
      onClose?.();
    }, [onClose]);

    const renderBackdrop = useCallback(
      props => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior='close'
          opacity={0.5}
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        onDismiss={handleClose}
        backdropComponent={renderBackdrop}
        style={{
          borderColor: Colors.GRAY_MEDIUM,
          borderWidth: 0.5,
          borderTopLeftRadius: 15 * Sizes.ratioWidthScreen,
          borderTopRightRadius: 15 * Sizes.ratioWidthScreen,
          paddingBottom: 30,
        }}
      >
        {/* <BottomSheetFlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
        /> */}
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: 'white',
    padding: 16,
  },
});
