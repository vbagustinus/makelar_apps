import React from 'react';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';
import { BaseView, Text } from '../../../components';
import { Colors, FontSize, Sizes } from '../../../styles';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../../constants';

export default function PrivacyScreen({ navigation: { pop } }) {
  const navigation = useNavigation();

  return (
    <BaseView
      onBackPress={pop}
      noshadow
      isScrollable
      title='My Pigeon Privacy Policy'
      containerStyle={styles.container}
    >
      <StatusBar translucent backgroundColor='transparent' />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Effective Date: January 1, 2025</Text>
        <Text style={styles.text}>
          Welcome to the My Pigeon mobile application ("App"). Your privacy is
          important to us. This Privacy Policy explains how we collect, use, and
          protect your personal information when you use our App and related
          services.
        </Text>

        <Text style={styles.subtitle}>1. Information We Collect</Text>
        <Text style={styles.text}>
          We may collect the following types of information when you use My
          Pigeon:
        </Text>
        <Text style={styles.bulletText}>
          • **Information You Provide:** When you register or use certain
          features, we may collect information such as your name, email address,
          country, and any details you enter about your pigeons (e.g., name,
          gender, color, eye color, lineage).
        </Text>
        <Text style={styles.bulletText}>
          • **Automatically Collected Information:** We may automatically
          collect non-personal data such as device information (model, operating
          system, device ID), IP address, app usage statistics, and crash logs.
        </Text>

        <Text style={styles.subtitle}>2. How We Use Your Information</Text>
        <Text style={styles.text}>The information we collect is used to:</Text>
        <Text style={styles.bulletText}>
          • Provide, maintain, and improve the functionality of the App.
        </Text>
        <Text style={styles.bulletText}>
          • Personalize your experience and enable features like profile
          management and pigeon data storage.
        </Text>
        <Text style={styles.bulletText}>
          • Communicate with you about important updates, bug fixes, or support
          requests.
        </Text>
        <Text style={styles.bulletText}>
          • Analyze usage patterns to improve performance and user experience.
        </Text>

        <Text style={styles.subtitle}>3. Third-Party Services</Text>
        <Text style={styles.text}>
          My Pigeon uses third-party services to provide authentication,
          analytics, and cloud data storage. These may include:
        </Text>
        <Text style={styles.bulletText}>
          • **Firebase (Google LLC):** Used for authentication, database, and
          analytics.
        </Text>
        <Text style={styles.bulletText}>
          • **Google Sign-In:** Used for secure and simplified login.
        </Text>
        <Text style={styles.text}>
          Please review their respective privacy policies for more information
          on how they manage your data.
        </Text>

        <Text style={styles.subtitle}>4. Data Storage and Transfers</Text>
        <Text style={styles.text}>
          Your information may be stored and processed on servers located in
          different countries (for example, Firebase servers). By using the App,
          you consent to the transfer of your information across international
          borders in accordance with this Privacy Policy.
        </Text>

        <Text style={styles.subtitle}>5. Data Security</Text>
        <Text style={styles.text}>
          We take reasonable technical and organizational measures to protect
          your data from unauthorized access, loss, misuse, or alteration.
          However, no internet transmission is completely secure, and we cannot
          guarantee absolute security.
        </Text>

        <Text style={styles.subtitle}>6. Your Rights</Text>
        <Text style={styles.text}>
          Depending on your location, you may have certain privacy rights:
        </Text>
        <Text style={styles.bulletText}>
          • Access, update, or delete your personal information.
        </Text>
        <Text style={styles.bulletText}>
          • Withdraw consent for certain data processing activities.
        </Text>
        <Text style={styles.bulletText}>
          • Request a copy of your stored data.
        </Text>
        <Text style={styles.bulletText}>
          • Object to data processing based on legitimate interests.
        </Text>

        <Text style={styles.subtitle}>7. GDPR Compliance (European Users)</Text>
        <Text style={styles.text}>
          If you are located in the European Economic Area (EEA), you have the
          right to request access, correction, or deletion of your personal
          data. You may also lodge a complaint with your local data protection
          authority if you believe your rights have been violated.
        </Text>

        <Text style={styles.subtitle}>
          8. CCPA Compliance (California Users)
        </Text>
        <Text style={styles.text}>
          California residents have the right to request information about the
          categories of personal data we collect, disclose, and the right to
          request deletion of their data. We do not sell your personal
          information to third parties.
        </Text>

        <Text style={styles.subtitle}>9. Children's Privacy</Text>
        <Text style={styles.text}>
          My Pigeon is not intended for children under the age of 13. We do not
          knowingly collect personal data from children. If we learn that we
          have collected such data, we will delete it promptly.
        </Text>

        <Text style={styles.subtitle}>10. Changes to This Policy</Text>
        <Text style={styles.text}>
          We may update this Privacy Policy from time to time. The updated
          version will be posted within the App and will include the new
          effective date. We encourage you to review this page periodically.
        </Text>

        <Text style={styles.subtitle}>11. Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions or concerns about this Privacy Policy or how
          we handle your information, please contact us at:
        </Text>
        <Text style={styles.bulletText}>📧 atahdeveloper@gmail.com</Text>
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
