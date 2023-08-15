import styles from '../../Styles/Project.module.css'
import { Table,Select,Row,Col } from 'antd';
import { useRecoilState,atom } from 'recoil';
import { langState } from '../../Store/State/atom';
import { ko, en } from '../../translations';
import { Line, Gauge } from '@ant-design/plots';
import {LineChartOutlined, DollarCircleTwoTone} from '@ant-design/icons'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { shape } from '@mui/system';
import { valueToPercent } from '@mui/base';




function BridgeStatistics() {
    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;
    type DateList = string;

    const { Column } = Table;
    const { Option } = Select;
    
    const cpu_data:any = [
        {
            task_name: "업로드",
            time: 892 //14분 52초
        },
        {
            task_name: "영상편집",
            time: 150//2분 30초
        },
        {
            task_name: "이미지 작업",
            time: 303//5분 03초
        },
        {
            task_name: "J태그",
            time: 2255//37분 35초
        },
        {
            task_name: "수평 파노라마",
            time: 2255//37분 35초
        },
        {
            task_name: "수직 파노라마",
            time: 60//1분 00초
        },
        {
            task_name: "외관조사망도",
            time: 72//1분 00초
        },
        {
            task_name: "상태평가보고서",
            time: 25//60//1분 00초
        },
    ]
const  gpu_data:any = [
        
        {
            task_name: "균열 검출",
            value: 2640
        },
        {
            task_name: "균열 측정",
            value: 2940
        },
        // {
        //     task_name: "결함 검출",
        //     value: 14100
        // },
        // {
        //     task_name: "결함 측정",
        //     value: 41
        // },
       
    ]
    
    const DemoLine_CPU = () => {
        const config :any = {
            gpu_data,
            padding: 'auto',
            xField: 'task_name',
            yField: 'time',
            xAxis: {
                // type: 'timeCat',
                tickCount: 7,
                tickMethod:'time-cat'
            },
        };
        return <Line data={cpu_data} {...config} className={styles.lineChart}/> 
        // return <Line data={cpu_data} xField='task_name' yField='value' className={styles.lineChart}/>;
    };

    const DemoLine_GPU = () => {
        const config :any = {
            gpu_data,
            padding: 'auto',
            xField: 'task_name',
            yField: 'value',
            xAxis: {
                tickCount: 4,
            },
        };
        return <Line data={gpu_data} {...config} className={styles.lineChart}/> 

    };
    const DemoGaugeStorage = () => {
        const config : any = {
            percent: 0.001288/2,
            range: {
                color: "l(0) 0:#B8E1FF 1:#3D76DD"
            },
            startAngle: Math.PI,
            endAngle: 2 * Math.PI,
            indicator: null,
            statistic: {
                title: {
                    offsetY: 0,
                    style: {
                        fontSize: "15px",
                        marginTop:"-70px",
                        color: "#4B535E",
                    },
                    formatter: () => (0.001288/2*100).toFixed(2)+"%"
                },
                content: {
                style: {
                    fontSize: "20px",
                    color: "#4B535E",
                },
                formatter: () => "Storage"
                }
            },
        };
        return <Gauge {...config} />;
    };
    const DemoGaugeStorage2 = () => {
        const config : any = {
            percent: 0.000454/2,
            range: {
                color: "l(0) 0:#B8E1FF 1:#3D76DD"
            },
            startAngle: Math.PI,
            endAngle: 2 * Math.PI,
            indicator: null,
            statistic: {
                title: {
                    offsetY: 0,
                    style: {
                        fontSize: "15px",
                        marginTop:"-70px",
                        color: "#4B535E",
                    },
                    formatter: () => (0.000454/2*100).toFixed(2)+"%"
                },
                content: {
                style: {
                    fontSize: "20px",
                    color: "#4B535E",
                },
                formatter: () => "Storage"
                }
            },
        };
        return <Gauge {...config} />;
    };

    const handleChange = (value: DateList) => {
        console.log(`selected ${value}`);
    };
  

    return (
        <>
            <div className={styles.maincontainer} >
            
                
                <div className={styles.statics}>    
                    <div className={styles.gpuStatics}>
                        <div className={styles.statics_title}>        
                            GPU 정보
                        </div>    
                        <div className={styles.statics_box}>
                            <DemoLine_GPU />
                        </div>      
                    </div>    
                    <div className={styles.cpuStatics}>
                        <div className={styles.statics_title}>        
                            CPU 정보
                        </div>    
                        <div className={styles.statics_box}>
                            <DemoLine_CPU/>
                        </div>     
                    </div>  
                    <div className={styles.storageStatics}>
                        <div className={styles.statics_title}>        
                            처리용량
                        </div>    
                        <div className={styles.statics_box}>
                            <div style={{"width":"50%", "float":"left"}}>
                                <DemoGaugeStorage /> 
                            </div>
                            <div style={{"width":"50%", "float":"right"}}>
                                <DemoGaugeStorage2 /> 
                            </div> 
                            <div style={{"width":"50%", "fontSize":"20px", "textAlign":"center", "float":"left"}}>
                                업로드 이미지
                            </div>    
                            <div style={{"width":"50%", "fontSize":"20px", "textAlign":"center", "float":"left"}}>
                                파노라마 이미지
                            </div>    
                        </div>    
                    </div>  
                </div>
                <div className={styles.priceInfo}>
                    <div className={styles.priceInfo_title}>        
                            과금 계산서
                        </div>    
                        <div className={styles.priceInfo_box}>
                            <Row>
                                <Col className={styles.priceInfo_text_title}>
                                   <DollarCircleTwoTone /> 이미지 업로드 기준
                                </Col>
                            </Row>
                            <div style={{"padding":"20px"}}>
                                <Row className={styles.priceInfo_subTitle}>
                                    <Col span={4}/>
                                    <Col span={10}>이미지 장수</Col>
                                    <Col span={10}>price</Col>
                                </Row>
                                <Row  className={styles.priceInfo_text}>
                                    <Col span={4}>업로드 이미지</Col>
                                    <Col span={10}>340장</Col>
                                    <Col span={10}>136,000 원</Col>
                                </Row>
                                
                                {/* <Row  className={styles.priceInfo_text}>
                                    <Col span={4}>총 요금</Col>
                                    <Col span={10}>340장</Col>
                                    <Col span={10}>136,000원</Col>
                                </Row> */}
                                <Row className={styles.priceInfo_text_title}>
                                    <Col span={24} style={{"textAlign":"center", "backgroundColor":"aqua" }}>베이직 요금제 : 1,136,000원</Col>
                                    {/* <Col span={2}>/</Col>
                                    <Col span={11}>프리미엄 : 2,362,000원</Col> */}
                                </Row>
                            </div>    
                            <Row>
                                <Col className={styles.priceInfo_text_title}>
                                   <DollarCircleTwoTone /> 파노라마 기준
                                </Col>
                            </Row>
                            <div style={{"padding":"20px"}}>
                                <Row className={styles.priceInfo_subTitle}>
                                    <Col span={4}/>
                                    <Col span={10}>파노라마 장수</Col>
                                    <Col span={10}>price</Col>
                                </Row>
                                <Row  className={styles.priceInfo_text}>
                                    <Col span={4}>파노라마</Col>
                                    <Col span={10}>12장 </Col>
                                    <Col span={10}>4,800원</Col>
                                </Row>
{/*                                 
                                <Row  className={styles.priceInfo_text}>
                                    <Col span={4}>총 요금</Col>
                                    <Col span={10}>12장</Col>
                                    <Col span={10}>4,800원</Col>
                                </Row> */}
                                <Row className={styles.priceInfo_text_title}>
                                    <Col span={24}  style={{"textAlign":"center", "backgroundColor":"aqua"}}>베이직 요금제 : 1,004,800원</Col>
                                    {/* <Col span={2}>/</Col>
                                    <Col span={11}>프리미엄 : 2,012,000원</Col> */}
                                </Row>
                            </div> 
                            <Row>
                                <Col className={styles.priceInfo_text_title}>
                                   <DollarCircleTwoTone /> 이미지 용량 기준
                                </Col>
                            </Row>
                            <div style={{"padding":"20px"}}>
                                <Row className={styles.priceInfo_subTitle}>
                                    <Col span={4}/>
                                    <Col span={10}>이미지 용량</Col>
                                    <Col span={10}>price</Col>
                                </Row>
                                <Row  className={styles.priceInfo_text}>
                                    <Col span={4}>업로드 이미지</Col>
                                    <Col span={10}>1,351MB x 20원</Col>
                                    <Col span={10}>27,020원</Col>
                                </Row>
                               
                                {/* <Row  className={styles.priceInfo_text}>
                                    <Col span={4}>총 요금</Col>
                                    <Col span={10}>4,851MB  x 20원</Col>
                                    <Col span={10}>97,020원</Col>
                                </Row> */}
                                <Row className={styles.priceInfo_text_title}>
                                    <Col span={11}>베이직 : 1,027,020원</Col>
                                    <Col span={2}>/</Col>
                                    <Col span={11}>프리미엄 : 2,027,020원</Col>
                                </Row>
                            </div>
                            <Row>
                                <Col className={styles.priceInfo_text_title}>
                                   <DollarCircleTwoTone /> 파노라마 용량 기준
                                </Col>
                            </Row>
                            <div style={{"padding":"20px"}}>
                                <Row className={styles.priceInfo_subTitle}>
                                    <Col span={4}/>
                                    <Col span={10}>파노라마 용량</Col>
                                    <Col span={10}>price</Col>
                                </Row>
                                <Row  className={styles.priceInfo_text}>
                                    <Col span={4}>파노라마</Col>
                                    <Col span={10}>476MB x 20원</Col>
                                    <Col span={10}>9,560원</Col>
                                </Row>
                                
                                {/* <Row  className={styles.priceInfo_text}>
                                    <Col span={4}>총 요금</Col>
                                    <Col span={10}>2,842  x 20원</Col>
                                    <Col span={10}>56,840원</Col>
                                </Row> */}
                                <Row className={styles.priceInfo_text_title} >
                                    <Col span={11}>베이직 : 1,009,560원</Col>
                                    <Col span={2}>/</Col>
                                    <Col span={11}>프리미엄 : 2,009,560원</Col>
                                </Row>
                            </div>
                        </div> 
                </div>   

                </div>
        </>
    )
}

export default BridgeStatistics;