import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { Fonts } from '../../constants';
import { Colors, Sizes } from '../../styles';
import FastImage from '@d11/react-native-fast-image';
import { logopigeon } from '../../assets/images';
import { useNavigation } from '@react-navigation/native';
import { useGlobalModal } from '../../store/useModalStore';
import hookUseSmartBloodlineNavigation from './hookUseSmartBloodlineNavigation';

const PigeonCard = ({ bird, style, role, mainId }) => {
  const navigation = useNavigation();
  const { showModal, hideModal } = useGlobalModal();
  const { goToBloodlineDetail } = hookUseSmartBloodlineNavigation();

  // Determine if it should be a mini card (e.g., for nested levels > 4)
  const isMiniPigeonCard = bird.nested > 4 || !bird.nested;

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
    console.log('mainId', mainId);

    console.log('bird', bird);
    if (!bird) return;

    showModal(
      <View
        style={{
          width: '100%',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <Pressable
          onPress={() => global.showImagePreview([{ url: bird?.imageUrl }])}
        >
          <FastImage
            source={bird?.imageUrl ? { uri: bird?.imageUrl } : logopigeon}
            style={{
              width: '100%',
              height: 300,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            resizeMode={FastImage.resizeMode.stretch}
          />
        </Pressable>
        {renderPopUp({
          label: 'Name: ',
          value: bird?.name || '-',
        })}
        {renderPopUp({
          label: 'Gender: ',
          value: bird?.gender || '-',
        })}
        {renderPopUp({
          label: 'Color: ',
          value: bird?.color || '-',
        })}
        {renderPopUp({
          label: 'Band / Ring / ID: ',
          value: bird?.ringName || '-',
        })}
        {/* 'eye' is used as a proxy for detail existence/completeness */}
        {mainId !== bird?.id && bird?.eye && (
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
            }}
            onPress={() => {
              hideModal();
              goToBloodlineDetail(bird?.id);
              // navigation.navigate('GlobalDetailPropertyScreen', {id: bird?.id});
            }}
          >
            <MaterialCommunityIcons
              name="bird"
              size={20}
              color={Colors.WHITE}
            />
            <Text style={[styles.latinName, { marginLeft: 10 }]}>
              View This Pigeon's Bloodline
            </Text>
          </TouchableOpacity>
        )}
      </View>,
    );
  };

  return (
    <TouchableOpacity
      style={[styles.card, style, isMiniPigeonCard && { height: 30 }]}
      onPress={goToDetail}
    >
      <View style={styles.innerCard}>
        {role && <Text style={styles.role}>{role}</Text>}
        {!isMiniPigeonCard && (
          <>
            <FastImage
              source={bird?.imageUrl ? { uri: bird?.imageUrl } : logopigeon}
              style={styles.image}
              resizeMode="cover"
            />
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                marginLeft: 2,
                width: '100%',
              }}
            >
              <Text style={styles.name}>{bird?.name || '-'}</Text>
              <Text numberOfLines={1} style={styles.detail}>
                {bird?.gender || '-'}
              </Text>
              <Text numberOfLines={1} style={styles.detail}>
                {bird?.color || '-'}
              </Text>
              <Text numberOfLines={1} style={styles.detail}>
                {bird?.ringName || '-'}
              </Text>
            </View>
          </>
        )}
        {isMiniPigeonCard && (
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              marginLeft: 5,
            }}
          >
            <Text style={[styles.name, { fontSize: 12 }]}>
              {bird?.name || '-'}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: 120,
    height: 60,
    backgroundColor: '#2c3e5050',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.PURPLE,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
  },
  role: {
    color: '#fff',
    fontSize: 12,
    fontFamily: Fonts.fontMedium,
  },
  image: {
    width: 30,
    height: 58,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    marginRight: 5,
  },
  name: {
    color: '#fff',
    fontFamily: Fonts.fontBoldItalic,
    fontSize: 9,
  },
  detail: {
    color: '#ccc',
    fontSize: 8,
    fontFamily: Fonts.fontItalic,
  },
  innerCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  latinName: {
    fontSize: 18,
    color: '#F0f0f0',
    fontFamily: Fonts.fontItalic,
  },
});

export default PigeonCard;
