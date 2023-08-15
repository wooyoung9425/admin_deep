import styles from '../../../Styles/PanoramaHorBridge.module.css'
import { useRecoilState, atom } from 'recoil';
import { useEffect, useState } from 'react';
import { Button, Select, Table, Image } from "antd";
import { langState } from '../../../Store/State/atom'
import axios from 'axios';
import { ko, en } from '../../../translations';
import { API_URL, IMAGE_URL } from '../../../Store/Global';

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

export default function DefectDetector() {

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
                // console.log(settings)
                setSetting(settings)
                setType(settings.bridge_type)
                setGirderCount(settings.girder_count)
                console.log(BridgeType)

                if(BridgeType === "Girder"){          
                    for(let i = 0; i < settings.span_count; i++){
                        for(let k = 0; k < settings.span_length/settings.span_class_length; k++){
                        axios({
                            method: 'get',
                            url: API_URL+'/File/Files',
                            headers: { "accept": `application/json`, "access-token": `${token}` },
                            params: {
                                path: `/project/${project_id}/stage4/${BridgeType}/S${"0"+settings.span_number_list[i].num+"0"+(k+1)}`
                            }
                            }).then((res)=>{
                                for(let y = 0; y < res.data.data.files.length; y++){
                                    const indexFront = res.data.data.files[y].indexOf("S") 
                                    const indexBack = res.data.data.files[y].indexOf(".png") 
                                    const SpanNum = res.data.data.files[y].substring(indexFront, indexBack)

                                    OriImage.push({
                                        original_image : `${IMAGE_URL}/image?path=/project/${project_id}/stage4/${BridgeType}/S${"0"+settings.span_number_list[i].num+"0"+(k+1)}/${res.data.data.files[y]}&width=1440`,
                                        no : OriImage.length
                                    })
                
                                    ImgContents.push({
                                        no : ImgContents.length,
                                        name : <a style={{color:"black"}}>{res.data.data.files[y]}</a>,
                                        sort : SpanNum
                                    })                                     
                                } 

                                OriImage.sort((obj1, obj2) => {
                                        if (obj1.original_image > obj2.original_image) {
                                            return 1;
                                        }
                                        if (obj1.original_image < obj2.original_image) {
                                            return -1;
                                        }
                                        return 0;
                                })
                                    
                                ImgContents.sort((obj1, obj2) => {
                                        if (obj1.sort > obj2.sort) {
                                            return 1;
                                        }
                                        if (obj1.sort < obj2.sort) {
                                            return -1;
                                        }
                                        return 0;
                                })

                                let copyArrOriImage = [...OriImage];
                                let copyArrImgContents = [...ImgContents];    

                                if(OriImage.length === settings.girder_count * settings.span_length/settings.span_class_length * settings.span_count * settings.girder_camera_count){
                                    setResultOri(true);

                                    for(let j = 0; j < OriImage.length; j++){
                                        // console.log(j+1)
                                        copyArrOriImage[j] = { ...copyArrOriImage[j], no : j+1};
                                        copyArrImgContents[j] = { ...copyArrImgContents[j], no : j+1};
                                    }
                                }           
                                
                                setImgListOri(copyArrOriImage);
                                setImgList(copyArrImgContents); 
                                // console.log(`stage4/${BridgeType}/S${settings.span_number_list[i].num.length === 2 ? settings.span_number_list[i].num+"0"+(k+1) : "0"+settings.span_number_list[i].num+"0"+(k+1)}`)
                        })
                        }
                    }
                } if(BridgeType === "Slab"){          
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
                                console.log(settings.girder_count * settings.span_length/settings.span_class_length * settings.span_count * settings.girder_camera_count)
                                setImgListOri(copyArrOriImage);
                                setImgList(copyArrImgContents); 
                        })
                        }
                    }
                } 
                if(BridgeType === "Pier"){
                    for(let i = 0; i < settings.pier_count; i++){
                        axios({
                            method: 'get',
                            url: API_URL+'/File/Files',
                            headers: { "accept": `application/json`, "access-token": `${token}` },
                            params: {
                                path: `/project/${project_id}/stage4/${BridgeType}/P0${settings.pier_number_list[i].num}`
                            }
                            }).then((res)=>{
                                for(let y = 0; y < res.data.data.files.length; y++){
                                    const indexFront = res.data.data.files[y].indexOf("S") 
                                    const indexBack = res.data.data.files[y].indexOf(".png") 
                                    const SpanNum = res.data.data.files[y].substring(indexFront, indexBack)

                                    OriImage.push({
                                        original_image : `${IMAGE_URL}/image?path=/project/${project_id}/stage4/${BridgeType}/P0${settings.pier_number_list[i].num}/${res.data.data.files[y]}&width=1440`,
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
                                    // console.log(`/project/${project_id}/stage4/${BridgeType}/S${settings.span_number_list[i].num.length === 2 ? settings.span_number_list[i].num+"0"+(k+1) : "0"+settings.span_number_list[i].num+"0"+(k+1)}`)
                                    // console.log(res.data.data.length)

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

                                setImgListOri(copyArrOriImage);
                                setImgList(copyArrImgContents); 
                        })
                        }
                    }
                } 

                
        }).catch((err) => {
            console.log(err);
        });     
        
    }, [BridgeType])

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
            console.log("Pise")
            } else {
            setBridgeType("Abutment");
            }
        };

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
                arr.push(<Option value={type} > {name}</Option>)
            })
        return arr;
    }

    const onClickPonirama = (e:any) => {

        alert("수직 파노라마 작업 중입니다. 잠시만 기다려주세요.")
        setTimeout(function() {
            alert("이미지 추출이 완료되었습니다.")
          }, 1000);

    }





    const rendering = () => {
        const result = [];    

            result.push(
                <div className={styles.PanoramaDiv} >                    
                    
                    <div className={styles.PanoramaImage}>
                        <Image src={resultOri === true ? ImgListOri[num].original_image : ""} alt="" width={1080} height={350} />
                    </div>
                </div>
            );

        return result;
    };

    return (
        <>
            <div className={styles.DivArea}>
                <div>
                    <p className={styles.subOrder}>{t.PdPanorama} &gt; {t.pnVerticalPanorama}</p>
                    <p className={styles.mainOrder}>{t.pnVerticalPanorama}</p>

                    <div>
                        <Select placeholder="선택해주세요"   className={styles.BridgeDiv} onChange={onChangeType} >
                            {option_render()}
                        </Select>
                    </div>

                    <div className={styles.SetDiv}>
                        <div className={styles.CamList}>
                            <Table dataSource={resultOri === true ? ImgList:""} onRow={(record) => {
                                return {
                                onClick: (event) => {
                                setNum(record.no - 1);
                                },
                                };
                            }}>
                                <Column title={t.cnNumber} dataIndex="no" key="no" />
                                <Column title={t.cnName} dataIndex="name" key="no" />
                            </Table>
                        </div>
                        
                        {rendering()}
                        <Button  style={{width:"150px", marginTop: "30px", marginLeft: "1200px"}} onClick={onClickPonirama} disabled={BridgeType === 'Girder' ? false : (BridgeType === 'Slab' ? false : (BridgeType === 'Pier' ? false : true))}>수직 파노라마 실행</Button>
                    </div>
                </div>
            </div>
        </>
    )
}
