(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var lR = ALLEX.execSuite.libRegistry;
lR.register('allex_formvalidationlib', require('./webindex')(ALLEX));

},{"./webindex":4}],2:[function(require,module,exports){
function createFormValidatorMixin (lib, mylib) {
  'use strict';

  function possiblyBuildRegExp (obj, val, name) {
    if (name === 'regex') {
      if (lib.isString(val)) {
        obj[name] = new RegExp(val);
      }
      if (val && 'object' === typeof val && 'string' in val && 'flags' in val && lib.isString(val.string)) {
        obj[name] = new RegExp(val.string, val.flags);
      }
    }
  }

  function possiblyBuildRegExps1 (val, name) {
    if ('object' !== typeof val) {
      return;
    }
    lib.traverseShallow(val, possiblyBuildRegExp.bind(null, val));
    val = null;
  }

  function possiblyBuildRegExps (obj) {
    if (!obj) {
      return;
    }
    lib.traverseShallow(obj, possiblyBuildRegExps1);
    obj = null;
  }

  function FormValidatorMixin (options) {
    this.validation = null;
    this.confirmationfields = null;
    this.set('validation', options ? options.validation : null);
    this.set('confirmationfields', options ? options.confirmationfields : null);
  }
  FormValidatorMixin.prototype.destroy = function () {
    this.confirmationfields = null;
    this.validation = null;
  };
  FormValidatorMixin.prototype.set_validation = function (validation) {
    var vld = lib.extend({}, validation);
    possiblyBuildRegExps(vld);
    this.validation = vld;
    return true;
  };
  FormValidatorMixin.prototype.validateFieldNameWithValue = function (fieldname, value) {
    var validation = this.validation,
      confirmationfields = this.confirmationfields,
      vld;
    if (lib.isVal(value) && confirmationfields && 'object' === typeof confirmationfields && fieldname in confirmationfields) {
      if (value !== this.data[confirmationfields[fieldname]]) {
        return false;
      }
    }
    if (!validation) return true;
    vld = validation[fieldname];

    if (!vld) return true;
    if (!this.validateValueWithJSON(vld.json_schema, value)) return false;
    if (!this.validateValueWithRegExp(vld.regex, value)) return false;
    return this.validateValueWithFunction(vld.custom, value);
  };
  FormValidatorMixin.prototype.validateValueWithJSON = function (schema, value) {
    if (!schema) return true;
    var result = lib.jsonschema.validate(value, schema);
    return !result.errors.length;
  };
  FormValidatorMixin.prototype.validateValueWithRegExp = function (regexp, value) {
    if (!regexp) return true;
    if (!(regexp instanceof RegExp)) return true;
    var result = regexp.test(value);
    //console.log('regexp', regexp, 'on', value, '=>', result);
    return result;
  };
  FormValidatorMixin.prototype.validateValueWithFunction = function (f, value) {
    if (!lib.isFunction (f)) return true;
    return f(value, this.data);
  };


  FormValidatorMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, FormValidatorMixin
      ,'set_validation'
      ,'validateFieldNameWithValue'
      ,'validateValueWithJSON'
      ,'validateValueWithRegExp'
      ,'validateValueWithFunction'
    );
  };

  mylib.FormValidator = FormValidatorMixin;
}
module.exports = createFormValidatorMixin;

},{}],3:[function(require,module,exports){
function createMixins (execlib) {
  'use strict';

  var lib = execlib.lib,
    ret = {};

  require('./formvalidatorcreator')(lib, ret);

  return ret;
};
module.exports = createMixins;

},{"./formvalidatorcreator":2}],4:[function(require,module,exports){
function createWebLib (execlib) {
  'use strict';

  return {
    mixins: require('./mixins')(execlib)
  };
}
module.exports = createWebLib;

},{"./mixins":3}]},{},[1]);
