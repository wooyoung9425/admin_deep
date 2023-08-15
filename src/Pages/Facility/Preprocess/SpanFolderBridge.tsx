import { Button, Tabs, Select} from 'antd';
import { useEffect, useState } from 'react';
import styles from '../../../Styles/Preprocess.module.css'
import { ko, en } from '../../../translations';
import { useRecoilState, atom } from 'recoil';
import { langState } from '../../../Store/State/atom'
import axios from "axios";
import { API_URL, IMAGE_URL } from '../../../Store/Global';

const { Option } = Select;

interface Image {
        camerafolderName : string;
        spanfolderName : string;
        imageURL : Array<string>;
}

export default function SpanFolderBridge() {

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    let token : string | null = localStorage.getItem("token") 
    let project_id : string | null = localStorage.getItem("project_id")
    const project_type = localStorage.getItem("project_Type");

    const { TabPane } = Tabs;

    const images : Image [] = [];

    const [typeArr, setType]=useState([])

    const [ImgList, setImgList] = useState<any[]>(images);

    const [BridgeType, setBridgeType] = useState<string>("")
    const [selectOptionGirderSpan, setselectOptionGirderSpan] = useState("") //G1
    const [selectOptionGirder, setSelectOptionGirder] = useState("") //G1
    const [GirderCount, setGirderCount] = useState<number>(0)
    const [SlabCount, setSlabCount] = useState<number>(0)
    const [PierCount, setPierCount] = useState<number>(0)
    const [SpanCount, setSpanCount] = useState<number>(0)
    const [SpanNumList, setSpanNumList] = useState<any>([])
    const [PierNumList, setPierNumList] = useState<any>([])

    const [girderOption, setgirderOption] = useState<boolean>(false);
    const [girderSideOption, setgirderSideOption] = useState<boolean>(false);
    const [SlabOption, setSlabOption] = useState<boolean>(false);
    const [pierOption, setpierOption] = useState<boolean>(false);

    const [girderSpanOptionList, setgirderSpanOptionList] = useState()
    const [girderOptionList, setgirderOptionList] = useState()

    const [resultImageList, setresultImageList] = useState<boolean>(false)

    useEffect(()=>{
        let path: any

        axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers : {"accept" : `application/json`, "access-token" : `${token}`}, 
        }).then((res) => {
            if (res.data.check === true) {
                const settings: any = JSON.parse(res.data.data.settings)
                    setType(settings.bridge_type)
                    setGirderCount(settings.girder_count)
                    setSlabCount(settings.slab_count)
                    setPierCount(settings.pier_count)
                    setSpanCount(settings.span_count)
                    setSpanNumList(settings.span_number_list)
                    setPierNumList(settings.pier_number_list)

                    //거더 선택 시
                    if(BridgeType === "Girder"){
                                for(let k = 0; k < settings.girder_camera_count; k++){
                                    for(let l = 0; l < settings.span_length / settings.span_class_length; l++){
                                        images.push({
                                            camerafolderName:"C" + String(k+1).padStart(2,"0"),
                                            spanfolderName : "S" + String(selectOptionGirderSpan.substring(2,3) === "0" ? String(selectOptionGirderSpan.substring(3,4)).padStart(2,"0") : selectOptionGirderSpan.substring(2,4)) + String(l+1).padStart(2,"0"),
                                            imageURL : []
                                        })
                                    }
                                }

                                for(let k = 0; k < settings.girder_camera_count; k++){
                                    for(let l = 0; l < settings.span_length / settings.span_class_length; l++){
                                        path = `/project/${project_id}/stage2/${BridgeType}/${selectOptionGirderSpan}/${BridgeType}_${selectOptionGirder}/C${String(k+1).padStart(2,"0")}/S` + `${String(selectOptionGirderSpan.substring(2,3) === "0" ? String(selectOptionGirderSpan.substring(3,4)).padStart(2,"0") : selectOptionGirderSpan.substring(2,4)) + String(l+1).padStart(2,"0")}`
                                        // console.log("path : ", path)                                            
                                    axios({
                                        method: 'get',
                                        url: API_URL + `/File/Files`,
                                        headers: { "accept" : `application/json`, "access-token": `${token}` },
                                        params: { path : path }
                                    }).then((res) => { 
                                        if (res.data.check === true) {
                                            for(let j = 0;  j< res.data.data.files.length; j++){
                                                // console.log(`${IMAGE_URL}/image?path=/project/${project_id}/stage2/${BridgeType}/${selectOptionGirderSpan}/${selectOptionGirder}/C${String(k+1).padStart(2,"0")}/S` + `${String(selectOptionGirderSpan.substring(2,3) === "0" ? String(selectOptionGirderSpan.substring(3,4)).padStart(2,"0") : selectOptionGirderSpan.substring(2,4)) + String(l+1).padStart(2,"0")}/${res.data.data.files[j]}&width=360`)
                                                images[6*(k)+l].imageURL.push(`${IMAGE_URL}/image?path=/project/${project_id}/stage2/${BridgeType}/${selectOptionGirderSpan}/${BridgeType}_${selectOptionGirder}/C${String(k+1).padStart(2,"0")}/S` + `${String(selectOptionGirderSpan.substring(2,3) === "0" ? String(selectOptionGirderSpan.substring(3,4)).padStart(2,"0") : selectOptionGirderSpan.substring(2,4)) + String(l+1).padStart(2,"0")}/${res.data.data.files[j]}&width=360`)
                                                // images[6*(k)+l].imageURL.push(`${IMAGE_URL}/image?path=/project/${project_id}/stage2/${BridgeType}/${selectOptionGirderSpan}/${selectOptionGirder}/C${String(k+1).padStart(2,"0")}/S` + `${String(selectOptionGirderSpan.substring(2,3) === "0" ? selectOptionGirderSpan.substring(3,4) : selectOptionGirderSpan.substring(2,4)) + String(selectOptionGirderSpan.substring(2,3) === "0" ? String(l+1).padStart(2,"0"): String(l+1).padStart(1,"0"))}/${res.data.data.files[j]}&width=360`)
                                            }
                                            setresultImageList(true);
                                        }
                                    })
                                    }
                                }
                    setImgList(images);
                    }   

                    //거더 측면 선택 시
                    if(BridgeType === "GirderSide"){
                        for(let i = 0; i < settings.span_length / settings.span_class_length; i++){
                            images.push({
                                camerafolderName : "",
                                spanfolderName : "S" + String(selectOptionGirderSpan.substring(2,3) === "0" ? String(selectOptionGirderSpan.substring(3,4)).padStart(2,"0") : selectOptionGirderSpan.substring(2,4)) + String(i+1).padStart(2,"0"),
                                imageURL: []
                            })
                        }

                        for(let i = 0; i < settings.span_length / settings.span_class_length; i++){
                            path = `/project/${project_id}/stage2/${BridgeType}/${selectOptionGirderSpan}/S${String(selectOptionGirderSpan.substring(2,3) === "0" ? String(selectOptionGirderSpan.substring(3,4)).padStart(2,"0") : selectOptionGirderSpan.substring(2,4)) + String(i+1).padStart(2,"0")}`
                            axios({
                                method: 'get',
                                url: API_URL + `/File/Files`,
                                headers: { "accept" : `application/json`, "access-token": `${token}` },
                                params: {
                                    path : path
                                }
                            }).then((res) => {
                                if(res.data.check === true){
                                    // console.log(res.data.data.files)
                                    for(let j = 0; j < res.data.data.files.length; j++){
                                        images[i].imageURL.push(`${IMAGE_URL}/image?path=/project/${project_id}/stage2/${BridgeType}/${selectOptionGirderSpan}/S${String(selectOptionGirderSpan.substring(2,3) === "0" ? String(selectOptionGirderSpan.substring(3,4)).padStart(2,"0") : selectOptionGirderSpan.substring(2,4)) + String(i+1).padStart(2,"0")}/${res.data.data.files[j]}&width=360`)
                                    }
                                    setresultImageList(true);
                                }
                            })
                        }
                        setImgList(images);
                    }
                    
                    
                    //교각 선택 시
                    if(BridgeType === "Pier"){
                            for(let j = 0; j < settings.pier_film_count; j++){
                                images.push({
                                    camerafolderName : selectOptionGirder,
                                    spanfolderName :"S" + String(j+1).padStart(3,"0"),
                                    imageURL : []
                                    })
                            }

                            for(let i = 0; i < settings.pier_film_count; i++){
                                path = `/project/${project_id}/stage2/${BridgeType}/${selectOptionGirder}/S${String(i+1).padStart(3,"0")}`
                                axios({
                                method: 'get',
                                url: API_URL + `/File/Files`,
                                headers: { "accept" : `application/json`, "access-token": `${token}` },
                                params: { 
                                    path :  path
                                }
                                }).then((res) => { 
                                    if (res.data.check === true) {
                                        for(let k = 0;  k< res.data.data.files.length; k++){
                                            images[i].imageURL.push(`${IMAGE_URL}/image?path=/project/${project_id}/stage2/${BridgeType}/${selectOptionGirder}/S${String(i+1).padStart(3,"0")}/${res.data.data.files[k]}&width=360`)
                                        }
                                        setresultImageList(true);
                                    }
                                })  
                            }
                        setImgList(images);
                    } 

                    //슬라브 선택 시
                    if(BridgeType === "Slab"){
                        for(let i = 0; i < settings.slab_count; i++){
                            for(let j = 0; j<settings.span_length / settings.span_class_length; j++){
                                images.push({
                                    camerafolderName : selectOptionGirder,
                                    spanfolderName : "S"+String(selectOptionGirderSpan.substring(2,3) === "0" ? String(selectOptionGirderSpan.substring(3,4)).padStart(2,"0") : selectOptionGirderSpan.substring(2,4)) + String(j+1).padStart(2,"0"),
                                    imageURL : []
                                })
                            }
                        }

                        for(let i =0; i <settings.slab_count; i++){
                            for(let j = 0; j <settings.span_length / settings.span_class_length; j++){
                                path = `/project/${project_id}/stage2/${BridgeType}/${selectOptionGirderSpan}/${selectOptionGirder}/S` + `${String(selectOptionGirderSpan.substring(2,3) === "0" ? String(selectOptionGirderSpan.substring(3,4)).padStart(2,"0") : selectOptionGirderSpan.substring(2,4)) + String(j+1).padStart(2,"0")}`
                                // console.log(`/project/${project_id}/stage2/${BridgeType}/${selectOptionGirderSpan}/${selectOptionGirder}/S` + `${String(selectOptionGirderSpan.substring(2,3) === "0" ? String(selectOptionGirderSpan.substring(3,4)).padStart(2,"0") : selectOptionGirderSpan.substring(2,4)) + String(j+1).padStart(2,"0")}`)
                                axios({
                                    method: 'get',
                                    url: API_URL + `/File/Files`,
                                    headers: { "accept" : `application/json`, "access-token": `${token}` },
                                    params: { path : path }
                                }).then((res) => { 
                                    if (res.data.check === true) {
                                        for(let k = 0;  k< res.data.data.files.length; k++){
                                            images[6*(i)+j].imageURL.push(`${IMAGE_URL}/image?path=/project/${project_id}/stage2/${BridgeType}/${selectOptionGirderSpan}/${selectOptionGirder}/S` + `${String(selectOptionGirderSpan.substring(2,3) === "0" ? String(selectOptionGirderSpan.substring(3,4)).padStart(2,"0") : selectOptionGirderSpan.substring(2,4)) + String(j+1).padStart(2,"0")}/${res.data.data.files[k]}&width=360`)
                                        }
                                        setresultImageList(true);
                                    }
                                })
                            }
                        }

                    setImgList(images);   
                    
                    }
            }
        }).catch((err) => {
            console.log(err);
        });

    }, [BridgeType, selectOptionGirder, selectOptionGirderSpan])

    const option_render=()=>{
        const arr: any[] = [];
            typeArr.map((type: any) => {
                let name = ''
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
        // console.log(e)
        setgirderOption(false)
        setgirderSideOption(false)
        setSlabOption(false)
        setpierOption(false)

            if (e === 'Girder') {
                setBridgeType("Girder")
                setgirderOption(true)
                let girderSpanOption : any=[]
                let girderoption :any=[]
                for(let i = 1; i < SpanCount + 1; i++){
                    girderSpanOption.push(<Option value={'S' + String(SpanNumList[i-1].num).padStart(3,"0")}> Span {String(SpanNumList[i-1].num)} </Option>)
                }
                for (let i = 1; i< GirderCount+ 1; i++){
                    girderoption.push(<Option value={'Girder' + String(i).padStart(2,"0")}> Girder {i}</Option>)
                }
                setgirderSpanOptionList(girderSpanOption)
                setgirderOptionList(girderoption)
            } else if (e === 'GirderSide'){
                setBridgeType("GirderSide")
                setgirderSideOption(true)
                let girderSideSpanOption : any = []
                for(let i = 1; i < SpanCount + 1; i++){
                    girderSideSpanOption.push(<Option value={'S' + String(SpanNumList[i-1].num).padStart(3,"0")}> Span {String(SpanNumList[i-1].num)} </Option>)
                }
                setgirderSpanOptionList(girderSideSpanOption)
            } else if (e === 'Slab') {
                setBridgeType("Slab")
                setSlabOption(true)
                let slabSpanOption : any = []
                let slaboption : any =[]
                for(let i = 1; i < SpanCount + 1; i++){
                    slabSpanOption.push(<Option value={'S' + String(SpanNumList[i-1].num).padStart(3,"0")}> Span {String(SpanNumList[i-1].num)} </Option>)
                }
                for(let i = 1; i < SlabCount + 1; i++){
                    slaboption.push(<Option value = {'Slab' + String(i).padStart(2,"0")}> Slab {i}</Option>)
                }
                setgirderSpanOptionList(slabSpanOption)
                setgirderOptionList(slaboption)
            } else if (e === 'Slab_Side'){
                setBridgeType('Slab_Side')
            } else if (e === 'Pier') {
                setBridgeType("Pier")
                setpierOption(true)
                let pieroption : any =[]
                // console.log(PierCount)
                for(let i = 1; i < PierCount + 1; i++){
                    pieroption.push(<Option value={'Pier' + String(PierNumList[i-1].num).padStart(2,"0")}> Pier {String(PierNumList[i-1].num)} </Option>)
                }
                setgirderOptionList(pieroption)
            } else if (e === 'Abutment') {
                setBridgeType("Abutment")
            }
    }

    const onChange1 = (e: string) => {
        if(BridgeType === 'Girder'){
            const n = e.length
            setSelectOptionGirder("G" + String(e.substring(n - 2, n)).padStart(2,"0"))
        }else if(BridgeType === 'GirderSide'){

        }else if(BridgeType === 'Slab'){
            const n = e.length
            setSelectOptionGirder("Slab"+String(e.substring(n - 2, n)).padStart(2,"0"))
        }else if(BridgeType === 'Slab_Side'){
        }else if(BridgeType === 'Pier'){
            const n = e.length
            setSelectOptionGirder("P"+String(e.substring(n - 2, n)).padStart(2,"0"))
        }else if(BridgeType === 'Abutment'){
            
        }
    }

    const onChange2 = (e: string) => {
        setselectOptionGirderSpan(e)
    }

    const renderingImg = (j:number) => {
        const resultImage:any[] = []; 

        
        ImgList[j].imageURL.map((imageURL:any)=>{
            resultImage.push(<img src={imageURL} id={String(j)} alt={imageURL} key={imageURL} className={styles.JtagImage}/>)
        })
        // console.log(resultImage)

        if(resultImage.length < 1){
            setresultImageList(false);
        }
        return resultImage;
    }

    const rendering = () => {
        const result:any[] = [];
        
        result.push(
            <div className={styles.JtagDiv}>
                        { 
                        resultImageList === true ? 
                            ImgList.map((_,j)=>(
                                <div className={BridgeType === "Girder" ? styles.ImageScrollDiv : styles.ImageScrollDivDrone}>
                                    <ul className={styles.ImageScrollDivUl}>
                                    <div className={styles.ImageDiv}>
                                    {girderOption === true ?
                                        <div>{selectOptionGirder}. {ImgList[j].camerafolderName}. {ImgList[j].spanfolderName}</div>
                                    : girderSideOption === true ?
                                    <div>{ImgList[j].spanfolderName}</div>
                                    :
                                    <div>{ImgList[j].camerafolderName}. {ImgList[j].spanfolderName}</div>
                                    }   
                                        <br />
                                        { renderingImg(j) }
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
        )
        return result;
    }

    return (
        <>
            <div className={styles.DivArea}>
                <p className={styles.subOrder}>{t.ppPreprocessor} &gt; {t.ppDistFolder}</p>
                <p className={styles.mainOrder}>{t.ppDistFolder}</p>

                <div>
                {/* 거더, 거더 측면, 슬라브, 교각 선택 */}
                <Select placeholder="선택해주세요" className={styles.BridgeDiv} onChange={onChangeType}>
                    {option_render()}
                </Select>
                
                {/* 교량 스팬 선택 */}
                {girderOption === true || SlabOption === true || girderSideOption === true ?
                <Select placeholder="선택해주세요" className={styles.BridgeDiv} onChange={onChange2}>
                    {girderSpanOptionList}
                </Select>  
                : ""
                }

                {/* 거더 번호, 슬라브 번호, 교각 스팬 번호 선택 */}
                {girderOption === true || pierOption === true  || SlabOption === true ?
                <Select placeholder="선택해주세요" className={styles.BridgeDiv} onChange={onChange1}>
                    {girderOptionList}
                </Select>  
                : ""
                }
                {rendering()}
            </div>
            </div>
        </>
    )
}
