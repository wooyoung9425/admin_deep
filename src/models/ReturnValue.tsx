export class ReturnValue {
    public check:boolean;
    public code:Number;
    public value:string;
    public message:string;

    constructor() {
        this.check = false;
        this.code = -1;
        this.value = "";
        this.message = "";
    };

    Success = (_code:Number):void => {
        this.check = true;
        this.code = _code;
    };

    Error = (msg:string):void => {
        this.check = false;
        this.code = -1;
        this.message = msg;
    };
}