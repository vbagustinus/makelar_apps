import { useMemo } from 'react';
import { propertyStatuses } from '../constants';

const normalizeValue = value => {
  if (!value) {
    return '';
  }
  if (Array.isArray(value)) {
    return value
      .map(val =>
        typeof val === 'object'
          ? val.name || val.label || val.value || ''
          : String(val),
      )
      .filter(Boolean)
      .join(', ');
  }
  if (typeof value === 'object') {
    return value.name || value.label || value.value || value.displayName || '';
  }
  return String(value);
};

export const formatPrice = value => {
  if (!value) return '-';
  const numeric = Number(String(value).replace(/[^0-9]/g, ''));
  if (Number.isNaN(numeric)) return value;
  return `Rp ${numeric.toLocaleString('id-ID')}`;
};

const getStatusMeta = (statusId, colors) => {
  const found = propertyStatuses.find(s => s.id === statusId);
  return {
    label: found?.name || 'Status',
    color: found?.color || colors.PRIMARY,
  };
};

export const usePropertyDetail = (item, colors) => {
  const images = useMemo(() => {
    if (item?.imageUrls && item?.imageUrls.length > 0) {
      return item.imageUrls;
    }
    if (item?.images && item?.images.length > 0) {
      return item.images;
    }
    if (item?.imageUrl) {
      return [item.imageUrl];
    }
    return [];
  }, [item]);

  const previewImages = useMemo(
    () => images.map(uri => ({ url: uri })),
    [images],
  );

  const statusMeta = useMemo(
    () => getStatusMeta(item?.statusId || item?.status?.id, colors),
    [item?.statusId, item?.status?.id, colors],
  );

  const featureCards = useMemo(
    () =>
      [
        item?.bedrooms
          ? {
              icon: 'bed-king-outline',
              label: `${normalizeValue(item?.bedrooms)} Kamar`,
            }
          : null,
        item?.bathrooms
          ? {
              icon: 'shower',
              label: `${normalizeValue(item?.bathrooms)} Kamar Mandi`,
            }
          : null,
        item?.buildingArea
          ? {
              icon: 'home-floor-1',
              label: `${normalizeValue(item?.buildingArea)} m2 Bangunan`,
            }
          : null,
        item?.landArea
          ? {
              icon: 'ruler-square',
              label: `${normalizeValue(item?.landArea)} m2 Tanah`,
            }
          : null,
        item?.floors
          ? {
              icon: 'stairs',
              label: `${normalizeValue(item?.floors)} Lantai`,
            }
          : null,
        item?.garage
          ? {
              icon: 'car',
              label: `${normalizeValue(item?.garage)} Garasi`,
            }
          : null,
        item?.electricPower
          ? {
              icon: 'lightning-bolt',
              label: `${normalizeValue(item?.electricPower)} VA`,
            }
          : null,
      ].filter(Boolean),
    [
      item?.bathrooms,
      item?.bedrooms,
      item?.buildingArea,
      item?.floors,
      item?.garage,
      item?.landArea,
      item?.electricPower,
    ],
  );

  const additionalSpecs = useMemo(() => {
    const specs: Array<{ label: string; value: string }> = [];

    if (item?.builtYear)
      specs.push({
        label: 'Tahun Dibangun',
        value: normalizeValue(item?.builtYear),
      });
    if (item?.renovationYear)
      specs.push({
        label: 'Tahun Renovasi',
        value: normalizeValue(item?.renovationYear),
      });
    if (item?.facing)
      specs.push({ label: 'Hadap', value: normalizeValue(item?.facing) });
    if (item?.furnished)
      specs.push({
        label: 'Furnished',
        value: normalizeValue(item?.furnished),
      });
    if (item?.waterSource)
      specs.push({
        label: 'Sumber Air',
        value: normalizeValue(item?.waterSource),
      });
    if (item?.roadWidth)
      specs.push({
        label: 'Lebar Jalan',
        value: `${normalizeValue(item?.roadWidth)} m`,
      });
    if (item?.carAccess)
      specs.push({
        label: 'Akses Mobil',
        value: normalizeValue(item?.carAccess),
      });
    if (item?.condition)
      specs.push({ label: 'Kondisi', value: normalizeValue(item?.condition) });
    if (item?.environmentType)
      specs.push({
        label: 'Lingkungan',
        value: normalizeValue(item?.environmentType),
      });
    if (item?.monthlyFee)
      specs.push({
        label: 'Iuran Bulanan',
        value: formatPrice(normalizeValue(item?.monthlyFee)),
      });
    if (item?.imbNumber)
      specs.push({ label: 'No. IMB', value: normalizeValue(item?.imbNumber) });
    if (item?.legalOwnerName)
      specs.push({
        label: 'Nama di Sertifikat',
        value: normalizeValue(item?.legalOwnerName),
      });

    if (item?.tower)
      specs.push({ label: 'Tower', value: normalizeValue(item?.tower) });
    if (item?.floorNumber)
      specs.push({
        label: 'Lantai Ke',
        value: normalizeValue(item?.floorNumber),
      });
    if (item?.unitNumber)
      specs.push({
        label: 'No. Unit',
        value: normalizeValue(item?.unitNumber),
      });
    if (item?.unitType)
      specs.push({ label: 'Tipe Unit', value: normalizeValue(item?.unitType) });
    if (item?.maintenanceFee)
      specs.push({
        label: 'Biaya IPL',
        value: formatPrice(normalizeValue(item?.maintenanceFee)),
      });
    if (item?.balcony)
      specs.push({ label: 'Balkon', value: normalizeValue(item?.balcony) });
    if (item?.apartmentFacilities)
      specs.push({
        label: 'Fasilitas Apt',
        value: normalizeValue(item?.apartmentFacilities),
      });

    if (item?.landShape)
      specs.push({
        label: 'Bentuk Tanah',
        value: normalizeValue(item?.landShape),
      });
    if (item?.frontageWidth)
      specs.push({
        label: 'Lebar Depan',
        value: `${normalizeValue(item?.frontageWidth)} m`,
      });
    if (item?.zoning)
      specs.push({ label: 'Zoning', value: normalizeValue(item?.zoning) });
    if (item?.contour)
      specs.push({ label: 'Kontur', value: normalizeValue(item?.contour) });
    if (item?.roadType)
      specs.push({
        label: 'Tipe Jalan',
        value: normalizeValue(item?.roadType),
      });

    if (item?.buildingWidth)
      specs.push({
        label: 'Lebar Bangunan',
        value: `${normalizeValue(item?.buildingWidth)} m`,
      });
    if (item?.buildingLength)
      specs.push({
        label: 'Panjang Bangunan',
        value: `${normalizeValue(item?.buildingLength)} m`,
      });
    if (item?.parkingSpace)
      specs.push({
        label: 'Parkir',
        value: `${normalizeValue(item?.parkingSpace)} m2`,
      });
    if (item?.restroomCount)
      specs.push({
        label: 'Kamar Mandi',
        value: normalizeValue(item?.restroomCount),
      });
    if (item?.electricityType)
      specs.push({
        label: 'Tipe Listrik',
        value: normalizeValue(item?.electricityType),
      });
    if (item?.businessSuitableFor)
      specs.push({
        label: 'Cocok Untuk',
        value: normalizeValue(item?.businessSuitableFor),
      });

    if (item?.officeType)
      specs.push({
        label: 'Tipe Kantor',
        value: normalizeValue(item?.officeType),
      });
    if (item?.meetingRoomCount)
      specs.push({
        label: 'R. Meeting',
        value: normalizeValue(item?.meetingRoomCount),
      });
    if (item?.workspaceCapacity)
      specs.push({
        label: 'Kapasitas',
        value: `${normalizeValue(item?.workspaceCapacity)} orang`,
      });
    if (item?.pantry)
      specs.push({ label: 'Pantry', value: normalizeValue(item?.pantry) });
    if (item?.toiletType)
      specs.push({
        label: 'Tipe Toilet',
        value: normalizeValue(item?.toiletType),
      });

    if (item?.totalRooms)
      specs.push({
        label: 'Total Kamar',
        value: normalizeValue(item?.totalRooms),
      });
    if (item?.occupiedRooms)
      specs.push({
        label: 'Kamar Terisi',
        value: normalizeValue(item?.occupiedRooms),
      });
    if (item?.roomFacilities)
      specs.push({
        label: 'Fasilitas Kamar',
        value: normalizeValue(item?.roomFacilities),
      });
    if (item?.bathroomInside)
      specs.push({
        label: 'K. Mandi Dalam',
        value: normalizeValue(item?.bathroomInside),
      });
    if (item?.incomePerMonth)
      specs.push({
        label: 'Pendapatan/Bln',
        value: formatPrice(normalizeValue(item?.incomePerMonth)),
      });
    if (item?.rules)
      specs.push({ label: 'Aturan', value: normalizeValue(item?.rules) });

    if (item?.ceilingHeight)
      specs.push({
        label: 'Tinggi Atap',
        value: `${normalizeValue(item?.ceilingHeight)} m`,
      });
    if (item?.loadingDock)
      specs.push({
        label: 'Loading Dock',
        value: normalizeValue(item?.loadingDock),
      });
    if (item?.truckAccess)
      specs.push({
        label: 'Akses Truk',
        value: normalizeValue(item?.truckAccess),
      });
    if (item?.powerCapacity)
      specs.push({
        label: 'Kapasitas Daya',
        value: `${normalizeValue(item?.powerCapacity)} KVA`,
      });
    if (item?.floorStrength)
      specs.push({
        label: 'Kekuatan Lantai',
        value: `${normalizeValue(item?.floorStrength)} ton/m2`,
      });

    return specs;
  }, [item]);

  return {
    images,
    previewImages,
    statusMeta,
    featureCards,
    additionalSpecs,
    formatPrice,
    extractValue: normalizeValue,
  };
};
