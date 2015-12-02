import Resource = require('../EveResource');
declare class MarketOrders extends Resource {
    fetch: ((err: Error, data: any) => void);
    constructor(eve: any);
}
export = MarketOrders;
