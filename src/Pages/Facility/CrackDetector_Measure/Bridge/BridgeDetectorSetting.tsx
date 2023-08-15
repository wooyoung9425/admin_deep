import styles from '../../../../Styles/CrackDetector_Measure.module.css'
import { langState } from '../../../../Store/State/atom'
import { ko, en } from '../../../../translations';
import { useRecoilState, atom } from 'recoil';
import { Button, Tabs, Table, Form, Input, Radio, Select, InputNumber, } from "antd";
import BridgeDefectDetectorSetting from './BridgeDefectDetectorSetting';
import BridgeCrackDetectorSetting from './BridgeCrackDetectorSetting';

export default function BridgeDetectorSetting() {

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;
    const { TabPane } = Tabs;
    const { Column } = Table;

  return (
    <div>
        <div className={styles.DivArea}>
        <div>
            <p className={styles.subOrder}>{t.dmDetectorMeasure} &gt; {t.dmDetectorSetting}</p>
            <p className={styles.mainOrder}>{t.dmDetectorSetting}</p>
        </div>

        <Tabs defaultActiveKey="1" > 
            <TabPane tab={t.cnCrackDetector} key="1">
                <BridgeCrackDetectorSetting/>
             </TabPane>
            <TabPane tab={t.dmDefectDetector} key="2">
                <BridgeDefectDetectorSetting/>
            </TabPane>
        </Tabs>

        </div>
    </div>
  )
}
