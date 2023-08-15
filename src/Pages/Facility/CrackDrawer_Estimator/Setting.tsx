
import styles from '../../../Styles/CrackDrawer_Estimator.module.css'
import { langState, projectType } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import { useRecoilState, atom } from 'recoil';
import { Button, Tabs, Table, Form, Input, Radio, Select, InputNumber, } from "antd";
import DrawerSetting from './Tunnel/DrawerSetting';
import EstimatorSetting from './Tunnel/EstimatorSetting';
import AirportDrawerSetting from './Airport/AirportDrawerSetting';
import AirportEstimatorSetting from './Airport/AirportEstimatorSetting';
import DamDrawerSetting from './Dam/DamDrawerSetting'
import DamEstimatorSetting from './Dam/DamEstimatorSetting';
import BridgeDrawerSetting from './Bridge/BridgeDrawerSetting';
import BridgeEstimatorSetting from './Bridge/BridgeEstimatorSetting';

export default function Setting() {
  const [language, setLang] = useRecoilState(langState); 
  const t = language === "ko" ? ko : en;
  const { TabPane } = Tabs;
  const { Column } = Table;
  
  const layout = {
    wrapperCol: { span: 16 },
  };

  const project_Type = localStorage.getItem("project_Type")
  const  selectType :any[]= [];
  const rendering = () => {
    if (project_Type === "Tunnel") {
      selectType.push(
        <>
          <Tabs defaultActiveKey="1" > 
            {/* From 설정 끝나고 -> api연결해서 리스트에서 고정값 가져와야함 */}  
            <TabPane tab={t.csCrackDrawer} key="1" className={styles.csTabPane}>
              <DrawerSetting/>
            </TabPane>
            <TabPane tab={t.csStateEstimator} key="2">
              <EstimatorSetting/>
            </TabPane>
          </Tabs>
        </>  
        )
    } else if(project_Type==='Airport') {
      selectType.push(
        <>
          <Tabs defaultActiveKey="1" > 
            {/* From 설정 끝나고 -> api연결해서 리스트에서 고정값 가져와야함 */}  
            <TabPane tab={t.csCrackDrawer} key="1" className={styles.csTabPane}>
              <AirportDrawerSetting/>
            </TabPane>
            <TabPane tab={t.csStateEstimator} key="2">
              <AirportEstimatorSetting/>
            </TabPane>
          </Tabs>
        </>  
        )
    } else if (project_Type === 'Dam') {
      selectType.push(
        <>
          <Tabs defaultActiveKey="1" > 
            {/* From 설정 끝나고 -> api연결해서 리스트에서 고정값 가져와야함 */}  
            <TabPane tab={t.csCrackDrawer} key="1" className={styles.csTabPane}>
              <DamDrawerSetting/>
            </TabPane>
            <TabPane tab={t.csStateEstimator} key="2">
              <DamEstimatorSetting/>
            </TabPane>
          </Tabs>
        </>  
        )
    }else if (project_Type === 'Bridge') {
      selectType.push(
        <>
          <Tabs defaultActiveKey="1" > 
            {/* From 설정 끝나고 -> api연결해서 리스트에서 고정값 가져와야함 */}  
            <TabPane tab={t.csCrackDrawer} key="1" className={styles.csTabPane}>
              <BridgeDrawerSetting/>
            </TabPane>
            <TabPane tab={t.csStateEstimator} key="2">
              <BridgeEstimatorSetting/>
            </TabPane>
          </Tabs>
        </>  
        )
    }
    return selectType;
  }

  return (
      <div>
        <div className={styles.DivArea}>
        <div>
            <p className={styles.subOrder}>{t.csDrawerEstimator} &gt; {t.csSetting}</p>
            <p className={styles.mainOrder}>{t.csSetting}</p>
        </div>
      {rendering()}
        
        
      </div>    
    </div>
  )
}
