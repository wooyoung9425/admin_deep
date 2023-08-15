import styles from '../../../Styles/Preprocess.module.css'
import { ko, en } from '../../../translations';
import { useRecoilState, atom } from 'recoil';
import { langState } from '../../../Store/State/atom'
import { useEffect, useState } from 'react';
import axios from "axios";
import { API_URL, IMAGE_URL } from '../../../Store/Global';
import { Tabs } from 'antd';
import { setFlagsFromString } from 'v8';

interface ImgLoad {
    load : string;
    imageURL : Array<string>;    
}

export default function SpanFolderDam() {

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    let token : string | null = localStorage.getItem("token") 
    let project_id : string | null = localStorage.getItem("project_id")

    const ImgLoad : ImgLoad[] = [];
    
    const [ImgLoadList, setImgLoadList]=useState<any[]>(ImgLoad)
    // const [carea, setCarea] = useState<any>([])

    const [setting, setSetting]=useState<any>([])
    const [typeArr, setType]=useState([])

    const [resultImageList, setresultImageList] = useState<boolean>(false)

    const { TabPane } = Tabs;

    useEffect(()=>{
        axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers : {"accept" : `application/json`, "access-token" : `${token}`}, 
        }).then((res) => {
            const settings: any = JSON.parse(res.data.data.settings)
                setSetting(settings)
                setType(settings.dam_type)     
        }).catch((err) => {
            console.log(err);
        });



        axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers : {"accept" : `application/json`, "access-token" : `${token}`}, 
        }).then((res) => {
            if (res.data.check === true) {
                const getSettings: any = JSON.parse(res.data.data.settings)
                    //폴더 내부 폴더 목록 가져오기///////////////////////////////////////
                    for(let i=0; i<getSettings.dam_type.length; i++){
                        axios({
                            method: 'get',
                            url: API_URL + "/file/folders",
                            headers : {"accept" : `application/json`, "access-token" : `${token}`}, 
                            params: {
                                path: `/project/${project_id}/stage2/${getSettings.dam_type[i]}/${getSettings.dam_eng}`
                            }
                        }).then((res1) => {
                            if (res1.data.check === true) {

                                // setUarea(res1.data.data.folders)
                                
                                /////////////////////////////////////////////////////////////////////
                                for(let j=0; j<res1.data.data.folders.length; j++){
                                    axios({
                                        method: 'get',
                                        url: API_URL + "/file/folders",
                                        headers : {"accept" : `application/json`, "access-token" : `${token}`}, 
                                        params: {
                                            path: `/project/${project_id}/stage2/${getSettings.dam_type[i]}/${getSettings.dam_eng}/${res1.data.data.folders[j]}`
                                        }
                                    }).then((res2) => {
                                        if (res2.data.check === true) {
                                            console.log("성ㅇㅇㅇ공ㅇㅇㅇ")
                                            console.log(`/project/${project_id}/stage2/${getSettings.dam_type[i]}/${getSettings.dam_eng}`)
                                            // console.log(res2.data.data.folders)
                                            // console.log(res1.data.data.folders[j] + "/" + res2.data.data.folders[0] + "/S001")
                                            ImgLoad.push({
                                                // load : `${res1.data.data.folders[j]}/${res2.data.data.folders[0]}/S001`,
                                                load : `${res1.data.data.folders[j]}/${res2.data.data.folders[0]}/S001`,
                                                imageURL : []
                                            })

                                            axios({
                                                method: 'get',
                                                url: API_URL+'/file/folders',
                                                headers: { "accept": `application/json`, "access-token": `${token}` },
                                                params: {
                                                    path: `/project/${project_id}/stage2/${getSettings.dam_type[i]}/${getSettings.dam_eng}/${res1.data.data.folders[j]}/${res2.data.data.folders[0]}/S001`
                                                }
                                            }).then((res3)=>{
                                                if (res3.data.check === true) {
                                                    
                                                    console.log(getSettings.dam_type[i])
                                                    console.log(res1.data.data.folders[j])
                                                    console.log(res2.data.data.folders[0])

                                                    for(let k = 0; k < res3.data.data.folders.length; k++){
                                                        ImgLoad[j].imageURL.push(`${IMAGE_URL}/image?path=/project/${project_id}/stage2/${getSettings.dam_type[i]}/${getSettings.dam_eng}/${res1.data.data.folders[j]}/${res2.data.data.folders[0]}/S001/${res3.data.data.files[k]}&width=360`)
                                                    } 

                                                    setresultImageList(true);
                                                    setImgLoadList(ImgLoad)

                                                } else {
                                                    console.log("실패")
                                                }
                                            }).catch((err) => {
                                                console.log(err);
                                            });
                                        }
                                    }).catch((err) => {
                                        console.log(err);
                                    });

                                    

                                }                                
                                //////////////////////////////////////////////////////////////////////////
                            }
                        }).catch((err) => {
                            console.log(err);
                        });
                    }                    
                    ///////////////////////////////////////////////////////////////////
            }
        }).catch((err) => {
            console.log(err);
        });

        // console.log(ImgLoadList.length)
        // console.log(ImgLoad)
        // console.log(ImgLoadList)
    },[])

    const rendering = (j:number) => {
        const resultImage:any[] = [];        
        ImgLoadList[j].imageURL.map((imageURL:any)=>{
            resultImage.push(<img src={imageURL} id={String(j)} alt={imageURL} key={imageURL} className={styles.JtagImage}/>)
        })
            
        if(resultImage.length < 1){
            setresultImageList(false);
        }
        return resultImage;
    }

    const Tabrendering = () => {
        const resultTab:any[] = []; 
        // const img = [...ImgLoadList]
        // console.log(img[0])
        let dam_type_length:number = 0;

        resultImageList === true ? console.log(ImgLoadList) : console.log("")
        resultImageList === true ?  dam_type_length = setting.dam_type.length : <div></div>


        for (let i = 1; i < dam_type_length+1; i++) {

            resultTab.push(     
                <TabPane tab={setting.dam_type[i-1]} key={i}>
                    <div className={styles.JtagDiv}>
                        { 
                                resultImageList === true ? 
                                ImgLoadList.map((_,j)=>(
                                        <div className={styles.ImageScrollDivDrone}>
                                            <ul className={styles.ImageScrollDivUl}>
                                            <div className={styles.ImageDiv}>
                                                <div>{ImgLoadList[j].load}</div>
                                                <br />
                                                { rendering(j)}
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
                </TabPane>
            )  

        }
        return resultTab;
    }

    return (
        <>
            <div className={styles.DivArea}>
                <p className={styles.subOrder}>{t.ppPreprocessor} &gt; {t.ppDistFolder}</p>
                <p className={styles.mainOrder}>{t.ppDistFolder}</p> 

                <Tabs defaultActiveKey="1">
                { Tabrendering()}
                </Tabs>
            </div>

        </>
    )
}