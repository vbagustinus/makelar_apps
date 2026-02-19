import axios from 'axios';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Values } from '../constants';
const isProduction = false;
const nrError = (_err: any) => {};

export default class ServiceModel {
  static type = 'service';
  baseURL: string;

  constructor(baseURL) {
    this.baseURL = baseURL || '';
    return this;
  }

  getHeaderAuth(token) {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async request(url, options) {
    if (!isProduction) {
      console.log('Making a request call', this.baseURL, url, options);
    }
    const {
      method = 'GET',
      params = {},
      data = null,
      headers = {},
      timeout = 30000,
      token = null,
      redirect = true,
    } = options;
    const abort = axios.CancelToken && axios.CancelToken.source();
    setTimeout(() => abort.cancel(`Timeout of ${timeout}ms.`), timeout);
    return axios({
      method,
      url,
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        'X-DEVICE-TYPE': Platform.OS,
        'X-APP-VERSION': DeviceInfo.getVersion(),
        'X-DEVICE-MODEL': DeviceInfo.getModel(),
        ...this.getHeaderAuth(token),
        ...headers,
      },
      data,
      params,
      timeout,
    })
      .then(response => {
        if (response.status < 200 && response.status > 208) {
          if (!isProduction) {
            console.log('SERVICE AXIOS GET ERROR', response.data);
          }
          throw response.status;
        } else {
          if (!isProduction) {
            console.log('GET SUCCESS', this.baseURL, url, response.data);
          }
          return {
            data: response.data,
            token: response.headers['x-inv-token'],
            crf: response.headers['x-inv-credential'],
          };
        }
      })
      .catch(err => {
        if (!isProduction) {
          console.log(
            'Getting Reject',
            this.baseURL,
            url,
            options,
            err.response ? err.response : err,
          );
        }
        const error = {
          data: {},
          meta: {
            code: 511,
            debugInfo: '',
            message: Values.networkerror,
          },
          status: 'error',
        };
        const errorNet = err.toString().includes(Values.networkerror);
        const errorTimeOut = err.toString().includes(Values.timeout);
        const errorStatus = err.response && err.response.status;
        const errorMessage =
          (err.response &&
            err.response.data &&
            err.response.data.meta &&
            err.response.data.meta.message) ||
          '';
        if (errorNet || errorTimeOut) {
          throw error;
        }
        if (err && err.code === 'ECONNABORTED') {
          throw err;
        }
        if (
          errorStatus &&
          errorStatus === 401 &&
          errorMessage.includes('expired')
        ) {
          // if (redirect) {
          //   navigationReset(0, [
          //     NavigationActions.navigate({
          //       routeName: Routes.login,
          //       params: {
          //         isExpired: true,
          //         openfrom: errorMessage,
          //       },
          //     }),
          //   ])
          // }
        }
        if (errorStatus && errorStatus < 500) {
          throw err.response.data;
        }
        if (err.response) {
          nrError(err);
          throw err.response;
        }
        if (err) {
          nrError(err);
          throw err;
        }
      });
  }

  get(url, options = {}) {
    return this.request(url, {
      method: 'GET',
      ...options,
    });
  }

  post(url, options) {
    return this.request(url, {
      method: 'POST',
      ...options,
    });
  }

  delete(url, options) {
    return this.request(url, {
      method: 'DELETE',
      ...options,
    });
  }

  put(url, options) {
    return this.request(url, {
      method: 'PUT',
      ...options,
    });
  }

  patch(url, options) {
    return this.request(url, {
      method: 'PATCH',
      ...options,
    });
  }
}
