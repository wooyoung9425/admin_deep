import styles from '../../../Styles/PanoramaManualBridge.module.css'
import { useRecoilState, atom } from 'recoil';
import { useEffect, useState } from 'react';
import { Button, Select, Table, Image } from "antd";
import { langState } from '../../../Store/State/atom'
import axios from 'axios';
import { ko, en } from '../../../translations';
import { API_URL, IMAGE_URL } from '../../../Store/Global';
import Moveable from "react-moveable";
import ReactDOM from 'react-dom/client';



const { Option } = Select;

interface ImgContents {
    no : number
    name : any
    sort : string
}

interface OriImage {
    no : any
    original_image : string
}

interface ImageUrl {
    num : Number;
    folderName : string;
    imageURL : Array<string>;
}


export default function PanoramaManualBridge() {

    const { Column } = Table;

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    let token : string | null = localStorage.getItem("token") 
    let project_id : string | null = localStorage.getItem("project_id")

    const ImgContents : ImgContents[] = []; 
    const OriImage : OriImage[] = [];  

    const [ImgList, setImgList] = useState<any | undefined>(ImgContents)
    const [ImgListOri, setImgListOri] = useState<any[]>(OriImage);

    const [resultOri, setResultOri] = useState<boolean>(false)
    const [resultDefect, setResultDefect] = useState<boolean>(false)

    const [num, setNum] = useState<number>(0);

    const [setting, setSetting]=useState<any>([])

    const [BridgeType, setBridgeType] = useState<string>("")
    const [GirderCount, setGirderCount] = useState<number>(0)

    const imagesAll : ImageUrl [] = [];

    const [ImageUrlList, setImageUrlList] = useState<any[]>(imagesAll);

    


    // const [selectOption, setSelectOption] = useState("") //G1
    // const [optionList, setOptionList] = useState()

    const [typeArr, setType]=useState([])
    // const [DamTypeCount, setDamTypeCount] = useState<number>(0);


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


    const [CopyImageUrlList, setCopyImageUrlList] = useState<any[]>(ImageUrlList);
    useEffect(()=>{
        setResultOri(false);
        setResultDefect(false);

        setImgList([])
        setImgListOri([])
        

        //교량 구조물 종류 받아오기
        axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers : {"accept" : `application/json`, "access-token" : `${token}`}, 
        }).then((res) => {
            const settings: any = JSON.parse(res.data.data.settings)
                setSetting(settings)
                setType(settings.bridge_type)
                setGirderCount(settings.girder_count)

                if(BridgeType === "Girder"){          
                    // stage4, 테이블 목록가져오기
                    for(let i = 0; i < settings.span_count; i++){
                        for(let k = 0; k < settings.span_length/settings.span_class_length; k++){
                            axios({
                                method: 'get',
                                url: API_URL+'/File/Files',
                                headers: { "accept": `application/json`, "access-token": `${token}` },
                                params: {
                                    path: `/project/${project_id}/stage4/${BridgeType}/S${settings.span_number_list[i].num.length === 2 ? settings.span_number_list[i].num+"0"+(k+1) : "0"+settings.span_number_list[i].num+"0"+(k+1)}`
                                }
                                }).then((res)=>{
                                    for(let y = 0; y < res.data.data.files.length; y++){
                                        ImgContents.push({
                                            no : ImgContents.length,
                                            name : <a style={{color:"black"}}>{res.data.data.files[y]}</a>,
                                            sort : res.data.data.files[y]
                                        })                                     
                                    } 
                                    for(let i = 0; i < 3; i++)
                                    for(let j=0; j<res.data.data.files.length; j++){
                                        // imagesAll[i].imageURL.push(`${IMAGE_URL}/image?path=/project/${project_id}/stage4/${BridgeType}/S${settings.span_number_list[i].num}}&width=360`)        
                                    }
                                    // console.log(`${IMAGE_URL}/image?path=/project/${project_id}/stage2/${BridgeType}/G01/C01/S${settings.span_number_list[i].num.length === 2 ? settings.span_number_list[i].num+"0"+(k+1) : "0"+settings.span_number_list[i].num+"0"+(k+1)}/${res.data.data.files[i]}`)

                                    ImgContents.sort((obj1, obj2) => {
                                            if (obj1.sort > obj2.sort) {
                                                return 1;
                                            }
                                            if (obj1.sort < obj2.sort) {
                                                return -1;
                                            }
                                            return 0;
                                    })
                                    let copyArrImgContents = [...ImgContents];    

                                    if(ImgContents.length === settings.girder_count * settings.span_length/settings.span_class_length * settings.span_count * settings.girder_camera_count){
                                        setResultOri(true);

                                        for(let j = 0; j < ImgContents.length; j++){
                                            // console.log(j+1)

                                            copyArrImgContents[j] = { ...copyArrImgContents[j], no : j+1};
                                        }
                                    }           
                                    
                                    setImgList(copyArrImgContents); 
                            })
                        }
                    }

                    for(let i = 0; i < settings.span_count; i++){
                        for(let j = 1; j < settings.girder_count+1; j++){
                            for(let y = 0; y < settings.girder_camera_count; y++){
                                for(let k = 1; k < settings.span_length/settings.span_class_length+1; k++){
                                    axios({
                                        method: 'get',
                                        url: API_URL+'/File/Files',
                                        headers: { "accept": `application/json`, "access-token": `${token}` },
                                        params: {
                                            path: `project/${project_id}/stage2/${BridgeType}/S00${settings.span_number_list[i].num}/${BridgeType}_G0${j}/C0${y+1}/S${settings.span_number_list[i].num.length === 2 ? settings.span_number_list[i].num+"0"+(k) : "0"+settings.span_number_list[i].num+"0"+(k)}`
                                        }
                                    }).then((res)=>{
                                        if (res.data.check === true) {


                                                imagesAll.push({
                                                    num : Number(`${settings.span_number_list[i].num.length === 2 ? settings.span_number_list[i].num+"0"+(k) : "0"+settings.span_number_list[i].num+"0"+(k)}`),
                                                    folderName : `${BridgeType}_G0${j}/C0${y+1}/S${settings.span_number_list[i].num.length === 2 ? settings.span_number_list[i].num+"0"+(k) : "0"+settings.span_number_list[i].num+"0"+(k)}`, 
                                                    imageURL : []
                                            })
                                            imagesAll.sort((obj1, obj2) => {
                                                if (obj1.folderName > obj2.folderName) {
                                                    return 1;
                                                }
                                                if (obj1.folderName < obj2.folderName) {
                                                    return -1;
                                                }
                                                return 0;
                                            })



                                        } else {
                                            console.log("실패")
                                        }
                                    }).catch((err) => {
                                        console.log(err);
                                    });  
                                }
                            }
                        }
                    } 


                    
                    
                    for(let i = 0; i < settings.span_count; i++){
                        for(let j = 1; j < settings.girder_count+1; j++){
                            for(let y = 0; y < settings.girder_camera_count; y++){
                                for(let k = 1; k < settings.span_length/settings.span_class_length+1; k++){
                                    axios({
                                        method: 'get',
                                        url: API_URL+'/File/Files',
                                        headers: { "accept": `application/json`, "access-token": `${token}` },
                                        params: {
                                            path: `project/${project_id}/stage2/${BridgeType}/S00${settings.span_number_list[i].num}/${BridgeType}_G0${j}/C0${y+1}/S${settings.span_number_list[i].num.length === 2 ? settings.span_number_list[i].num+"0"+(k) : "0"+settings.span_number_list[i].num+"0"+(k)}`
                                        }
                                    }).then((res)=>{
                                        if (res.data.check === true) {
                                            for(let z=0; z<res.data.data.files.length; z++){

                                                    imagesAll[settings.girder_count * settings.girder_camera_count * (settings.span_length/settings.span_class_length) * i + settings.girder_camera_count * (settings.span_length/settings.span_class_length) * (j-1) + (settings.span_length/settings.span_class_length) * y + (k-1)].imageURL.push(`${IMAGE_URL}/image?path=/project/${project_id}/stage2/${BridgeType}/S00${settings.span_number_list[i].num}/${BridgeType}_G0${j}/C0${y+1}/S${settings.span_number_list[i].num.length === 2 ? settings.span_number_list[i].num+"0"+(k) : "0"+settings.span_number_list[i].num+"0"+(k)}/${res.data.data.files[z]}&width=360`)                                                
                                                // console.log((i*24) + ((j-1)*12) + (y*(settings.span_length/settings.span_class_length)) + (k))
                                            }

                                            // setresultImageList(true);
                                            // console.log(imagesAll.length)
                                            if(imagesAll.length === settings.span_count * settings.girder_count * settings.girder_camera_count * settings.span_length/settings.span_class_length){
                                                setresultImageList(true);
                                            // setCopyImageUrlList(imagesAll[settings.girder_count * settings.girder_camera_count * (settings.span_length/settings.span_class_length) * i + settings.girder_camera_count * (settings.span_length/settings.span_class_length) * (j-1) + (settings.span_length/settings.span_class_length) * y + (k-1)].imageURL)

                                            }
                                        } else {
                                            console.log("실패")
                                        }
                                    }).catch((err) => {
                                        console.log(err);
                                    });  
                                }
                            }
                        }
                    } 
                    setImageUrlList(imagesAll)
                    // let copyImageUrlList = [...ImageUrlList];
                }
                else if(BridgeType === "GirderSide"){          
                    for(let i = 0; i < settings.span_count; i++){
                        for(let k = 0; k < settings.span_length/settings.span_class_length; k++)
                        {
                        axios({
                            method: 'get',
                            url: API_URL+'/File/Files',
                            headers: { "accept": `application/json`, "access-token": `${token}` },
                            params: {

                                path: `/project/${project_id}/stage4/${BridgeType}/S${settings.span_number_list[i].num.length === 2 ? settings.span_number_list[i].num+"0"+(k+1) : "0"+settings.span_number_list[i].num+"0"+(k+1)}`
                            }
                            
                            }).then((res)=>{
                                for(let y = 0; y < res.data.data.files.length; y++){
                                    const indexFront = res.data.data.files[y].indexOf("S") 
                                    const indexBack = res.data.data.files[y].indexOf(".png") 
                                    const SpanNum = res.data.data.files[y].substring(indexFront, indexBack)
                                    //console.log(`/project/${project_id}/stage4/${BridgeType}/S${settings.span_number_list[i].num.length === 2 ? settings.span_number_list[i].num+"0"+(k+1) : "0"+settings.span_number_list[i].num+"0"+(k+1)}`)

                                    OriImage.push({
                                        original_image : `${IMAGE_URL}/image?path=/project/${project_id}/stage4/${BridgeType}/S${settings.span_number_list[i].num.length === 2 ? settings.span_number_list[i].num+"0"+(k+1) : "0"+settings.span_number_list[i].num+"0"+(k+1)}/${res.data.data.files[y]}&width=1440`,
                                        no : OriImage.length
                                    })
                
                                    ImgContents.push({
                                        no : ImgContents.length+1,
                                        name : <a style={{color:"black"}}>{res.data.data.files[y]}</a>,
                                        sort : res.data.data.files[y]
                                    })                                     
                                } 
                                ImgContents.sort((obj1, obj2) => {
                                    if (obj1.no > obj2.no) {
                                        return 1;
                                    }
                                    if (obj1.no < obj2.no) {
                                        return -1;
                                    }
                                    return 0;
                            })

                                let copyArrOriImage = [...OriImage];
                                let copyArrImgContents = [...ImgContents];    

                                if(OriImage.length === settings.girder_count * settings.span_length/settings.span_class_length){
                                    setResultOri(true);
                                }           
                                //console.log(OriImage.length)

                                setImgListOri(copyArrOriImage);
                                setImgList(copyArrImgContents); 
                        })
                        }
                    }
                } 
                
                else if(BridgeType === "Slab"){          
                    for(let i = 0; i < settings.span_count; i++){
                        for(let k = 0; k < settings.span_length/settings.span_class_length; k++){
                        // console.log(`stage4/${BridgeType}/S${settings.span_number_list[i].num.length === 2 ? settings.span_number_list[i].num+(k+1) : settings.span_number_list[i].num+"0"+(k+1)}`)
                        // settings.span_number_list[i].num.length === 2 ? settings.span_number_list[i].num+"0"+(k+1) : "0"+settings.span_number_list[i].num+"0"+(k+1)
                        axios({
                            method: 'get',
                            url: API_URL+'/File/Files',
                            headers: { "accept": `application/json`, "access-token": `${token}` },
                            params: {
                                path: `/project/${project_id}/stage4/${BridgeType}/S${settings.span_number_list[i].num.length === 2 ? settings.span_number_list[i].num+"0"+(k+1) : "0"+settings.span_number_list[i].num+"0"+(k+1)}`
                            }
                            }).then((res)=>{
                                for(let y = 0; y < res.data.data.files.length; y++){
                                    const indexFront = res.data.data.files[y].indexOf("S") 
                                    const indexBack = res.data.data.files[y].indexOf(".png") 
                                    const SpanNum = res.data.data.files[y].substring(indexFront, indexBack)

                                    OriImage.push({
                                        original_image : `${IMAGE_URL}/image?path=/project/${project_id}/stage4/${BridgeType}/S${settings.span_number_list[i].num.length === 2 ? settings.span_number_list[i].num+"0"+(k+1) : "0"+settings.span_number_list[i].num+"0"+(k+1)}/${res.data.data.files[y]}&width=1440`,
                                        no : OriImage.length
                                    })
                
                                    ImgContents.push({
                                        no : ImgContents.length+1,
                                        name : <a style={{color:"black"}}>{res.data.data.files[y]}</a>,
                                        sort : SpanNum
                                    })                                     
                                } 

                                ImgContents.sort((obj1, obj2) => {
                                    if (obj1.no > obj2.no) {
                                        return 1;
                                    }
                                    if (obj1.no < obj2.no) {
                                        return -1;
                                    }
                                    return 0;
                            })

                                let copyArrOriImage = [...OriImage];
                                let copyArrImgContents = [...ImgContents];    

                                if(OriImage.length === settings.girder_count * settings.span_length/settings.span_class_length){
                                    setResultOri(true);
                                }           
                                console.log(settings.girder_count * settings.span_length/settings.span_class_length * settings.span_count * settings.girder_camera_count)
                                setImgListOri(copyArrOriImage);
                                setImgList(copyArrImgContents); 
                        })
                        }
                    }


                } 
                
                
                else if(BridgeType === "Pier"){
                    for(let i = 0; i < settings.span_count; i++){
                        axios({
                            method: 'get',
                            url: API_URL+'/File/Files',
                            headers: { "accept": `application/json`, "access-token": `${token}` },
                            params: {
                                path: `/project/${project_id}/stage4/${BridgeType}/P0${settings.span_number_list[i].num}`
                            }
                            }).then((res)=>{
                                for(let y = 0; y < res.data.data.files.length; y++){
                                    const indexFront = res.data.data.files[y].indexOf("S") 
                                    const indexBack = res.data.data.files[y].indexOf(".png") 
                                    const SpanNum = res.data.data.files[y].substring(indexFront, indexBack)

                                    OriImage.push({
                                        original_image : `${IMAGE_URL}/image?path=/project/${project_id}/stage4/${BridgeType}/P0${settings.span_number_list[i].num}/${res.data.data.files[y]}&width=1440`,
                                        no : OriImage.length
                                    })
                
                                    ImgContents.push({
                                        no : ImgContents.length+1,
                                        name : <a style={{color:"black"}}>{res.data.data.files[y]}</a>,
                                        sort : res.data.data.files[y]
                                    })                                     
                                } 
                                
                                ImgContents.sort((obj1, obj2) => {
                                    if (obj1.no > obj2.no) {
                                        return 1;
                                    }
                                    if (obj1.no < obj2.no) {
                                        return -1;
                                    }
                                    return 0;
                            })

                                let copyArrOriImage = [...OriImage];
                                let copyArrImgContents = [...ImgContents];    

                                if(OriImage.length > 0){
                                    setResultOri(true);
                                }           
                                console.log(settings.girder_count * settings.span_length/settings.span_class_length * settings.span_count * settings.girder_camera_count)
                                setImgListOri(copyArrOriImage);
                                setImgList(copyArrImgContents); 
                        })
                        
                    }
                    

                }
        }).catch((err) => {
            console.log(err);
        });     
        
    }, [BridgeType])

    const onClickTest = () => {
        console.log(CopyImageUrlList)
    }



    const option_render=()=>{
        const arr: any[] = [];
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
        return arr;
    }

    const onChangeType = (e: any) => {
        console.log(e);
        if (e === "Girder") {
            setBridgeType("Girder");
            } else if (e === "GirderSide") {
            setBridgeType("GirderSide");
            } else if (e === "Slab") {
            setBridgeType("Slab");
            } else if (e === "SlabSide") {
            setBridgeType("SlabSide");
            } else if (e === "Pier") {
            setBridgeType("Pier");
            } else {
            setBridgeType("Abutment");
            }
        };


    const rendering = () => {
        const result = [];    

            result.push(
                <div className={styles.DetectorDiv} >

                    <Button className={styles.nextBtn}>{t.upload}</Button>
                    <Button className={styles.nextBtn}>{t.save}</Button>
                    <div className={styles.DetectorImage}>
                        <Image src={resultOri === true ? ImgListOri[num].original_image : ""} alt="" width={1080} height={250} />
                    </div>
                </div>
            );
        return result;
    };

    useEffect(()=>{
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
                task_name: "manualpanorama_input",
                interactive: false,
                tasks: [
                    {
                        "input_yaml": "stage4/yml/Girder_G02_C02_S506"
                    }
                ]
            }
        }).then((res)=>{
            if (res.data.check === true) {
                console.log(" 성공", res.data)
                

                //Joint 복사 (stage1_2 -> stage2)
                
            }
        });
        
    },[])

    const [resultImageList, setresultImageList] = useState<boolean>(false)

    const manualrendering = () => {

        const resultImage:any[] = [];   
        const imageURLArray: any[] = [];     
        //console.log(ImageUrlList[num])
        imageURLArray.push(ImageUrlList[num].imageURL)
        //console.log(imageURLArray)
        ImageUrlList[num].imageURL.map((item:any, index:any) => {
            // console.log(index+1)
                resultImage.push(
                    <>
                <img src={item} className={`target${index+1}`} alt={item.imageURL} key={item.imageURL} style={{width:"20%", height:"20%", marginRight:"10px"}}/>
                <Moveable
                    target={`.target${index+1}`}
                    origin={false} edge={true} draggable={true}
                    onDrag={({target,transform,}) => {target.style.transform = transform;}}
                    onDragEnd={({ target, isDrag}) => {console.log("onDragEnd", target.style.transform, target.className);}}
                    keepRatio={true}
                    resizable={true}
                    onResize={({target, width, height, delta}) => {delta[0] && (target.style.width = `${width}px`); delta[1] && (target.style.height = `${height}px`);}}
                    onResizeEnd={({ target, isDrag}) => {console.log("onResizeEnd", target.style.width, target.style.height);}}
                    />
                    </>
                )
        }
        
        )

        return resultImage;
    }

        

    return (
        <>
            <div className={styles.DivArea}>
                <div>
                    <p className={styles.subOrder}>{t.PdPanorama} &gt; {t.pnmanualPanorama}</p>
                    <p className={styles.mainOrder}>{t.pnmanualPanorama}</p>
                    {/* <Button onClick={onClickTest}>테스트</Button> */}

                    <div>
                        <Select placeholder="선택해주세요" className={styles.BridgeDiv} onChange={onChangeType}>
                            {option_render()}
                        </Select>
                    </div>

                    <div className={styles.SetDiv}>
                        <div className={styles.CamList}>
                            <Table dataSource={resultOri === true ? ImgList:""} onRow={(record) => {
                                return {
                                onClick: (event) => {
                                setNum(record.no - 1);
                                console.log(record.sort)
                                },
                                };
                            }}>
                                <Column title={t.cnNumber} dataIndex="no" key="no" />
                                <Column title={t.cnName} dataIndex="name" key="no" />
                            </Table>
                        </div>
                        <div className={styles.content}>
                        { 
                        resultImageList === true ? 


                                <div className={styles.imgrenderbox}>
                                { manualrendering() }
                                </div>
        
                    

                            // ))
                            :   
                            <div>
                            이미지 로딩 중 입니다.

                            </div>                    
                    }
                        </div>

                        
                        {/* {rendering()} */}
                        {/* <div className={styles.content}>

                    <img
                    className="target1" src={`${testImage}01.png`} alt="target" style={{position: "absolute",left: "100px", top:"220px" ,width: "144px", height:"288px", cursor: "move"}}
                    /> 
                    <img
                    className="target2" src={`${testImage}02.png`} alt="target" style={{left: "164px", top:"220px" , position:"absolute", width: "144px", height:"288px", cursor: "move"  }}
                    /> 
                    <img
                    className="target3" src={`${testImage}03.png`} alt="target" style={{position: "absolute", left: "192px",top:"100px" , width: "144px", height:"288px", cursor: "move"}}
                    /> 
                    <img
                    className="target4" src={`${testImage}04.png`} alt="target" style={{position: "absolute", left: "241px", top:"211px" , width: "144px", height:"288px", cursor: "move"}}
                    /> 
                    <img
                    className="target5" src={`${testImage}05.png`} alt="target" style={{position: "absolute", left: "289px", top:"287px" , width: "144px", height:"288px", cursor: "move"}}
                    />         
                    <img
                    className="target6" src={`${testImage}06.png`} alt="target" style={{position: "absolute", left: "421px", top:"312px" ,width: "144px", height:"288px", cursor: "move"}}
                    /> 
                    <img
                    className="target7" src={`${testImage}07.png`} alt="target" style={{left: "497px", top:"138px" , position:"absolute", width: "144px", height:"288px", cursor: "move"  }}
                    /> 

                    <img
                    className="target8" src={`${testImage}08.png`} alt="target" style={{position: "absolute", left: "569px", top:"281px" , width: "144px", height:"288px", cursor: "move"}}
                    /> 
                    <img
                    className="target9" src={`${testImage}09.png`} alt="target" style={{position: "absolute", left: "658px", top:"149px"  , width: "144px", height:"288px", cursor: "move"}}
                    /> 
                    <img
                    className="target10" src={`${testImage}10.png`} alt="target" style={{position: "absolute", left: "754px", top:"269px" , width: "144px", height:"288px", cursor: "move"}}
                    />      



                    <Moveable
                    target={".target3"}
                    origin={false} edge={true} draggable={true}
                    onDrag={({target,transform,}) => {target.style.transform = transform;}}
                    onDragEnd={({ target, isDrag }) => {console.log("onDragEnd", target.style.transform, target.className);}}
                    keepRatio={true}
                    resizable={true}
                    onResize={({target, width, height, delta}) => {delta[0] && (target.style.width = `${width}px`); delta[1] && (target.style.height = `${height}px`);}}
                    onResizeEnd={({ target, isDrag}) => {console.log("onResizeEnd", target.style.width, target.style.height);}}
                    />

                    <Moveable
                    target={".target4"}
                    origin={false} edge={true} draggable={true}
                    onDrag={({target,transform,}) => {target.style.transform = transform;}}
                    onDragEnd={({ target, isDrag }) => {console.log("onDragEnd", target.style.transform, target.className);}}
                    keepRatio={true}
                    resizable={true}
                    onResize={({target, width, height, delta}) => {delta[0] && (target.style.width = `${width}px`); delta[1] && (target.style.height = `${height}px`);}}
                    onResizeEnd={({ target, isDrag}) => {console.log("onResizeEnd", target.style.width, target.style.height);}}
                    />
                    <Moveable
                    target={".target5"}
                    origin={false} edge={true} draggable={true}
                    onDrag={({target,transform,}) => {target.style.transform = transform;}}
                    onDragEnd={({ target, isDrag}) => {console.log("onDragEnd", target.style.transform, target.className);}}
                    keepRatio={true}
                    resizable={true}
                    onResize={({target, width, height, delta}) => {delta[0] && (target.style.width = `${width}px`); delta[1] && (target.style.height = `${height}px`);}}
                    onResizeEnd={({ target, isDrag}) => {console.log("onResizeEnd", target.style.width, target.style.height);}}
                    />

                    <Moveable
                    target={".target6"}
                    origin={false} edge={true} draggable={true}
                    onDrag={({target,transform,}) => {target.style.transform = transform;}}
                    onDragEnd={({ target, isDrag}) => {console.log("onDragEnd", target.style.transform, target.className);}}
                    keepRatio={true}
                    resizable={true}
                    onResize={({target, width, height, delta}) => {delta[0] && (target.style.width = `${width}px`); delta[1] && (target.style.height = `${height}px`);}}
                    onResizeEnd={({ target, isDrag}) => {console.log("onResizeEnd", target.style.width, target.style.height);}}
                    />

                    <Moveable
                    target={".target7"}
                    origin={false} edge={true} draggable={true}
                    onDrag={({target,transform,}) => {target.style.transform = transform;}}
                    onDragEnd={({ target, isDrag}) => {console.log("onDragEnd", target.style.transform, target.className);}}
                    keepRatio={true}
                    resizable={true}
                    onResize={({target, width, height, delta}) => {delta[0] && (target.style.width = `${width}px`); delta[1] && (target.style.height = `${height}px`);}}
                    onResizeEnd={({ target, isDrag}) => {console.log("onResizeEnd", target.style.width, target.style.height);}}
                    />
                    <Moveable
                    target={".target8"}
                    origin={false} edge={true} draggable={true}
                    onDrag={({target,transform,}) => {target.style.transform = transform;}}
                    onDragEnd={({ target, isDrag}) => {console.log("onDragEnd", target.style.transform, target.className);}}
                    keepRatio={true}
                    resizable={true}
                    onResize={({target, width, height, delta}) => {delta[0] && (target.style.width = `${width}px`); delta[1] && (target.style.height = `${height}px`);}}
                    onResizeEnd={({ target, isDrag}) => {console.log("onResizeEnd", target.style.width, target.style.height);}}
                    />

                    <Moveable
                    target={".target9"}
                    origin={false} edge={true} draggable={true}
                    onDrag={({target,transform,}) => {target.style.transform = transform;}}
                    onDragEnd={({ target, isDrag}) => {console.log("onDragEnd", target.style.transform, target.className);}}
                    keepRatio={true}
                    resizable={true}
                    onResize={({target, width, height, delta}) => {delta[0] && (target.style.width = `${width}px`); delta[1] && (target.style.height = `${height}px`);}}
                    onResizeEnd={({ target, isDrag}) => {console.log("onResizeEnd", target.style.width, target.style.height);}}
                    />
                    <Moveable
                    target={".target10"}
                    origin={false} edge={true} draggable={true}
                    onDrag={({target,transform,}) => {target.style.transform = transform;}}
                    onDragEnd={({ target, isDrag}) => {console.log("onDragEnd", target.style.transform, target.className);}}
                    keepRatio={true}
                    resizable={true}
                    onResize={({target, width, height, delta}) => {delta[0] && (target.style.width = `${width}px`); delta[1] && (target.style.height = `${height}px`);}}
                    onResizeEnd={({ target, isDrag}) => {console.log("onResizeEnd", target.style.width, target.style.height);}}
                    />

                </div> */}

                    </div>
                </div>
            </div>
        </>
    )
                        
}