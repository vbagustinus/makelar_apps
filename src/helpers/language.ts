import { getString } from './async';

export const getLanguages = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await getString('language');
      if (result !== null) {
        resolve(result);
      } else {
        const temp = 'id';
        resolve(temp);
      }
    } catch (error) {
      reject(error);
    }
  });
};
