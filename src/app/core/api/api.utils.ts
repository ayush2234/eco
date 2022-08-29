// -----------------------------------------------------------------------------------------------------
// @ API UTILITIES
// -----------------------------------------------------------------------------------------------------
import {
  isString,
  isArray,
  isBoolean,
  isPlainObject,
  cloneDeep,
  isNull,
  isUndefined,
} from 'lodash';
import { ApiResponse } from './api.types';

export class ApiUtils {
  /**
   * Constructor
   */
  constructor() {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Convert object to ApiObject
   *
   * @param request
   */
  static toApiObject(request: any): any {
    // Return if there is no data
    if (!request) {
      return request;
    }

    // Convert all boolean properties to string value;
    const data = cloneDeep(request);

    Object.keys(data).forEach(key => {
      data[key] = this.sanitizeApiObject(data[key]);
    });

    return data;
  }

  /**
   * Convert object to ApiObject
   *
   * @param data
   */
  static toUiObject(response: ApiResponse<any>): any {
    // Return if there is no data
    if (!response) {
      return response;
    }

    const { data: responseData } = response;

    // Return if there is no data
    if (!responseData) {
      return response;
    }
    const data = cloneDeep(responseData);

    // Convert all string boolean properties to boolean;
    Object.keys(data).forEach(key => {
      data[key] = this.sanitizeUiObject(data[key]);
    });

    return { ...cloneDeep(response), data };
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Convert object to ApiObject
   *
   * @param request
   */
  private static sanitizeApiObject(data: any): any {
    if (isNull(data) || isUndefined(data)) {
      return data;
    }

    if (isPlainObject(data)) {
      Object.keys(data).map(key => {
        return (data[key] = this.sanitizeApiObject(data[key]));
      });
    }

    if (isArray(data)) {
      data = data.map(value => this.sanitizeApiObject(value));
    }

    if (isBoolean(data)) {
      data = data ? 'Y' : 'N';
    }

    return data;
  }

  /**
   * Convert object to ApiObject
   *
   * @param request
   */
  private static sanitizeUiObject(data: any): any {
    if (isNull(data) || isUndefined(data)) {
      return data;
    }

    if (isPlainObject(data)) {
      Object.keys(data).map(key => {
        return (data[key] = this.sanitizeUiObject(data[key]));
      });
    }

    if (isArray(data)) {
      data = data.map(value => this.sanitizeUiObject(value));
    }

    if (isString(data)) {
      switch (data.toLowerCase()) {
        case 'y':
          data = true;
          break;
        case 'n':
          data = false;
          break;
        default:
          break;
      }
    }

    return data;
  }
}
