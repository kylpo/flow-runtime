/* @flow */

import Type from './Type';
import type Validation, {IdentifierPath} from '../Validation';
import getErrorMessage from "../getErrorMessage";


/**
 * # ThisType
 * Captures a reference to a particular instance of a class or a value,
 * and uses that value to perform an identity check.
 * In the case that `this` is undefined, any value will be permitted.
 */
export default class ThisType<T> extends Type {
  typeName: string = 'ThisType';

  recorded: ? T;

  collectErrors (validation: Validation<any>, path: IdentifierPath, input: any): boolean {
    const {recorded} = this;
    if (input === recorded) {
      return false;
    }
    else if (typeof recorded === 'function' && input instanceof recorded) {
      return false;
    }
    else if (recorded != null) {
      validation.addError(path, this, getErrorMessage('ERR_EXPECT_THIS'));
      return true;
    }
    else {
      return false;
    }
  }

  accepts (input: any): boolean {
    const {recorded} = this;
    if (input === recorded) {
      return true;
    }
    else if (typeof recorded === 'function' && input instanceof recorded) {
      return true;
    }
    else if (recorded != null) {
      return false;
    }
    else {
      return true;
    }
  }

  compareWith (input: Type<any>): -1 | 0 | 1 {
    if (!(input instanceof ThisType)) {
      return -1;
    }
    else if (input.recorded && this.recorded) {
      return input.recorded === this.recorded ? 0 : -1;
    }
    else if (this.recorded) {
      return 0;
    }
    else {
      return 1;
    }
  }

  /**
   * Get the inner type.
   */
  unwrap (): Type<T> {
    return this;
  }

  toString (withBinding?: boolean): string {
    return 'this';
  }

  toJSON () {
    return {
      typeName: this.typeName,
    };
  }
}
