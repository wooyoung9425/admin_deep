import styles from '../../../Styles/Preprocess.module.css'
import styled from "styled-components";
import { Button, Form, Radio,Select, Input, Table} from 'antd';
import { useRecoilState, atom } from 'recoil';
import { useState } from 'react'
import { langState } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useEffect } from 'react';
import { API_URL } from '../../../Store/Global';
import ColumnGroup from 'antd/lib/table/ColumnGroup';
import Column from 'antd/es/table/Column';
import { dataURLFileLoader } from 'react-doc-viewer';

interface TableSet {
    key: any;
    no: any;
    firstCam:any;
    lastCam:any;
}

export default function Setting() {

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;
    const [pName, setpName] = useState('');
    const [cNameKr, setcNameKr] = useState('');
    const [cNameEn, setcNameEn] = useState('');
    const [speed, setSpeed] = useState('10');
    const [fps, setFps] = useState('60');
    const [numSet, setnumSet] = useState('');
    const [numCam, setnumCam] = useState('');
    const [spanCount, setspanCount] = useState('');
    const [spanLen, setspanLen] = useState('');

    const list: any[] = [pName, cNameKr, cNameEn, speed, fps, numSet, numCam, spanCount, spanLen ]

        const plus = (event:any) => {
    
            console.log(list);
            alert(`설정값을 변경하였습니다`);
            window.location.replace("/Facility/Panorama/Dashboard")
        }
        let token : string | null = localStorage.getItem("token") 
        let project_id : string | null = localStorage.getItem("project_id")


        // const formItemLayoutWithOutLabel = {
        //     wrapperCol: {
        //     xs: { span: 24, offset: 0 },
        //     sm: { span: 24, offset: 0 },
        //     },
        // };

        const [projectName, setProjectName] =useState(0); 
        const [korName, setKorName] =useState(0);
        const [cameraNo, setCamraNo] =useState(0); 
        const [spanNo, setSpanNo] =useState(0); 
        const [enName, setEnName] =useState(0);
        const [speedd, setSpeedd] =useState(0); 
        const [fpss, setFpss] =useState(0); 
        const [spanLenn, setSpanLenn] =useState(0); 
        const [direction, setDirection] = useState('');
        const[dirvlaue, setDirvlaue] = useState(direction)

        let TableSet : TableSet[] = [];

        const [filmSetResult, setfilmSetResult] = useState<boolean>(false);
        const [TableSetStauts, setTableSetStauts] = useState(TableSet);
        // let TableSet:any[] = [];



        const { Column } = Table;
        const [leng, SetLeng] = useState('');

        const spanNoInput = (e:any) => {setSpanNo(e.target.value);}


        useEffect(() => {
            const response = axios({
                method: 'get',
                url: API_URL + `/project/view/${project_id}`,
                headers : {"accept" : `application/json`, "access-token" : `${token}`}, 
            }).then((res) => {
                    // console.log(res.data.check) 
                    const settings: any = JSON.parse(res.data.data.settings)
                    // console.log("dlfmaaaaaaaaaaaaaaaa"+res.data.data.title)
                    if (res.data.check === true) {
                        for (let i = 0; i < 1; i++) {
                            console.log('세트갯'+JSON.parse(settings.filmSetCount)[i].FirstCamera)
                            console.log(`카메라갯수${settings.tunnel_kor}` )
                            console.log(`스팬갯수${settings.direction}` )
                            setCamraNo(settings.cameraCount)
                            setSpanNo(settings.spanCount)
                            setProjectName(res.data.data.title)
                            setKorName(settings.tunnel_kor)
                            setEnName(settings.tunnel_eng)
                            setSpeedd(settings.scanSpeed)
                            setFpss(settings.scanSpeed.fps)
                            setSpanLenn(settings.spanLength)
                            setDirection(settings.direction)
                            if(settings.direction === 'P01'){
                                setDirvlaue('상행')
                            } else {
                                setDirvlaue('하행')
                                }
                            }

                        for(let i = 0; i < JSON.parse(settings.filmSetCount).length; i++){
                            TableSet.push({
                                key:i,
                                no: i+1,
                                firstCam: JSON.parse(settings.filmSetCount)[i].FirstCamera,
                                lastCam: JSON.parse(settings.filmSetCount)[i].LastCamera
                            })
                                // console.log(JSON.parse(settings.filmSetCount).length)

                            // SetLeng(JSON.parse(settings.filmSetCount).length);

                        }
                    } else {
                        console.log("실패");
                    }
                
                    setTableSetStauts(TableSet);
                    if(TableSetStauts.length > 0){
                        setfilmSetResult(true)
                }

                }).catch((err) => {
                    console.log(err);
                });
        }, []);
        
        


    return (
    <div>

            <div className={styles.DivArea} >
                <div className={styles.CreateTitleDiv}>
                    <p className={styles.CreateTitleText}>{t.Setting}</p>
                </div>

                <div className={styles.Projectbody}>
                    <div className={styles.Createtable}>
                    <Form className={styles.Forms} labelCol={{ span: 8, }} wrapperCol={{ span: 8 }} layout="horizontal">
                            <Form.Item className={styles.FormItem}  label="프로젝트 명">
                                <div className={styles.inputbox}>
                                <span className={styles.suffix}>{projectName}</span>
                                </div>
                                </Form.Item>
                                <Form.Item className={styles.FormItem} label="터널 이름(한)">
                                <div className={styles.inputbox}>
                                <span className={styles.suffix}>{korName}</span>
                                </div>
                                </Form.Item>
                                <Form.Item className={styles.FormItem} label="터널 이름(영)">
                                <div className={styles.inputbox}>
                                <span className={styles.suffix}>{enName}</span>
                                </div>
                            </Form.Item>
                            <Form.Item className={styles.FormItem} label="터널 스캐너 이동 속도">
                            <div className={styles.inputbox}>
                            <span className={styles.suffix}>{speed}</span>
                            <span className={styles.suffixx}>km/h</span>
                            </div>
                            </Form.Item>
                            <Form.Item className={styles.FormItem} label="영상 FPS">
                            <div className={styles.inputbox}>
                            <span className={styles.suffix}>{fps}</span>
                            <span className={styles.suffixx}>FPS</span>
                            </div>
                            </Form.Item>
                            <Form.Item className={styles.FormItem} name="radio-button" label="진행 방향">
                            <div className={styles.inputbox}>
                            <span className={styles.suffix}>{dirvlaue}</span>
                            </div>
                            </Form.Item>
                            <Form.Item className={styles.FormItem} label="촬영 set 수" style={{marginBottom:'0px'}}>
                            {
                                filmSetResult === true ? 
                                <Table dataSource={TableSetStauts} pagination={false} size="small">
                                    {/* <Column title="key" dataIndex="key" key="key"/> */}
                                    <Column title="set 번호" dataIndex="no" key="no"/>
                                    <Column title="첫번째 카메라 번호" dataIndex="firstCam" key="firstCam"/>
                                    <Column title="마지막 카메라 번호" dataIndex="lastCam" key="lastCam"/>
                                </Table>
                            :
                            <div>데이터를 불러오지 못했습니다</div>                        
                            }

                            </Form.Item>
                            <Form.Item className={styles.FormItem} label="카메라 수">
                            <div className={styles.inputbox}>
                            <span className={styles.suffix}>{cameraNo}</span>
                            <span className={styles.suffixx}>개</span>
                            </div>                                
                            </Form.Item>
                            <Form.Item className={styles.FormItem} label="스팬 수">
                            <div className={styles.inputbox}>
                            <span className={styles.suffix}>{spanNo}</span>
                            <span className={styles.suffixx}>개</span>
                            </div>      
                            </Form.Item>
                            <Form.Item className={styles.FormItem} label="스팬 길이">
                            <div className={styles.inputbox}>
                            <span className={styles.suffix}>{spanLenn}</span>
                            <span className={styles.suffixx}>개</span>
                            </div>     
                            </Form.Item>
            </Form>


                </div>
                    </div>


            

                

            </div>


        </div>


    )
}
