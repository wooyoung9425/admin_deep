import { atom } from 'recoil';
import { UserInfo, VideoContents} from '../Type/type'
import {v4 as uuidv4} from "uuid"


let langState = atom<string>({
  key: 'langState',
  default: "ko"
})


let userState = atom<UserInfo>({
  key: 'userState',
  default: {email : "", name : "", phone : "", avatar : "", role : "" , id : -1, companyId : -1}
})

let VideoState = atom < VideoContents > ({
  key: 'VideoState',
  default: { no: 0, url : "", Video_name: "", start: "", end:"", reversal: [false, false],status : 0 }
})

let VideoList = atom<any>({
  key: 'ListState',
  default: []
})

let videoURL = atom < any > ({
  key: 'videoURL',
  default: {no: 0, url : ""}
})

let projectType = atom<any>({
  key: 'projectType',
  default: ""
})
let TimeSet = atom<any>({
  key:'TimeSet',
  default : { start:"", end:""}
})

let filmCount = atom<any>({
  key : 'filmCount',
  default: {
      FirstCamera: '',
      LastCamera:'',
      id:uuidv4(),         
  }  
})
let project_info = atom<any>({
  key: 'ProjectInfo',
  default:[]
})
let projectId = atom<any>({
  key: 'projectId',
  default : 0
})
export {langState, userState, VideoState, videoURL , VideoList, projectType, filmCount, TimeSet, project_info, projectId}

