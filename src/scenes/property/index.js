import * as React from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import {
  View,
  Text,
  BaseView,
  Popup,
  EmptyData,
  AddButton,
} from '../../components';
import {
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Share from 'react-native-share';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { FlashList } from '@shopify/flash-list';
import Animated from 'react-native-reanimated';
import {
  birdColors,
  eyeColorOptions,
  Fonts,
  genderOptions,
} from '../../constants';
import { Colors, Sizes } from '../../styles';
import { FloatingButton } from '../../components';
import { useNavigation } from '@react-navigation/native';
import { LoadingPigeons } from './LoadingPigeons';
import useAuthStore from '../../store/useAuthStore';
import { GlobalBannerAd } from '../ads';
import { logo, logotransparent } from '../../assets/images';
import useBloodlineStore from '../../store/usePropertyStore';
import { useShareLimiter } from '../../hooks';
import LottieView from 'lottie-react-native';

const properties = [
  {
    id: '1',
    title: 'Rumah Minimalis Modern',
    price: 'Rp 980jt',
    location: 'Jakarta Selatan',
    image: 'https://picsum.photos/seed/p1/600/400',
  },
  {
    id: '2',
    title: 'Apartemen City View',
    price: 'Rp 1,2M',
    location: 'Bandung',
    image: 'https://picsum.photos/seed/p2/600/400',
  },
  {
    id: '3',
    title: 'Rumah Cluster Tenang',
    price: 'Rp 760jt',
    location: 'Bogor',
    image: 'https://picsum.photos/seed/p3/600/400',
  },
  {
    id: '4',
    title: 'Ruko 2 Lantai',
    price: 'Rp 1,8M',
    location: 'Bekasi',
    image: 'https://picsum.photos/seed/p4/600/400',
  },
];

function BloodLineScreen() {
  const navigation = useNavigation();
  const fetchPigeons = useBloodlineStore(state => state.fetchPigeons);
  const fetchMorePigeons = useBloodlineStore(state => state.fetchMorePigeons);
  const deletePigeonData = useBloodlineStore(state => state.deletePigeonData);
  const clearToken = useAuthStore(state => state.clearToken);
  const user = useAuthStore(state => state.user);
  const { updateUserPoint } = useAuthStore();
  const [successModal, setSuccessModal] = React.useState(false);

  const { addShare, canAddPoint } = useShareLimiter();

  const listPigeon = useBloodlineStore(state => state.listPigeon);
  const listPigeonLoading = useBloodlineStore(state => state.listPigeonLoading);
  const deletePigeonSuccess = useBloodlineStore(
    state => state.deletePigeonSuccess,
  );
  const { fetchPigeonCounts, fetchLatestPigeons } = useBloodlineStore();
  const globalLoading = useBloodlineStore(state => state.globalLoading);

  const isFetchingMore = useBloodlineStore(state => state.isFetchingMore);
  const hasMorePigeons = useBloodlineStore(state => state.hasMorePigeons);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedPigeon, setSelectedPigeon] = React.useState(null);
  const [isPopupVisible, setPopupVisible] = React.useState(false);

  const handleCancel = () => {
    setPopupVisible(false);
  };

  const handleConfirm = async () => {
    if (selectedPigeon) {
      deletePigeonData(selectedPigeon.id, selectedPigeon.imageUrls);
    }
  };

  React.useEffect(() => {
    // fetchPigeons();
  }, []);

  React.useEffect(() => {
    if (deletePigeonSuccess) {
      setPopupVisible(false);
      fetchPigeons();
      fetchPigeonCounts();
      fetchLatestPigeons();
    }
  }, [deletePigeonSuccess]);

  // ✅ UseMemo for filteredPigeons
  const filteredPigeons = React.useMemo(() => {
    if (!searchQuery.trim()) return properties;
    return properties.filter(pigeon =>
      pigeon.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, properties]);

  const handleAdd = () => {
    return navigation.push('AddPropertyScreen');
  };

  const toShare = item => {
    const shareOptions = {
      title: item?.name,
      message: 'I want to share my pigeon bloodline information!',
      url: `https://merpatiku-github-io.vercel.app/dl?id=${item?.id}`,
    };

    Share.open(shareOptions)
      .then(async res => {
        console.log('Shared successfully', res);

        if (canAddPoint()) {
          // ✅ Add points + save history
          addShare();

          try {
            await updateUserPoint(user?.uid, 1); // increment +1
            console.log('✅ User point increased');
            await setSuccessModal(true);
          } catch (err) {
            console.error('❌ Failed to update user points:', err);
          }
        } else {
          console.log('⛔ Share limit reached (max 10 per minute)');
        }
      })
      .catch(err => {
        err && console.log('Share failed', err);
      });
  };

  const renderItem = ({ item }) => {
    const gender = genderOptions.find(g => g.id === item.genderId);
    const color = birdColors.find(c => c.id === item.colorId);
    const eye = eyeColorOptions.find(e => e.id === item.eyeColorId);

    return (
      <Pressable
        onPress={() => navigation.navigate('GlobalDetailBloodlineScreen', item)}
        style={styles.pressableContainerSocial}
      >
        <View style={styles.propertyItemContainer}>
          {/* Container Gambar */}
          <View unflex style={styles.imageWrapper}>
            <Image source={{ uri: item?.image }} style={styles.propertyImage} />
          </View>

          {/* Detail Properti */}
          <View style={styles.propertyDetailsContent}>
            <Text style={styles.companyNameText}>{item?.title}</Text>

            <Text style={styles.detailLabelText}>
              <Text style={styles.detailValueText}>Properties:</Text>{' '}
              {item?.propertiesCount}
            </Text>

            <Text style={styles.detailLabelText}>
              <Text style={styles.detailValueText}>Service Areas:</Text>{' '}
              {item?.serviceAreas}
            </Text>

            {/* Tombol Aksi */}
            <View unflex style={styles.actionButtonContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.emailButton]}
              >
                <MaterialCommunityIcons
                  name='email-outline'
                  size={18}
                  color='#4A90E2'
                />
                <Text style={styles.emailButtonText}>Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.textButton]}
              >
                <MaterialCommunityIcons
                  name='text-box-outline'
                  size={18}
                  color='#6B6B6B'
                />
                <Text style={styles.textButtonText}>Text</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <BaseView
      title={'Daftar Propertimu'}
      disableLeftMenu
      loading={globalLoading}
      onBackPress={() => {}}
    >
      <View unflex style={{ flexDirection: 'row' }}>
        <TextInput
          style={styles.searchInput}
          placeholder='Search by name...'
          placeholderTextColor='#aaaaaa50'
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <AddButton onPress={handleAdd} />
      </View>

      <View unflex style={{ marginLeft: -0 }}>
        <GlobalBannerAd />
      </View>

      {/* {listPigeonLoading && <LoadingPigeons />}
      {!listPigeonLoading && ( */}
      <FlashList
        onRefresh={fetchPigeons}
        refreshing={false}
        data={filteredPigeons}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        estimatedItemSize={100}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <EmptyData
            message='Tidak ada properti ditemukan.'
            description='Silakan tambahkan properti terlebih dahulu.'
            illustration={logo}
          />
        }
        onEndReached={() => {
          if (!isFetchingMore && hasMorePigeons) {
            fetchMorePigeons();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <View style={{ padding: 20, backgroundColor: Colors.WHITE }}>
            {isFetchingMore && (
              <ActivityIndicator size='large' color={Colors.PRIMARY} />
            )}
            <View style={styles.spacer} />
          </View>
        }
      />
      {/* )} */}

      <Popup
        visible={isPopupVisible}
        title='Are you sure you want to delete this?'
        message='Deleted data cannot be restored.'
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />

      {/* Success Modal */}
      <Modal
        visible={successModal}
        transparent
        animationType='fade'
        onRequestClose={() => setSuccessModal(false)}
      >
        <View unflex style={styles.modalContainer}>
          <View unflex style={styles.modalContent}>
            <LottieView
              source={require('../../assets/images/successfully-done.json')}
              autoPlay
              loop={false}
              onAnimationFinish={() => {
                setTimeout(() => setSuccessModal(false), 500);
              }}
              style={{ width: 250, height: 250, marginTop: -20 }}
            />
            <Text style={styles.modalText}>🎉 You earned 1 point!</Text>
          </View>
        </View>
      </Modal>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
    backgroundColor: Colors.WHITE,
  },
  searchInput: {
    backgroundColor: '#2c2f4850',
    padding: 10,
    borderRadius: 8,
    margin: 10,
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: Fonts.fontRegular,
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.WHITE_20,
    borderRadius: 12,
    marginTop: 10,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.WHITE_50,
  },
  image: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 10,
  },
  deleteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.WHITE_20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIconBottom: {
    position: 'absolute',
    right: 10,
    backgroundColor: Colors.WHITE_20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editText: {
    color: Colors.WHITE,
    fontFamily: Fonts.fontSemiBold,
    fontSize: 12,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontFamily: Fonts.fontBoldItalic,
    color: Colors.YELLOW,
    marginLeft: 10,
  },
  spacer: {
    height: 120,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  infoText: {
    fontSize: 13,
    color: Colors.WHITE,
    marginHorizontal: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.PRIMARY,
    padding: 0,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalText: {
    marginTop: -60,
    fontSize: 14,
    color: Colors.WHITE,
    fontFamily: Fonts.fontRegular,
    textAlign: 'center',
    padding: 20,
  },
  // --- ITEM PROPERTI (Kartu) ---
  propertyItemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },

  // --- GAMBAR PROPERTI ---
  imageWrapper: {
    // Memberikan bentuk lengkungan pada gambar
    borderRadius: 5,
    overflow: 'hidden',
    width: 150 * Sizes.ratioWidthScreen,
    height: 150 * Sizes.ratioWidthScreen,
  },
  propertyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // --- DETAIL TEKS ---
  propertyDetailsContent: {
    flex: 1,
    marginLeft: 15,
  },
  companyNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  detailLabelText: {
    fontSize: 14,
    color: '#6B6B6B',
    lineHeight: 20,
  },
  detailValueText: {
    fontWeight: '600', // Untuk menonjolkan label seperti "Properties:"
    color: '#333333',
  },

  // --- TOMBOL AKSI ---
  actionButtonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
  },
  emailButton: {
    backgroundColor: '#E6F0FF',
    borderColor: '#E6F0FF',
  },
  textButton: {
    backgroundColor: 'transparent',
    borderColor: '#CCCCCC',
  },
  emailButtonText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  textButtonText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
    color: '#6B6B6B',
  },
});

export default BloodLineScreen;
