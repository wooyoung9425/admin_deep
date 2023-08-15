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

interface OriImage {
    no : any
    original_image : string
}

interface DefectResultImage {
    no : any
    result_image : string
    sort : string
}

export default function DefectDetector() {

    const { Column } = Table;

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    let token : string | null = localStorage.getItem("token") 
    let project_id : string | null = localStorage.getItem("project_id")

    const ImgContents : ImgContents[] = []; 
    const OriImage : OriImage[] = [];  
    const DefectResultImage : DefectResultImage[] = [];
    
    const [ImgList, setImgList] = useState<any | undefined>(ImgContents)
    const [ImgListOri, setImgListOri] = useState<any[]>(OriImage);
    const [ImgListDefect, setImgListDefect] = useState<any[]>(DefectResultImage);

    const [resultOri, setResultOri] = useState<boolean>(false)
    const [resultDefect, setResultDefect] = useState<boolean>(false)

    const [num, setNum] = useState<number>(0);

    const [setting, setSetting]=useState<any>([])

    const [BridgeType, setBridgeType] = useState<string>("")
    const [GirderCount, setGirderCount] = useState<number>(0)

    const [typeArr, setType]=useState([])

    useEffect(()=>{

        localStorage.setItem('bridge_type', BridgeType)

        setResultOri(false);
        setResultDefect(false);

        setImgList([])
        setImgListOri([])
        setImgListDefect([])

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

                if(BridgeType === "Girder" || BridgeType === "Slab" || BridgeType === "GirderSide"){   

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

                                    console.log(SpanNum);

                                    OriImage.push({
                                        original_image : `${IMAGE_URL}/image?path=/project/${project_id}/stage4/${BridgeType}/S${settings.span_number_list[i].num.length === 2 ? settings.span_number_list[i].num+"0"+(k+1) : "0"+settings.span_number_list[i].num+"0"+(k+1)}/${res.data.data.files[y]}&width=1440`,
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

                                if(BridgeType === "Girder"){
                                    if(OriImage.length === settings.girder_count * settings.span_length/settings.span_class_length * settings.span_count * settings.girder_camera_count){
                                        setResultOri(true);
    
                                        for(let j = 0; j < OriImage.length; j++){
                                            // console.log(j+1)
                                            copyArrOriImage[j] = { ...copyArrOriImage[j], no : j+1};
                                            copyArrImgContents[j] = { ...copyArrImgContents[j], no : j+1};
                                        }
                                    } 
                                }else if(BridgeType === "Slab"){
                                    if(OriImage.length === settings.slab_count * settings.span_length/settings.span_class_length * settings.span_count){
                                        setResultOri(true);
    
                                        for(let j = 0; j < OriImage.length; j++){
                                            // console.log(j+1)
                                            copyArrOriImage[j] = { ...copyArrOriImage[j], no : j+1};
                                            copyArrImgContents[j] = { ...copyArrImgContents[j], no : j+1};
                                        }
                                    }
                                }else if(BridgeType === "GirderSide"){
                                    if(OriImage.length === settings.span_count * settings.span_length/settings.span_class_length){
                                        setResultOri(true);

                                        for(let j = 0; j < OriImage.length; j++){
                                            // console.log(j+1)
                                            copyArrOriImage[j] = { ...copyArrOriImage[j], no : j+1};
                                            copyArrImgContents[j] = { ...copyArrImgContents[j], no : j+1};
                                        }
                                    }
                                }
                                
                                setImgListOri(copyArrOriImage);
                                setImgList(copyArrImgContents); 
                        })
                        }
                    }

                    //결함 검출 결과
                    axios({
                        method: 'get',
                        url: API_URL+'/File/Files',
                        headers: { "accept": `application/json`, "access-token": `${token}` },
                        params: {
                            path: `/project/${project_id}/stage6_defect/${BridgeType}`
                        }
                    }).then((res)=>{
                        for(let y = 0; y < res.data.data.files.length; y++){
                            if(res.data.data.files[y].includes(String(".png")) || res.data.data.files[y].includes(String(".JPG"))){
                                const indexFront = BridgeType === "Girder" ?  res.data.data.files[y].indexOf("S") : res.data.data.files[y].length
                                const indexBack = res.data.data.files[y].indexOf(".png") 
                                const SpanNum = BridgeType === "Girder" ? res.data.data.files[y].substring(indexFront, indexBack-7) : res.data.data.files[y].substring(indexFront-11, indexBack-12)

                                DefectResultImage.push({
                                    result_image : `${IMAGE_URL}/image?path=/project/${project_id}/stage6_defect/${BridgeType}/${res.data.data.files[y]}&width=1440`,
                                    no : DefectResultImage.length,
                                    sort : SpanNum
                                })

                                DefectResultImage.sort((obj1, obj2) => {
                                    if (obj1.sort > obj2.sort) {
                                        return 1;
                                    }
                                    if (obj1.sort < obj2.sort) {
                                        return -1;
                                    }
                                        return 0;
                                    })
                            }
                        }

                        let copyArrResultImage = [...DefectResultImage]; 

                        if(BridgeType === "Girder"){
                            if(DefectResultImage.length === settings.girder_count * settings.span_length/settings.span_class_length * settings.span_count * settings.girder_camera_count){
                                setResultDefect(true);
    
                                for(let j = 0; j < DefectResultImage.length; j++){
                                    copyArrResultImage[j] = { ...copyArrResultImage[j], no : j+1};
                                }
                            }else{
                                alert("모든 결과가 나올 때까지 기다려주세요.")
                            }
                        }else if(BridgeType === "Slab"){
                            if(DefectResultImage.length === settings.span_count * settings.span_length/settings.span_class_length * settings.slab_count){
                                setResultDefect(true);
    
                                for(let j = 0; j < DefectResultImage.length; j++){
                                    copyArrResultImage[j] = { ...copyArrResultImage[j], no : j+1};
                                }
                            }else{
                                alert("모든 결과가 나올 때까지 기다려주세요.")
                            }
                        }else if(BridgeType === "GirderSide"){
                            if(DefectResultImage.length === settings.span_count * settings.span_length/settings.span_class_length){
                                setResultDefect(true);

                                for(let j = 0; j> DefectResultImage.length; j++){
                                    copyArrResultImage[j] = { ...copyArrResultImage[j], no : j+1};
                                }
                            }else{
                                alert("모든 결과가 나올 때까지 기다려주세요.")
                            }
                        }
                        setImgListDefect(copyArrResultImage)
                    })

                }else if(BridgeType === "Pier"){
                    //교각 파노라마 원본 이미지
                    for(let i = 0; i < settings.pier_count; i++){
                        axios({
                            method: 'get',
                            url: API_URL+'/File/Files',
                            headers: { "accept": `application/json`, "access-token": `${token}` },
                            params: {
                                path: `/project/${project_id}/stage4/${BridgeType}/P${settings.pier_number_list[i].num.length === 2 ? settings.pier_number_list[i].num : "0"+settings.pier_number_list[i].num}`
                            }
                        }).then((res)=> {
                                for(let j = 0; j < res.data.data.files.length; j++){
                                    const indexFront = res.data.data.files[j].indexOf("S") 
                                    const indexBack = res.data.data.files[j].indexOf(".png") 
                                    const SpanNum = res.data.data.files[j].substring(indexFront-4, indexBack)

                                    console.log(SpanNum)
                                
                                    OriImage.push({
                                        original_image : `${IMAGE_URL}/image?path=/project/${project_id}/stage4/${BridgeType}/P${settings.pier_number_list[i].num.length === 2 ? settings.pier_number_list[i].num : "0"+settings.pier_number_list[i].num}/${res.data.data.files[j]}&width=1440`,
                                        no : OriImage.length
                                    })
    
                                    ImgContents.push({
                                        no : ImgContents.length + 1,
                                        name : <a style={{color:"black"}}>{res.data.data.files[j]}</a>,
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

                                if(OriImage.length === settings.pier_count * settings.pier_film_count){
                                    setResultOri(true);

                                    for(let j = 0; j < OriImage.length; j++){
                                        // console.log(j+1)
                                        copyArrOriImage[j] = { ...copyArrOriImage[j], no : j+1};
                                        copyArrImgContents[j] = { ...copyArrImgContents[j], no : j+1};
                                    }
                                }
                                setImgListOri(copyArrOriImage);
                                setImgList(copyArrImgContents); 
                            })

                            // setNewDefectMeasureList(DefectMeasure);
                            // setNewCrackMeasureList(CrackMeasure);
                    }

                    //교각 결함 검출 이미지
                    axios({
                            method: 'get',
                            url: API_URL+'/File/Files',
                            headers: { "accept": `application/json`, "access-token": `${token}` },
                            params: {
                                path: `/project/${project_id}/stage6_defect/${BridgeType}`
                            }
                    }).then((res)=> {
                                for(let i = 0; i < res.data.data.files.length; i++){
                                    if(res.data.data.files[i].includes(String(".png")) || res.data.data.files[i].includes(String(".JPG"))){

                                        DefectResultImage.push({
                                        result_image : `${IMAGE_URL}/image?path=/project/${project_id}/stage6_defect/${BridgeType}/${res.data.data.files[i]}&width=1440`,
                                        no : DefectResultImage.length,
                                        sort : ""
                                    })

                                    if(DefectResultImage.length === settings.pier_count * settings.pier_film_count){
                                        setResultDefect(true);
                                    }
                                    }
                                }
                                setImgListDefect(DefectResultImage)
                    })

                }
        }).catch((err) => {
            console.log(err);
        });     
        
    }, [BridgeType])

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

    const downloadCouple = () => {

        alert("30초 정도 기다리시면 다운로드 됩니다.")

        const indexFrontOri = ImgListOri[num].original_image.indexOf("/stage")
        const indexBackOri= ImgListOri[num].original_image.indexOf("&width")   
        const ImageUrlCutWidthOri = ImgListOri[num].original_image.substring(indexFrontOri+1, indexBackOri)

        // console.log("원본 경로 : ", ImageUrlCutWidthOri)

        const indexFrontDefectName = ImgListDefect[num].result_image.indexOf("/stage")
        const indexBackDefectName= ImgListDefect[num].result_image.indexOf("&width")   
        const ImageUrlCutWidthDefectName = ImgListDefect[num].result_image.substring(BridgeType === "Girder" ? indexFrontDefectName+22
                                                                                                            : BridgeType === "Pier" ? indexFrontDefectName+20
                                                                                                            : BridgeType === "Slab" ? indexFrontDefectName+20
                                                                                                            : indexFrontDefectName+26, indexBackDefectName)

        // console.log("결함 커플 이미지 이름 : ", ImageUrlCutWidthDefectName)

        const indexFrontDefect = ImgListDefect[num].result_image.indexOf("/stage")
        const indexBackDefect= ImgListDefect[num].result_image.indexOf("&width")   
        const ImageUrlCutWidthDefect = ImgListDefect[num].result_image.substring(indexFrontDefect+1, indexBackDefect)

        // console.log("결함 경로 : ", ImageUrlCutWidthDefect)

        axios({
            method: 'post',
            url: API_URL+'/Job/Start',
            headers: { "accept": `application/json`, "access-token": `${token}` },  
            data: {
                project_id: project_id,
                task_name: "image_join",
                interactive: false,
                tasks: [{
                    image1_path: ImageUrlCutWidthOri,
                    image2_path: ImageUrlCutWidthDefect,
                    align: 0, //수평 //수직으로 하려면 0
                    output_folder: 'stage6_Couple',
                    output_name: ImageUrlCutWidthDefectName
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
            method: 'post',
            url: API_URL + '/Job/Query',
            headers: { "accept": `application/json`, "access-token": `${token}` },
            data: { job_id: job_id}
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

        const indexFrontDefectName = ImgListDefect[num].result_image.indexOf("/stage")
        const indexBackDefectName= ImgListDefect[num].result_image.indexOf("&width")   
        const ImageUrlCutWidthDefectName = ImgListDefect[num].result_image.substring(BridgeType === "Girder" ? indexFrontDefectName+22
                                                                                                            : BridgeType === "Pier" ? indexFrontDefectName+20
                                                                                                            : BridgeType === "Slab" ? indexFrontDefectName+20
                                                                                                            : indexFrontDefectName+26, indexBackDefectName)

        // console.log("결함 커플 이미지 이름 : ", ImageUrlCutWidthDefectName)

        const linkDefect = document.createElement('a');
        let srcDefect = `${IMAGE_URL}/image?path=/project/${project_id}/stage6_Couple/${ImageUrlCutWidthDefectName}`;
        const imageBlobDefect = await (await fetch(srcDefect)).blob();
        srcDefect = URL.createObjectURL(imageBlobDefect);
        linkDefect.href = srcDefect;
        linkDefect.download = ImageUrlCutWidthDefectName
        linkDefect.click();
    }

    const openWindowDefect = () => {
        window.open('../../ViewerDefect', "결함 결과 수정", "width=1650px, height=1200px, left=300, top=150");
    }

    const rendering = () => {
        const result = [];    

        resultDefect === true ? localStorage.setItem('edit_defect_image', ImgListDefect[num].result_image) : localStorage.setItem('edit_defect_image', "")
        // console.log(resultOri === true ? ImgListOri[num].original_image.substring(64) : "")
        // console.log(resultOri === true ? ImgListOri[num].original_image : "")
        // console.log(resultOri === true ? ImgListOri[num].original_image.substring(ImgListOri[num].original_image.indexOf("/stage") + 13, ImgListOri[num].original_image.indexOf("&width")): "")

            result.push(
                <div className={styles.DetectorDiv} >
                    {
                        BridgeType === "Girder" ? 
                        <span className={styles.DetectorTitle}>{resultOri === true ?  ImgListOri[num].original_image.substring(ImgListOri[num].original_image.indexOf("/stage") + 21, ImgListOri[num].original_image.indexOf("&width")) : ""}</span>
                        : BridgeType === "Pier" ? 
                        <span className={styles.DetectorTitle}>{resultOri === true ? ImgListOri[num].original_image.substring(ImgListOri[num].original_image.indexOf("/stage") + 17, ImgListOri[num].original_image.indexOf("&width")): ""}</span>
                        : BridgeType === "Slab" ?
                        <span className={styles.DetectorTitle}>{resultOri === true ? ImgListOri[num].original_image.substring(ImgListOri[num].original_image.indexOf("/stage") + 19, ImgListOri[num].original_image.indexOf("&width")): ""}</span>
                        : <span className={styles.DetectorTitle}>{resultOri === true ? ImgListOri[num].original_image.substring(ImgListOri[num].original_image.indexOf("/stage") + 25, ImgListOri[num].original_image.indexOf("&width")) : ""}</span>
                    }
                    
                    
                    <Button className={styles.downloadBtn} onClick={downloadCouple}>{t.coupledownload}</Button> 
                    <Button className={styles.downloadBtn} onClick={openWindowDefect}>결함 결과 수정</Button>

                    <div className={styles.DetectorImage}>
                        <Image src={resultOri === true ? ImgListOri[num].original_image : ""} alt="" width={1080} height={250} />
                    </div>
                    <div className={styles.DetectorImage}>
                        <Image src={resultDefect === true ? ImgListDefect[num].result_image : ""} alt="" width={1080} height={250} />
                    </div>
                </div>
            );

        return result;
    };

    return (
        <>
            <div className={styles.DivArea}>
                <div>
                    <p className={styles.subOrder}>{t.dmDetectorMeasure} &gt; {t.dmDefectDetector}</p>
                    <p className={styles.mainOrder}>{t.dmDefectDetector}</p>
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
