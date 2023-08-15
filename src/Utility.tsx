// import MessageBox from './MessageBox';
import Moment from 'moment';
import { Cookies } from "react-cookie";

const cookies = new Cookies();

//공통적으로 사용되는 함수 모음
const Utility = {
    IsNullOrEmpty : function(str?:string|undefined):boolean {
        let result:boolean = true;

        try {
            if (str === null || str === undefined) {
                result = true;
            } else {
                if (str.trim() === "") {
                    result = true;
                } else {
                    result = false;
                }
            }
        } catch (e) {
            result = true;
        }

        return result;
    },
    RemoveTag : function(str:string):string {
        let result:string = "";
        let extractTextPattern = /(<([^>]+)>)/gi;
        result = str.replace(extractTextPattern, '');
        return result;
    },
    Move : function(url:string):void {
        document.location.href = url;
    },
    HasClass : function(target:HTMLElement, findClass:string):boolean {
        let result:boolean = false;
        if (target !== null && target !== undefined) {
            for(let i = 0; i < target.classList.length; i++) {
                if (target.classList[i] === findClass) {
                    result = true;
                    break;
                }
            }
        }

        return result;
    },
    AddClass : function(target:HTMLElement, findClass:string):boolean {
        let result:boolean = false;
        if (target !== null && target !== undefined) {
            if (!this.HasClass(target, findClass)) {
                target.classList.add(findClass);
            }
        }

        return result;
    },
    RemoveClass : function(target:HTMLElement, findClass:string):boolean {
        let result:boolean = false;
        if (target !== null && target !== undefined) {
            if (this.HasClass(target, findClass)) {
                target.classList.remove(findClass);
            }
        }

        return result;
    },
    ToggleClass : function(target:HTMLElement, findClass:string):boolean {
        let result:boolean = false;
        if (target !== null && target !== undefined) {
            if (this.HasClass(target, findClass)) {
                target.classList.remove(findClass);
            } else {
                target.classList.add(findClass);
            }
        }

        return result;
    },
    Focus : function(targetID:string):void {
        let target = document.getElementById(targetID) as HTMLElement;
        if (target !== null && target !== undefined) {
            setTimeout(function() {
                target.focus();
            }, 600);
        }
    },
    DateString: function(dt:Date, format:string):string {
        Moment.locale('ko');
        return Moment(dt).format(format);
    },
    ForEach : function(start:number, end:number, upcase:number):any {
        var result:any = [];

        for(let i = start; i < end; i += upcase) {
            result.push(i);
        }

        return result;
    },
    EachFind : function(arr:[], index:number, column:string):any {
        if (arr !== null && arr !== undefined && arr.length > index) {
            console.log(arr);
            console.log(arr[index]);
            return arr[index][column];
        } else {
            return null;
        }
    },
    setCookie:function(name:string, value:string, option?:any):void {
        cookies.set(name, value, { ...option });
    },
    removeCookie:function(name:string, option?:any):void {
        cookies.remove(name, { ...option });
    },
    getCookie:function(name:string):string {
        return cookies.get(name);
    }
};

export default Utility;
