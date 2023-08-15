import styles from '../../../../Styles/CrackDetector_Measure.module.css'
import { langState } from '../../../../Store/State/atom'
import { ko, en } from '../../../../translations';
import { useRecoilState, atom } from 'recoil';
import { Button, Tabs, Table, Form, Input, Radio, Select, InputNumber, } from "antd";
import AirportCrackDetectorSetting from './AirportCrackDetectorSetting';
import AirportDefectDetectorSetting from './AirportDefectDetectorSetting';
import AirportFODDetectorSetting from './AirportFODDetectorSetting';

export default function AirportDetectorSetting() {

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;
    const { TabPane } = Tabs;
    const { Column } = Table;

    return (
    <div>
        <div className={styles.DivArea}>
        <div>
            <p className={styles.subOrder}>{t.dmDetectorMeasure} &gt; {t.dmDetectorMeasureSetting}</p>
            <p className={styles.mainOrder}>{t.dmDetectorMeasureSetting}</p>
        </div>

        <Tabs defaultActiveKey="1" > 
                    {/* From 설정 끝나고 -> api연결해서 리스트에서 고정값 가져와야함 */}  
        <TabPane tab={t.cnCrackDetector} key="1">
            <AirportCrackDetectorSetting/>
        </TabPane>
        <TabPane tab={t.dmDefectDetector} key="2">
            <AirportDefectDetectorSetting/>
        </TabPane>
        <TabPane tab={t.dmFODDetector} key="3">
            <AirportFODDetectorSetting/>
        </TabPane>
        </Tabs>

        </div>
    </div>
    )
}
