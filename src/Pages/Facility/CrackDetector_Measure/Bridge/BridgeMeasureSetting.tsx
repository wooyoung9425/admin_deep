import styles from '../../../../Styles/CrackDetector_Measure.module.css'
import { langState } from '../../../../Store/State/atom'
import { ko, en } from '../../../../translations';
import { useRecoilState, atom } from 'recoil';
import { Button, Tabs, Table, Form, Input, Radio, Select, InputNumber, } from "antd";
import BridgeDefectMeasureSetting from './BridgeDefectMeasureSetting';
import BridgeCrackMeasureSetting from './BridgeCrackMeasureSetting';


export default function BridgeMeasureSetting() {

  const [language, setLang] = useRecoilState(langState); 
  const t = language === "ko" ? ko : en;
  const { TabPane } = Tabs;
  const { Column } = Table;

  return (
    <div>
      <div className={styles.DivArea}>
        <div>
            <p className={styles.subOrder}>{t.dmDetectorMeasure} &gt; {t.dmMeasureSetting}</p>
            <p className={styles.mainOrder}>{t.dmMeasureSetting}</p>
        </div>

        <Tabs defaultActiveKey="1" > 
            <TabPane tab={t.cnMeasure} key="1">
                <BridgeCrackMeasureSetting/>
            </TabPane>
            <TabPane tab={t.dmDefectMeasure} key="2">
                <BridgeDefectMeasureSetting/>
            </TabPane>
        </Tabs>
    </div>
  </div>
  )
}
