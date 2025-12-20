import aesjs from 'aes-js';
import * as lodash from 'lodash';
import { Defaults, Values, Colors } from '../constants';
import { monthList } from './index';

export const _forceNumber = value =>
  value ? value && value.replace(/[^0-9]/g, '') : '';

export const helperCurrency = (number, haveCurrency = false) => {
  if (!number || isNaN(number)) {
    return '0';
  }
  if (!!(number % 1)) {
    number = Math.round(number);
  }
  let regex = /\./g;

  const currency = haveCurrency ? 'Rp. ' : '';
  return `${currency}${number
    .toString()
    .replace(regex, '')
    .replace(/(\d)(?=(\d{3})+$)/g, '$1' + '.')}`;
};

export const _helperNpwp = value => {
  if (!value) {
    return '';
  }
  return value
    .toString()
    .replace(/(\d{2})(\d{3})(\d{3})(\d{1})(\d{3})(\d{3})/, '$1.$2.$3.$4-$5.$6');
};

export const removeMillionFormat = number => {
  // Nine Zeroes for Billions // Six Zeroes for Millions // Three Zeroes for Thousands
  return !number
    ? [0, '']
    : Math.abs(Number(number)) >= 1.0e9
    ? [Math.abs(Number(number)) / 1.0e9, 'b']
    : Math.abs(Number(number)) >= 1.0e6
    ? [Math.abs(Number(number)) / 1.0e6, 'm']
    : Math.abs(Number(number)) >= 1.0e3
    ? [Math.abs(Number(number)) / 1.0e3, 'k']
    : [Math.abs(Number(number)), ''];
};

// get precentace loan
export const getPercentageChange = (loan, balance) => {
  if (!loan || !balance) {
    return 0;
  }
  const diferences = +loan - (+loan - +balance);
  return diferences / +loan;
};

export const projectionForKonventional = (
  tenor,
  loanGrade,
  loanAmount,
  nominalFunding,
) => {
  if (!tenor || !loanGrade || !loanAmount || !nominalFunding) {
    return 0;
  }
  const imbalBalikTmp = (tenor / 12) * (loanGrade / 100) * loanAmount;
  const imbalBalik = imbalBalikTmp * (nominalFunding / loanAmount);
  return parseInt(+imbalBalik > 0 ? imbalBalik : 0);
};

export const projectionForSyariah = (
  tenor,
  loanGrade,
  invoiceAmount,
  loanAmount,
  nominalFunding,
) => {
  if (
    !tenor ||
    !loanGrade ||
    !invoiceAmount ||
    !loanAmount ||
    !nominalFunding
  ) {
    return 0;
  }
  // rumus: (tenor / 12) * (loanGrade/100) * (loanAmount/invoiceAmount) * invoiceAmount
  // invoiceAmount => 100%
  // loanAmount => 80%
  const ujrahTmp =
    (tenor / 12) *
    (loanGrade / 100) *
    (loanAmount / invoiceAmount) *
    invoiceAmount;
  const totalPengembalian = ujrahTmp * (nominalFunding / loanAmount);
  return parseInt(+totalPengembalian > 0 ? totalPengembalian : 0, 10);
};

export const checkFundingNominalOd = value => {
  if (!value) {
    return false;
  }
  const regex = /^[0-9]*$/gm;
  const result = regex.test(value / 1000000);
  return result;
};

export const setInitialName = value => {
  if (!value) {
    return '';
  }
  let initials = (value && value.match(/\b\w/g)) || [];
  initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  return initials;
};

export const setFirstName = value => {
  if (!value) {
    return '';
  }
  return value.split(' ')[0];
};

export const getInitials = (name, param) => {
  if (name) {
    const array = name.split(param);
    if (array.length > 1) {
      if (array[1].length === 0) {
        return array[0].slice(0, 4).toUpperCase().trim();
      }
      return array[1].slice(0, 4).toUpperCase().trim();
    }
    return array[0].slice(0, 4).toUpperCase().trim();
  }
  return '';
};

export const getGradeandColor = loanRating => {
  const rate = (loanRating && loanRating.split()[0][0]) || '';
  let color = '';
  let grade = loanRating;
  switch (rate) {
    case 'A':
      color = Colors.greenlight;
      break;
    case 'B':
      color = Colors.orangelight;
      break;
    case 'C':
      color = Colors.redlight;
      break;
    default:
      color = Colors.gray;
      grade = 'N/A';
      break;
  }
  return { color, grade };
};

export const nameSBNManipulation = str =>
  (str && str.slice(0, 2).toLowerCase()) || '';

export const getSBNPrefix = (preference, tradability) => {
  let prefix = Values.sbr.toLowerCase();
  if (preference === Values.sbnsharia && !tradability) {
    prefix = Values.st.toLowerCase();
  } else if (tradability) {
    prefix =
      preference === Values.sbnsharia
        ? Values.sr.toLowerCase()
        : Values.ori.toLowerCase();
  }
  return prefix;
};

export const getStatusSBN = idStatus => {
  switch (+idStatus) {
    case 0:
      return 'Pending';
    case 1:
      return 'Confirm';
    case 2:
      return 'Reject';
    case 3:
      return 'Verified Order';
    case 4:
      return 'Completed Order';
    case 5:
      return 'Unpaid Order';
    default:
      return '';
  }
};

