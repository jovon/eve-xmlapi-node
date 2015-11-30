'use strict';

var utils = require('./utils');

export = _Error;

module _Error {  
  
  /**
  * Create subclass of internal Error klass
  * (Specifically for errors returned from Eve's XML API)
  */
  export class EveError extends Error{
    type: string;
    stack: any;
    rawType: any;
    code: any;
    param: any;
    detail: string;
    raw: any;
    requestId: any;
    statusCode: any;
    constructor(raw?: any) {  
      super()
      
      this.type = this.type || 'Generic';
      this.stack = (new Error(raw.message)).stack;
      this.rawType = raw.type;
      this.code = raw.code;
      this.param = raw.param;
      this.message = raw.message || 'Unknown';
      this.detail = raw.detail;
      this.raw = raw;
      this.requestId = raw.requestId;
      this.statusCode = raw.statusCode;      
    }        
  };  

  export class EveInvalidRequestError extends EveError{  
    constructor(raw: any) {
      super(raw)
      this.type = 'EveInvalidRequestError'
    }
  }
  
  export class EveAPIError extends EveError{  
    constructor(raw: any) {
      super(raw)
      this.type = 'EveAPIError'
    }
  }
}



