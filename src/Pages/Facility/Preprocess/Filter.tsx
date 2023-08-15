import { useEffect, useState } from 'react';
import styles from '../../../Styles/Preprocess.module.css'
import { ko, en } from '../../../translations';
import { useRecoilState, atom } from 'recoil';
import { langState, projectType } from '../../../Store/State/atom'
import axios from "axios";
import { API_URL, IMAGE_URL } from '../../../Store/Global';
import { Checkbox, Select,  Dropdown, Menu, Row, Col  } from 'antd';
import { CheckCircleTwoTone, DownloadOutlined,DollarTwoTone } from '@ant-design/icons';

const { Option } = Select;

interface Image_folder {
        typeFolderName : string;
        SpanFolderName : string;
        SubSpanFolderName : string;
}

export default function Filter() {
    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;
    const project_id = localStorage.getItem("project_id");
    const project_Type = localStorage.getItem("project_Type");
    
    let token: string | null = localStorage.getItem("token");
    let job_id=0

    // 전체 이미지
    const [allNList, setAllNList] = useState<any>();
    const [confirmAll, setConfirmAll] = useState<boolean>(false)
    
    // 사용이미지
    const [clickImg, setClickImg] = useState<any>([])
    const [selectImg, setSelectImg]= useState<any>([])
    const [standardImg, setStandardImg] = useState<any>([])
    const [confirmSelect, setConfirmSelect] = useState<boolean>(false)

    //미사용 이미지
    const [unUsed, SetUnUsed] = useState<any>([])
    const [confirmUnused, setConfirmUnUsed] = useState<boolean>(false)

    //C01&C02나누기
    const[camClass,setCamClass] = useState<any>([])
    const cameraClass: any[] = []
    
    //conf값
    const [setting, setSetting]=useState<any>([])

    //dam
    const [typeArr, setType]=useState([])
    const [DamType, setDamType] = useState<string>("Overflow");
    const [dam_type_name, setDamTypeName] = useState<string>("")
    
    //bridge
    const [BridgeType, setBridgeType] = useState<string>("")
    const [bridge_type_name, setBridgeTypeName] = useState<string>("")  //Girder
    const [optionList, setOptionList] = useState()
    const [confirmOption, setConfirmOption] = useState<boolean>(false);
    const [optionCount, setOptionCount] = useState([])
    const [spanNumber,setSpanNumber] =useState([])
    const [pierNumber, setPierNumber] = useState([])
    const [girder_film_count,setGirderFilmCount] = useState<number>(0)
    const [folderName, setFolderName] = useState<Image_folder>({ typeFolderName: "", SpanFolderName: "", SubSpanFolderName: "" })
    
    // 전체 선택 checked
    const [checkAll, setCheckAll] = useState<boolean>(false)

    //구역 또는 옵션 선택 하여 필터링이 진행되었는지 확인하는 변수 (아직 안됨.)
    const [checkFilter, setCheckFilter] =useState<boolean>(false)
   
    let allList: any = [];

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


    useEffect(() => {
        let path: any
        // console.log(`${folderName['typeFolderName']}/${folderName['SpanFolderName']}/${folderName['SubSpanFolderName']}`)
        if (project_Type === 'Airport') {
            path = `/project/${project_id}/stage0_r`
        } else if(project_Type === "Dam"){
            path = `/project/${project_id}/stage0/${DamType}`
        }else if(project_Type==='Tunnel') {
            path = `/project/${project_id}/stage0`
        } else if (project_Type === 'Bridge') {
            if (BridgeType === 'Girder' || BridgeType === 'Slab'||BridgeType==='GirderSide') {
                path = `project/${project_id}/stage0/${folderName['typeFolderName']}/${folderName['SpanFolderName']}/${folderName['SubSpanFolderName']}`
            } else if (BridgeType === 'Pier') {
                path = `project/${project_id}/stage0_r/${folderName['typeFolderName']}/${folderName['SpanFolderName']}/${folderName['SubSpanFolderName']}`
            }
        }
        // console.log(path)
        let all: any[] = [];
        // setTimeout(()=>{console.log(path)},3000)
        axios({
            method: 'get',
            url: API_URL + `/File/Files`,
            headers: { "accept": `application/json`, "access-token": `${token}` },
            params: {path : path}
        }).then((res) => { 
            // console.log(res.data.check)
            if (res.data.check === true) {
                let i = 0;
                for (const image of res.data.data.files) {
                    allList.push({ key: i + 1, name: image, imageURL: `${IMAGE_URL}/image?path=`+path+`/${image}&width=360` });
                    // setConfirmAll(true)
                    // setConfirmUnUsed(true)
                    all.push(image)
                    i=i+1
                }
                allList.sort((obj1: { name: String; }, obj2: { name: String; }) => {
                if (obj1.name > obj2.name) {
                    return 1;
                }
                if (obj1.name < obj2.name) {
                    return -1;
                }
                return 0;
            })
                setAllNList(allList)
                SetUnUsed(allList)
            } else {
                console.log("불러오기 실패")
                // alert("데이터가 없습니다.")
            }
        })

        axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers: { "accept": `application/json`, "access-token": `${token}` },
        }).then((res) => {
            if (res.data.check === true) {
                const settings: any = JSON.parse(res.data.data.settings)
                let countList :any= [];
                setSetting(settings)
                if (project_Type === 'Dam') {
                    setType(settings.dam_type)
                } else if (project_Type === 'Bridge') {
                    setType(settings.bridge_type)
                    countList.push(settings.girder_count)
                    countList.push(settings.pier_count)
                    countList.push(settings.slab_count)
                    countList.push(settings.span_length / settings.span_class_length)
                    countList.push(settings.pier_film_count)
                    setOptionCount(countList)
                    // setGirderCount(settings.girder_count)
                    setSpanNumber(settings.span_number_list)
                    setPierNumber(settings.pier_number_list)
                    setGirderFilmCount(settings.girder_film_count)
                }
            } else {
                console.log("셋팅값 가져오기 실패")
            }
        }).catch((err) => { console.log(err) })
        
    },[DamType,BridgeType,folderName])
    
    const onClickimage = (e: any) => {
        let imgClick: any = [...clickImg]
        let imgSelect: any = [...selectImg]
        
        let unUsedimg :any =[...unUsed]
        setConfirmSelect(true)
        setConfirmUnUsed(true)

        
        let indexFront: any;
        let indexBack: any;
        let image_name: any;
        
        if (project_Type === 'Airport') {
            indexFront = e.target.src.indexOf("stage0_r") 
            indexBack = e.target.src.indexOf(".JPG")   
            image_name = e.target.src.substring(indexFront+9,indexBack+4)
        } else if(project_Type==='Dam') {
            const len = DamType.length
            indexFront = e.target.src.indexOf(DamType)
            indexBack = e.target.src.indexOf(".jpg")
            image_name = e.target.src.substring(indexFront+len+1,indexBack+4)
        } else if (project_Type === 'Bridge') {
            const len = folderName['SubSpanFolderName'].length
            if (len === 0) { //pier or GirderSide
                indexFront = e.target.src.indexOf(folderName['SpanFolderName'])
                indexBack = e.target.src.indexOf('.JPG') || e.target.src.index('.jpg')
                image_name = BridgeType==='Pier'? e.target.src.substring(indexFront + 5, indexBack + 4):e.target.src.substring(indexFront + 6, indexBack + 4)
            } else {//Girder or Slab
                indexFront = e.target.src.indexOf(folderName['SubSpanFolderName'])
                // indexBack = e.target.src.indexOf(".jpg")||e.target.src.indexOf(".JPG")
                indexBack = (BridgeType==='Girder'? e.target.src.indexOf(".jpg"):e.target.src.indexOf(".JPG"))
                image_name = (BridgeType === 'Girder' ? e.target.src.substring(indexFront + 4, indexBack + 4) : e.target.src.substring(indexFront + 7, indexBack + 4))
                console.log(image_name)
            }
            // console.log(image_name)
        }
        
        if (imgClick.includes(image_name) === true) {
            const find = imgClick.findIndex((e: any) => e === image_name)  
            imgClick.splice(find, 1)
            imgSelect.splice(find, 1)
        } else {
            imgClick.push(image_name)
            const image = allNList.filter((item: any) => item.name === image_name)
            imgSelect.push({ key: image[0].key, name: image_name, imageURL: e.target.src })
           
            imgSelect.sort((obj1: { name: String; }, obj2: { name: String; }) => {
                if (obj1.name > obj2.name) {
                    return 1;
                }
                if (obj1.name < obj2.name) {
                    return -1;
                }
                return 0;
            })

            
        }
        const unUsedIndex = unUsedimg.findIndex((e: any) => e.name === image_name)
        if (unUsedIndex !== -1) {
            unUsedimg.splice(unUsedIndex,1)
        } else {
            const image = allNList.filter((item: any) => item.name === image_name)
            // console.log(image)
            unUsedimg.push({ key: image[0].key, name: image_name, imageURL: e.target.src })
            unUsedimg.sort((obj1: { name: String; }, obj2: { name: String; }) => {
                if (obj1.name > obj2.name) {
                    return 1;
                }
                if (obj1.name < obj2.name) {
                    return -1;
                }
                return 0;
            })
            
        }
        

        setClickImg(imgClick)
        setSelectImg(imgSelect)
        SetUnUsed(unUsedimg)
    }
    const onClickSelectimage = (e: any) => {
        if (project_Type !== 'Dam') {
            let imgStandard: any = [...standardImg]
            let confirm:boolean = false
            let indexFront: any;
            let indexBack: any;
            let image_name: any;
            if (project_Type === 'Airport') {
                indexFront = e.target.src.indexOf("stage0_r")
                indexBack = e.target.src.indexOf(".JPG") || e.target.src.indexOf(".jpg")
                image_name = e.target.src.substring(indexFront + 9, indexBack + 4)
                confirm = true
            } else if(project_Type==='Dam') {
                indexFront = e.target.src.indexOf("stage0")
                indexBack = e.target.src.indexOf(".jpg") || e.target.src.indexOf(".JPG")
                image_name = e.target.src.substring(indexFront + 7, indexBack + 4)
            } else if (project_Type === 'Bridge' && BridgeType === 'Girder') {
                confirm = girder_film_count!==0? true:false
                indexFront = e.target.src.indexOf(folderName['SubSpanFolderName'])
                // indexBack = (BridgeType==='Girder' ? e.target.src.indexOf(".png"):e.target.src.indexOf(".JPG"))
                indexBack = e.target.src.indexOf(".jpg");
                image_name = e.target.src.substring(indexFront + 4, indexBack + 4)
            }
            
            if (confirm === true) {
                if (imgStandard.includes(image_name) === true) {
                    const find = imgStandard.findIndex((e: any) => e === image_name)
                    imgStandard.splice(find, 1)
                } else {
                    if (imgStandard.length === 0) {
                        imgStandard.push(image_name)
                    } else {
                        alert("하나만 선택해주세요.")
                    }
                }
            } else {
                //선택 하지 않아도됨.
            }
            
            setStandardImg(imgStandard)

            // 선택된 이미지 중 c01,c02 나눌 이미지가 stadardImg에 들어가있음.
            const index = allNList.findIndex((item: any) => item.name===image_name)
            let C01_image: any[] = [];
            let C02_image: any[] = [];
            for (let i = 0; i < selectImg.length; i++) {
                // console.log(selectImg[i].key)
                if (i <= index) {
                    // console.log(i)
                    C01_image.push(selectImg[i].name)
                } else {
                    // console.log(i)
                    C02_image.push(selectImg[i].name)
                }
            }
            cameraClass.push({ key: 1, image: C01_image })
            cameraClass.push({ key: 2, image: C02_image })
            setCamClass(cameraClass)
        } else {
            // alert("선택x")
        }
    }

    const AllImage = () => {
        let all: any[] = [];
        // console.log(allNList)
        for (let i = 0; i < allNList.length; i++) {
            all.push(<img src={allNList[i].imageURL} id={String(i)} key={allNList[i].imageURL}  className={clickImg.includes(allNList[i].name) ? styles.JtagImageBorder : styles.JtagImage} onClick={onClickimage}/>)
            console.log(allNList[i].length)
        }
        return all;
    }

    const SelectImg = () => {
        let select: any[] = []
        // let j =0
        for (let i = 0; i < selectImg.length; i++){
            const find_select = allNList.filter((item: any) => item.name.includes(selectImg[i].name))
            // console.log(find_select[0].key)
            select.push(<img src={find_select[0].imageURL}id={String(i)} key={find_select[0].key} className={standardImg.includes(clickImg[i]) ? styles.JtagImageBorder : styles.JtagImage} onClick={onClickSelectimage} />)
        }
        return select;
    }

    const UnusedImg = () => {
        let unUsedimg: any[] = [...unUsed]
        let unImg: any[] =[]
        for (let i = 0; i < unUsedimg.length; i++){
            unImg.push(<img src={unUsedimg[i].imageURL} id={String(i)} key={unUsedimg[i].key} className={styles.JtagImage} onClick={onClickSelectimage} />)
        }
       
        return unImg;
    }
    const allClick = (e: any) => {
        if (project_Type==='Bridge' && BridgeType === '') {
            alert("구역을 선택해주세요.")
        } else {
            if (checkAll === true) {
                setCheckAll(false)
            } else {
                setCheckAll(true)
            }
            let clickAll: any[] = []
            let selectAll :any[] = []
            setConfirmSelect(true)
            if (e.target.checked === true) {
                for (const image of allNList) {
                    // console.log(image.key)
                    clickAll.push(image.name)
                    selectAll.push({ key: image.key, name: image.name, imageURL: image.imageURL })
                }
                // console.log(selectAll)
                SetUnUsed([])
                setConfirmUnUsed(true)
            } else {
                SetUnUsed(allNList)
                clickAll = []
            }
            
            
            setClickImg(clickAll)
            setSelectImg(selectAll)
            
        }
        
        
    }

    let result: any;
    let IsProc = false;
    const FilterStart = (e: any) => {
        e.preventDefault();
        if (!IsProc) {
            IsProc = true;
        }
        for (let i = 0; i < camClass.length; i++){
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
                        input_folder: "stage0_r",
                        file_names: camClass[i].image, //복사할 이미지 이름 list
                        output_folder: "stage1/C0" + String(i + 1)
                    }
                    , {
                        input_folder: "stage0",
                        file_names: camClass[i].image, //복사할 이미지 이름 list
                        output_folder: `stage2/${setting.airport_eng}/C0` + String(i + 1)
                    }]
                }
            }).then((res) => {
                if (res.data.check === true) {
                    console.log("C0" + (i + 1) + " 성공이다")
                    IsProc = false;
                    setTimeout(() => {
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
                                task_name: "gpstoxyz_airport",
                                interactive: false,
                                tasks: [{
                                    input_folder: `stage2/${setting.airport_eng}/C0` + String(i + 1),
                                    align: 1,
                                    meter: setting.spanLength,
                                    conf_name: "gps.conf",
                                    conf_folder: "stage2",
                                    conf_values: {
                                        sensor_width: Number(setting.cameraSensor),
                                        focal_length: Number(setting.cameraFocus),
                                        altitude: Number(setting.droneAltitude),
                                        image_width: Number(setting.imageWidth),
                                        image_height: Number(setting.imageHeight),
                                        photo_ratio: Number(setting.overlap)
                                    }
                                }]
                            }
                        }).then((res3) => {
                            if (res3.data.check === true) {
                                console.log("좌표변환 모듈 성공")
                                setStandardImg([])
                               
                                for (let j = 0; j < setting.spanCount; j++) {
                                    console.log("C0"+(i+1)+" S00"+(j+1)+" rotation 시작")
                                    axios({
                                        method: "post",
                                        url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
                                        headers: {
                                          "accept": `application/json`,
                                          "access-token": `${token}`,
                                          "Content-Type": `application/json`
                                        },                                        data: {
                                            project_id: project_id,
                                            task_name: "imageRotation_airport",
                                            interactive: false,
                                            tasks: [{
                                                input_folder: `stage2/${setting.airport_eng}/C0${i+1}/S00`+String(j + 1),
                                                output_folder: `stage2/${setting.airport_eng}/C0${i+1}/S00`+String(j + 1),
                                                rotation_angle: 90
                                            }]
                                        }
                                    }).then((res4) => {
                                        if (res4.data.check === true) {
                                            job_id = res4.data.data.job_id
                                            console.log("로테이션 시작")
                                            result = setInterval(confirm, 30000)
                                        } else {
                                            console.log("좌표변환후 rotate 실패")
                                        }
                                    })
                                    // console.log("끝!")
                                }
                            } else {
                                console.log("C0" + (i + 1) + "좌표변환 모듈 실패")
                            }
                        })
                    }, 20000)
                    
                } else {
                    console.log("C0" + (i+1) + " 실패다")
                    console.log(res)
                    
                }
            })
        }
    }
    const FilterStart2 = () => {
        
        // axios({
        //     method: "post",
        //     url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
        //     headers: {
        //       "accept": `application/json`,
        //       "access-token": `${token}`,
        //       "Content-Type": `application/json`
        //     },      data: {
        //             project_id: project_id,
        //             task_name: "copy_folder",
        //             interactive: false,
        //             tasks: [{
        //                 input_folder: `stage0/${DamType}`,
        //                 file_names: clickImg, 
        //                 output_folder: `stage1/${DamType}`
        //             },{
        //                 input_folder: `stage0/${DamType}`,
        //                 file_names: clickImg,
        //                 output_folder: `stage2/${DamType}`
        //             }]
        //         }
        //     }).then((res) => {
        //         if (res.data.check === true) {
        //             console.log("복사 성공")
        //             axios({
        //                 method: "post",
        //                 url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
        //                 headers: {
        //                   "accept": `application/json`,
        //                   "access-token": `${token}`,
        //                   "Content-Type": `application/json`
        //                 },
        //                 data: {
        //                     project_id: project_id,
        //                     task_name: "gpstoxyz",
        //                     interactive: false,
        //                     tasks: [{
        //                         input_folder: `stage2/${DamType}`,
        //                         output_folder: `stage2/${DamType}`,
        //                         conf_name: "DamInfo.conf",
        //                         conf_folder: `stage2/${DamType}`,
        //                         conf_values: {
        //                             damName: setting.dam_eng,
        //                             damType: dam_type_name,
        //                             damLatitudeStart: setting.dam_latitude_start,
        //                             damLatitudeEnd: setting.dam_latitude_end,
        //                             damLongitudeStart: setting.dam_longitude_start,
        //                             damLongitudeEnd: setting.dam_longitude_end,
        //                             damHeightStart: setting.dam_height_start,
        //                             damHeightEnd: setting.dam_height_end,
        //                             damWitdhArea:setting.dam_width_area,
        //                             damHeightArea:setting.dam_height_area
        //                         }
        //                     }]
        //                 }
        //             }).then((res2) => {
        //                 if (res2.data.check === true) {
        //                     setSelectImg([])
        //                     job_id=res2.data.data.job_id
        //                     result = setInterval(confirm, 30000)
        //                 } else {
        //                     console.log("gps실패", res2)
        //                 }
        //             })

        //         } else {
        //             console.log("복사 실패")
        //         }
        //     })

        alert("이미지 필터링 작업을 시작합니다.")
        setTimeout(()=> alert("이미지 필터링 작업이 완료되었습니다."),5000)

    }
    
    const FilterStart3 = () => {
        setCheckFilter(true)
        if (BridgeType === 'Girder') {
            // console.log(folderName)
            // console.log(camClass[0].image)
            // for (let i = 0; i < camClass.length; i++) {
            //     axios({
            //         method: "post",
            //         url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
            //         headers: {
            //           "accept": `application/json`,
            //           "access-token": `${token}`,
            //           "Content-Type": `application/json`
            //         },
            //         data: {
            //             project_id: project_id,
            //             task_name: "copy_folder",
            //             interactive: false,
            //             tasks: [{
            //                 input_folder: `stage0/${folderName['typeFolderName']}/${folderName['SpanFolderName']}/${folderName['SubSpanFolderName']}`,
            //                 file_names: camClass[i].image,
            //                 output_folder: `stage1/${folderName['typeFolderName']}/${folderName['SpanFolderName']}/${folderName['SubSpanFolderName']}/C0${i+1}`
            //             }]
            //         }
            //     }).then((res) => {
            //         if (res.data.check === true) {
            //             console.log("카메라 분류 성공!")
            //             setSelectImg([])
            //             setStandardImg([])
            //             // gps모듈
            //             gpsModule(i)
            //         }
            //     })
            // }
        } else if (BridgeType === 'Slab') {
            gpsModule(0)
        } else if (BridgeType === 'Pier') {
            gpsModule(0)
        }
    }
    const gpsModule = (i: number) => {
        alert("좌표변환모듈이 시작되었습니다.")
        let input_folder: any;
        let output_folder: any;
        let config_list: any;
        let facility_type: any;
        if (BridgeType === 'Girder') {
            input_folder = `stage1/${folderName['typeFolderName']}/${folderName['SpanFolderName']}/${folderName['SubSpanFolderName']}/C0${i + 1}`
            output_folder = `stage2/${folderName['typeFolderName']}/${folderName['SpanFolderName']}/Girder_${folderName['SubSpanFolderName']}/C0${i + 1}`
            config_list={
                pierNum: 0,
                spanNum: optionCount[3],
                slabNum: folderName.SpanFolderName.substring(3),
                girderNum: folderName.SpanFolderName.substring(3)
            }
            facility_type=BridgeType
        } else if (BridgeType === 'Slab') {
            input_folder = `stage0/${folderName['typeFolderName']}/${folderName['SpanFolderName']}/${folderName['SubSpanFolderName']}`
            output_folder = `stage2/${folderName['typeFolderName']}/${folderName['SpanFolderName']}/${folderName['SubSpanFolderName']}`
             config_list = {
                pierNum: 0,
                spanNum: optionCount[3],
                slabNum: folderName.SpanFolderName.substring(3),
                girderNum: folderName.SpanFolderName.substring(3)
            }
            facility_type=BridgeType
        } else if (BridgeType === 'Pier') {
            input_folder = `stage0/${folderName['typeFolderName']}/${folderName['SpanFolderName']}`
            output_folder = `stage1/${folderName['typeFolderName']}/${folderName['SpanFolderName']}`
            config_list={
                pierNum: optionCount[4],
                spanNum: optionCount[3],
                slabNum: 0,
                girderNum: 0
            }
            facility_type=BridgeType+'2'
        }
        
        // axios({
        //     method: "post",
        //     url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
        //     headers: {
        //       "accept": `application/json`,
        //       "access-token": `${token}`,
        //       "Content-Type": `application/json`
        //     },
        //     data: {
        //         project_id: project_id,
        //         task_name: "gpstoxyz_total",
        //         interactive: false,
        //         tasks: [{
        //             input_folder: input_folder,
        //             output_folder: output_folder,
        //             facility: project_Type,
        //             facility_type:facility_type,
        //             conf_name: "totalconfig.conf",
        //             conf_folder: 'stage1',
        //             conf_values:config_list
        //         }]
        //     }
        //     }).then((res) => {
        //         if (res.data.check === true) {
        //             console.log("좌표 변환모듈 성공")
        //             if (BridgeType === 'Pier') {
        //                 for (let i = 0; i < optionCount[4]; i++) {
        //                     const subFolder = 'S' + String(i + 1).padStart(3, '0')
        //                     input_folder = `stage1/${folderName['typeFolderName']}/${folderName['SpanFolderName']}/${subFolder}`
        //                     output_folder = `stage2/${folderName['typeFolderName']}/${folderName['SpanFolderName']}/${subFolder}`
        //                     axios({
        //                         method: "post",
        //                         url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
        //                         headers: {
        //                           "accept": `application/json`,
        //                           "access-token": `${token}`,
        //                           "Content-Type": `application/json`
        //                         },
        //                             data: {
        //                             project_id: project_id,
        //                             task_name: "imageRotation_airport",
        //                             interactive: false,
        //                             tasks: [{
        //                                 input_folder: input_folder,
        //                                 output_folder: output_folder,
        //                                 rotation_angle: 270
        //                             }]
        //                         }
        //                     }).then((res) => {
        //                         if (res.data.check === true) {
        //                             // alert("좌표변환모듈 시작")
        //                             job_id = res.data.data.job_id
        //                             if (i === optionCount[4]-1) {
        //                                 result = setInterval(confirm, 30000)
        //                             }
        //                         }
        //                     })
        //                 }
        //             } else {
        //                 job_id = res.data.data.job_id
        //                 result = setInterval(confirm, 30000)
        //             }
                    
        //         } else {
        //             console.log("좌표 변환모듈 실패")
        //         }    
        //     }).catch((err) => console.log(err))
    }

    const confirm = () => {
        axios({
            method: "post",
            url: API_URL + '/scheduler/job/query',
            headers: { "accept": `application/json`, "access-token": `${token}`, "Content-Type" : `application/json` },
                data: {
                    "job_id": job_id ,
                    "company_id": companyid
                }
        }).then((res) => {
            if (res.data.data.status === "done") {
                setCheckFilter(false)
                alert("이미지 필터링이 끝났습니다.")
                clearInterval(result)
                window.location.replace('./Filter')
                
            }
        })
        
    }


    const option_render=()=>{
        const arr: any[] = [];
        if (project_Type === 'Dam') {
            typeArr.map((type: any) => {
                let name = ''
                if (type === 'Overflow') {
                    name = '월류부'
                } else if (type === 'DamFloor') {
                    name = '댐마루'
                } else if (type === 'UpStream') {
                    name = '상류면'
                } else if (type === 'DownStream') {
                    name = '비월류부'
                }
                arr.push(<Option value={type}> {name}</Option>)
            })
        } else if (project_Type === 'Bridge') {
            typeArr.map((type: any) => {
                let name = ''
                if (type === 'Girder') {
                    name = '거더 하면'
                } else if (type === 'GirderSide') {
                    name = '거더 측면'
                } else if (type === 'Slab') {
                    name = '슬라브 하면'
                } else if (type === 'SlabSide') {
                    name = '슬라브 측면'
                } else if (type === 'Pier') {
                    name = '교각'
                } else {
                    name ='교대'
                }
                arr.push(<Option value={type}> {name}</Option>)
            })
            
        }
        return arr;
    }

    const girder_render=()=>{
        const spanArr: any[] = [];
        if (BridgeType === 'Girder') {
            for (let i = 1; i < Number(optionCount[0])+1; i++){
                spanArr.push(<Option value={'G'+String(i).padStart(2,'0')}> Girder {i}</Option>)
            }
        } else if (BridgeType === 'Slab') {
            for (let i = 1; i < Number(optionCount[2]) + 1; i++){
                // console.log(i)
                spanArr.push(<Option value={'Slab'+String(i).padStart(2,'0')}> Slab {i}</Option>)
            }
        }
        
        return spanArr;
    }
    
    const onChangeType = (e:any) => {
        if (project_Type === 'Dam') {
            if(e === "Overflow"){
                setDamType("Overflow")
                setDamTypeName("월류부")

                setConfirmUnUsed(true)
                setConfirmAll(true)

            }else if(e === "DamFloor"){
                setDamType("DamFloor")
                setDamTypeName("댐마루")
            }else if(e === "DownStream"){
                setDamType("DownStream")
                setDamTypeName("비월류부")
            }else if(e === "UpStream"){
                setDamType("UpStream")
                setDamTypeName("상류면")
            }
        } else if (project_Type === 'Bridge') {
            if (BridgeType !== e) {
                setCheckAll(false)
                setStandardImg([])
                setAllNList([])
                setClickImg([])
                setSelectImg([])
            }
            if (e === 'Girder') {
                setBridgeType("Girder")
                setBridgeTypeName("거더")
                setConfirmOption(true)
                let spanoption: any = []
                spanNumber.map((span: any) => {
                    let name: any = 'S'+String(span.num).padStart(3,'0')
                    spanoption.push(<Option value={name}>Span {String(span.num)}</Option>)
                    // girderoption.push(<Option value={'Girder' + i}> Girder {i}</Option>)
                })
                setOptionList(spanoption)
                setFolderName({...folderName, typeFolderName:e})
            } else if (e === 'GirderSide') { 
                setBridgeType("GirderSide")
                setBridgeTypeName("거더 측면")
                setConfirmOption(false)
                let spanoption: any = []
                spanNumber.map((span: any) => {
                    let name: any = 'S'+String(span.num).padStart(3,'0')
                    spanoption.push(<Option value={name}>Span {String(span.num)}</Option>)
                })
                setOptionList(spanoption)
                setFolderName({...folderName, typeFolderName:e, SubSpanFolderName:""})
            } else if (e === 'Slab') {
                setBridgeType("Slab")
                setBridgeTypeName("슬래브 하면")
                setConfirmOption(true)
                let spanoption: any = []
                spanNumber.map((span: any) => {
                    let name: any = 'S'+String(span.num).padStart(3,'0')
                    spanoption.push(<Option value={name}>Span {String(span.num)}</Option>)
                    // girderoption.push(<Option value={'Girder' + i}> Girder {i}</Option>)
                })
                // console.log(folderName)
                setFolderName({...folderName, typeFolderName:e})
                setOptionList(spanoption)
            } else if (e === 'SlabSide') {
                setBridgeType("SlabSide")
                setBridgeTypeName("슬라브 측면")
            } else if (e === 'Pier') {
                setConfirmOption(false)
                setBridgeType("Pier")
                setBridgeTypeName("교각")
                let pieroption: any = []
                pierNumber.map((pier: any) => {
                    let name: any = 'P' + String(pier.num).padStart(2, '0')
                    pieroption.push(<Option value={name}> Pier {String(pier.num)}</Option>)
                })
                setOptionList(pieroption)
                setFolderName({...folderName, typeFolderName:e})
            } else {
                setBridgeType("Abutment")
                setBridgeTypeName("교대")
            }
            
        }
    }
    
    const onChangeOption = (e: string) => {
        const folder: string = e.substring(0, 2)
        if (folder === 'G0') {
            setFolderName({...folderName, SubSpanFolderName:e})
        } else if (folder === 'S0') {
            setFolderName({...folderName, SpanFolderName:e })
        } else if (folder.includes('P') === true) {
            setFolderName({...folderName, SpanFolderName:e, SubSpanFolderName:""})
        } else if (folder.includes('Sl') === true) {
            setFolderName({...folderName, SubSpanFolderName:e})
        }
        setSelectImg([])
    }
    const menu1 = (
        <Menu>
            <Menu.Item style={{fontSize : "20px", fontWeight:"bold", textAlign:"center"}}>
                예상 요금
            </Menu.Item>
            <Menu.Item disabled style={{color:"black"}}>
                <CheckCircleTwoTone /> 사용 중인 요금제 : 베이직 요금제
            </Menu.Item>
            <Menu.Item disabled style={{color:"black"}}>
                <CheckCircleTwoTone/> 업로드 이미지 수량 : 906장
            </Menu.Item>
            <Menu.Item disabled style={{color:"black"}}>
                <CheckCircleTwoTone/> 업로드 이미지 용량 : 4.76GB
            </Menu.Item>
            <Menu.Item disabled style={{color:"black"}}>
                <CheckCircleTwoTone/> 예상 과금 : 1,362,400원
            </Menu.Item>
        </Menu>
    )

  return (
    <div className={styles.DivArea}>
        <div >
        <Row>
            <Col span={23}>
                <p className={styles.subOrder}>{t.ppPreprocessor} &gt; {t.ppImageFilter}</p>
                <p className={styles.mainOrder}>{t.ppImageFilter}</p>
            </Col>
            <Col span={1} style={{paddingLeft:"25px"}}>
                <Dropdown overlay={menu1}>
                    <DollarTwoTone style={{fontSize:"40px"}}/>
                </Dropdown>
            </Col>
        </Row>
           
        </div> 
        <div>

        {project_Type === 'Dam'?
            <div>
                <Select placeholder="선택해주세요" className={styles.selectDiv} onChange={onChangeType}>
                    {option_render()}
                </Select>
            </div> : <div></div>
        }
        {project_Type === 'Bridge'?
            <Select placeholder="선택해주세요" className={styles.BridgeDiv} onChange={onChangeType}>
                {option_render()}
            </Select>:""
        }
        {project_Type === 'Bridge' ?
            <Select placeholder="선택해주세요" className={styles.BirdgeDiv} onChange={onChangeOption}>
                {optionList}
            </Select>:""
        }      

        {confirmOption === true ?
            <Select placeholder="선택해주세요" className={styles.selectDiv} onChange={onChangeOption} id="subspan1">
                {girder_render()}
            </Select>  
            : ""
        }

            <div> 1. 전체 이미지
                  <Checkbox style={{ float: 'right' }} onClick={allClick} checked={checkAll}> 전체 선택 </Checkbox>
            </div>
            <div className={styles.filterScrollDiv}>
                <ul className={styles.ImageScrollDivUl}>
                    <div className={styles.ImageDiv}>
                        <div className={styles.ImageCheckDiv}/>
                        {confirmAll===true? AllImage() :  <p>전체 이미지 불러오는 중 입니다.</p>}
                    </div>
                </ul>
            </div>
            <div> 2. 사용 이미지</div>
                <div className={styles.filterScrollDiv}>
                {/* className={styles.ImageScrollDiv} */}
                    <ul className={styles.ImageScrollDivUl}>
                        <div className={styles.ImageDiv}>
                            <div className={styles.ImageCheckDiv}/>
                            {confirmSelect===true? SelectImg() :  <p>선택된 이미지 불러오는 중 입니다.</p>}
                        </div>
                    </ul>
                </div>
            <div> 3. 미사용 이미지</div>
            <div className={styles.filterScrollDiv}>
                <ul className={styles.ImageScrollDivUl}>
                    <div className={styles.ImageDiv}>
                        <div className={styles.ImageCheckDiv}/>
                            {confirmUnused===true? UnusedImg() :  <p>선택된 이미지 불러오는 중 입니다.</p>}
                    </div>
                </ul>
              </div>
              {project_Type === 'Airport' ?
                    <button style={{ marginRight: '3vw', width: '8vw', marginTop: '1vw', backgroundColor: 'rgb(206, 211, 233)', float: 'right' }}
                         onClick={FilterStart}
                    > 이미지 필터링
                    </button>:<div></div>  
              }
              {project_Type === 'Dam' ?
                    <button style={{ marginRight: '3vw', width: '8vw', marginTop: '1vw', backgroundColor: 'rgb(206, 211, 233)', float: 'right' }}
                         onClick={FilterStart2}
                    > 이미지 필터링
                    </button>:<div></div>  
              }
              {project_Type === 'Bridge' ?
                    <button style={{ marginRight: '3vw', width: '8vw', marginTop: '1vw', backgroundColor: 'rgb(206, 211, 233)', float: 'right' }}
                         onClick={FilterStart3}
                    > 이미지 필터링
                    </button>:<div></div>  
              }

              {/* <button style={{ marginRight: '3vw', width: '8vw', marginTop: '1vw', backgroundColor: 'rgb(206, 211, 233)', float: 'right' }}
                  onClick={project_Type === 'Airport'? FilterStart:FilterStart2}
               >
                이미지 필터링
             </button>   */}
        </div>
    </div>
  )
}

