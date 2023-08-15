import { ReturnValue } from './ReturnValue'

export class ReturnValues<T> extends ReturnValue {
    public data:T|null;

    constructor() {
        super();
        this.data = null;
    };
}

