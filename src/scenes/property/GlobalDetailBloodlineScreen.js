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
  Platform,
  PermissionsAndroid,
} from 'react-native';
// --- FIX: Correct import for MaterialCommunityIcons ---
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
import dayjs from 'dayjs';
import { GlobalBannerAd } from '../ads';
import { BaseView } from '../../components';
import { logo, logopigeon, logotransparent } from '../../assets/images';
import useBloodlineStore from '../../store/usePropertyStore';
import customParseFormat from 'dayjs/plugin/customParseFormat';
// Set language to English for display formats
dayjs.locale('en');
dayjs.extend(customParseFormat);

// --- ADDED: Imports from DetailBloodlineScreen ---
import ViewShot from 'react-native-view-shot';
import QRCode from 'react-native-qrcode-svg';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { NodeGeneral } from './Node';
import { ImageHeader } from './ImageHeader';

// --- ADDED: Constants for node dimensions ---
const NODE_WIDTH = 120;
const NODE_HEIGHT = 60;
const NODE_WIDTH_COMPACT = 90;
const NODE_HEIGHT_COMPACT = 40;
const H_GAP = 40;
const V_GAP = 30;
const HEADER_HEIGHT = 260;
const HEADER_CAPTURE_HEIGHT = 100;

const GlobalDetailBloodlineScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const item = route.params;

  // --- State and Refs ---
  const viewShotRef = useRef(null);
  const getPigeonById = useBloodlineStore(state => state.getPigeonById);
  const [birdLineage, setBirdLineage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [maxNested, setMaxNested] = useState(1);
  const [positions, setPositions] = useState([]);
  const yPositionCursorRef = useRef({ value: 0 });

  const findById = (dataList, id) =>
    dataList.find(item => item.id === id) || null;

  // Translated Details
  const pigeonDetails = [
    {
      id: 1,
      icon: 'cake-variant-outline',
      label: 'Date of Birth',
      value: birdLineage?.dateOfBirth
        ? dayjs(birdLineage?.dateOfBirth).format('DD MMMM YYYY')
        : 'Unknown',
    },
    {
      id: 2,
      icon: 'eye-circle-outline',
      label: 'Eye Color',
      value: birdLineage?.eye,
    },
    {
      id: 3,
      icon: 'gender-male-female',
      label: 'Gender',
      value: birdLineage?.gender,
    },
    {
      id: 4,
      icon: 'palette-outline',
      label: 'Color',
      value: birdLineage?.color,
    },
    {
      id: 5,
      icon: 'ring',
      label: 'Band / Ring / ID',
      value: birdLineage?.ringName,
    },
  ];

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

  const buildLineageAsync = async ({
    birdId,
    nested = 1,
    birdDataCache = {},
  }) => {
    if (!birdId) return null;

    let bird = birdDataCache[birdId];
    if (!bird) {
      try {
        bird = await getPigeonById(birdId);
        if (bird) {
          birdDataCache[birdId] = bird;
        }
      } catch (error) {
        console.error(`Failed to fetch Firestore ID ${birdId}:`, error);
        bird = null;
      }
    }

    if (!bird) {
      // Translated manual entry
      return { name: 'Unknown', id: birdId, isManual: true, nested };
    }

    const result = {
      nested,
      id: bird.id,
      name: bird.name,
      notes: bird.notes,
      gender: findById(genderOptions, bird.genderId)?.name || 'N/A',
      color: findById(birdColors, bird.colorId)?.name || 'N/A',
      eye: findById(eyeColorOptions, bird.eyeColorId)?.name || 'N/A',
      type: findById(pigeonTypes, bird.pigeonTypeId)?.name || 'N/A',
      ringName: bird.ringName,
      imageUrl: bird.imageUrl,
      imageUrls: bird.imageUrls,
      father: null,
      mother: null,
      isManual: false,
    };

    if (bird.maleLineageId) {
      result.father = await buildLineageAsync({
        birdId: bird.maleLineageId,
        nested: nested + 1,
        birdDataCache,
      });
    } else if (bird.maleLineage) {
      // Translated manual entry
      result.father = {
        name: bird.maleLineage,
        gender: 'Male', // Translated Gender
        isManual: true,
        nested: nested + 1,
      };
    }

    if (bird.femaleLineageId) {
      result.mother = await buildLineageAsync({
        birdId: bird.femaleLineageId,
        nested: nested + 1,
        birdDataCache,
      });
    } else if (bird.femaleLineage) {
      // Translated manual entry
      result.mother = {
        name: bird.femaleLineage,
        gender: 'Female', // Translated Gender
        isManual: true,
        nested: nested + 1,
      };
    }

    return result;
  };

  const layoutTree = (node, depth = 0) => {
    if (!node || !node.name) return null;

    const hasImage = !!node.imageUrl;
    const currentHeight = hasImage ? NODE_HEIGHT : NODE_HEIGHT_COMPACT;

    let nodePositions = [];
    let fatherNodeInfo = null;
    let motherNodeInfo = null;

    if (node.father && node.father.name) {
      fatherNodeInfo = layoutTree(node.father, depth + 1);
      if (fatherNodeInfo) nodePositions.push(...fatherNodeInfo.positions);
    }
    if (node.mother && node.mother.name) {
      motherNodeInfo = layoutTree(node.mother, depth + 1);
      if (motherNodeInfo) nodePositions.push(...motherNodeInfo.positions);
    }

    let ownY;
    if (fatherNodeInfo && motherNodeInfo) {
      const fatherMidY = fatherNodeInfo.y + fatherNodeInfo.height / 2;
      const motherMidY = motherNodeInfo.y + motherNodeInfo.height / 2;
      ownY = (fatherMidY + motherMidY) / 2 - currentHeight / 2;
    } else if (fatherNodeInfo) {
      ownY = fatherNodeInfo.y + fatherNodeInfo.height / 2 - currentHeight / 2;
    } else if (motherNodeInfo) {
      ownY = motherNodeInfo.y + motherNodeInfo.height / 2 - currentHeight / 2;
    } else {
      ownY = yPositionCursorRef.current.value;
      yPositionCursorRef.current.value += currentHeight + V_GAP;
    }

    const uniqueNodeId = `${node.id || 'manual'}-${depth}-${Math.random()}`;
    const ownX = depth * (NODE_WIDTH + H_GAP);
    const newNode = { id: uniqueNodeId, x: ownX, y: ownY, data: node };
    nodePositions.push(newNode);

    return {
      positions: nodePositions,
      x: ownX,
      y: ownY,
      height: currentHeight,
    };
  };

  useEffect(() => {
    const loadLineage = async () => {
      if (!item?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const generatedLineage = await buildLineageAsync({
        birdId: item.id,
        birdDataCache: {},
      });
      if (generatedLineage) {
        const { max } = getMaxNestedWithNode(generatedLineage);
        setBirdLineage(generatedLineage);
        setMaxNested(max);
      }
    };
    loadLineage();
  }, [item?.id]);

  useEffect(() => {
    if (birdLineage) {
      yPositionCursorRef.current.value = HEADER_CAPTURE_HEIGHT;
      const treeLayoutResult = layoutTree(birdLineage);
      if (treeLayoutResult && treeLayoutResult.positions.length > 0) {
        const sortedPositions = treeLayoutResult.positions.sort(
          (a, b) => a.x - b.x || a.y - b.y,
        );

        const minY = Math.min(...sortedPositions.map(p => p.y));
        const maxYPos = Math.max(
          ...sortedPositions.map(
            p => p.y + (p.data.imageUrl ? NODE_HEIGHT : NODE_HEIGHT_COMPACT),
          ),
        );
        const treeHeight = maxYPos - minY;
        const availableHeight = Math.max(treeHeight, Sizes.heightScreen);
        let yOffset = (availableHeight - treeHeight) / 2;
        if (yOffset < 0) yOffset = 0;

        const centeredPositions = sortedPositions.map(p => ({
          ...p,
          y: p.y - minY + HEADER_CAPTURE_HEIGHT + yOffset,
        }));
        setPositions(centeredPositions);
      } else {
        setPositions([]);
      }
    }
    setLoading(false);
  }, [birdLineage]);

  const maxX =
    positions.length > 0
      ? Math.max(...positions.map(p => p.x)) + NODE_WIDTH
      : 0;
  const maxY =
    positions.length > 0
      ? Math.max(...positions.map(p => p.y)) + NODE_HEIGHT
      : 0;

  const malePath = Skia.Path.Make();
  const femalePath = Skia.Path.Make();

  // --- LINE DRAWING LOGIC FIX ---
  // Draw lines from the RIGHT EDGE of the parent to the LEFT EDGE of the child
  positions.forEach(parentPos => {
    if (!parentPos.data) return;

    // Determine parent dimensions dynamically
    const parentHasImage = !!parentPos.data.imageUrl;
    const parentWidth = parentHasImage ? NODE_WIDTH : NODE_WIDTH_COMPACT;
    const parentHeight = parentHasImage ? NODE_HEIGHT : NODE_HEIGHT_COMPACT;

    // Line start point: center-right of the parent node
    const lineStartX = parentPos.x + parentWidth;
    const lineStartY = parentPos.y + parentHeight / 2;

    const findPosByData = dataToFind =>
      positions.find(p => p.data === dataToFind);
    const childFatherPos = parentPos.data.father
      ? findPosByData(parentPos.data.father)
      : null;
    const childMotherPos = parentPos.data.mother
      ? findPosByData(parentPos.data.mother)
      : null;

    [childFatherPos, childMotherPos].forEach(childPos => {
      if (childPos && childPos.data && childPos.data.name) {
        // Determine child dimensions dynamically
        const childHasImage = !!childPos.data.imageUrl;
        const childHeight = childHasImage ? NODE_HEIGHT : NODE_HEIGHT_COMPACT;

        // Line end point: center-left of the child node
        const lineEndX = childPos.x;
        const lineEndY = childPos.y + childHeight / 2;

        const controlX = (lineStartX + lineEndX) / 2;
        // Use translated gender for path determination
        const path = childPos.data.gender === 'Male' ? malePath : femalePath;
        path.moveTo(lineStartX, lineStartY);
        path.cubicTo(
          controlX,
          lineStartY,
          controlX,
          lineEndY,
          lineEndX,
          lineEndY,
        );
      }
    });
  });

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const bannerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT / 1],
      [1, 0],
      Extrapolate.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, HEADER_HEIGHT],
          [0, -HEADER_HEIGHT],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }));
  const searchBarStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [HEADER_HEIGHT - 50, HEADER_HEIGHT],
      [0, 1],
      Extrapolate.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [HEADER_HEIGHT - 50, HEADER_HEIGHT],
          [-20, 0],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }));

  useEffect(() => {
    const backAction = () => {
      handleBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [navigation]);

  const handleBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('Main');
  };

  async function hasAndroidPermission() {
    if (Platform.OS === 'android' && Platform.Version < 33) {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      const hasPermission = await PermissionsAndroid.check(permission);
      if (hasPermission) return true;
      const status = await PermissionsAndroid.request(permission);
      return status === 'granted';
    }
    return true;
  }

  const renderLabelValue = ({ label, value, index = 0, styleValue = {} }) => (
    <Animated.View
      entering={FadeInDown.duration(500).delay(100 * index)}
      style={styles.labelValueContainer}
    >
      <Text style={styles.popUpLabel}>{label}</Text>
      <Text style={[styles.latinName, styleValue]}>{value || '-'}</Text>
    </Animated.View>
  );

  return (
    <BaseView disableToolbar style={styles.container}>
      <Animated.View style={[styles.banner, bannerStyle]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialCommunityIcons
            name='arrow-left'
            size={30}
            color={Colors.GRAY_BLACK}
          />
        </TouchableOpacity>
        <Pressable
          onPress={() =>
            global.showImagePreview &&
            global.showImagePreview([{ url: birdLineage?.imageUrl }])
          }
        >
          <Image source={{ uri: birdLineage?.imageUrl }} style={styles.image} />
        </Pressable>
        <LinearGradient
          colors={Colors.GRADIENT_ROYAL90}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={styles.nameBanner}
        >
          <Text style={styles.nameBannerText}>{birdLineage?.name}</Text>
          <Text style={styles.latinName}>({birdLineage?.type})</Text>
        </LinearGradient>
      </Animated.View>

      <Animated.View
        style={[styles.searchSticky, searchBarStyle]}
        pointerEvents='auto'
      >
        <LinearGradient
          colors={Colors.GRADIENT_ROYAL}
          style={styles.searchContainer}
        >
          <TouchableOpacity onPress={handleBack} style={styles.searchIcon}>
            <MaterialCommunityIcons name='arrow-left' size={30} color='white' />
          </TouchableOpacity>
          <Text style={styles.searchTitle}>Pigeon Details</Text>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT - 40 }}
      >
        <LinearGradient
          colors={Colors.GRADIENT_ROYAL}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.contentContainer}
        >
          <FlatList
            data={pigeonDetails}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item, index }) =>
              renderLabelValue({
                label: item?.label,
                value: item?.value,
                index,
              })
            }
          />
          {renderLabelValue({
            label: 'Additional Information: ',
            value: birdLineage?.notes || '-',
            styleValue: {
              textAlign: 'right',
              width: '100%',
              paddingRight: 120 * Sizes.ratioWidthScreen,
            },
          })}

          {/* Bloodline Tree Visualization */}
          <ScrollView
            horizontal
            contentContainerStyle={{
              flexGrow: 1,
              minWidth: maxX + 200,
              paddingBottom: V_GAP,
            }}
          >
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                minHeight: maxY + 400,
                paddingRight: H_GAP,
              }}
            >
              <ViewShot
                ref={viewShotRef}
                options={{ format: 'png', quality: 1.0 }}
                style={{
                  width: maxX + 200,
                  height: maxY + 400,
                  position: 'relative',
                  marginLeft: 20,
                  padding: 20,
                  paddingLeft: 40,
                  backgroundColor: 'transparent',
                }}
              >
                {/* Render Canvas (lines) first to be on the back layer */}
                <Canvas
                  key={item?.id || 'canvas'}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <Path
                    path={malePath}
                    color={Colors.RED}
                    style='stroke'
                    strokeWidth={2}
                  />
                  <Path
                    path={femalePath}
                    color={Colors.PINK}
                    style='stroke'
                    strokeWidth={2}
                  />
                </Canvas>
                {/* Render Nodes (cards) afterwards to be on the front layer */}
                {positions.map(p => (
                  <NodeGeneral
                    key={p.id}
                    x={p.x}
                    y={p.y}
                    data={p.data}
                    mainId={item?.id}
                  />
                ))}
                <Image source={logotransparent} style={styles.watermark} />
                <View style={styles.headerCaptureWrapper}>
                  <ImageHeader
                    logoSource={
                      item?.owner?.photoURL
                        ? { uri: item?.owner?.photoURL }
                        : logo
                    }
                    title={birdLineage?.name || ''}
                    subtitle={
                      item?.owner?.displayName || 'Bloodline / Lineage / Strain' // Translated Lineage
                    }
                  />
                </View>
                <View style={styles.qrCodeContainer}>
                  <QRCode
                    value={
                      `https://merpatiku-github-io.vercel.app/dl?id=${item?.id}` ||
                      'No ID'
                    }
                    size={100}
                    logo={logotransparent}
                    logoSize={15}
                    logoBackgroundColor='white'
                    backgroundColor={'transparent'}
                    color={Colors.PRIMARY}
                  />
                </View>
              </ViewShot>
            </ScrollView>
          </ScrollView>
        </LinearGradient>
      </Animated.ScrollView>
      <View style={styles.bannerBottom}>
        <GlobalBannerAd />
      </View>
    </BaseView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2C2C2C' },
  image: { width: '100%', height: HEADER_HEIGHT, resizeMode: 'cover' },
  contentContainer: { padding: 0, backgroundColor: '#3A3A3A', paddingTop: 40 },
  latinName: { fontSize: 18, color: '#F0f0f0', fontFamily: Fonts.fontItalic },
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
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchTitle: {
    fontFamily: Fonts.fontSemiBold,
    color: 'white',
    fontSize: Sizes.CUSTOM_SIZE(14),
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 30,
    zIndex: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 50,
    padding: 5,
  },
  nameBanner: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    zIndex: 20,
    borderRadius: 0,
    padding: 10,
  },
  nameBannerText: {
    fontFamily: Fonts.fontBoldItalic,
    fontSize: FontSize.FONT_SIZE_30,
    color: Colors.WHITE,
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
  watermark: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    opacity: 0.2,
    zIndex: -1,
  },
  headerCaptureWrapper: {
    zIndex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  popUpLabel: { fontSize: 12, fontFamily: Fonts.fontRegular, color: '#F0f0f0' },
  labelValueContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: Colors.PRIMARY_50,
    borderBottomWidth: 0.5,
    justifyContent: 'space-between',
    width: '100%',
  },
  // --- ADDED: STYLE FOR LOADING MODAL (Translated) ---
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#333333',
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

export default GlobalDetailBloodlineScreen;