export const encrypt = value => {
  const textBytes = aesjs.utils.utf8.toBytes(JSON.stringify(value));
  const AesCtr = new aesjs.ModeOfOperation.ctr(
    Defaults.SECRETKEY,
    new aesjs.Counter(6),
  );
  const encryptedBytes = AesCtr.encrypt(textBytes);
  return aesjs.utils.hex.fromBytes(encryptedBytes);
};

export const decrypt = value => {
  const encryptedBytes = aesjs.utils.hex.toBytes(value);
  const AesCtr = new aesjs.ModeOfOperation.ctr(
    Defaults.SECRETKEY,
    new aesjs.Counter(6),
  );
  const decryptedBytes = AesCtr.decrypt(encryptedBytes);
  return aesjs.utils.utf8.fromBytes(decryptedBytes);
};

export const isStringEmpty = (value, defaultValue) => {
  if (value) {
    return value;
  } else {
    return defaultValue;
  }
};

export const removeNonNumericCharacter = value => value.replace(/\D/g, '');

export const splitArray = (array, size) => {
  const result = [];
  if (!array || !size) {
    return result;
  }
  array.forEach(item => {
    const last = result[result.length - 1];
    if (!last || last.length === size) {
      result.push([item]);
    } else {
      last.push(item);
    }
  });
  return result;
};

export const _findIndex = (lists, id) => {
  if (!lists) {
    return -1;
  }
  return lists.findIndex(x => x.id === id);
};

export const removeDashFromStrNumber = number =>
  number ? number.replace(/-/g, '') : '';

export const removeSpaceString = str => {
  if (!str) {
    return '';
  }
  return str.trim();
};

export const getFundingMethodNamebyType = fundingType =>
  fundingType === Values.isNumZero
    ? 'CIH'
    : fundingType === Values.isNumOne
    ? 'RDL'
    : 'RD';

export const lenderTypeStatus = (pmpStatusKonven, pmpStatusSyariah) => {
  const onlyConven =
    (pmpStatusKonven === Values.available ||
      pmpStatusKonven === Values.pending) &&
    pmpStatusSyariah === Values.unavailable;
  const onlySharia =
    (pmpStatusSyariah === Values.available ||
      pmpStatusSyariah === Values.pending) &&
    pmpStatusKonven === Values.unavailable;
  const convenSharia =
    ((pmpStatusKonven === Values.available ||
      pmpStatusKonven === Values.pending) &&
      pmpStatusSyariah !== Values.unavailable) ||
    ((pmpStatusSyariah === Values.available ||
      pmpStatusSyariah === Values.pending) &&
      pmpStatusKonven !== Values.unavailable);
  return {
    onlyConven,
    onlySharia,
    convenSharia,
  };
};

export const historyGroupByMonth = data => {
  let result = [];
  if (typeof data === 'object') {
    const tmpHistories = lodash.groupBy(data, item => {
      const dateParam = item && item.transactionDate.replace(/ /g, 'T');
      const date = dateParam ? new Date(Date.parse(dateParam)) : new Date();
      return monthList(date.getMonth()) + ' ' + date.getFullYear();
    });
    result = Object.keys(tmpHistories).map(historyMonth => {
      let newData = [];
      tmpHistories[historyMonth] &&
        tmpHistories[historyMonth].forEach(history => {
          newData.push({
            id: history.id || 0,
            title: history.transactionType.text || '',
            type: history.transactionType.id || '',
            date: history.transactionDate || new Date(),
            amount: history.amount.plain || 0,
            amountformatted: history.amount.formatted || '',
            payment: history.transactionSource.text || '',
            paymenttype: history.transactionSource.type || '',
            note: history.note || '',
          });
        });
      return {
        title: historyMonth,
        data: newData,
      };
    });
  }
  return result;
};
export const loanTypeInitial = type =>
  type === Values.isNumSharia ? 'S' : type === Values.isStrOne ? 'K' : '';

export const dateNumberToWord = newdate => {
  // ex: 2121/02/02 => 2 February 2021
  const date = new Date(Date.parse(newdate));
  return (
    date.getDate() + ' ' + monthList(date.getMonth()) + ' ' + date.getFullYear()
  );
};

export const statusAccount = status =>
  status.toLowerCase() === Values.statusVerified
    ? 'Verified'
    : status.toLowerCase() === Values.statusUnverified
    ? 'Unverified'
    : status.toLowerCase() === Values.statusWaitVerified
    ? 'Waiting'
    : '';

export const loanTypeInitialSpecialCase = type =>
  type === Values.isNumConven
    ? 'K'
    : type === Values.isNumSharia
    ? 'S'
    : type === Values.isNumConvenSharia
    ? 'KS'
    : '';

export const stringLimitation = (value, length = 0) => {
  if (!value) {
    return '';
  }
  if (value.toString().length < length) {
    return value.toString();
  }
  return value.toString().substring(0, length) + '..';
};

export const maskPhoneNumber = phonenumber => {
  if (isNaN(phonenumber)) {
    return;
  }
  const phone = '+' + phonenumber;
  const lastnumber = phonenumber.length - 6;
  return (
    '+' +
    phonenumber.substr(0, 4) +
    '-' +
    phonenumber.substr(4, 4) +
    '-' +
    phonenumber.substr(8, lastnumber).replace(/[0-9]/g, 'x')
  );
};

export const isNPWP = num => {
  return num.length < 15 || num.length > 20;
};
