export = _Error;
declare module _Error {
    class EveError extends Error {
        type: string;
        stack: any;
        rawType: any;
        code: any;
        param: any;
        detail: string;
        raw: any;
        requestId: any;
        statusCode: any;
        constructor(raw?: any);
    }
    class EveInvalidRequestError extends EveError {
        constructor(raw: any);
    }
    class EveAPIError extends EveError {
        constructor(raw: any);
    }
}
