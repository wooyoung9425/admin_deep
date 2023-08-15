import styles from '../../../Styles/CreateProject.module.css'
import AirportCreate from './AirportCreate';
import TunnelCreate from './TunnelCreate';
import DamCreate from './DamCreate';
import BridgeCreate from './BridgeCreate';
import BuildingCreate from './BuildingCreate';

function CreateProject() {

    const projectType = localStorage.getItem('project_Type')

    const rendering = () => {
        const result = [];
        console.log(projectType)

        if(projectType === "Tunnel"){
            result.push(
                <TunnelCreate/>
            )
        }else if(projectType === "Airport"){
            result.push(
                <AirportCreate />
            )
        }else if(projectType === "Dam"){
            result.push(
                <DamCreate />
            )
        } else if (projectType === "Bridge") {
            result.push(
                <BridgeCreate/>
            )
        } else if (projectType === "Building") {
            result.push(
                <BuildingCreate/>
            )
        }       
        return result;
    }

    return (
        <div>
            <div className={styles.DivArea}>
                <div className={styles.CreateTitleDiv}>
                    <p className={styles.CreateTitleText}>프로젝트 생성</p>
                </div>            
                { rendering() }
            </div>
        </div>
    );

}
export default CreateProject;

