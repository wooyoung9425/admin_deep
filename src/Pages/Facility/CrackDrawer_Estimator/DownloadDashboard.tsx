import { Carousel, Button, Table } from 'antd';
import { useRecoilState, atom } from 'recoil';
import { langState } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import { useEffect, useState } from 'react';
import { API_URL, IMAGE_URL } from '../../../Store/Global';
import axios from "axios";
import Column from 'antd/lib/table/Column';


function DownloadDashboard() {


    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;
    const project_id = localStorage.getItem('project_id')
    let token: string | null = localStorage.getItem("token")
    const List: any = [{drawer:"외관조사망도 실행하지 않음", estimator:"상태평가보고서 실행하지 않음"}];
    const [DrawerDown, setDrawerDown] = useState<any | undefined>([]);
    const project_Type = localStorage.getItem('project_Type')

    const setting :any = localStorage.getItem("settings")
    const typeArr = JSON.parse(setting).dam_type
    const [DamType, setDamType] = useState<string>("");

    useEffect(() => {
        let path = ""
        if (['Tunnel','Airport'].includes(String(project_Type))===true) {
            path = `/project/${project_id}/stage8_CAD/`
        } else if (project_Type === 'Dam') {
            path = `/project/${project_id}/stage8/overflow/`
        } else if (project_Type === 'Bridge') {
            path = `/project/${project_id}/stage8`
        }
        const response1 = axios({
            method: "get",
            url: API_URL + '/File/Files',
            headers: { "accept": `application/json`, "access-token": `${token}` },
            params:{path : `/project/${project_id}/stage8_CAD/`}
        }).then((res) => {
            console.log(res.data.data.files.length)
            if (res.data.check === true) {
                if (res.data.data.files.length === 3) {
                    List[0] = { ...List[0], drawer: <a onClick={download} id="drawer">외관조사망도 download</a> }
                } else if (res.data.data.files.length === 0) {
                    List[0] = { ...List[0], estimator: "외관조사망도 실행하지 않음", }
                } else {
                    List[0] = { ...List[0], drawer: "외관조사망도 진행중", }
                }
            } else {
                
            }
            setDrawerDown(List)
        })
        const response2 = axios({
            method: "get",
            url: API_URL + '/File/Files',
            headers: { "accept": `application/json`, "access-token": `${token}` },
            params:{path : `/project/${project_id}/stage9/`}
        }).then((res) => {
            console.log(res.data.data.files.length)
            if (res.data.check === true) {
                if (res.data.data.files.length === 3) {
                    console.log("3개다")
                    List[0]={...List[0], estimator: <a onClick={download} id="estimator">상태평가보고서 download</a>}
                    
                } else if (res.data.data.files.length === 0) {
                    List[0]={...List[0], estimator: "상태평가보고서 실행하지 않음",}
                }    else {
                    console.log("1개다",List[0])
                    List[0]={...List[0], estimator: "상태평가보고서 진행중",}
                    
                }
            }
            setDrawerDown(List)
        })
        
 },[])
     const download = (e : any) => {
        console.log(e.target.id)
        if (e.target.id === "drawer") { //외관 조사망도
            axios({
                method: "get",
                url: API_URL + '/File/Files',
                headers: { "accept": `application/json`, "access-token": `${token}` },
                params:{path : `/project/${project_id}/stage8_CAD/`}
            }).then((res) => {
                if (res.data.check === true) {
                    console.log(`${IMAGE_URL}/image?path=/project/${project_id}/stage8_CAD/${res.data.data.files[2]}`)
                    // console.log(res.data.data.files)
                    const link = document.createElement('a');
                    link.href = `${IMAGE_URL}/image?path=/project/${project_id}/stage8_CAD/${res.data.data.files[2]}`;
                    link.setAttribute('download', 'file.dxf'); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                } else {
                    console.log("실패")
                }
            })
        } else {
            axios({
                method: "get",
                url: API_URL + '/File/Files',
                headers: { "accept": `application/json`, "access-token": `${token}` },
                params:{path : `/project/${project_id}/stage9/`}
            }).then((res) => {
                if (res.data.check === true) {
                    console.log(`${IMAGE_URL}/image?path=/project/${project_id}/stage9/${res.data.data.files[1]}`)
                    console.log(res.data.data.files)
                    const link = document.createElement('a');
                    link.href = `${IMAGE_URL}/image?path=/project/${project_id}/stage9/demo.docx}`;
                    link.setAttribute('download', 'file.dxf'); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                } else {
                    console.log("실패")
                }
                
            })
        }
    }


    return (
            <div>
                    <div>
                    <Table dataSource={DrawerDown} size="small" scroll={{ y: 200 }} pagination={false} >
                        <Column title='외관조사망도' dataIndex="drawer"></Column>
                        <Column title='상태평가보고서' dataIndex="estimator" />
                    </Table>
                    </div>
            </div> 

        )
}

export default DownloadDashboard;

