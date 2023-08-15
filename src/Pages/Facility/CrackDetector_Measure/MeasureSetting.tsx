import TunnelMeasureSetting from './Tunnel/MeasureSetting'
import BridgeMeasureSetting from './Bridge/BridgeMeasureSetting'

export default function MeasureSetting() {

    const projectType = localStorage.getItem('project_Type')

    const rendering = () => {
        const result = [];
        if(projectType === "Tunnel"){
        result.push(
            <TunnelMeasureSetting/>
        )
        }else if(projectType === "Bridge"){
        result.push(
            <BridgeMeasureSetting />
        )
        }    
        return result;
    }

    return (
        <>
            {rendering()}
        </> 
    )
}
