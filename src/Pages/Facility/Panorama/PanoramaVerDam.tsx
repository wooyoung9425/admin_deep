import styles from '../../../Styles/PanoramaVer.module.css'
import { Button, Tabs, Image, Table } from "antd";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilState, atom } from 'recoil';
import { langState } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import { API_URL, IMAGE_URL } from '../../../Store/Global';

interface ImgContents {
    no : number
    name : any
    sort : any
}


interface ResultImage {
    no : any
    result_image : string
}


export default function PanoramaVerDam() {

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    const { Column } = Table;

    let token : string | null = localStorage.getItem("token") 
    let project_id : string | null = localStorage.getItem("project_id")

    const ImgContents : ImgContents[] = [];   
    const ResultImage : ResultImage[] = [];  



    const [num, setNum] = useState<number>(0);
    const [ImgList, setImgList] = useState<any | undefined>(ImgContents)

    const [ImgListCrack, setImgListCrack] = useState<any[]>(ResultImage);

    const [resultCrack, setResultCrack] = useState<boolean>(false)

    useEffect(() => {

        axios({
            method: 'get',
            url: API_URL+'/File/Files',
            headers: { "accept": `application/json`, "access-token": `${token}` },
            params: {
                path: `/project/${project_id}/stage5`
            }
        }).then((res)=>{
            if (res.data.check === true) {
                // console.log("성공")
                
                for(let i = 0; i<res.data.data.files.length; i++){
                    ResultImage.push({
                        result_image : `${IMAGE_URL}/image?path=/project/${project_id}/stage5/${res.data.data.files[i]}&width=1440`,
                        no : 6
                    })

                    ImgContents.push({
                                    no : i,
                                    name : res.data.data.files[i],
                                    sort : i+1
                                })
                }

                if(ResultImage.length > 0){
                    setResultCrack(true);
                    console.log(res.data.data.files)
                }else{
                    alert("결과가 나올 때까지 기다려주세요.")
                }

            // } else {
            //     alert('수직파노라마를 실행해주세요.')
            }

                ImgContents.sort((obj1, obj2) => {
                    if (obj1.sort > obj2.sort) {
                        return 1;
                    }
                    if (obj1.sort < obj2.sort) {
                        return -1;
                    }
                    return 0;
                    })

            let copyArrImgList = [...ImgList];

            for(let i = 0; i < ImgList.length; i++){
                copyArrImgList[i] = { ...copyArrImgList[i], no : i};
            }
            setImgList(copyArrImgList)
            // console.log(ImgList, "ImgListttttt")

            ResultImage.sort((obj1, obj2) => {
                if (obj1.no > obj2.no) {
                    return 1;
                }
                if (obj1.no < obj2.no) {
                    return -1;
                }
                return 0;
                })

            setImgListCrack(ResultImage);

        }).catch((err) => {
            console.log(err);
        });
    }, [])




    const rendering = () => {
        const result = [];
        for (let i = 1; i < 2; i++) {
            result.push(
                <div className={styles.DetectorDiv} >
                    <div className={styles.DetectorDivv} >
                    <Button className={styles.nextBtn}>{t.download}</Button> 
                    <Button className={styles.nextBtn}>{t.upload}</Button>
                    <Button className={styles.nextBtn}>{t.save}</Button>
                    </div>
                    <div className={styles.DetectorImage}>
                        <Image src={resultCrack === true ? ImgListCrack[num].result_image : ""} alt="" width={1080} height={500} />
                    </div>
                </div>

            );
        }
        return result;
    };

    const nextClick = () => {
        if (num < ImgListCrack.length - 1) {
            setNum(num + 1);
        } else if (num >= ImgListCrack.length - 1) {
            window.location.replace("./MeasureSetting");
        }
        };

    return (
    <div>
        <div className={styles.DivArea}>
            <div>
                <p className={styles.subOrder}>{t.pnPanorama} &gt; {t.pnHorizontalPanorama}</p>
                <p className={styles.mainOrder}>{t.pnHorizontalPanorama}</p>
            </div>

        <div className={styles.SetDiv}>
            <div className={styles.CamList}>
                <Table dataSource={ImgList} onRow={(record) => {
                    return {
                    onClick: (event) => {
                    setNum(record.no);
                    },
                    };
                }}>
                    <Column title={t.cnNumber} dataIndex="sort" key="no" />
                    <Column title={t.cnName} dataIndex="name" key="no" />
                </Table>
            </div>

                <div></div>
            <Tabs defaultActiveKey="1">
            {rendering()}
            </Tabs>
            
            {/* <Button className={styles.nextBtnn} onClick={nextClick}>
                    {t.next}
                </Button> */}
            </div>

        </div>
        </div>
    )
}