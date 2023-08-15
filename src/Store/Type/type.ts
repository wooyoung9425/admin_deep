import { Dispatch, SetStateAction } from "react"
import { Url } from "url"

interface Menubar {
  first : string,
  second : string,
  third : string,
  fourth : string,
  fifth : string,
  sixth : string
}

interface PMenubar {
  first : string,
  second : string,
  third : string,
}

interface LogInCheck{
  rightId : boolean, 
  rightPass : boolean
}

interface SignUpCheck{
  rightId : boolean, 
  rightPass : boolean,
  rightPassCheck : boolean,
  rightName : boolean,
  rightPhone : boolean
}


interface UserInfo{
  email : string | undefined | null,
  name : string | undefined | null,
  phone :string | undefined | null,
  avatar : string | undefined | null,
  role : string | undefined | null,
  id : number
  companyId : number
}

interface TransLang{
  ko : any,
  en : any
}

interface WordSet{
  [key : string] : TransLang
}

interface ProjectList{
    key : number,
    no: number,
    project_Type : string,
    title: string|any,
    construct: string,
    status: string,
    date: string,
    delete : any
  
}

interface SearchList{
    key : number,
    title: string,
    construct: string,
    status: string,
    date: string,
    delete : any
  
}

interface InputItem {
  id: number;
  title: string;
}
interface VideoContents {
    no: number; //카메라 번호
    url: Url|string; // 영상 url
    Video_name: string|any; //영상 이름
    start: string|any; //영상 편집 시작시간
    end: string; //영상편집 종료시간
    reversal: any; // [상하반전, 좌우반전]
    status: string | any; // [영상 업로드 프로그래스]
}

interface ProjectInpormationContents {
  key: number;
  no: number; //프로젝트 번호
  title: string|any; //프로젝트 이름
  type: string; // 시설물 종류
  date: string|any; //프로젝트 생성 날짜
  status: string | any; // 프로젝트 상태
}

interface ProjectMainDashboard {
  key: number;
  no: number; //프로젝트 번호
  task: string|any; //프로젝트 이름
  status: string | any; // 프로젝트 상태
  start: string; // 시작시간
  time: string|any; //소요시간
  
}

interface FilmSetCount {
  FirstCamera: any | string ;
  LastCamera: any | string;
  id: any | string;

}


export type {Menubar, PMenubar, UserInfo, LogInCheck, SignUpCheck, WordSet, TransLang, ProjectList, SearchList, InputItem, VideoContents, ProjectInpormationContents, ProjectMainDashboard, FilmSetCount}