import styles from '../../../../Styles/XAI.module.css'
import { useRecoilState } from 'recoil';
import { langState } from '../../../../Store/State/atom'
import { ko, en } from '../../../../translations';
import { useEffect, useState } from 'react';
import { API_URL, IMAGE_URL } from '../../../../Store/Global';
import { Table, Button } from 'antd';

import axios from 'axios';

interface Image {
    key: number,
    name: string,
    url: string,
}

export default function MetaLearningResult() {

    let token : string | null = localStorage.getItem("token") 
    let project_id: string | null = localStorage.getItem("project_id")
    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    const { Column } = Table;

    const oriImgUrl : Image[] = [];
    const [oriImgList, setOriImgList] = useState<any[]>(oriImgUrl);
    const [oriList, setOriList] = useState<boolean>(false)

    const [oriSelet, setOriSelect] = useState(0)


    useEffect(() => {
        axios({
                method: 'get',
                url: API_URL+'/File/Files',
                headers: { "accept": `application/json`, "access-token": `${token}` },
                params : {path : `/project/${project_id}/stageMeta/original`}
        }).then((res) => {
            if (res.data.check === true) {
                // console.log(res.data.data.files)

                for (let i = 0; i < res.data.data.files.length; i++) {
                    oriImgUrl.push({
                        key: i + 1,
                        name: res.data.data.files[i],
                        url: `${IMAGE_URL}/image?path=/project/${project_id}/stageMeta/original/${res.data.data.files[i]}&width=360`,
                    })
                }

                setOriImgList(oriImgUrl)
                setOriList(true)

            } else {
                
            }
        })

        axios({
            method: 'get',
            url: API_URL+'/File/Files',
            headers: { "accept": `application/json`, "access-token": `${token}` },
            params : {path : `/project/${project_id}/stageMeta/result`}
        }).then((res) => {
            if (res.data.check === true) {

                //text 파일 읽고 싶어요
                // console.log(res.data.data.files)
                // // ${IMAGE_URL}/project/245/stageMeta/result/Result.txt

                // let file = "${IMAGE_URL}/image?path=/project/245/stageMeta/result/" + res.data.data.files

                // let fileReader = new FileReader();

                // fileReader.onload = () => {
                //     console.log(fileReader.result)
                // }

                // fileReader.readAsText(new Blob([file], {type: 'text/plain'}));
            } else {
                
            }
        })

        console.log(oriImgList)
        console.log(oriList)
    }, []);

    

    return (
    <>
        <div className={styles.DivArea}>
                    <div>
                        <p className={styles.subOrder}>{t.dmDetectorMeasure} &gt; {t.dmMetaLearningResult}</p>
                        <p className={styles.mainOrder}>{t.dmMetaLearningResult}</p>   
                    </div>

                    <div className={styles.xai_table}>
                        <Table dataSource={oriList === true? oriImgList:[]}>
                            <Column title={t.cnNumber} dataIndex="key" key="num" />
                            <Column title={t.cnName} dataIndex="name" key="num" onCell={(record: any) => {
                                return {
                                    onClick: event => {
                                        // console.log(record)
                                        setOriSelect(record.key-1)
                                    }
                                }
                            }} />
                        </Table>
                    </div>

                    <p className={styles.mainOrder}>{oriImgList[oriSelet].name}</p>
                    <div className={styles.originalImg}>
                        <img src={oriList === true ? oriImgList[oriSelet].url:""} />
                    </div>
        </div>
    </>
    )
}
