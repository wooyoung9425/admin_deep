import AirportDetectorSetting from './Airport/AirportDetectorSetting';
import BridgeDetectorSetting from './Bridge/BridgeDetectorSetting';
import DamDetectorSetting from './Dam/DamDetectorSetting';
import TunnelDetectorSetting from './Tunnel/TunnelDetectorSetting'

export default function DetectorSetting() {

    const projectType = localStorage.getItem('project_Type')

    const rendering = () => {
        const result = [];
        if(projectType === "Tunnel"){
          result.push(
            <TunnelDetectorSetting/>
          )
        }else if(projectType === "Airport"){
          result.push(
            <AirportDetectorSetting />
          )
        }else if(projectType === "Dam"){
          result.push(
            <DamDetectorSetting />
          )
        }else if(projectType === "Bridge"){
          result.push(
            <BridgeDetectorSetting />
          )
        }    
        return result;
      }

    return (
    <>
        { rendering()}
    </> 
    )
}
