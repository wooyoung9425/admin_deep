import styles from '../../../../Styles/CrackDetector_Measure.module.css'
import { useRecoilState, atom } from 'recoil';
import { useEffect, useState } from 'react';
import { Button, Select, Table, Image } from "antd";
import { langState } from '../../../../Store/State/atom'
import axios from 'axios';
import { ko, en } from '../../../../translations';
import { API_URL, IMAGE_URL } from '../../../../Store/Global';

const { Option } = Select;

interface ImgContents {
    no : number
    name : any
    sort : string
}

interface DetectorImage{
    no: any
    detector_image : string
    sort : string
}

interface CrackMeasureResultImage {
    no : any
    result_image : string
    sort : string
}

export default function BridgeCrackMeasure() {

    const { Column } = Table;

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    let token : string | null = localStorage.getItem("token") 
    let project_id : string | null = localStorage.getItem("project_id")

    const [BridgeType, setBridgeType] = useState<string>("")  
    const [typeArr, setType]=useState([])

    const [setting, setSetting]=useState<any>([])

    const ImgContents : ImgContents[] = []; 
    const DetectorImage : DetectorImage[] = [];  
    const CrackMeasureResultImage : CrackMeasureResultImage[] = [];

    const [ImgList, setImgList] = useState<any | undefined>(ImgContents)
    const [ImgListDetector, setImgListDetector] = useState<any[]>(DetectorImage);
    const [ImgListCrackMeasure, setImgListCrackMeasure] = useState<any[]>(CrackMeasureResultImage);

    const [resultDetector, setResultDetector] = useState<boolean>(false)
    const [resultCrack, setResultCrack] = useState<boolean>(false)

    
    const [num, setNum] = useState<number>(0);

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

    useEffect(()=> {
        localStorage.setItem('bridge_type', BridgeType)

        setResultDetector(false);
        setResultCrack(false);

        setImgList([])
        setImgListDetector([])
        setImgListCrackMeasure([])

        axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers : {"accept" : `application/json`, "access-token" : `${token}`}, 
        }).then((res) => {
            const settings: any = JSON.parse(res.data.data.settings)
            setSetting(settings)
            setType(settings.bridge_type)

            if(BridgeType === "Girder" || BridgeType === "Slab" || BridgeType === "GirderSide"){
                for(let i = 0; i < settings.span_count; i++){
                    for(let k = 0; k < settings.span_length/settings.span_class_length; k++){
                        axios({
                            method:'get',
                            url: API_URL+'/File/Files',
                            headers: {"accept":`application/json`, "access-token": `${token}`},
                            params: {
                                path: `/project/${project_id}/stage6_crack/${BridgeType}/S${settings.span_number_list[i].num.length === 2 ? settings.span_number_list[i].num+"0"+(k+1) : "0"+settings.span_number_list[i].num+"0"+(k+1)}`
                            }
                        }).then((res)=>{
                            for(let y = 0; y < res.data.data.files.length; y++){
                                const indexFront = res.data.data.files[y].indexOf("S") 
                                const indexBack = res.data.data.files[y].indexOf(".png") 
                                const SpanNum = res.data.data.files[y].substring(BridgeType==="Girder" ? indexFront
                                                                                                        : BridgeType === "GirderSide" ? indexFront+10 
                                                                                                        : indexFront+12, indexBack-6)

                                DetectorImage.push({
                                no : DetectorImage.length,
                                detector_image : `${IMAGE_URL}/image?path=/project/${project_id}/stage6_crack/${BridgeType}/S${settings.span_number_list[i].num.length === 2 ? settings.span_number_list[i].num+"0"+(k+1) : "0"+settings.span_number_list[i].num+"0"+(k+1)}/${res.data.data.files[y]}&width=1440`,
                                sort : SpanNum
                                })

                                ImgContents.push({
                                    no : ImgContents.length,
                                    name : <a style ={{color:"black"}}>{res.data.data.files[y]}</a>,
                                    sort : SpanNum
                                })
                            }

                                DetectorImage.sort((obj1, obj2) => {
                                    if(obj1.sort > obj2.sort){
                                        return 1;
                                    }
                                    if(obj1.sort < obj2.sort){
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

                                let copyArrDetectorImage = [...DetectorImage];
                                let copyArrImgContents = [...ImgContents];

                                if(BridgeType === "Girder"){
                                    if(DetectorImage.length === settings.girder_count * settings.span_length/settings.span_class_length * settings.span_count * settings.girder_camera_count){
                                        setResultDetector(true);

                                        for(let j = 0; j < DetectorImage.length; j++){
                                            copyArrDetectorImage[j] = {...copyArrDetectorImage[j], no : j+1};
                                            copyArrImgContents[j] = { ...copyArrImgContents[j], no : j+1};
                                        }
                                    }

                                }else if(BridgeType === "Slab"){
                                    if(DetectorImage.length === settings.slab_count * settings.span_length/settings.span_class_length * settings.span_count){
                                        setResultDetector(true);

                                        for(let j = 0; j < DetectorImage.length; j++){
                                            // console.log(j+1)
                                            copyArrDetectorImage[j] = { ...copyArrDetectorImage[j], no : j+1};
                                            copyArrImgContents[j] = { ...copyArrImgContents[j], no : j+1};
                                        }
                                    }
                                }else if(BridgeType === "GirderSide"){
                                    if(DetectorImage.length === settings.span_count * settings.span_length/settings.span_class_length){
                                        setResultDetector(true);

                                        for(let j = 0; j < DetectorImage.length; j++){
                                        // console.log(j+1)
                                            copyArrDetectorImage[j] = { ...copyArrDetectorImage[j], no : j+1};
                                            copyArrImgContents[j] = { ...copyArrImgContents[j], no : j+1};
                                        }
                                    }
                                }else if(BridgeType === "Pier"){
                                    if(DetectorImage.length === settings.pier_count * settings.pier_film_count){
                                        setResultDetector(true);

                                        for(let j = 0; j < DetectorImage.length; j++){
                                            copyArrDetectorImage[j] = { ...copyArrDetectorImage[j], no : j+1};
                                            copyArrImgContents[j] = { ...copyArrImgContents[j], no : j+1};
                                        }
                                    }
                                }
                                setImgListDetector(copyArrDetectorImage);
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
                        headers: {"accept":`application/json`, "access-token": `${token}`},
                        params: {
                            path: `/project/${project_id}/stage6_crack/${BridgeType}/P${settings.pier_number_list[i].num.length === 2 ? settings.pier_number_list[i].num : "0"+settings.pier_number_list[i].num}`
                        }
                    }).then((res) => {
                        for(let y = 0; y < res.data.data.files.length; y++){
                            if(res.data.data.files[y].includes(String(".png"))||res.data.data.files[y].includes(String(".JPG"))){
                                // console.log(res.data.data.files[y])
                                const indexFront = res.data.data.files[y].indexOf("_C")
                                const indexBack = res.data.data.files[y].indexOf(".png")
                                const SpanNum = res.data.data.files[y].substring(indexFront-8, indexBack)

                                // console.log(SpanNum)
    
                                DetectorImage.push({
                                    no : DetectorImage.length,
                                    detector_image : `${IMAGE_URL}/image?path=/project/${project_id}/stage6_crack/${BridgeType}/P${settings.pier_number_list[i].num.length === 2 ? settings.pier_number_list[i].num : "0"+settings.pier_number_list[i].num}/${res.data.data.files[y]}&width=1440`,
                                    sort : SpanNum
                                })

                                ImgContents.push({
                                    no : ImgContents.length,
                                    name : <a style ={{color:"black"}}>{res.data.data.files[y]}</a>,
                                    sort : SpanNum
                                })
                            }

                            DetectorImage.sort((obj1, obj2) => {
                                if(obj1.sort > obj2.sort){
                                    return 1;
                                }
                                if(obj1.sort < obj2.sort){
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

                            let copyArrDetectorImage = [...DetectorImage];
                            let copyArrImgContents = [...ImgContents];

                             if(DetectorImage.length === settings.pier_count * settings.pier_film_count){
                                setResultDetector(true);

                                for(let j = 0; j < DetectorImage.length; j++){
                                    copyArrDetectorImage[j] = {...copyArrDetectorImage[j], no : j+1};
                                    copyArrImgContents[j] = { ...copyArrImgContents[j], no : j+1};
                                }
                            }
                            setImgListDetector(copyArrDetectorImage);
                            setImgList(copyArrImgContents);
                        }
                    })
                }
            }

                axios({
                    method: 'get',
                    url : API_URL+'/File/Files',
                    headers : { "Contents-Type" : "application/json", "access-token": `${token}`},
                    params: {
                        path : `/project/${project_id}/stage7_crack/${BridgeType}`
                    }
                }).then((res)=>{
                    for(let y = 0; y < res.data.data.files.length; y++){
                        if(res.data.data.files[y].includes(String(".png"))){
                            const indexFront = res.data.data.files[y].indexOf("_M")
                            const indexBack = res.data.data.files[y].indexOf(".png")
                            // const SpanNum = res.data.data.files[y].substring(indexFront-8, indexBack-7)
                            const SpanNum = res.data.data.files[y].substring(BridgeType === "Pier" ? indexFront-8 
                                                                                                    : indexFront-5, indexBack-7)

                            // console.log(SpanNum)

                            CrackMeasureResultImage.push({
                                result_image : `${IMAGE_URL}/image?path=/project/${project_id}/stage7_crack/${BridgeType}/${res.data.data.files[y]}&width=1440`,
                                no : CrackMeasureResultImage.length,
                                sort : SpanNum
                            })

                            CrackMeasureResultImage.sort((obj1, obj2) => {
                                if(obj1.sort > obj2.sort){
                                    return 1;
                                }
                                if(obj1.sort < obj2.sort){
                                    return -1;
                                }
                                return 0;
                            })
                        }
                    }

                    let copyArrCrackResultImage = [...CrackMeasureResultImage];
                    if(BridgeType === "Girder"){
                        if(CrackMeasureResultImage.length === settings.girder_count * settings.span_length/settings.span_class_length * settings.span_count * settings.girder_camera_count){
                            setResultCrack(true);
                            for(let j = 0; j < CrackMeasureResultImage.length; j++){
                                copyArrCrackResultImage[j] = { ...copyArrCrackResultImage[j], no : j+1};
                            }
                        }
                    }else if(BridgeType === "Slab"){
                        if(CrackMeasureResultImage.length === settings.span_count * settings.span_length/settings.span_class_length * settings.slab_count){
                            setResultCrack(true);
                            for(let j = 0; j < CrackMeasureResultImage.length; j++){
                                copyArrCrackResultImage[j] = { ...copyArrCrackResultImage[j], no : j+1};
                            }
                        }
                    }else if(BridgeType === "GirderSide"){
                        if(CrackMeasureResultImage.length === settings.span_count * settings.span_length/settings.span_class_length){
                            setResultCrack(true);
                            for(let j = 0; j < CrackMeasureResultImage.length; j++){
                                copyArrCrackResultImage[j] = { ...copyArrCrackResultImage[j], no : j+1};
                            }
                        }
                    }else if(BridgeType === "Pier"){
                        if(CrackMeasureResultImage.length === settings.pier_count * settings.pier_film_count){
                            setResultCrack(true);
                            for(let j = 0; j < CrackMeasureResultImage.length; j++){
                                copyArrCrackResultImage[j] = { ...copyArrCrackResultImage[j], no : j+1};
                            }
                        }
                    }
                    setImgListCrackMeasure(copyArrCrackResultImage)
                })
        }).catch((err) => {
            console.log(err);
        })

    }, [BridgeType])

    const onChangeType = (e:any) => {
        if (e === 'Girder') {
            setBridgeType("Girder")
        } else if (e === 'GirderSide'){
            setBridgeType('GirderSide')
        } else if (e === 'Slab') {
            setBridgeType("Slab")
        } else if (e === 'Slab_Side') {
            setBridgeType("Slab_Side")
        } else if (e === 'Pier') {
            setBridgeType("Pier")
        } else if (e ==='Abutment'){
            setBridgeType("Abutment")
        }
    }

    const option_render=()=>{
        const arr: any[] = [];
        typeArr.map((type:any)=>{
                let name=''
            if (type === 'Girder') {
                name = '거더 하면'
            } else if(type==='GirderSide'){
                    name='거더 측면'
            }else if(type==='Slab'){
                name='슬라브 하면'
            } else if (type === 'Slab_Side') {
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

    const downloadCouple = () => {

        alert("30초 정도 기다리시면 다운로드 됩니다.")

        const indexFrontOri = ImgListDetector[num].detector_image.indexOf("/stage")
        const indexBackOri= ImgListDetector[num].detector_image.indexOf("&width")   
        const ImageUrlCutWidthOri = ImgListDetector[num].detector_image.substring(indexFrontOri+1, indexBackOri)

        console.log("원본 경로 : ", ImageUrlCutWidthOri)

        const indexFrontCrackName = ImgListCrackMeasure[num].result_image.indexOf("/stage")
        const indexBackCrackName= ImgListCrackMeasure[num].result_image.indexOf("&width")   
        const ImageUrlCutWidthCrackName = ImgListCrackMeasure[num].result_image.substring(BridgeType === "Girder" ? indexFrontCrackName+21
                                                                                                            : BridgeType === "Pier" ? indexFrontCrackName+19
                                                                                                            : BridgeType === "Slab" ? indexFrontCrackName+19
                                                                                                            : indexFrontCrackName+25, indexBackCrackName)

        console.log("균열 커플 이미지 이름 : ", ImageUrlCutWidthCrackName)

        const indexFrontCrack = ImgListCrackMeasure[num].result_image.indexOf("/stage")
        const indexBackCrack= ImgListCrackMeasure[num].result_image.indexOf("&width")   
        const ImageUrlCutWidthCrack = ImgListCrackMeasure[num].result_image.substring(indexFrontCrack+1, indexBackCrack)

        console.log("균열 경로 : ", ImageUrlCutWidthCrack)

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
                task_name: "image_join",
                interactive: false,
                tasks: [{
                    image1_path: ImageUrlCutWidthOri,
                    image2_path: ImageUrlCutWidthCrack,
                    align: 0, //수평 //수직으로 하려면 0
                    output_folder: 'stage7_Couple',
                    output_name: ImageUrlCutWidthCrackName
                }]
                }
        }).then((res) => {
            console.log(res.data.check)
            if (res.data.check === true) {
                job_id = res.data.data.job_id
                        /////20초마다 alert로 알려줌////////////
                resultCouple = setInterval(confirm, 10000)
            } else {
                console.log("실패")
            }
        })
    }

    let job_id = 0;
    let resultCouple :any;

    async function confirm(){        
        axios({
            method: "post",
            url: API_URL + '/scheduler/job/query',
            headers: { "accept": `application/json`, "access-token": `${token}`, "Content-Type" : `application/json` },
                data: {
                    "job_id": job_id ,
                    "company_id": companyid
                }
                  }).then(async (res) => {
                console.log(res)
                if (res.data.check === true) {
                    if (res.data.data.status === "done") {
                        console.log("성공")
                        setTimeout(()=>
                            download()
                        ,10000)                    
                        clearInterval(resultCouple)
                    } else if (res.data.data.status === "progress") {
                    } else if(res.data.data.status === "error"){
                        alert("해당 파일이 없습니다.")
                    }
                } else {
                    console.log("실패")
                }
            })
        
    }

    async function download(){
        console.log("지금! 다운로드 해!")

        const indexFrontCrackName = ImgListCrackMeasure[num].result_image.indexOf("/stage")
        const indexBackCrackName= ImgListCrackMeasure[num].result_image.indexOf("&width")   
        const ImageUrlCutWidthCrackName = ImgListCrackMeasure[num].result_image.substring(BridgeType === "Girder" ? indexFrontCrackName+21
                                                                                                            : BridgeType === "Pier" ? indexFrontCrackName+19
                                                                                                            : BridgeType === "Slab" ? indexFrontCrackName+19
                                                                                                            : indexFrontCrackName+25, indexBackCrackName)

        console.log("균열 커플 이미지 이름 : ", ImageUrlCutWidthCrackName)

        const linkCrack = document.createElement('a');
        let srcCrack = `${IMAGE_URL}/image?path=/project/${project_id}/stage7_Couple/${ImageUrlCutWidthCrackName}`;
        const imageBlobCrack = await (await fetch(srcCrack)).blob();
        srcCrack = URL.createObjectURL(imageBlobCrack);
        linkCrack.href = srcCrack;
        linkCrack.download = ImageUrlCutWidthCrackName
        linkCrack.click();
    }

    const rendering = () => {
        const result = [];    

        resultCrack === true ? localStorage.setItem('edit_crack_image', ImgListCrackMeasure[num].result_image) : localStorage.setItem('edit_crack_image', "")

        // console.log(resultOri === true ? ImgListDetector[num].original_image.substring(64) : "")
        // console.log(resultOri === true ? ImgListOri[num].original_image : "")
        // console.log(resultOri === true ? ImgListOri[num].original_image.substring(ImgListOri[num].original_image.indexOf("/stage") + 13, ImgListOri[num].original_image.indexOf("&width")): "")

            result.push(
                <div className={styles.DetectorDiv} >
                    {
                        BridgeType === "Girder" ? 
                        <span className={styles.DetectorTitle}>{resultDetector === true ?  ImgListDetector[num].detector_image.substring(ImgListDetector[num].detector_image.indexOf("/stage") + 27, ImgListDetector[num].detector_image.indexOf("&width")) : ""}</span>
                        : BridgeType === "Pier" ? 
                        <span className={styles.DetectorTitle}>{resultDetector === true ? ImgListDetector[num].detector_image.substring(ImgListDetector[num].detector_image.indexOf("/stage") + 23, ImgListDetector[num].detector_image.indexOf("&width")): ""}</span>
                        : BridgeType === "Slab" ?
                        <span className={styles.DetectorTitle}>{resultDetector === true ? ImgListDetector[num].detector_image.substring(ImgListDetector[num].detector_image.indexOf("/stage") + 25, ImgListDetector[num].detector_image.indexOf("&width")): ""}</span>
                        : <span className={styles.DetectorTitle}>{resultDetector === true ? ImgListDetector[num].detector_image.substring(ImgListDetector[num].detector_image.indexOf("/stage") + 31, ImgListDetector[num].detector_image.indexOf("&width")) : ""}</span>
                    }
                    
                    <Button className={styles.downloadBtn} onClick={downloadCouple}>{t.coupledownload}</Button> 
                    <div className={styles.DetectorImage}>
                        <Image src={resultDetector === true ? ImgListDetector[num].detector_image : ""} alt="" width={1080} height={250} />
                    </div>
                    <div className={styles.DetectorImage}>
                        <Image src={resultCrack === true ? ImgListCrackMeasure[num].result_image : ""} alt="" width={1080} height={250} />
                    </div>
                </div>
            );
        return result;
    };

    return (
        <>
            <div className={styles.DivArea}>
                <div>
                    <p className={styles.subOrder}>{t.dmDetectorMeasure} &gt; {t.cnMeasure}</p>
                    <p className={styles.mainOrder}>{t.cnMeasure}</p>
                    <div>
                        <Select placeholder="선택해주세요" className={styles.BridgeDiv} onChange = {onChangeType}>
                            {option_render()}
                        </Select>
                    </div>

                    <div className={styles.SetDiv}>
                        <div className={styles.CamList}>
                            <Table dataSource={resultDetector === true ? ImgList:""} onRow={(record) => {
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
                    </div>
                </div>

            </div>
        </>
    )
}
