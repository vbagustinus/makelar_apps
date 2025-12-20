/**
 * Menyamarkan nomor telepon.
 * Contoh: +6285157212193 menjadi +6285xxxxx193
 * 4 digit awal (termasuk prefix internasional) dan 2 digit akhir dipertahankan.
 * @param {string | null | undefined} phoneNumber - Nomor telepon yang akan disamarkan.
 * @returns {string} - Nomor telepon yang telah disamarkan atau '-' jika kosong.
 */
export const maskPhoneNumber = phoneNumber => {
  if (!phoneNumber) {
    return '-';
  }

  try {
    // Regex: Tangkap 4 karakter pertama (\S{4}) dan 2 karakter terakhir (\d{2})
    const regex = /^(\S{4})(\d+)(\d{2})$/;

    if (!regex.test(phoneNumber)) {
      // Jika format tidak cocok (misalnya, terlalu pendek untuk disamarkan)
      return phoneNumber;
    }

    return phoneNumber.replace(regex, (match, prefix, middle, suffix) => {
      // Hitung jumlah karakter di bagian tengah dan ganti dengan 'x'
      const maskedMiddle = 'x'.repeat(middle.length);
      return `${prefix}${maskedMiddle}${suffix}`;
    });
  } catch (error) {
    // Tangani error yang tidak terduga (meskipun jarang terjadi pada string murni)
    console.error('Error saat menyamarkan nomor telepon:', error);
    return phoneNumber || '-';
  }
};

/**
 * Menyamarkan alamat email.
 * Contoh: vbagustinus@gmail.com menjadi vbxxxxxxxus@gmail.com
 * Dua karakter pertama dan dua karakter terakhir username, serta seluruh domain, dipertahankan.
 * @param {string | null | undefined} email - Alamat email yang akan disamarkan.
 * @returns {string} - Alamat email yang telah disamarkan atau '-' jika kosong.
 */
export const maskEmail = email => {
  if (!email) {
    return '-';
  }

  try {
    // Regex Baru:
    // 1. Tangkap 2 karakter pertama username ([a-zA-Z0-9]{2}) -> Group 1 (Prefix)
    // 2. Tangkap semua karakter di tengah ([a-zA-Z0-9._-]+?) -> Group 2 (Middle, diubah)
    // 3. Tangkap 2 karakter terakhir username ([a-zA-Z0-9._-]{2}) -> Group 3 (Suffix)
    // 4. Tangkap seluruh domain (@.*)$ -> Group 4 (Domain)
    const regex =
      /^([a-zA-Z0-9]{2})([a-zA-Z0-9._-]+?)([a-zA-Z0-9._-]{2})(?=@)(@.*)$/;

    if (!regex.test(email)) {
      // Jika format tidak cocok, kembalikan email asli.
      // Catatan: Ini berlaku untuk email dengan username kurang dari 5 karakter (2 prefix + 1 masked + 2 suffix)
      return email;
    }

    return email.replace(regex, (match, prefix, middle, suffix, domain) => {
      // Hitung jumlah karakter di bagian tengah (Group 2) dan ganti dengan 'x'
      const maskedMiddle = 'x'.repeat(middle.length);

      // Gabungkan: Prefix (vb) + Masked (xxxxxxx) + Suffix (us) + Domain (@gmail.com)
      return `${prefix}${maskedMiddle}${suffix}${domain}`;
    });
  } catch (error) {
    // Tangani error yang tidak terduga
    console.error('Error saat menyamarkan email:', error);
    return email || '-';
  }
};
