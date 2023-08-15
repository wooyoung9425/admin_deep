import { useEffect, useState } from 'react';
import styles from '../../../Styles/XAI.module.css'
import { langState } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import { useRecoilState } from 'recoil';
import { Button, Select, Slider, Table, Input } from 'antd';
import { API_URL, IMAGE_URL } from '../../../Store/Global';
import axios from 'axios';

interface Image {
    num: string;
    folderName: string;
    imageURL: Array<string>;
    cnt:Number
}
interface CNT {
    camera_number : string;
    cnt : number;
}

interface Copy {
    input_folder : string;
    output_folder: string;
    choice_model: string;
    cls_model: string;
    choice_dic: string;
    fsize: number;
}
interface Image_folder {
        typeFolderName : string;
        SubFolderName : string;
}
const { Option } = Select;
export default function Bridge_Captioning() {
    let Newarr:any[] = [];
    
    const images : Image [] = [];
    const cnt : CNT [] = [];
    const folder_copy: Copy[] = [];
    
    const project_Type = localStorage.getItem("project_Type")
    const setting :any = localStorage.getItem("settings")
    const typeArr = JSON.parse(setting).bridge_type
    const GirderCount : any = JSON.parse(setting).girder_count
    let job_id = 0;
        
    const [BridgeType, setBridgeType] = useState<string>("");
    const [bridge_type_name, setBridgeTypeName]=useState<string>("")
    const [SelectOption, setSelectOption] = useState<string>("")
    const [confirmOption, setConfirmOption] = useState<boolean>(false);
    const [spanNumber,setSpanNumber] =useState([])
    const [pierNumber,setPierNumber] =useState([])
    const [optionCount, setOptionCount] = useState([])

    const [userid, setUserId] = useState<number>(-1);
    const [companyid, setCompanyId] = useState<number>(-1);
  
    useEffect(() => {
        let getIdCompany = async () => {
          if (token !== null) {
            console.log("여기 들어옴?");
            console.log("프로젝트ID" + project_id);
            const response = await axios({
              method: "get",
              url: `${API_URL}/account/auth/check/${token}`,
            })
              .then(async (res) => {
                if (res.data.check === true) {
                  setUserId(res.data.data.id)
                  setCompanyId(res.data.data.companyId)
                  // localStorage.set("project_id", id);
                  console.log(
                    `아이디는 다음과 같음 : ${res.data.data.id} / 회사는 다음과 같음 : ${res.data.data.companyId}`
                  );
                  return {
                    email: res.data.data.email,
                    name: res.data.data.name,
                    phone: res.data.data.phone,
                    avatar: res.data.data.avatar,
                    role: res.data.data.role,
                    id: res.data.data.id,
                    companyId: res.data.data.companyId,
                  };
                } else {
                  console.log("토큰 만료");
                  localStorage.removeItem("token");
                  alert("토큰이 만료었습니다 다시 로그인 해주세요");
                  window.location.replace("/Main");
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        };
        getIdCompany();
      }, []);


    const [folderName, setFolderName] = useState<Image_folder>({ typeFolderName: "", SubFolderName: ""})
    typeArr.map((type: String, index: number) => {
        if (type === 'Girder') {
            for (let i = 0; i < 1; i++){
                images.push({ 
                num: '선택해주세요', 
                folderName:'구역을 선택해주세요.', 
                imageURL: [],
                cnt:0,
                })
            
        cnt.push({
            camera_number :  'G'+String(i+1).padStart(2,'0'), 
            cnt : 0})
            }
        }
    })
    
    const [model, setModel]=useState('')
    const [Fsize, setFsize] =useState(100)
    const [word, setWord] = useState('')
    const [cls, setCls] = useState("")
    
    
    

    const [ImgList, setImgList] = useState<any[]>(images);


    const [finalCNT, setFinalCNT] = useState<any[]>(cnt);

    let token : string | null = localStorage.getItem("token") 
    let project_id : string | null = localStorage.getItem("project_id")

    
    const [result, setResult] = useState<boolean>(false)

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    const { Column } = Table;
    let [fileArr,setFileArr] = useState<any>([])

    const [arr, setArr] = useState<any>([])
    let [URLarr, setURLarr] = useState<any>([])
    
    
    let imgResult:any[];
    const rendering = (i: number) => {
        imgResult = [];    
        ImgList[i].imageURL.map((imageURL: any) => {
            let index1 = ""
            const index_c = imageURL.indexOf(String(BridgeType))
            const len = String(BridgeType).length
            let ImageUrlCutWidth = ""
            if (project_Type === "Bridge") {
                if (BridgeType === 'Girder') {
                    index1 = imageURL.indexOf(".jpg") || imageURL.indexOf(".png") 
                    ImageUrlCutWidth = imageURL.substring(index_c+len+10, index1+4)
                } else if (BridgeType === 'Pier') {
                    index1 = imageURL.indexOf('.JPG')
                    ImageUrlCutWidth = imageURL.substring(index_c+len+10, index1+4)
                } else if (BridgeType === 'Slab') {
                    index1= imageURL.indexOf('.JPG')
                    ImageUrlCutWidth = imageURL.substring(index_c+len+13, index1+4)
                } else if (BridgeType === 'GirderSide') {
                    index1 = imageURL.indexOf(".JPG")
                    ImageUrlCutWidth = imageURL.substring(index_c + len + 12, index1 + 4)
                }
            }
            // console.log(ImageUrlCutWidth)
            imgResult.push(<img src={imageURL} id={String(i)} alt={imageURL} key={imageURL} className={URLarr.includes(ImageUrlCutWidth) ? styles.JtagImageBorder : styles.JtagImage} onClick={onClickImage} />)
        })
        
        if(imgResult.length < 1){
            setResult(false);
            // console.log(result);
        }
        
        return imgResult;
    }
    
    //프로젝트 정보 가져오기
    //type
    const [type, setType] = useState("")

    useEffect(() => {
        // console.log(folderName)
        let countList: any = [];
        let settings: any;
        axios({
             method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers: { "accept": `application/json`, "access-token": `${token}` },
        }).then((res) => {
            if (res.data.check === true) {
                settings= JSON.parse(res.data.data.settings)
                setType(res.data.data.projectType)
                countList.push(settings.girder_count)
                countList.push(settings.pier_film_count)
                countList.push(settings.slab_count)
                countList.push(settings.span_length/settings.span_class_length)
                setOptionCount(countList)
                setSpanNumber(settings.span_number_list)
                setPierNumber(settings.pier_number_list)
            } else {
                console.log("실패")
            }
        })

        let copy = [...images]
        let copyCNT = [...cnt]
        
        if (BridgeType === 'Girder') {
            for (let i = 0; i < optionCount[0]; i++){
                
                copy[i] = { ...copy[i], num: folderName.SubFolderName, folderName:'G'+String(i+1).padStart(2,'0') }
                Newarr[i] = { folder: folderName.typeFolderName+'/'+folderName.SubFolderName+'/G'+String(i+1).padStart(2,'0'), filename: [] };
                axios({
                    method: 'get',
                    url: API_URL+'/File/Files',
                    headers: { "accept": `application/json`, "access-token": `${token}` },
                    params: {
                        path: `/project/${project_id}/stage0/${folderName.typeFolderName + '/' + folderName.SubFolderName}/${'G' + String(i + 1).padStart(2, '0')}`
                    }
                }).then((res)=>{
                    if (res.data.check === true) {
                        console.log("성공")
                        let imgURL = [];
                        for (let j = 0; j < res.data.data.files.length; j++){
                            imgURL.push(`${IMAGE_URL}/image?path=/project/${project_id}/stage0/${folderName.typeFolderName + '/' + folderName.SubFolderName}/${'G' + String(i + 1).padStart(2, '0')}/${res.data.data.files[j]}&width=360`)
                            setImgList(copy)
                            if (imgURL.length===res.data.data.files.length) {
                                setResult(true)
                            }
                        }
                        copy[i] = { ...copy[i], imageURL: imgURL }
                        setImgList(copy)
                    } else {
                        console.log("실패")
                    }
                }).catch((err) => {
                    console.log(err);
                });                
            }
            setFinalCNT(copyCNT)
        } else if (BridgeType === 'GirderSide') {
            const f_name: string = 'S' + folderName.SubFolderName.substring(2, 4)
            copy = []
            copyCNT = []
            for (let i = 0; i < optionCount[3]; i++) {
                copy.push({ num: folderName.SubFolderName, folderName: f_name + String(i + 1).padStart(2, '0'), cnt: 0, imageURL: [] })
                Newarr[i] = { folder: folderName.typeFolderName + '/' + folderName.SubFolderName + '/' + f_name + String(i + 1).padStart(2, '0'), filename: [] };
                copyCNT.push({ camera_number:f_name+String(i + 1).padStart(2, '0'), cnt:0})
                axios({
                    method: 'get',
                    url: API_URL + '/File/Files',
                    headers: { "accept": `application/json`, "access-token": `${token}` },
                    params: {
                        path: `/project/${project_id}/stage2/${folderName.typeFolderName + '/' + folderName.SubFolderName}/${f_name+ String(i + 1).padStart(2, '0')}`
                    }
                }).then((res) => {
                    if (res.data.check === true) {
                        console.log("성공")
                        let imgURL = [];
                        // setResult(true);
                        for (let j = 0; j < res.data.data.files.length; j++) {
                            imgURL.push(`${IMAGE_URL}/image?path=/project/${project_id}/stage2/${folderName.typeFolderName + '/' + folderName.SubFolderName}/${f_name + String(i + 1).padStart(2, '0')}/${res.data.data.files[j]}&width=360`)
                            setImgList(copy)
                            if (j === res.data.data.files.length - 1) {
                                setResult(true)
                            }
                        }
                        copy[i] = { ...copy[i], imageURL: imgURL }
                        setImgList(copy)
                    } else {
                        console.log("실패")
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
            setFinalCNT(copyCNT)
        } else if (BridgeType === 'Slab') {
            copy=[]
            for (let i = 0; i < optionCount[2]; i++){
                copy.push({num: folderName.SubFolderName, folderName: 'Slab' + String(i + 1).padStart(2, '0'),cnt:0, imageURL:[]})
                Newarr[i] = { folder: folderName.typeFolderName + '/' +folderName.SubFolderName + '/Slab' + String(i + 1).padStart(2, '0'), filename: [] };
                axios({
                    method: 'get',
                    url: API_URL + '/File/Files',
                    headers: { "accept": `application/json`, "access-token": `${token}` },
                    params: {
                        path: `/project/${project_id}/stage0/${folderName.typeFolderName + '/' + folderName.SubFolderName}/${'Slab' + String(i + 1).padStart(2, '0')}`
                    }
                }).then((res) => {
                    if (res.data.check === true) {
                        console.log("성공")
                        let imgURL = [];
                        // setResult(true);
                        for (let j = 0; j < res.data.data.files.length; j++) {
                            imgURL.push(`${IMAGE_URL}/image?path=/project/${project_id}/stage0/${folderName.typeFolderName + '/' + folderName.SubFolderName}/${'Slab' + String(i + 1).padStart(2, '0')}/${res.data.data.files[j]}&width=360`)
                            setImgList(copy)
                            if (j === res.data.data.files.length - 1) {
                                setResult(true)
                            }
                        }
                        copy[i] = { ...copy[i], imageURL: imgURL }
                        setImgList(copy)
                    } else {
                        console.log("실패")
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
        } else if (BridgeType === 'Pier') {
            copy = []
            copyCNT = []
            for (let i = 0; i < optionCount[1]; i++) {
                copy.push({ num: folderName.SubFolderName, folderName: 'S' + String(i + 1).padStart(3, '0'), cnt: 0, imageURL: [] })
                Newarr[i] = { folder: folderName.typeFolderName + '/' + folderName.SubFolderName + '/S' + String(i + 1).padStart(3, '0'), filename: [] }
                copyCNT.push({ camera_number:folderName.SubFolderName, cnt:0})
              
                axios({
                    method: 'get',
                    url: API_URL + '/File/Files',
                    headers: { "accept": `application/json`, "access-token": `${token}` },
                    params: {
                    path: `/project/${project_id}/stage2/${folderName.typeFolderName+'/'+folderName.SubFolderName + '/S' + String(i + 1).padStart(3, '0')}`
                    }
                }).then((res) => {
                    if (res.data.check === true) {
                        console.log("성공")
                        
                        let imgURL = [];
                        for (let j = 0; j < res.data.data.files.length; j++) {
                            imgURL.push(`${IMAGE_URL}/image?path=/project/${project_id}/stage2/${folderName.typeFolderName + '/' + folderName.SubFolderName + '/S' + String(i + 1).padStart(3, '0')}/${res.data.data.files[j]}&width=360`)
                            setImgList(copy)
                             if (j === res.data.data.files.length - 1) {
                                setResult(true)
                            }
                        }
                        copy[i] = { ...copy[i], imageURL: imgURL }
                        setImgList(copy)
                        
                    } else {
                        console.log("실패")
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
            // setImgList(copy)
            setFinalCNT(copyCNT)
        }
        setArr(Newarr)
      
    }, [SelectOption, folderName])

    let copyArrImgList = [...ImgList];
    let copyArrCNT = [...finalCNT];
    let copyArr = [...URLarr];
    let copyfilename = [...arr]
    let filename = [...fileArr]

    const onClickImage = (e: any) => {
        const id = Number(e.target.id)
        const len = BridgeType.length
        console.log(arr)
        filename = [...copyfilename[id].filename]
        const str = e.target.src
        let index1 = ""
        if (project_Type === "Bridge") {
            if (BridgeType === 'Girder') {
                // index1 = str.indexOf(".png") 
                index1 = str.indexOf(".jpg") 
            } else if (BridgeType === 'Pier' || BridgeType==='Slab'|| BridgeType === 'GirderSide') {
                index1 = str.indexOf(".JPG")
            }
        }
        const index2 = str.indexOf(BridgeType)
        const num = (BridgeType === 'Girder' ? 'G' + String(id + 1).padStart(2, '0')
                    : BridgeType === 'Pier' ? 'S' + String(id + 1).padStart(3, '0')
                    : BridgeType === 'Slab' ? 'Slab' + String(id + 1).padStart(2, '0')
                    : ImgList[id].folderName)
        
        if (num === ImgList[id].folderName) {
            let name = (BridgeType === 'Girder' ? str.substring(index2 + len + 10, index1 + 4)
                        : BridgeType === 'Pier' ?  str.substring(index2 + len + 10, index1 + 4)
                        : BridgeType ==='Slab' ? str.substring(index2 + len +13, index1 +4)
                        : str.substring(index2 + len + 12, index1 + 4))
            if (copyArr.includes(name) === false) {
                //border
                copyArr.push(name)
                //선택 개수 계산
                copyArrCNT[id] = { ...copyArrCNT[id], cnt: copyArrCNT[id].cnt + 1 }
                copyArrImgList[id] = { ...copyArrImgList[id], cnt: copyArrCNT[id].cnt, }
                //filename
                filename.push(name)
                setFileArr(filename)
            } else {//선택이미지 중복일때
                //  border없앰
                const i = copyArr.indexOf(name)
                copyArr.splice(i, 1)
                // 선택 개수 계산
                copyArrCNT[id] = { ...copyArrCNT[id], cnt: copyArrCNT[id].cnt - 1 }
                copyArrImgList[id] = { ...copyArrImgList[id], cnt: copyArrCNT[id].cnt, }
                //filename 
                const j = filename.indexOf(name)
                filename.splice(j, 1)
            }
        }
        setFinalCNT(copyArrCNT)
        setImgList(copyArrImgList)
        setURLarr(copyArr)
        copyfilename[id] = { ...copyfilename[id], filename: filename }
        setArr(copyfilename)
        
    }

    let captioning: any;
    const onClick = () => {
        if (model === '') {
            alert("모델을 선택해주세요.")
        } else {
            alert("Captioning 진행중입니다.")
            
            folder_copy.push({
                input_folder: "stageXAI/original/captioning/"+BridgeType,
                output_folder: "stageXAI/Captioning/"+BridgeType,
                choice_model: model, 
                cls_model : "model/"+cls,
                choice_dic: "caption_data/"+word,
                fsize: Fsize,
                }
            )
         
            console.log(folder_copy)
            let input_folder: any;
            if (BridgeType === 'Girder' || BridgeType === 'Slab') {
                input_folder='stage0/'
            } else if (BridgeType === 'Pier') {
                input_folder='stage2/'
            } else if (BridgeType === 'GirderSide') {
                input_folder = 'stage2/'
            }
            arr.map((ob: any, i: number) => {
                console.log(ob.cam, ob.filename)
                 axios({
                    method: "post",
                    url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
                    headers: {
                      "accept": `application/json`,
                      "access-token": `${token}`,
                      "Content-Type": `application/json`
                    },
                    data: {
                        project_id: project_id,
                        task_name: "copy_folder",
                        interactive: false,
                        tasks: [{
                            input_folder: input_folder+ob.folder,
                            file_names: ob.filename,
                            output_folder:"stageXAI/original/captioning/"+BridgeType+'/'
                            }]
                        }
                }).then((res) => {
                    if (res.data.check === true) {
                        console.log("복제 성공")
                        axios({
                            method: "post",
                            url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
                            headers: {
                              "accept": `application/json`,
                              "access-token": `${token}`,
                              "Content-Type": `application/json`
                            },
                            data: {
                                project_id: project_id,
                                task_name: "xai_captioning",
                                interactive: false,
                                tasks: folder_copy
                            }
                        }).then((res2)=>{
                            console.log("captioning성공")
                            job_id = res2.data.data.job_id
                            captioning = setInterval(confirm, 30000)
                            console.log(res2)
                        }).catch((err) => {
                            console.log(err);
                        });
                    }
                    
                }).catch((err) => {
                    console.log(err)
                })
            })
        }


        
    }


    const modelSelect :any[] =[]
    const selectModel = () => {
        
       if (project_Type === 'Bridge') {
            modelSelect.push(
                <div>
                    <Select placeholder="선택해주세요" className={styles.selectDiv} onChange={onChangeBridgeType}>
                        {option_render()} 
                    </Select>
                    <Select  placeholder="선택해주세요" className={styles.selectDiv} onChange={onChangeBridgeOption} id='select2'>
                        {(() => {
                            let optionArr: any = [];
                            if (BridgeType === 'Girder' || BridgeType === 'Slab' ||BridgeType==='GirderSide') {
                                spanNumber.map((span:any)=>{
                                    let name :string = 'S'+String(span.num).padStart(3,'0')
                                    optionArr.push(<Option value={name}>Span {span.num}</Option>)
                                })
                            } else if (BridgeType === 'Pier') {
                                pierNumber.map((pier: any) => {
                                    let name: string = 'P' + String(pier.num).padStart(2, '0')
                                    optionArr.push(<Option value={name}>Pier {pier.num}</Option>)
                                })
                            }
                            return optionArr;
                        })()}
                    </Select>
                </div>
            )
        }
        return modelSelect;
    }
    const option_render=()=>{
        const arr: any[] = [];
        typeArr.map((type:any)=>{
                let name=''
            if (type === 'Girder') {
                name = '거더 하면'
            } else if(type==='GirderSide'){
                name='거더 측면'
            } else if (type === 'Slab') {
                name = '슬라브 하면'
            } else if (type === 'SlabSide') {
                name = '슬라브 측면'
            } else if (type === 'Pier') {
                name ='교각'
            } else if (type === 'Abutment') {
                name = '교대'
            }
            arr.push(<Option value={type}> {name}</Option>)
        })
        return arr;
    }
    
    const handleChange = (e: any) => {
        setFsize(e.target.value)
    }

   const onChangeBridgeType = (e:any) => {

        const copy = [...ImgList]
        
        if (e === "Girder") {
            setBridgeType("Girder")
            setFolderName({...folderName,typeFolderName:"Girder"})
            setBridgeTypeName("거더")
        } else if (e === 'GirderSide') {
            setFolderName({...folderName,typeFolderName:"GirderSide"})
            setBridgeTypeName("거더")
            setBridgeType("GirderSide")
            setBridgeTypeName("거더 측면")
        }else if (e === "Slab") {
            setBridgeType("Slab")
            setFolderName({...folderName,typeFolderName:"Slab"})
            setBridgeTypeName("슬라브 하면")
        }else if(e === "SlabSide"){
            setBridgeType("SlabSide")
            setFolderName({...folderName,typeFolderName:"SlabSide"})
            setBridgeTypeName("슬라브 측면")
        } else if (e === "Pier") {
            setConfirmOption(false)
            setBridgeType("Pier")
            setFolderName({...folderName,typeFolderName:"Pier"})
            setBridgeTypeName("교각")
        }else if(e === "Abutment"){
            setBridgeType("Abutment")
            setFolderName({...folderName,typeFolderName:"Abutment"})
            setBridgeTypeName("교대")
        }
        setURLarr([])
        setImgList(copy)
        setModel('BEST_checkpoint_bridge_5_cap_per_img_5_min_word_freq.pth.tar')
        setWord('WORDMAP_bridge_5_cap_per_img_5_min_word_freq.json')
        setCls('myresnet.pt')
       
    }
    const confirm = () => {
        // console.log(job_id)
        axios({
            method: "post",
            url: API_URL + '/scheduler/job/query',
            headers: { "accept": `application/json`, "access-token": `${token}`, "Content-Type" : `application/json` },
                data: {
                    "job_id": job_id ,
                    "company_id": companyid
                }
            }).then((res) => {
                console.log(res)
                if (res.data.check == true) {
                    console.log("성공",res.data.data.status)
                    if (res.data.data.status === "done") {
                        alert("Captioning이 끝났습니다.")
                        clearInterval(captioning)
                        window.location.href='../XAI/Result_Captioning'
                    } else if(res.data.data.status === "error"){
                        alert("해당 파일이 없습니다.")
                    }
                 } else {
                    console.log("실패")
                 }
            })
        
    }
    const onChangeBridgeOption = (e: any) => {
        setFolderName({ ...folderName, SubFolderName: e })
    }
  return (
      <>
            <div className={styles.DivArea}>

            <div>
                <p className={styles.subOrder}>{t.xaiDashboard} &gt; {t.captioning}</p>
                <p className={styles.mainOrder}>{t.captioning}</p>
            
            </div>  
              <div className={styles.CamList}>
                  Model : &nbsp;
                  {selectModel()}
                <Table dataSource={ImgList}>
                        <Column title={t.cnNumber} dataIndex="num" key="num" />
                        <Column title={t.cnName} dataIndex="folderName" key="num" />
                        <Column title={t.cnt} dataIndex="cnt" key="num" />
                        {/* <Column title={t.cnStatus}  key="no" /> */}
                  </Table>
                  
                  Font Size : <Input type="number" name="fsize" defaultValue={100} className={styles.fsize} onChange={handleChange} />
                  {/* onChange={handleChange} */}
                <Button onClick={onClick}>{t.btnComfirm}</Button>
            </div>      
            
            <div className={styles.ImageTaskDiv}>
                    { 
                        result === true ? 
                            ImgList.map((_,i)=>(
                                <div className={styles.ImageScrollDiv} key={i}>
                                    <ul className={styles.ImageScrollDivUl}>
                                    <div className={styles.ImageDiv}>
                                        {BridgeType === 'Girder'||BridgeType==='Slab' ? <div>{i + 1}. {ImgList[i].num}/{ImgList[i].folderName}</div>
                                                : <div>{i + 1}. {ImgList[i].folderName}</div>}
                                        <br />
                                        { rendering(i) }
                                    </div>
                                    </ul>
                                </div>
                            ))
                            :   
                            <div>
                            이미지 로딩 중 입니다.
                            </div>
                    }
                                    
            </div>  


            </div>
        </>
  )
}
