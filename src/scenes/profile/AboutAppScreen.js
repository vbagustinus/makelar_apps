import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { BaseView, Text } from '../../components';
import { Colors, FontSize, Sizes } from '../../styles';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../constants';

export default function AboutAppScreen({ navigation: { pop } }) {
  const navigation = useNavigation();
  return (
    <BaseView
      onBackPress={pop}
      noshadow
      isScrollable
      title='About My Pigeon App'
      containerStyle={styles.container}
    >
      <StatusBar translucent backgroundColor='transparent' />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>About My Pigeon App</Text>

        <Text style={styles.text}>
          Welcome to{' '}
          <Text style={{ fontFamily: Fonts.fontSemiBold }}>My Pigeon</Text>, an
          app built to connect and empower pigeon enthusiasts around the world.
          We believe this hobby is more than just enjoyment—it’s about
          dedication, knowledge, and community. My Pigeon is here to support all
          of that, from tracking your pigeons’ data to helping you connect with
          fellow pigeon lovers worldwide.
        </Text>

        <Text style={styles.subtitle}>Key Features:</Text>
        <Text style={styles.bulletText}>
          1. **Pigeon Data Management**: Easily store and manage important data
          for each of your pigeons, including breed, lineage, genealogy, and
          performance history. The app helps you monitor your pigeons’ progress
          in detail.
        </Text>
        <Text style={styles.bulletText}>
          2. **Event & Competition Schedules**: Stay up to date with pigeon
          races and events happening around the world. Receive notifications so
          you never miss an important competition.
        </Text>
        <Text style={styles.bulletText}>
          3. **Community Forum**: Interact with pigeon enthusiasts globally,
          share tips and experiences, and discuss everything related to pigeon
          care, breeding, and training.
        </Text>
        <Text style={styles.bulletText}>
          4. **Gallery**: Upload and share stunning photos of your pigeons with
          the community. The gallery also serves as a visual portfolio for your
          birds.
        </Text>
        <Text style={styles.bulletText}>
          5. **Articles & Guides**: Access a growing library of exclusive
          articles and expert guides on pigeon care, training, and health from
          experienced breeders and hobbyists worldwide.
        </Text>
        <Text style={styles.bulletText}>
          6. **Search Feature**: Find pigeons by specific characteristics such
          as feather color, breed, or lineage, helping you locate relevant
          information quickly.
        </Text>

        <Text style={styles.subtitle}>Our Vision & Mission:</Text>
        <Text style={styles.text}>
          Our vision is to make{' '}
          <Text style={{ fontFamily: Fonts.fontSemiBold }}>My Pigeon</Text>
          the leading global platform that supports and develops the pigeon
          hobby community. Our mission is to provide innovative, user-friendly
          tools while fostering an active, supportive, and passionate worldwide
          community of pigeon lovers.
        </Text>

        <Text style={styles.subtitle}>User Support:</Text>
        <Text style={styles.text}>
          We’re always open to feedback and suggestions. If you have questions
          or need help, please contact our support team through the contact
          feature in the app. We’re committed to continuously improving
          <Text style={{ fontFamily: Fonts.fontSemiBold }}> My Pigeon</Text>
          to give you the best experience possible.
        </Text>
      </ScrollView>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f010',
  },
  content: {
    padding: 20 * Sizes.ratioWidthScreen,
  },
  sectionTitle: {
    color: Colors.WHITE,
    fontSize: FontSize.FONT_SIZE_16,
    fontFamily: Fonts.fontSemiBold,
    marginBottom: 10,
  },
  subtitle: {
    color: Colors.WHITE,
    fontSize: FontSize.FONT_SIZE_16,
    fontFamily: Fonts.fontSemiBold,
    marginTop: 20,
    marginBottom: 8,
  },
  text: {
    color: Colors.WHITE,
    fontSize: FontSize.FONT_SIZE_14,
    fontFamily: Fonts.fontRegular,
    lineHeight: 22,
    textAlign: 'justify',
  },
  bulletText: {
    color: Colors.WHITE,
    fontSize: FontSize.FONT_SIZE_14,
    fontFamily: Fonts.fontRegular,
    marginLeft: 10,
    lineHeight: 22,
    textAlign: 'justify',
  },
});
