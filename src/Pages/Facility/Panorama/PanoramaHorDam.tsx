import styles from '../../../Styles/PanoramaVer.module.css'
import { Button, Tabs, Image, Table } from "antd";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilState, atom } from 'recoil';
import { langState } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import { API_URL, IMAGE_URL } from '../../../Store/Global';

interface ImgContents {
    no : number
    name : any
    sort : any
}


interface ResultImage {
    no : any
    result_image : string
}


export default function PanoramaHorDam() {

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    const { Column } = Table;

    let token : string | null = localStorage.getItem("token") 
    let project_id : string | null = localStorage.getItem("project_id")

    const ImgContents : ImgContents[] = [];   
    const ResultImage : ResultImage[] = [];  



    const [num, setNum] = useState<number>(0);
    const [ImgList, setImgList] = useState<any | undefined>(ImgContents)

    const [ImgListCrack, setImgListCrack] = useState<any[]>(ResultImage);

    const [resultCrack, setResultCrack] = useState<boolean>(false)



    const [projectName, setProjectName] = useState<string>('');
    const [damName, setDamName] = useState<string>('');
    const [userid, setUserId] = useState<number>(-1);
    const [companyid, setCompanyId] = useState<number>(-1);

    useEffect(() => {
        let getIdCompany = async () => {
            if(token !== null){ 
                console.log("여기 들어옴?")
                console.log("프로젝트ID"+project_id)
                const response = await axios({
                method : "get",
                url : `${API_URL}/account/auth/check/${token}`,                
                }).then(async(res)=>{
                if(res.data.check === true){
                    setUserId(res.data.data.id)
                    setCompanyId(res.data.data.companyId)
                    // localStorage.set("project_id", id);
                    console.log(`아이디는 다음과 같음 : ${res.data.data.id} / 회사는 다음과 같음 : ${res.data.data.companyId}`)
                    return {email : res.data.data.email, name : res.data.data.name, phone : res.data.data.phone, avatar : res.data.data.avatar, role : res.data.data.role, id : res.data.data.id, companyId : res.data.data.companyId}
                }else{
                    console.log("토큰 만료")
                    localStorage.removeItem('token')
                    alert("토큰이 만료었습니다 다시 로그인 해주세요")
                    window.location.replace("/Main")
                }
                }).catch((err)=>{
                console.log(err)
                })
            }
        }
        getIdCompany()
    },[])

    const [damtype, setDamtype] = useState<string>('');

    useEffect(() => {
        const response = axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers : {"accept" : `application/json`, "access-token" : `${token}`}, 
        }).then((res) => {
            // console.log(res.data.check) 
            const settings: any = JSON.parse(res.data.data.settings)
            // console.log("dlfmaaaaaaaaaaaaaaaa"+res.data.data.title)
                if (res.data.check === true) {
                    for (let i = 0; i < 1; i++) {
                        // console.log(`터널이름${settings.airport_eng}` )
                        console.log(`방향${settings.dam_type}` )
                        setDamName(settings.dam_eng)
                        setDamtype(settings.dam_type)
                        console.log(`방향oo${damtype}` )
                        setProjectName(settings.airport_eng)

                }

            }
            }).catch((err) => {
                console.log(err);
            });
    }, []);


    useEffect(() => {

        axios({
            method: 'get',
            url: API_URL+'/File/Files',
            headers: { "accept": `application/json`, "access-token": `${token}` },
            params: {
                path: `/project/${project_id}/stage4/Overflow`
            }
        }).then((res)=>{
            if (res.data.check === true) {
                console.log("성공",res.data.data.files.length)
                
                for(let i = 0; i<res.data.data.files.length; i++){
                    ResultImage.push({
                        result_image : `${IMAGE_URL}/image?path=/project/${project_id}/stage4/Overflow/${res.data.data.files[i]}&width=1440`,
                        no : 6
                    })

                    console.log(`${IMAGE_URL}/image?path=/project/${project_id}/stage4/Overflow/${res.data.data.files[0]}&width=1440`)

                    ImgContents.push({
                                    no : i,
                                    name : res.data.data.files[i],
                                    sort : i+1
                                })
                }

                if(ResultImage.length > 0){
                    setResultCrack(true);
                    console.log(res.data.data.files)
                }else{
                    alert("결과가 나올 때까지 기다려주세요.")
                }

            // } else {
            //     alert('수직파노라마를 실행해주세요.')
            }

                ImgContents.sort((obj1, obj2) => {
                    if (obj1.sort > obj2.sort) {
                        return 1;
                    }
                    if (obj1.sort < obj2.sort) {
                        return -1;
                    }
                    return 0;
                    })

            let copyArrImgList = [...ImgList];

            for(let i = 0; i < ImgList.length; i++){
                copyArrImgList[i] = { ...copyArrImgList[i], no : i};
            }
            setImgList(copyArrImgList)
            // console.log(ImgList, "ImgListttttt")

            ResultImage.sort((obj1, obj2) => {
                if (obj1.no > obj2.no) {
                    return 1;
                }
                if (obj1.no < obj2.no) {
                    return -1;
                }
                return 0;
                })

            setImgListCrack(ResultImage);

        }).catch((err) => {
            console.log(err);
        });
    }, [])


    const onClickPonirama = (e:any) => {
        // console.log(arr);
        // console.log(Verstitch);    
        axios({

            method: "post",
            url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
            headers: {
              "accept": `application/json`,
              "access-token": `${token}`,
              "Content-Type": `application/json`
            },
            data: {
                project_id: project_id,
                task_name: "ver_stitch_old",
                interactive: false,
                tasks: [
                    {
                        input_folder: `stage4/${damtype}`,
                        output_folder: "stage5",
                        yml_output_folder: "stage5_YML",
                        cam_no: 2,
                        conf_name: "config.cfg"
                    }
                ],
            }
        }).then((res)=>{
            if (res.data.check === true) {
                console.log("파노라마 성공")
                alert("수직파노라마 작업")

            } else {
                console.log("파노라마 실패")
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    const rendering = () => {
        const result = [];
        for (let i = 1; i < 2; i++) {
            result.push(
                <div className={styles.DetectorDiv} >
                    <div className={styles.DetectorDivv} >
                    {/* <Button className={styles.nextBtn}>{t.download}</Button> 
                    <Button className={styles.nextBtn}>{t.upload}</Button>
                    <Button className={styles.nextBtn}>{t.save}</Button> */}
                    </div>
                    <div className={styles.DetectorImage}>
                        <Image src={resultCrack === true ? ImgListCrack[num].result_image : ""} alt="" width={1080} height={500} />
                    </div>
                </div>

            );
        }
        return result;
    };

    const nextClick = () => {
        if (num < ImgListCrack.length - 1) {
            setNum(num + 1);
        } else if (num >= ImgListCrack.length - 1) {
            window.location.replace("./MeasureSetting");
        }
        };

    return (
    <div>
        <div className={styles.DivArea}>
            <div>
                <p className={styles.subOrder}>{t.pnPanorama} &gt; {t.pnVerticalPanorama}</p>
                <p className={styles.mainOrder}>{t.pnVerticalPanorama}</p>
            </div>

        <div className={styles.SetDiv}>
            <div className={styles.CamList}>
                <Table dataSource={ImgList} onRow={(record) => {
                    return {
                    onClick: (event) => {
                    setNum(record.no);
                    },
                    };
                }}>
                    <Column title={t.cnNumber} dataIndex="sort" key="no" />
                    <Column title={t.cnName} dataIndex="name" key="no" />
                </Table>
            </div>

                <div></div>
            <Tabs defaultActiveKey="1">
            {rendering()}
            </Tabs>
            <Button  style={{width:"150px", marginTop: "60px", marginLeft: "1010px"}} onClick={onClickPonirama}>수직 파노라마 실행</Button>
            {/* <Button className={styles.nextBtnn} onClick={nextClick}>
                    {t.next}
                </Button> */}
            </div>

        </div>
        </div>
    )
}