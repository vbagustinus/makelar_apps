import React from 'react';
import { useGlobalModal } from '../../store/useModalStore';
import hookUseSmartBloodlineNavigation from './hookUseSmartBloodlineNavigation';
import {
  Pressable,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native'; // Added StyleSheet
import FastImage from '@d11/react-native-fast-image';
import { Fonts } from '../../constants';
import { Colors } from '../../styles';
import { logotransparent } from '../../assets/images';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { useNavigation } from '@react-navigation/native';
// NOTE: Make sure to import missing dependencies like Colors, Fonts, logotransparent, MaterialCommunityIcons

// Constants for node dimensions and spacing for the bloodline tree
const NODE_WIDTH = 120; // Adjusted to match PigeonCard width
const NODE_HEIGHT = 60; // Adjusted to match PigeonCard height
const NODE_WIDTH_COMPACT = 90;
const NODE_HEIGHT_COMPACT = 40;

// ======== COMPONENT NODE for the Skia Tree ========
// This component renders an individual pigeon node in the tree
// ======== COMPONENT NODE for the Skia Tree ========
export const Node = ({ x, y, data, mainId }) => {
  const navigation = useNavigation();
  const { showModal, hideModal } = useGlobalModal();
  const { goToBloodlineDetail } = hookUseSmartBloodlineNavigation();

  if (!data || !data.name) return null;

  const isManualNode = data.isManual;

  const renderPopUp = ({ label, value }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          marginHorizontal: 0,
          alignContent: 'space-between',
          justifyContent: 'space-between',
          borderBottomColor: Colors.PRIMARY,
          borderBottomWidth: 0.5,
        }}
      >
        <Text
          style={[
            styles.latinName,
            { fontSize: 12, fontFamily: Fonts.fontRegular },
          ]}
        >
          {label}{' '}
        </Text>
        <Text style={styles.latinName}>{value}</Text>
      </View>
    );
  };

  const goToDetail = () => {
    console.log('data clicked for modal:', data);

    if (!data) {
      console.warn('Attempted to show modal for null/undefined data.');
      return;
    }

    showModal(
      <View
        style={{
          width: '100%',
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: 'transparent',
        }}
      >
        <Pressable
          disabled={!data?.imageUrl}
          onPress={() => {
            console.log(
              'Attempting to show image preview for URL:',
              data?.imageUrl,
            );
            if (global.showImagePreview) {
              global.showImagePreview([{ url: data?.imageUrl }]);
            } else {
              console.error('global.showImagePreview is not defined!');
            }
          }}
        >
          <FastImage
            source={data?.imageUrl ? { uri: data?.imageUrl } : logotransparent}
            style={{
              width: '100%',
              height: 300,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            resizeMode={FastImage.resizeMode.stretch}
            tintColor={data?.imageUrl ? undefined : Colors.WHITE}
          />
        </Pressable>
        {renderPopUp({
          label: 'Name: ',
          value: data?.name || '-',
        })}
        {renderPopUp({
          label: 'Gender: ',
          value: data?.gender || '-',
        })}
        {renderPopUp({
          label: 'Color: ',
          value: data?.color || '-',
        })}
        {renderPopUp({
          label: 'Ring: ',
          value: data?.ringName || '-',
        })}
        {!data.isManual && data.originalId && data.originalId !== mainId && (
          <TouchableOpacity
            style={{
              padding: 10,
              paddingVertical: 15,
              marginHorizontal: 0,
              backgroundColor: Colors.PRIMARY,
              borderBottomWidth: 0.5,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
            }}
            onPress={() => {
              hideModal();
              goToBloodlineDetail(data.originalId);
            }}
          >
            <MaterialCommunityIcons
              name='bird'
              size={20}
              color={Colors.WHITE}
            />
            <Text style={[styles.latinName, { marginLeft: 10 }]}>
              View This Pigeon’s Bloodline
            </Text>
          </TouchableOpacity>
        )}
      </View>,
    );
  };

  const hasImage = !!data.imageUrl;
  const currentWidth = hasImage ? NODE_WIDTH : NODE_WIDTH_COMPACT;
  const currentHeight = hasImage ? NODE_HEIGHT : NODE_HEIGHT_COMPACT;

  return (
    <TouchableOpacity
      style={[
        styles.nodeCard,
        {
          position: 'absolute',
          top: y,
          left: x,
          width: currentWidth,
          height: currentHeight,
        },
      ]}
      onPress={goToDetail}
    >
      <View style={styles.nodeInnerCard}>
        {data.imageUrl ? (
          // CONDITION 1: If imageUrl exists, show the image and detailed info
          <>
            <FastImage
              source={{ uri: data.imageUrl }}
              style={styles.nodeImage}
              resizeMode='cover'
            />
            <View style={styles.nodeTextContainer}>
              <Text style={styles.nodeName} numberOfLines={1}>
                {data.name || '-'}
              </Text>
              <Text numberOfLines={1} style={styles.nodeDetail}>
                {data.gender || '-'}
              </Text>
              <Text numberOfLines={1} style={styles.nodeDetail}>
                {data.color || '-'}
              </Text>
            </View>
          </>
        ) : (
          // CONDITION 2: If NO imageUrl, show name and gender centered
          <View style={styles.manualNodeContent}>
            <Text style={styles.manualNodeName} numberOfLines={1}>
              {data.name || 'Unknown'}
            </Text>
            {data.gender && (
              <Text style={styles.manualNodeDetail}>{data.gender}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const NodeGeneral = ({ x, y, data, mainId }) => {
  const navigation = useNavigation();
  const { showModal, hideModal } = useGlobalModal();

  if (!data || !data.name) return null;

  const renderPopUp = ({ label, value }) => (
    <View style={styles.popUpRow}>
      <Text style={styles.popUpLabel}>{label}</Text>
      <Text style={styles.latinName}>{value}</Text>
    </View>
  );

  const goToDetail = () => {
    if (!data) return;

    showModal(
      <View style={styles.modalContainer}>
        <Pressable
          disabled={!data?.imageUrl}
          onPress={() => {
            if (global.showImagePreview) {
              global.showImagePreview([{ url: data?.imageUrl }]);
            }
          }}
        >
          <FastImage
            source={data?.imageUrl ? { uri: data?.imageUrl } : logotransparent}
            style={styles.modalImage}
            resizeMode={FastImage.resizeMode.stretch}
            tintColor={data?.imageUrl ? undefined : Colors.WHITE}
          />
        </Pressable>

        {renderPopUp({ label: 'Name: ', value: data?.name || '-' })}
        {renderPopUp({ label: 'Gender: ', value: data?.gender || '-' })}
        {renderPopUp({ label: 'Color: ', value: data?.color || '-' })}
        {renderPopUp({ label: 'Ring: ', value: data?.ringName || '-' })}

        {data.id && data.id !== mainId && (
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              hideModal();
              // For global navigation, push a new detail screen
              navigation.push('GlobalDetailPropertyScreen', { id: data.id });
            }}
          >
            <MaterialCommunityIcons
              name='bird'
              size={20}
              color={Colors.WHITE}
            />
            <Text style={[styles.latinName, { marginLeft: 10 }]}>
              View This Pigeon’s Bloodline
            </Text>
          </TouchableOpacity>
        )}
      </View>,
    );
  };

  const hasImage = !!data.imageUrl;
  const currentWidth = hasImage ? NODE_WIDTH : NODE_WIDTH_COMPACT;
  const currentHeight = hasImage ? NODE_HEIGHT : NODE_HEIGHT_COMPACT;

  return (
    <TouchableOpacity
      style={[
        styles.nodeCard,
        {
          position: 'absolute',
          top: y,
          left: x,
          width: currentWidth,
          height: currentHeight,
        },
      ]}
      onPress={goToDetail}
    >
      <View style={styles.nodeInnerCard}>
        {data.imageUrl ? (
          <>
            <FastImage
              source={{ uri: data.imageUrl }}
              style={styles.nodeImage}
              resizeMode='cover'
            />
            <View style={styles.nodeTextContainer}>
              <Text style={styles.nodeName} numberOfLines={1}>
                {data.name || '-'}
              </Text>
              <Text numberOfLines={1} style={styles.nodeDetail}>
                {data.gender || '-'}
              </Text>
              <Text numberOfLines={1} style={styles.nodeDetail}>
                {data.color || '-'}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.manualNodeContent}>
            <Text style={styles.manualNodeName} numberOfLines={1}>
              {data.name || 'Unknown'}
            </Text>
            {data.gender && (
              <Text style={styles.manualNodeDetail}>{data.gender}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Styles used by the Node component and the pop-up modal
const styles = StyleSheet.create({
  // Kept for renderPopUp: used for Name/Gender/Color/Band/Ring/ID labels and values
  latinName: {
    fontSize: 18,
    color: '#F0f0f0',
    fontFamily: Fonts.fontItalic,
  },
  popUpRow: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    borderBottomColor: Colors.PRIMARY,
    borderBottomWidth: 0.5,
  },
  popUpLabel: { fontSize: 12, fontFamily: Fonts.fontRegular, color: '#F0f0f0' },
  // Styles for the Node component (mimicking PigeonCard)
  nodeCard: {
    backgroundColor: Colors.WHITE_20, // Semi-transparent dark background
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.WHITE_50, // Purple border
    borderRadius: 8, // Rounded corners for the whole card
    overflow: 'hidden', // Ensure content stays within borders
  },
  nodeInnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', // Take full width of nodeCard
    height: '100%', // Take full height of nodeCard
    paddingRight: 5, // Small padding inside
  },
  nodeImage: {
    width: 35, // Fixed width for the image
    height: '100%', // Take full height of innerCard
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    marginRight: 5,
  },
  nodeTextContainer: {
    flex: 1, // Take remaining space
    justifyContent: 'center', // Center text vertically
    alignItems: 'flex-start', // Align text to the left
  },
  nodeName: {
    color: '#fff',
    fontFamily: Fonts.fontBoldItalic,
    fontSize: 10,
  },
  nodeDetail: {
    color: Colors.WHITE_80,
    fontSize: 8,
    fontFamily: Fonts.fontItalic,
  },
  // Specific styles for manual/placeholder nodes
  manualNodeContent: {
    flex: 1, // Take full space of nodeCard
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderRadius: 8, // Match parent border radius
  },
  manualNodeName: {
    fontFamily: Fonts.fontBoldItalic,
    fontSize: 10,
    color: Colors.WHITE,
    textAlign: 'center',
    marginTop: 2,
  },
  manualNodeDetail: {
    fontSize: 10,
    color: Colors.WHITE_80,
    textAlign: 'center',
  },
  modalContainer: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  modalImage: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButton: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  labelValueContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: Colors.PRIMARY_50,
    borderBottomWidth: 0.5,
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
  },
  // --- TAMBAHAN: STYLE UNTUK MODAL LOADING ---
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Latar belakang semi-transparan
  },
  activityIndicatorWrapper: {
    backgroundColor: '#333333', // Warna background container spinner
    padding: 25,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  loadingText: {
    marginTop: 15,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: Fonts.fontRegular,
  },
});
