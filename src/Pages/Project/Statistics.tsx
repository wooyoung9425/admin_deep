import styles from '../../Styles/Project.module.css'
import { Select } from 'antd';
import { useRecoilState,atom } from 'recoil';
import { langState } from '../../Store/State/atom';
import { ko, en } from '../../translations';
import { Line, Gauge } from '@ant-design/plots';
import {LineChartOutlined, DollarCircleTwoTone} from '@ant-design/icons'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { shape } from '@mui/system';
import { valueToPercent } from '@mui/base';
import TunnelStatistics from './TunnelStatistics';
import DamStatistics from './DamStatistics';
import AirportStatistics from './AirportStatistics';
import BridgeStatistics from './BridgeStatistics';




function Statistics() {
    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;
    type DateList = string;
    const option = [{value:'Tunnel',label:'Tunnel'}, {value:'Airport',label:'Airport'},{value:'Dam',label:'Dam'},{value:'Bridge',label:'Bridge'}]
    const [Facility, setFacility] = useState<string>("Tunnel")
    
    const onchangeFacility = (e:any) => {
        setFacility(e)
    }
    return (
        <>
            <div className={styles.maincontainer} >
            
            <div>
                <br />
                <br />
                <h1 style={{"fontSize" : "45px","fontWeight":600}}> <LineChartOutlined /> 통계 </h1>
                <br />
                <div>
                        <Select defaultValue='Tunnel' options={option} style={{ width: '120px' }} onChange={onchangeFacility}></Select>        
                </div>
                <div className={styles.statics}>  
                    {Facility==='Tunnel'? <TunnelStatistics />:""}
                    {Facility==='Airport'? <AirportStatistics />:""}
                    {Facility==='Dam'? <DamStatistics />:""}   
                    {Facility==='Bridge'? <BridgeStatistics />:""}
                       
                </div>   

                </div>
            </div>
        </>
    )
}

export default Statistics;