import { StyleSheet } from 'react-native';
import { Colors, Sizes } from '../styles';
import { Fonts } from '../constants';

export default StyleSheet.create({
  marginBottom20: {
    marginBottom: Sizes.SIZE_20,
  },
  textStyle: {
    alignSelf: 'center',
    fontSize: Sizes.CUSTOM_SIZE(18),
    alignItems: 'center',
    color: Colors.SOFT_WHITE, // Ganti ke warna putih lembut
    fontFamily: Fonts.fontRegular,
  },
  buttonStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.SOFT_PRIMARY, // Warna biru pastel
    borderRadius: 5,
    marginHorizontal: 5,
  },
  containerDisabled: {
    backgroundColor: Colors.SOFT_GRAY, // Warna abu-abu lembut
  },
  textDisable: {
    color: Colors.SOFT_WHITE, // Warna putih lembut
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alignStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 26 * Sizes.ratioHeightScreen,
    zIndex: 1,
    backgroundColor: Colors.SOFT_DIM, // Warna latar belakang lembut
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.SOFT_DIM, // Warna abu lembut
  },
  modalContainer: {
    height: Sizes.CUSTOM_SIZE(405),
    width: Sizes.CUSTOM_SIZE(311),
    backgroundColor: Colors.SOFT_WHITE, // Warna putih lembut
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 32 * Sizes.ratioWidthScreen,
  },
  modalTitle: {
    fontFamily: Fonts.fontSemiBold,
    fontSize: Sizes.CUSTOM_SIZE(18),
    color: Colors.SOFT_PRIMARY, // Warna lembut
    marginHorizontal: 49 * Sizes.ratioWidthScreen,
    letterSpacing: 0.3,
    marginTop: 18 * Sizes.ratioHeightScreen,
    textAlign: 'center',
  },
  description: {
    color: 'rgba(100,100,100,0.6)', // Abu-abu lembut transparan
    fontFamily: Fonts.fontRegular,
    fontSize: 14 * Sizes.ratioWidthScreen,
    marginHorizontal: Sizes.CUSTOM_SIZE(36),
    textAlign: 'center',
    marginTop: Sizes.CUSTOM_SIZE(24),
  },
  optionContainer: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  buttonContainer: {
    width: Sizes.widthScreen - 130 * Sizes.ratioWidthScreen,
    height: Sizes.SIZE_40,
    borderRadius: 4,
    marginTop: Sizes.CUSTOM_SIZE(48),
  },
  buttonText: {
    color: Colors.WHITE,
    fontFamily: Fonts.fontSemiBold,
    fontSize: 14 * Sizes.ratioWidthScreen,
  },
  mainDisconnect: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingBottom: Sizes.CUSTOM_SIZE(-40),
  },
  imgDisconnect: {
    margin: Sizes.SIZE_30,
    padding: 0,
    height: Sizes.CUSTOM_SIZE(82),
    width: Sizes.CUSTOM_SIZE(106),
    marginTop: 0,
  },
  titleDisconnect: {
    fontFamily: Fonts.fontRegular,
    fontSize: 14 * Sizes.ratioWidthScreen,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  btnTextDisconnect: {
    color: Colors.WHITE,
    fontSize: 14 * Sizes.ratioWidthScreen,
    fontFamily: Fonts.fontBold,
  },
  btnContainer: {
    width: Sizes.CUSTOM_SIZE(24),
    height: 38 * Sizes.ratioHeightScreen,
    borderRadius: 4,
    backgroundColor: Colors.PRIMARY,
    marginTop: 40 * Sizes.ratioHeightScreen,
  },
  bannerContainer: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    right: 5,
    height: 74 * Sizes.ratioHeightScreen,
    paddingHorizontal: 10 * Sizes.ratioWidthScreen,
    backgroundColor: Colors.warning,
    borderRadius: 4,
  },
  bannerTitle: {
    lineHeight: 17 * Sizes.ratioHeightScreen,
    fontSize: 14 * Sizes.ratioWidthScreen,
    fontFamily: Fonts.fontBold,
    color: 'white',
  },
  bannerDescription: {
    lineHeight: 15 * Sizes.ratioHeightScreen,
    fontSize: 12 * Sizes.ratioWidthScreen,
    fontFamily: Fonts.fontRegular,
    color: Colors.WHITE,
    textAlign: 'center',
    marginTop: 5 * Sizes.ratioHeightScreen,
  },
  textCustomFont: {
    fontFamily: Fonts.fontRegular,
    fontSize: 12 * Sizes.ratioWidthScreen,
    color: Colors.PRIMARY,
  },
  defaultContainer: {
    paddingVertical: 25 * Sizes.ratioWidthScreen,
    paddingHorizontal: Sizes.CUSTOM_SIZE(18),
    backgroundColor: Colors.transparent,
    flex: 0,
    paddingTop: 40 * Sizes.ratioHeightScreen,
  },
  secondContainer: {
    height: 35 * Sizes.ratioWidthScreen,
    maxWidth: 250 * Sizes.ratioWidthScreen,
  },
  thirdContainer: {
    justifyContent: 'flex-end',
    height: 35 * Sizes.ratioWidthScreen,
  },
  defaultTitle: {
    color: Colors.WHITE,
    fontFamily: Fonts.fontSemiBold,
    fontSize: 16 * Sizes.ratioWidthScreen,
    lineHeight: Sizes.CUSTOM_SIZE(18),
    height: Sizes.CUSTOM_SIZE(18),
  },
  defaultLeftComponent: {
    width: 100 * Sizes.ratioWidthScreen,
    height: 35 * Sizes.ratioWidthScreen,
    paddingRight: 50 * Sizes.ratioWidthScreen,
    padding: 5 * Sizes.ratioWidthScreen,
  },
  defaultContainerStyle: {
    padding: 10 * Sizes.ratioWidthScreen,
    height: 36 * Sizes.ratioHeightScreen,
    borderRadius: 4,
    borderColor: Colors.borderStone,
    borderWidth: Sizes.borderWidth,
  },
  defaultTitleInput: {
    color: Colors.charcoal05opacity,
    fontFamily: Fonts.fontSemiBold,
    fontSize: 14 * Sizes.ratioWidthScreen,
    lineHeight: Sizes.CUSTOM_SIZE(18),
    marginBottom: 10 * Sizes.ratioWidthScreen,
  },
  textInput: {
    fontFamily: Fonts.fontLight,
    fontSize: 12 * Sizes.ratioWidthScreen,
  },
  textInputContainer: {
    borderWidth: Sizes.borderWidth,
    borderColor: Colors.borderStone,
    borderRadius: 8,
    backgroundColor: Colors.WHITE,
  },
  errorMessage: {
    fontFamily: Fonts.fontItalic,
    fontSize: 12 * Sizes.ratioWidthScreen,
    color: Colors.vermilion,
  },
  labelText: {
    color: Colors.charcoal,
    fontFamily: Fonts.fontSemiBold,
    fontSize: 14 * Sizes.ratioWidthScreen,
  },
  defaultInputIcon: {
    height: 42 * Sizes.ratioHeightScreen,
    borderRadius: 8,
    borderColor: 'rgba(103, 103, 103, 0.4)',
    borderWidth: Sizes.borderWidth,
  },
  defaultTextInputIcon: {
    padding: 12,
    height: 42,
    flex: 1,
  },
  defaultImgInputIcon: {
    width: 15 * Sizes.ratioWidthScreen,
    height: 11 * Sizes.ratioWidthScreen,
    marginRight: 14,
  },
  defaultTextInputError: {
    padding: 12 * Sizes.ratioWidthScreen,
    paddingLeft: 14 * Sizes.ratioWidthScreen,
  },
  defaultInputNominal: {
    height: '100%',
    width: 45 * Sizes.ratioWidthScreen,
    backgroundColor: 'rgba(244, 244, 244, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 0.5,
    borderRightColor: Colors.smoke,
  },
  defaultTextNominal: {
    fontSize: 14,
    fontFamily: Fonts.fontSemiBold,
    color: 'rgba(0,0,0,0.65)',
  },
  defaultTextInputNominal: {
    padding: 12 * Sizes.ratioWidthScreen,
    paddingLeft: 14 * Sizes.ratioWidthScreen,
    width: 284 * Sizes.ratioWidthScreen,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  buttonDropDown: {
    justifyContent: 'center',
  },
  buttonTextDropDown: {
    fontSize: 12 * Sizes.ratioWidthScreen,
  },
  modalDropDown: {
    flexGrow: 1,
  },
  defaultDropdown: {
    position: 'absolute',
    height: (33 + StyleSheet.hairlineWidth) * 5 * Sizes.ratioWidthScreen,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'lightgray',
    borderRadius: 2,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  rowTextDropDown: {
    paddingHorizontal: 6 * Sizes.ratioWidthScreen,
    paddingVertical: 10 * Sizes.ratioWidthScreen,
    fontSize: 11 * Sizes.ratioWidthScreen,
    color: 'gray',
    backgroundColor: 'white',
    textAlignVertical: 'center',
  },
  highlightedRowText: {
    color: 'black',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'lightgray',
  },
  containerNoInternet: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(103,103,103,.6)',
  },
  modalContainerNoInternet: {
    padding: 32 * Sizes.ratioWidthScreen,
    paddingBottom: 82 * Sizes.ratioHeightScreen,
    width: 311 * Sizes.ratioWidthScreen,
    backgroundColor: 'white',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleNoInternet: {
    fontSize: Sizes.CUSTOM_SIZE(18),
    letterSpacing: 0.3,
    fontFamily: Fonts.fontSemiBold,
    color: Colors.PRIMARY,
    marginBottom: 24 * Sizes.ratioHeightScreen,
    marginTop: 27 * Sizes.ratioHeightScreen,
    textAlign: 'center',
  },
  bodyNoInternet: {
    width: Sizes.widthScreen - 130 * Sizes.ratioWidthScreen,
    height: 39 * Sizes.ratioHeightScreen,
  },
  descriptionNoInternet: {
    fontSize: 14 * Sizes.ratioWidthScreen,
    fontFamily: Fonts.fontRegular,
    color: Colors.charcoal,
    marginBottom: 22 * Sizes.ratioHeightScreen,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22 * Sizes.ratioHeightScreen,
  },
  buttonNoInternet: {
    height: 38 * Sizes.ratioHeightScreen,
    borderRadius: 4,
    width: Sizes.CUSTOM_SIZE(24),
    marginTop: 50 * Sizes.ratioHeightScreen,
  },
  buttonTextNoInternet: {
    color: Colors.WHITE,
    fontSize: 14 * Sizes.ratioWidthScreen,
    fontFamily: Fonts.fontSemiBold,
  },
  textReg14Charcoal: {
    fontSize: 14 * Sizes.ratioWidthScreen,
    fontFamily: Fonts.fontRegular,
    color: Colors.fontLabel,
    lineHeight: 24 * Sizes.ratioHeightScreen,
    letterSpacing: 0.3 * Sizes.ratioWidthScreen,
  },
  btnPopUp: {
    width: 115 * Sizes.ratioWidthScreen,
    marginTop: 0,
    height: 39 * Sizes.ratioHeightScreen,
  },
  btnPopUpAditional: {
    borderWidth: Sizes.borderWidth,
    backgroundColor: Colors.WHITE,
    borderColor: Colors.charcoal05opacity,
  },
  mainContainerPopUp: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    padding: 32 * Sizes.ratioWidthScreen,
    backgroundColor: 'rgba(103,103,103,.6)',
  },
  secondContainerPopUp: {
    borderRadius: 4,
    backgroundColor: Colors.WHITE,
    padding: 23 * Sizes.ratioWidthScreen,
    width: 311 * Sizes.ratioWidthScreen,
  },
  imgIllustrationPopUp: {
    width: 100 * Sizes.ratioWidthScreen,
    height: 100 * Sizes.ratioWidthScreen,
    marginBottom: 27 * Sizes.ratioHeightScreen,
  },
  textTitlePopUp: {
    fontSize: Sizes.CUSTOM_SIZE(18),
    letterSpacing: 0.3,
    fontFamily: Fonts.fontSemiBold,
    color: Colors.PRIMARY,
    marginBottom: 24 * Sizes.ratioHeightScreen,
    textAlign: 'center',
  },
  textDescPopUp: {
    fontSize: 14 * Sizes.ratioWidthScreen,
    fontFamily: Fonts.fontRegular,
    color: Colors.charcoal,
    marginBottom: 22 * Sizes.ratioHeightScreen,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22 * Sizes.ratioHeightScreen,
  },
  mainToastUp: {
    position: 'absolute',
    left: 0,
    top: 20,
    right: 0,
    justifyContent: 'center',
    borderRadius: 4,
    marginTop: 0 * Sizes.ratioWidthScreen,
    marginHorizontal: 10 * Sizes.ratioWidthScreen,
    zIndex: 999999,
    paddingVertical: Sizes.CUSTOM_SIZE(18),
    paddingHorizontal: 10 * Sizes.ratioWidthScreen,
  },
  mainTitleToastUp: {
    color: Colors.WHITE,
    fontFamily: Fonts.fontBold,
    fontSize: 14 * Sizes.ratioWidthScreen,
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  mainDescToastUp: {
    color: Colors.WHITE,
    fontFamily: Fonts.fontRegular,
    fontSize: 12 * Sizes.ratioWidthScreen,
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  defaultMainView: {
    flex: 1,
  },
  defaultStyle: {
    flex: 1,
    fontSize: 12 * Sizes.ratioWidthScreen,
  },
  textItalic: {
    fontStyle: 'italic',
  },
  textBold: {
    fontWeight: 'bold',
  },
  textCenter: {
    textAlign: 'center',
  },
  textUnderline: {
    textDecorationLine: 'underline',
  },
  unflex: {
    flex: 0,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    alignItems: 'center',
  },
  centering: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacebetween: {
    justifyContent: 'space-between',
  },
  right: {
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  left: {
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
  },
  absolute: {
    position: 'absolute',
  },
  shadow: {
    shadowColor: Colors.charcoal07opacity,
    shadowOffset: {
      width: 0,
      height: Sizes.borderWidth * Sizes.ratioWidthScreen,
    },
    shadowOpacity: 0.3 * Sizes.ratioWidthScreen,
    shadowRadius: 1 * Sizes.ratioWidthScreen,
    elevation: 1 * Sizes.ratioWidthScreen,
  },
  containerToolbar: {
    height: 50 * Sizes.ratioHeightScreen,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.PRIMARY,
  },
  title: {
    marginTop: 20 * Sizes.ratioHeightScreen,
    fontFamily: Fonts.fontSemiBold,
    color: 'white',
    fontSize: Sizes.CUSTOM_SIZE(14),
    letterSpacing: 0.34,
  },
  logo: {
    height: Sizes.CUSTOM_SIZE(24),
    width: 84 * Sizes.ratioWidthScreen,
    marginTop: 20 * Sizes.ratioHeightScreen,
  },
  leftMenuContainer: {
    padding: 8,
    marginTop: 20 * Sizes.ratioHeightScreen,
    width: 60 * Sizes.ratioWidthScreen,
  },
  rightMenuContainer: {
    padding: 8,
    marginTop: 20 * Sizes.ratioHeightScreen,
    width: 60 * Sizes.ratioWidthScreen,
  },
  tutorialHome: {
    justifyContent: 'center',
    marginBottom: -25 * Sizes.ratioWidthScreen,
    position: 'absolute',
    bottom: -15 * Sizes.ratioWidthScreen,
    left: 0,
    right: 0,
  },
  accessoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accessory: {
    position: 'absolute',
    right: 0,
    left: 0,
    backgroundColor: '#EFF0F1',
  },
  accessoryBorder: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.2)',
  },
  verticalDataTitleText: {
    fontFamily: Fonts.fontRegular,
    fontSize: 14 * Sizes.ratioWidthScreen,
    color: Colors.charcoal09opacity,
  },
  verticalDataDescriptionText: {
    fontFamily: Fonts.fontBold,
    fontSize: 14 * Sizes.ratioWidthScreen,
    color: Colors.charcoal,
    marginTop: 4 * Sizes.ratioHeightScreen,
  },
  listingCardContainer: {
    marginBottom: Sizes.SIZE_20,
    margin: Sizes.CUSTOM_SIZE(18),
    backgroundColor: Colors.WHITE,
    borderRadius: 5 * Sizes.ratioWidthScreen,
  },
  listingCardDetailContainer: {
    borderTopStartRadius: 4,
    paddingBottom: 30 * Sizes.ratioHeightScreen,
  },
  listingCardLogoContainer: {
    width: 100 * Sizes.ratioWidthScreen,
    height: 100 * Sizes.ratioWidthScreen,
    marginLeft: 25 * Sizes.ratioWidthScreen,
  },
  listingCardDataContainer: {
    flexDirection: 'row',
    marginTop: 20 * Sizes.ratioHeightScreen,
  },
  listingCardOptionContainer: {
    height: 40 * Sizes.ratioHeightScreen,
    flexDirection: 'row',
  },
  listingCardLeftButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  listingCardRightButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 4,
  },
  listingCardButtonTextContainer: {
    fontFamily: Fonts.fontSemiBold,
    fontSize: 14 * Sizes.ratioWidthScreen,
  },
  marginLeft24: {
    marginLeft: Sizes.CUSTOM_SIZE(24),
  },
  baseContainer: {
    backgroundColor: Colors.PRIMARY,
    flex: 1,
  },
  mainContainer: {
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 99,
  },
  secondContainerLoading: {
    backgroundColor: 'transparent',
    width: 200,
    height: 200,
    borderWidth: 1,
  },
  previewSign: {
    width: Sizes.widthScreen,
    height: 200 * Sizes.ratioWidthScreen,
    width: 200 * Sizes.ratioWidthScreen,
    backgroundColor: Colors.WHITE,
  },
  webBg: {
    width: '100%',
    backgroundColor: '#FFF',
    flex: 1,
    height: Sizes.heightScreen / 2,
  },
  // START TOOTBAR
  toolbarShadow: {
    shadowColor: Colors.charcoal07opacity,
    shadowOffset: {
      width: 0,
      height: Sizes.borderWidth * Sizes.ratioWidthScreen,
    },
    shadowOpacity: 0.3 * Sizes.ratioWidthScreen,
    shadowRadius: 1 * Sizes.ratioWidthScreen,
    elevation: Sizes.borderWidth * Sizes.ratioWidthScreen,
  },
  // END TOOLBAR
  // START DATEPICKER
  containerDatePickerStyle: {},
  viewDatePicker: {
    borderWidth: 1 * Sizes.ratioWidthScreen,
    borderRadius: 8 * Sizes.ratioWidthScreen,
  },
  iconDate: {
    paddingVertical: 9 * Sizes.ratioWidthScreen,
    paddingHorizontal: 12 * Sizes.ratioWidthScreen,
    borderRightWidth: 1 * Sizes.ratioWidthScreen,
    borderColor: Colors.borderStone,
  },
  dropDownIcon: {
    marginRight: 10 * Sizes.ratioWidthScreen,
    alignSelf: 'center',
  },
  customDate: {
    borderWidth: 0,
  },
  defaultDate: {
    flex: 1,
    borderWidth: 0,
  },
  defaultTextInput: {
    fontFamily: Fonts.fontSemiBold,
    fontSize: 14 * Sizes.ratioWidthScreen,
    color: Colors.borderStone,
    marginLeft: 16 * Sizes.ratioWidthScreen,
  },
  // END DATEPICKER
  //LOAN RATING
  ratingStyle: {
    fontFamily: Fonts.fontBold,
    fontSize: 14 * Sizes.ratioWidthScreen,
  },
  textLoading: {
    fontFamily: Fonts.fontRegular,
    fontSize: 14 * Sizes.ratioWidthScreen,
  },
});
