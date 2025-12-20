import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Pressable,
  BackHandler,
  Platform, // --- TAMBAHAN ---
  PermissionsAndroid, // --- TAMBAHAN ---
  Alert, // --- TAMBAHAN ---
  Modal,
} from 'react-native';
import Share from 'react-native-share';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, FontSize, Sizes } from '../../styles';
import {
  birdColors,
  eyeColorOptions,
  Fonts,
  genderOptions,
  pigeonTypes,
} from '../../constants';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
  FadeInDown,
} from 'react-native-reanimated';
import * as RNFS from '@dr.pogodin/react-native-fs';
import dayjs from 'dayjs';
import { GlobalBannerAd, useInterstitialAd } from '../ads';
import { BaseView, ZoomableImageModal } from '../../components';
import { logo, logopigeon, logotransparent } from '../../assets/images';
import useBloodlineStore from '../../store/usePropertyStore';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.locale('id');
dayjs.extend(customParseFormat);

// --- TAMBAHAN: Import ViewShot ---
import ViewShot from 'react-native-view-shot';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

import QRCode from 'react-native-qrcode-svg';

// SKIA IMPORTS
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { useShareLimiter } from '../../hooks';
import useAuthStore from '../../store/useAuthStore';
import { Node } from './Node';
import { ImageHeader } from './ImageHeader';

// Constants for node dimensions and spacing for the bloodline tree
const NODE_WIDTH = 120; // Adjusted to match PigeonCard width
const NODE_HEIGHT = 60; // Adjusted to match PigeonCard height
const NODE_WIDTH_COMPACT = 90;
const NODE_HEIGHT_COMPACT = 40;
const H_GAP = 40; // Adjusted for smaller nodes
const V_GAP = 30; // Adjusted for smaller nodes

const HEADER_HEIGHT = 260;
const HEADER_CAPTURE_HEIGHT = 100;

const DetailBloodlineScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const item = route.params || {}; // Safely access route params
  console.log('DetailBloodlineScreen', item);
  const { updateUserPoint, user } = useAuthStore();
  const { canAddPoint, addShare } = useShareLimiter();
  // --- TAMBAHAN: Ref untuk ViewShot ---
  const viewShotRef = useRef(null);

  const [successModal, setSuccessModal] = React.useState(false);

  const listPigeon = useBloodlineStore(state => state.listPigeon);
  const [birdLineAge, setBirdLineAge] = useState({});
  const [loading, setLoading] = useState(false);
  const [maxNested, setMaxNested] = useState(1); // Max nesting level for the tree
  const [positions, setPositions] = useState([]); // Stores calculated {x, y, data} for each node

  // State loading untuk memberi tahu pengguna
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // A mutable object to act as a Y-axis cursor for layout, passed by reference.
  // This helps in sequentially assigning Y positions for leaf nodes.
  const yPositionCursorRef = useRef({ value: 0 }); // useRef used here

  const findById = (dataList, id) => {
    return dataList.find(item => item.id === id) || null;
  };

  const type = findById(pigeonTypes, item.pigeonTypeId);
  const color = findById(birdColors, item.colorId);
  const gender = findById(genderOptions, item.genderId);
  const eye = findById(eyeColorOptions, item.eyeColorId);

  const { showAd } = useInterstitialAd(() => {
    captureAndSaveImage();
  });

  const detailPigeon = [
    {
      id: 1,
      bgColor: '#F4ECFF30',
      icon: 'cake-variant-outline',
      label: 'Date of Birth', // Translated from 'Tanggal Lahir'
      value: item?.dateOfBirth
        ? dayjs(
            item?.dateOfBirth?.toDate?.() || item?.dateOfBirth?._seconds * 1000,
          ).format('DD MMM YYYY')
        : 'Unknown', // Translated from 'Tidak Diketahui'
    },
    {
      id: 2,
      bgColor: '#FFF7E630',
      icon: 'eye-circle-outline',
      label: 'Eye Color', // Translated from 'Mata'
      value: eye?.name,
    },
    {
      id: 3,
      bgColor: '#E6F4FF30',
      icon: 'gender-male-female',
      label: 'Gender', // Translated from 'Jenis Kelamin'
      value: gender?.name,
    },
    {
      id: 4,
      bgColor: '#E6FFF230',
      icon: 'palette-outline',
      label: 'Color', // Translated from 'Warna'
      value: color?.name,
    },
    {
      id: 5,
      bgColor: '#FFE6E630',
      icon: 'ring',
      label: 'Band / Ring / ID',
      value: item.ringName,
    },
  ];

  // Calculate maximum X and Y coordinates to determine ScrollView/Canvas dimensions
  // This ensures the content area is large enough to contain all nodes and lines.
  const maxX =
    positions.length > 0
      ? Math.max(...positions.map(p => p.x)) + NODE_WIDTH
      : 0;
  const maxY =
    positions.length > 0
      ? Math.max(...positions.map(p => p.y)) + NODE_HEIGHT
      : 0;

  // Skia Path objects for male and female lines
  const malePath = Skia.Path.Make();
  const femalePath = Skia.Path.Make();

  let maleLinesDrawnCount = 0; // Counter for debugging
  let femaleLinesDrawnCount = 0; // Counter for debugging

  // Draw connector lines based on calculated node positions
  // Lines are colored based on the gender of the CHILD (father or mother)
  positions.forEach(parentPos => {
    // Ensure parent data is valid before processing
    if (!parentPos.data) return;

    const parentHasImage = !!parentPos.data.imageUrl;
    const parentWidth = parentHasImage ? NODE_WIDTH : NODE_WIDTH_COMPACT;
    const parentHeight = parentHasImage ? NODE_HEIGHT : NODE_HEIGHT_COMPACT;

    const parentMidX = parentPos.x + NODE_WIDTH; // Mid-right point of parent node
    const parentMidY = parentPos.y + NODE_HEIGHT / 2; // Mid-vertical point of parent node

    // Get the actual data for father and mother from the lineage structure
    const fatherData = parentPos.data.father;
    const motherData = parentPos.data.mother;

    // findPosByData mencocokkan berdasarkan REFERENSI OBJEK
    // Ini akan bekerja karena buildLineage sekarang memastikan setiap node adalah objek unik
    const findPosByData = dataToFind => {
      return positions.find(p => p.data === dataToFind);
    };

    const childFatherPos = fatherData ? findPosByData(fatherData) : null;
    const childMotherPos = motherData ? findPosByData(motherData) : null;

    // Iterate through potential children (father and mother)
    [childFatherPos, childMotherPos].forEach(childPos => {
      // Draw a line only if the child position and its data (with a name) exist
      // And only draw from parent (right) to child (left) as per diagram
      if (childPos && childPos.data && childPos.data.name) {
        const childHasImage = !!childPos.data.imageUrl;
        const childHeight = childHasImage ? NODE_HEIGHT : NODE_HEIGHT_COMPACT;

        const childMidX = childPos.x;
        const childMidY = childPos.y + childHeight / 2; // Gunakan tinggi dinamis anak
        const controlX = (parentMidX + childMidX) / 2;

        // --- Pengecekan NaN yang lebih ketat sebelum menggambar ---
        if (
          isNaN(parentMidX) ||
          isNaN(parentMidY) ||
          isNaN(childMidX) ||
          isNaN(childMidY) ||
          isNaN(controlX)
        ) {
          console.error(`[DEBUG PATH ERROR] NaN coordinate detected for line drawing! Skipping line.
                Parent: ${parentPos.data.name} (X:${parentMidX}, Y:${parentMidY})
                Child: ${childPos.data.name} (X:${childMidX}, Y:${childMidY})
                Control X: ${controlX}`);
          return; // Lewati baris ini jika ada NaN
        }
        // --- Pilih Path berdasarkan jenis kelamin anak ---
        if (childPos.data.gender === 'Male') {
          malePath.moveTo(parentMidX, parentMidY);
          malePath.cubicTo(
            controlX,
            parentMidY,
            controlX,
            childMidY,
            childMidX,
            childMidY,
          );
          maleLinesDrawnCount++;
        } else if (childPos.data.gender === 'Female') {
          femalePath.moveTo(parentMidX, parentMidY);
          femalePath.cubicTo(
            controlX,
            parentMidY,
            controlX,
            childMidY,
            childMidX,
            childMidY,
          );
          femaleLinesDrawnCount++;
        } else {
          // Fallback for unknown gender, perhaps draw a default color or log a warning
          console.warn(
            `[LINE NOT DRAWN WARNING] Child gender unknown for ${childPos.data.name} (Gender: "${childPos.data.gender}"). Line skipped.`,
          );
        }
      } else {
        // Log when a child is expected but not found or invalid for line drawing
        if (fatherData && !childFatherPos) {
          console.warn(
            `[LINE NOT DRAWN WARNING] Father data present for ${
              parentPos.data.name
            } (ID: ${
              parentPos.data.id || 'N/A'
            }) but child position NOT FOUND for father data: ${JSON.stringify(
              fatherData,
            )}.`,
          );
        }
        if (motherData && !childMotherPos) {
          console.warn(
            `[LINE NOT DRAWN WARNING] Mother data present for ${
              parentPos.data.name
            } (ID: ${
              parentPos.data.id || 'N/A'
            }) but child position NOT FOUND for mother data: ${JSON.stringify(
              motherData,
            )}.`,
          );
        }
      }
    });
  });

  // ======== NODE LAYOUT CALCULATION FUNCTION (MODIFIED FOR DYNAMIC SIZE) ========
  const layoutTree = (node, depth = 0) => {
    if (!node || !node.name) {
      return null;
    }

    // --- MODIFIKASI: Tentukan ukuran node saat ini berdasarkan datanya ---
    const hasImage = !!node.imageUrl;
    const currentHeight = hasImage ? NODE_HEIGHT : NODE_HEIGHT_COMPACT;
    // Lebar tetap sama untuk menjaga struktur kolom, hanya tinggi yang berubah
    const currentWidth = NODE_WIDTH;

    let nodePositions = [];
    let fatherNodeInfo = null;
    let motherNodeInfo = null;

    if (node.father && node.father.name) {
      fatherNodeInfo = layoutTree(node.father, depth + 1);
      if (fatherNodeInfo) {
        nodePositions.push(...fatherNodeInfo.positions);
      }
    }

    if (node.mother && node.mother.name) {
      motherNodeInfo = layoutTree(node.mother, depth + 1);
      if (motherNodeInfo) {
        nodePositions.push(...motherNodeInfo.positions);
      }
    }

    let ownY;
    if (fatherNodeInfo && motherNodeInfo) {
      // Pusatkan node saat ini di antara titik tengah kedua anaknya
      const fatherMidY = fatherNodeInfo.y + fatherNodeInfo.height / 2;
      const motherMidY = motherNodeInfo.y + motherNodeInfo.height / 2;
      ownY = (fatherMidY + motherMidY) / 2 - currentHeight / 2; // Gunakan currentHeight
    } else if (fatherNodeInfo) {
      // Sejajarkan dengan titik tengah anak tunggal (ayah)
      ownY = fatherNodeInfo.y + fatherNodeInfo.height / 2 - currentHeight / 2; // Gunakan currentHeight
    } else if (motherNodeInfo) {
      // Sejajarkan dengan titik tengah anak tunggal (ibu)
      ownY = motherNodeInfo.y + motherNodeInfo.height / 2 - currentHeight / 2; // Gunakan currentHeight
    } else {
      // Ini adalah daun: gunakan kursor Y
      ownY = yPositionCursorRef.current.value;
      // --- MODIFIKASI: Majukan kursor berdasarkan tinggi node saat ini ---
      yPositionCursorRef.current.value += currentHeight + V_GAP;
    }

    const ownX = depth * (NODE_WIDTH + H_GAP);
    const newNode = {
      id: node.id || `temp-${Math.random()}`,
      x: ownX,
      y: ownY,
      data: node,
    };
    nodePositions.push(newNode);

    // Kembalikan info posisi DAN tinggi node ini untuk digunakan oleh parentnya
    return {
      positions: nodePositions,
      x: ownX,
      y: ownY,
      height: currentHeight, // --- TAMBAHAN PENTING ---
    };
  };

  // ======== MAX NESTED CALCULATION (UNCHANGED) ========
  const getMaxNestedWithNode = node => {
    if (!node) return { max: 0, maxNode: null };

    const currentNested = typeof node.nested === 'number' ? node.nested : 0;

    const fatherResult = getMaxNestedWithNode(node.father);
    const motherResult = getMaxNestedWithNode(node.mother);

    let max = currentNested;
    let maxNode = node;

    if (fatherResult.max > max) {
      max = fatherResult.max;
      maxNode = fatherResult.maxNode;
    }

    if (motherResult.max > max) {
      max = motherResult.max;
      maxNode = motherResult.maxNode;
    }

    return { max, maxNode };
  };

  // ======== BUILD LINEAGE FUNCTION (MODIFIED: NO CACHE, UNIQUE OBJECTS) ========
  const buildLineage = ({ birdId, nested = 1, parentId = 'root' }) => {
    let bird = listPigeon.find(b => b.id === birdId);
    let currentBirdNode;

    // Buat ID unik untuk instance node ini di pohon, menggabungkan parentId dan random string
    // Ini memastikan setiap node di pohon memiliki ID yang unik untuk React keys dan pencarian posisi.
    const instanceId = `${
      birdId || 'manual'
    }-${parentId}-${nested}-${Math.random().toString(36).substring(2, 7)}`;

    if (bird) {
      // Ini adalah merpati asli dari listPigeon
      currentBirdNode = {
        nested,
        id: instanceId, // ID unik untuk instance ini di pohon
        originalId: bird.id, // Simpan ID asli jika perlu
        name: bird.name,
        notes: bird.notes,
        eye:
          findById(eyeColorOptions, bird.eyeColorId)?.name || 'Tidak diketahui',
        gender:
          findById(genderOptions, bird.genderId)?.name || 'Tidak diketahui',
        color: findById(birdColors, bird.colorId)?.name || 'Tidak diketahui',
        ringName: bird.ringName,
        imageUrl: bird.imageUrl,
        imageUrls: bird.imageUrls,
        isManual: false, // Flag untuk node asli
        father: null, // Akan diisi secara rekursif
        mother: null, // Akan diisi secara rekursif
      };
    } else {
      // Ini adalah entri "manual" atau ID tidak ditemukan di listPigeon
      currentBirdNode = {
        nested,
        id: instanceId, // ID unik untuk instance ini di pohon
        originalId: birdId, // Simpan ID yang dicoba jika perlu
        name:
          typeof birdId === 'string' && !birdId.startsWith('manual-')
            ? birdId
            : `Tidak Diketahui`, // Gunakan birdId (nama) jika itu string manual
        notes: '',
        eye: 'Tidak diketahui',
        gender: 'Tidak diketahui', // Gender default untuk node manual (akan di-override jika ayah/ibu)
        color: 'Tidak diketahui',
        ringName: '',
        imageUrl: null,
        imageUrls: [],
        isManual: true, // Flag untuk node manual
        father: null,
        mother: null,
      };
    }

    // Sekarang, bangun anak-anak untuk currentBirdNode secara rekursif
    // PENTING: Selalu panggil buildLineage untuk anak-anak, bahkan untuk entri manual berdasarkan nama string.
    // Kita meneruskan ID instansi saat ini sebagai parentId untuk membuat ID anak lebih unik.
    if (bird?.maleLineageId) {
      // Jika ada ID ayah asli
      currentBirdNode.father = buildLineage({
        birdId: bird.maleLineageId,
        nested: nested + 1,
        parentId: currentBirdNode.id,
      });
    } else if (bird?.maleLineage) {
      // Jika ada nama ayah manual tapi tidak ada ID
      // Gunakan nama manual sebagai birdId virtual untuk panggilan rekursif
      currentBirdNode.father = buildLineage({
        birdId: bird.maleLineage,
        nested: nested + 1,
        parentId: currentBirdNode.id,
      });
      if (currentBirdNode.father) {
        currentBirdNode.father.gender = 'Male'; // Set gender untuk node manual
      }
    } else {
      currentBirdNode.father = null;
    }

    if (bird?.femaleLineageId) {
      // Jika ada ID ibu asli
      currentBirdNode.mother = buildLineage({
        birdId: bird.femaleLineageId,
        nested: nested + 1,
        parentId: currentBirdNode.id,
      });
    } else if (bird?.femaleLineage) {
      // Jika ada nama ibu manual tapi tidak ada ID
      // Gunakan nama manual sebagai birdId virtual untuk panggilan rekursif
      currentBirdNode.mother = buildLineage({
        birdId: bird.femaleLineage,
        nested: nested + 1,
        parentId: currentBirdNode.id,
      });
      if (currentBirdNode.mother) {
        currentBirdNode.mother.gender = 'Female'; // Set gender untuk node manual
      }
    } else {
      currentBirdNode.mother = null;
    }

    return currentBirdNode;
  };

  // ======== EFFECT HOOK ========
  useEffect(() => {
    setLoading(true);

    if (item?.id) {
      console.log('[DEBUG] Generating lineage for item ID:', item.id);
      // Panggil buildLineage dengan parentId awal 'root'
      const generatedLineage = buildLineage({
        birdId: item.id,
        parentId: 'root',
      });

      if (generatedLineage) {
        const { max, maxNode } = getMaxNestedWithNode(generatedLineage);
        console.log('Nilai nested tertinggi:', max, 'Pada node:', maxNode);
        console.log('Lineage:', generatedLineage);
        setBirdLineAge(generatedLineage);
        setMaxNested(max);

        // PENTING: Reset kursor Y sebelum memulai perhitungan tata letak pohon
        yPositionCursorRef.current.value = HEADER_CAPTURE_HEIGHT;

        // Panggil layoutTree untuk mendapatkan posisi yang dihitung untuk semua node
        const treeLayoutResult = layoutTree(generatedLineage);
        if (treeLayoutResult) {
          // Urutkan posisi untuk rendering yang konsisten (penting untuk urutan penggambaran garis)
          // Urutkan berdasarkan X terlebih dahulu, lalu berdasarkan Y.
          const sortedPositions = treeLayoutResult.positions.sort((a, b) => {
            if (a.x !== b.x) return a.x - b.x;
            return a.y - b.y;
          });
          // 1. Hitung tinggi silsilah yang sebenarnya
          const minY = Math.min(...sortedPositions.map(p => p.y));
          const maxY = Math.max(
            ...sortedPositions.map(p => {
              const hasImage = !!p.data.imageUrl;
              const height = hasImage ? NODE_HEIGHT : NODE_HEIGHT_COMPACT;
              return p.y + height;
            }),
          );
          const treeHeight = maxY - minY;

          // 2. Tentukan area yang tersedia untuk silsilah di dalam gambar
          const availableHeight = maxY + 400 - HEADER_CAPTURE_HEIGHT; // Total tinggi ViewShot dikurangi header

          // 3. Hitung offset vertikal agar silsilah berada di tengah
          // Hanya terapkan jika silsilah lebih pendek dari area yang tersedia
          let yOffset = 0;
          if (treeHeight < availableHeight) {
            yOffset = (availableHeight - treeHeight) / 2;
          }

          // 4. Terapkan offset ke setiap node
          const centeredPositions = sortedPositions.map(p => ({
            ...p,
            // Geser posisi Y setiap node. Kurangi minY agar perhitungan dimulai dari 0, lalu tambahkan offset.
            y: p.y - minY + HEADER_CAPTURE_HEIGHT + yOffset,
          }));

          console.log(
            `[CENTERING] Tree Height: ${treeHeight}, Available: ${availableHeight}, Y-Offset: ${yOffset}`,
          );
          setPositions(centeredPositions); // Gunakan posisi yang sudah di-center
        } else {
          console.warn('[DEBUG] No tree layout result generated.');
          setPositions([]); // Tidak ada tata letak yang dapat dihasilkan
        }
      } else {
        console.warn(
          '[DEBUG] Could not generate lineage for item ID:',
          item.id,
        );
        setBirdLineAge({});
        setPositions([]);
        setMaxNested(1);
      }
    } else {
      console.log('[DEBUG] No item ID provided, clearing lineage data.');
      setBirdLineAge({});
      setPositions([]);
      setMaxNested(1);
    }
    setLoading(false);
  }, [item?.id, listPigeon]); // Dependencies: re-run if main pigeon or list of all pigeons changes

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const bannerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT / 1],
      [1, 0],
      Extrapolate.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, -HEADER_HEIGHT],
      Extrapolate.CLAMP,
    );
    return { opacity, transform: [{ translateY }] };
  });

  const searchBarStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [HEADER_HEIGHT - 50, HEADER_HEIGHT],
      [0, 1],
      Extrapolate.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [HEADER_HEIGHT - 50, HEADER_HEIGHT],
      [-20, 0],
      Extrapolate.CLAMP,
    );
    return { opacity, transform: [{ translateY }] };
  });

  const toShare = () => {
    const shareOptions = {
      title: birdLineAge?.name, // Assuming birdLineAge was renamed to birdLineage in the previous translation
      message: 'I want to share my bloodline information!', // Translated from 'Saya ingin berbagi informasi trahku!'
      url: `https://merpatiku-github-io.vercel.app/dl?id=${birdLineage?.originalId}`,
    };

    Share.open(shareOptions)
      .then(async res => {
        console.log('Shared successfully', res);

        if (canAddPoint()) {
          // ✅ Add point + save history
          addShare();

          try {
            await updateUserPoint(user?.uid, 1); // increment +1
            console.log('✅ User point incremented'); // Translated from 'Point user ditambah'
            await setSuccessModal(true);
          } catch (err) {
            console.error('❌ Failed to update point:', err); // Translated from 'Gagal update point'
          }
        } else {
          console.log('⛔ Share limit reached (max 10 per minute)'); // Translated from 'Limit share tercapai (max 10 per menit)'
        }
      })
      .catch(err => {
        err && console.log('Shared failed', err);
      });
  };
  // Back button handling (UNCHANGED)
  useEffect(() => {
    const backAction = () => {
      handleBack();
      return true; // prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleBack = () => {
    console.log('navigation', navigation.canGoBack());
    if (navigation.canGoBack()) {
      navigation?.goBack();
    } else {
      navigation?.navigate('Main'); // Navigate to 'Main' if no history
    }
  };

  // --- TAMBAHAN: Fungsi untuk cek & minta izin penyimpanan di Android ---
  async function hasAndroidPermission() {
    // Hanya perlu izin untuk Android versi di bawah 13 (API 33)
    if (Platform.OS === 'android' && Platform.Version < 33) {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

      const hasPermission = await PermissionsAndroid.check(permission);
      if (hasPermission) {
        return true;
      }

      const status = await PermissionsAndroid.request(permission);
      return status === 'granted';
    }
    // Untuk iOS atau Android 13+, izin tidak diperlukan dengan cara ini
    return true;
  }

  // --- PERUBAHAN: Fungsi generateImage diubah menjadi captureAndSaveImage ---
  const captureAndSaveImage = async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      Alert.alert(
        'Izin Ditolak',
        'Izin penyimpanan diperlukan untuk menyimpan gambar.',
      );
      return;
    }
    setIsGeneratingImage(true);
    setTimeout(async () => {
      try {
        if (viewShotRef.current) {
          // 1. Tangkap gambar, hasilnya adalah URI file sementara
          const tempUri = await viewShotRef.current.capture({
            pixelRatio: 2.5,
            quality: 1.0,
            format: 'png',
          });

          // 2. Buat nama file baru yang aman
          const safeFileName = (birdLineAge?.name || 'tanpa_nama').replace(
            /[^a-zA-Z0-9]/g,
            '_',
          );
          const fileName = `Silsilah_${safeFileName}_${Date.now()}.png`;

          // 3. Tentukan path baru di direktori cache aplikasi
          const newPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
          console.log(`Memindahkan file sementara...
            - Dari: ${tempUri}
            - Ke: ${newPath}`);

          // 4. Pindahkan (rename) file sementara ke path baru
          await RNFS.moveFile(tempUri, newPath);

          // 5. Simpan file yang sudah di-rename ke galeri menggunakan CameraRoll
          //    Catatan: Nama file akhir di galeri mungkin tetap diatur oleh sistem operasi.
          console.log(`Menyimpan ke galeri: ${newPath}`);
          await CameraRoll.save(newPath, { type: 'photo' });

          Alert.alert(
            'Berhasil 👍',
            'Gambar silsilah telah disimpan ke galeri Anda.',
          );
        }
      } catch (error) {
        console.error('Gagal mengambil atau menyimpan gambar!', error);
        Alert.alert(
          'Error 😥',
          'Gagal menyimpan gambar silsilah. Cek console log untuk detail.',
        );
      } finally {
        setIsGeneratingImage(false);
      }
    }, 300);
  };

  const renderLabelValue = ({ label, value, index = 0, styleValue = {} }) => {
    return (
      <Animated.View
        entering={FadeInDown.duration(500).delay(100 * index)}
        style={{
          flexDirection: 'row',
          padding: 10,
          marginHorizontal: 0,
          backgroundColor: Colors.PRIMARY_50,
          borderBottomColor: Colors.PRIMARY_50,
          borderBottomWidth: 0.5,
          alignContent: 'space-between',
          justifyContent: 'space-between',
          width: '100%',
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
        <Text style={[styles.latinName, styleValue]}>{value || '-'}</Text>
      </Animated.View>
    );
  };

  return (
    <>
      <BaseView
        disableToolbar
        style={styles.container}
        loading={loading || isGeneratingImage}
      >
        {/* Animated Header/Banner Section */}
        <Animated.View style={[styles.banner, bannerStyle]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              position: 'absolute',
              top: 60,
              left: 30,
              zIndex: 20,
              backgroundColor: Colors.WHITE_20,
              borderColor: Colors.WHITE,
              borderWidth: 1,
              borderRadius: 50,
              padding: 5,
            }}
          >
            <MaterialCommunityIcons
              name='arrow-left'
              size={30}
              color={Colors.WHITE}
            />
          </TouchableOpacity>
          <Pressable
            onPress={() => {
              const imagesForPreview = item.imageUrls.map(url => ({
                url: url,
              }));
              console.log('showImagePreview', imagesForPreview);
              global.showImagePreview(imagesForPreview);
            }}
          >
            <Image source={{ uri: item?.imageUrl }} style={styles.image} />
          </Pressable>
          <Pressable
            style={{
              position: 'absolute',
              bottom: 20,
              left: 30,
              right: 30,
              zIndex: 20,
              borderRadius: 0,
              padding: 10,
            }}
            onPress={() => {
              const imagesForPreview = item.imageUrls.map(url => ({
                url: url,
              }));
              global.showImagePreview(imagesForPreview);
            }}
          >
            <LinearGradient
              colors={Colors.GRADIENT_ROYAL90}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                bottom: 20,
                left: 30,
                right: 30,
                zIndex: 20,
                borderRadius: 10,
                padding: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.fontBoldItalic,
                  fontSize: FontSize.FONT_SIZE_30,
                  color: Colors.WHITE,
                }}
              >
                {birdLineAge?.name}
              </Text>
              <Text style={styles.latinName}>({type?.name})</Text>
            </LinearGradient>
          </Pressable>
          <TouchableOpacity
            onPress={showAd}
            style={{
              position: 'absolute',
              top: 60,
              right: 80,
              zIndex: 20,
              backgroundColor: Colors.WHITE_20,
              borderColor: Colors.WHITE,
              borderWidth: 1,
              borderRadius: 50,
              padding: 5,
            }}
          >
            <MaterialCommunityIcons
              name={'download'}
              size={FontSize.FONT_SIZE_30}
              color={Colors.WHITE}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={toShare}
            style={{
              position: 'absolute',
              top: 60,
              right: 30,
              zIndex: 20,
              backgroundColor: Colors.WHITE_20,
              borderColor: Colors.WHITE,
              borderWidth: 1,
              borderRadius: 50,
              padding: 5,
            }}
          >
            <MaterialCommunityIcons
              name={'share'}
              size={FontSize.FONT_SIZE_30}
              color={Colors.WHITE}
            />
          </TouchableOpacity> */}
        </Animated.View>

        {/* --- MODIFIKASI: Tambahkan tombol "Generate Image" di header sticky --- */}
        <Animated.View
          style={[styles.searchSticky, searchBarStyle]}
          pointerEvents='auto'
        >
          <LinearGradient
            colors={Colors.GRADIENT_ROYAL}
            style={styles.searchContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.searchIcon}
            >
              <MaterialCommunityIcons
                name='arrow-left'
                size={20}
                color={Colors.WHITE}
              />
            </TouchableOpacity>
            <Text style={styles.searchTitle}>Pigeon Details</Text>

            <View style={{ flexDirection: 'row' }}>
              {/* --- TAMBAHAN: Tombol untuk generate gambar --- */}
              <TouchableOpacity onPress={showAd} style={styles.searchIcon}>
                <MaterialCommunityIcons
                  name={'download'}
                  size={20}
                  color={Colors.WHITE}
                />
              </TouchableOpacity>

              {/* <TouchableOpacity
                onPress={toShare}
                style={[styles.searchIcon, { marginLeft: 10 }]}
              >
                <MaterialCommunityIcons
                  name={'share'}
                  size={20} // Samakan ukurannya
                  color={Colors.YELLOW}
                />
              </TouchableOpacity> */}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Main Scrollable Content */}
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingTop: HEADER_HEIGHT - 40 }}
        >
          <LinearGradient
            colors={Colors.GRADIENT_ROYAL}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.contentContainer}
          >
            {/* Pigeon Detail List */}
            <FlatList
              data={detailPigeon}
              keyExtractor={(item, idx) => idx?.toString()}
              renderItem={({ item, index }) =>
                renderLabelValue({
                  label: item?.label,
                  value: item?.value,
                  index,
                })
              }
            />
            {/* Additional Info / Notes */}
            {renderLabelValue({
              label: 'Additional Information: ', // Translated from 'Informasi Tambahan: '
              value: birdLineAge?.notes || '-', // Assuming birdLineAge was renamed to birdLineage
              styleValue: {
                textAlign: 'right',
                width: '100%',
                paddingRight: 120 * Sizes.ratioWidthScreen,
              },
            })}

            {/* Horizontal ScrollView for the tree content */}
            <ScrollView
              horizontal
              contentContainerStyle={{
                flexGrow: 1,
                minWidth: maxX + 200,
                paddingBottom: V_GAP,
              }}
            >
              {/* Vertical ScrollView for the tree content */}
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  minHeight: maxY + 200,
                  paddingRight: H_GAP,
                }}
              >
                {/* --- MODIFIKASI: Ganti View dengan ViewShot dan tambahkan Logo --- */}
                <ViewShot
                  ref={viewShotRef}
                  options={{ format: 'png', quality: 1.0 }}
                  style={{
                    width: maxX + 0,
                    height: maxY + 200,
                    position: 'relative',
                    backgroundColor: Colors.PRIMARY_80, // Beri background solid agar gambar tidak transparan
                  }}
                  renderToHardwareTextureAndroid={false}
                >
                  <View
                    // colors={Colors.GRADIENT_ROYAL}
                    // start={{ x: 1, y: 1 }}
                    // end={{ x: 1, y: 0 }}
                    style={{
                      width: maxX + 200,
                      height: maxY + 200,
                      position: 'relative',
                      padding: 20,
                      marginLeft: 20,
                      backgroundColor: 'transparent',
                    }}
                  >
                    {/* Canvas for drawing lines using Skia. Added debug background and a Rect for testing. */}
                    <Canvas
                      key={
                        positions.length > 0 ? positions[0].id : 'empty-canvas'
                      } // Added key here
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      {/* DEBUG: Kotak BIRU sebagai test render dasar Skia */}
                      {/* <Rect 
                      x={50} y={50} width={50} height={50} color="blue" style={"stroke"} strokeWidth={3}
                    /> */}
                      {/* Garis Male (Merah) */}
                      <Path
                        path={malePath}
                        color={Colors.RED}
                        style='stroke'
                        strokeWidth={2}
                      />
                      {/* Garis Female (Pink) */}
                      <Path
                        path={femalePath}
                        color={Colors.PINK}
                        style='stroke'
                        strokeWidth={2}
                      />
                    </Canvas>

                    {/* Render Node components based on calculated positions */}
                    {positions.map(p => (
                      <Node
                        key={p.id}
                        x={p.x} // Anda bisa tetap menambahkan margin kiri jika mau, misal: p.x + 50
                        y={p.y} // <-- Gunakan p.y langsung tanpa penambahan
                        data={p.data}
                        mainId={item?.id}
                      />
                    ))}
                    {/* --- TAMBAHAN: Letakkan logo atau gambar lain di sini --- */}
                    <Image
                      source={logotransparent} // Gunakan logo dari assets Anda
                      style={{
                        position: 'absolute',
                        width: '100%', // Atur ukuran
                        height: '100%',
                        resizeMode: 'contain',
                        opacity: 0.2, // Buat sedikit transparan seperti watermark
                        zIndex: -1,
                      }}
                    />
                    <View
                      style={{
                        zIndex: 1,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                      }}
                    >
                      <ImageHeader
                        logoSource={
                          item?.owner?.photoURL
                            ? { uri: item?.owner?.photoURL }
                            : logo
                        }
                        title={birdLineAge?.name || ''}
                        subtitle={
                          item?.owner?.displayName ||
                          'Silsilah / Kombinasi / Keturunan / Trah'
                        }
                        qrValue={
                          `https://merpatiku-github-io.vercel.app/dl?id=${item?.id}` ||
                          'No ID'
                        }
                      />
                    </View>
                    {/* --- MODIFIKASI: Posisikan QR Code secara absolut --- */}
                    <View style={styles.qrCodeContainer}>
                      <QRCode
                        value={
                          `https://merpatiku-github-io.vercel.app/dl?id=${item?.id}` ||
                          'No ID'
                        }
                        size={100} // Atur ukuran yang sesuai
                        logo={logotransparent}
                        logoSize={15}
                        logoBackgroundColor='white'
                        backgroundColor={'transparent'} // Beri background putih agar terbaca
                        color={Colors.PRIMARY}
                      />
                    </View>
                  </View>
                </ViewShot>
              </ScrollView>
            </ScrollView>
          </LinearGradient>
        </Animated.ScrollView>
        {/* Global Banner Ad at the bottom */}
        <View style={[styles.bannerBottom]}>
          <GlobalBannerAd />
        </View>
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2C2C2C' },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    overflow: 'hidden',
  },
  contentContainer: { padding: 0, backgroundColor: '#3A3A3A', paddingTop: 40 },
  latinName: {
    fontSize: 18,
    color: '#F0f0f0',
    fontFamily: Fonts.fontItalic,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
    fontFamily: Fonts.fontBold,
    textAlign: 'center',
    marginTop: 20,
  },
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 1,
    overflow: 'hidden',
  },
  bannerBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
  },
  searchSticky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 10,
  },
  searchContainer: {
    flex: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
  },
  searchIcon: {
    padding: 8,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.WHITE_20,
    borderColor: Colors.WHITE,
    borderWidth: 1,
    borderRadius: 40,
  },
  searchTitle: {
    fontFamily: Fonts.fontSemiBold,
    color: 'white',
    fontSize: Sizes.CUSTOM_SIZE(14),
  },
  // Styles for the Node component (mimicking PigeonCard)
  nodeCard: {
    backgroundColor: '#2c3e5050', // Semi-transparent dark background
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.PURPLE, // Purple border
    borderRadius: 8, // Rounded corners for the whole card
    overflow: 'hidden', // Ensure content stays within borders
  },
  qrCodeContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
  },
  // Kept for renderPopUp: used for Name/Gender/Color/Band/Ring/ID labels and values
  latinName: {
    fontSize: 18,
    color: '#F0f0f0',
    fontFamily: Fonts.fontItalic,
  },

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
});

export default DetailBloodlineScreen;
