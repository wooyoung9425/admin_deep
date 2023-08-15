import styles from '../../../../Styles/CrackDetector_Measure.module.css'
import { Button, Tabs, Image, Table } from "antd";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilState, atom } from 'recoil';
import { langState } from '../../../../Store/State/atom'
import { ko, en } from '../../../../translations';
import { API_URL, IMAGE_URL } from '../../../../Store/Global';

interface ImgContents {
    no : number
    name : any
}

interface OriImage {
    no : any
    original_image : string
}

interface ResultImage {
    no : any
    result_image : string
}

export default function DefectDetector() {

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    const { TabPane } = Tabs;
    const { Column } = Table;

    let token : string | null = localStorage.getItem("token") 
    let project_id : string | null = localStorage.getItem("project_id")

    const ImgContents : ImgContents[] = [];  
    const OriImage : OriImage[] = [];  
    const ResultImage : ResultImage[] = [];  

    const [num, setNum] = useState<number>(0);

    const [ImgList, setImgList] = useState<any | undefined>(ImgContents)
    const [ImgListOri, setImgListOri] = useState<any[]>(OriImage);
    const [ImgListDefect, setImgListDefect] = useState<any[]>(ResultImage);

    const [resultOri, setResultOri] = useState<boolean>(false)
    const [resultDefect, setResultDefect] = useState<boolean>(false)

    const [setting, setSetting]=useState<any>([])
    const [typeArr, setType]=useState([])
    const [DamType, setDamType]=useState<string>("Overflow");
    const [DamTypeCount, setDamTypeCount] = useState<number>(0);

    const [userid, setUserId] = useState<number>(-1);
    const [companyid, setCompanyId] = useState<number>(-1);
  
    useEffect(() => {
        let getIdCompany = async () => {
          if (token !== null) {
            console.log("여기 들어옴?");
            console.log("프로젝트ID" + project_id);
            const response = await axios({
              method: "get",
              url: `${API_URL}/account/auth/check/${token}`,
            })
              .then(async (res) => {
                if (res.data.check === true) {
                  setUserId(res.data.data.id)
                  setCompanyId(res.data.data.companyId)
                  // localStorage.set("project_id", id);
                  console.log(
                    `아이디는 다음과 같음 : ${res.data.data.id} / 회사는 다음과 같음 : ${res.data.data.companyId}`
                  );
                  return {
                    email: res.data.data.email,
                    name: res.data.data.name,
                    phone: res.data.data.phone,
                    avatar: res.data.data.avatar,
                    role: res.data.data.role,
                    id: res.data.data.id,
                    companyId: res.data.data.companyId,
                  };
                } else {
                  console.log("토큰 만료");
                  localStorage.removeItem("token");
                  alert("토큰이 만료었습니다 다시 로그인 해주세요");
                  window.location.replace("/Main");
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        };
        getIdCompany();
      }, []);


    useEffect(() => {

        localStorage.setItem('dam_type', DamType)

        setNum(0)
        //댐 구조물 종류 받아오기
        axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers : {"accept" : `application/json`, "access-token" : `${token}`}, 
        }).then((res) => {
            const settings: any = JSON.parse(res.data.data.settings)
                setSetting(settings)
                setType(settings.dam_type)  
                setDamTypeCount(settings.dam_type.length > 0 ? settings.dam_type.length : 0)         
        }).catch((err) => {
            console.log(err);
        }); 


        //파노라마 원본 받아오기
        axios({
            method: 'get',
            url: API_URL+'/File/Files',
            headers: { "accept": `application/json`, "access-token": `${token}` },
            params: {
                path: `/project/${project_id}/stage4/${DamType}`
            }
            }).then((res)=>{
                if (res.data.check === true){
                    for(let i = 0; i<res.data.data.files.length; i++){
                    console.log(res.data.data.files[i].includes(String(".jpg")))

                        if(
                            res.data.data.files[i].includes(String(".png")) || 
                            res.data.data.files[i].includes(String(".jpg"))){
                            OriImage.push({
                                original_image : `${IMAGE_URL}/image?path=/project/${project_id}/stage4/Overflow/${res.data.data.files[i]}&width=1440`,
                                no : i
                            })
                    console.log(OriImage[1])

                            setResultOri(true);
                            console.log("vvvvvvvvvv")

                        }

                        if(OriImage.length === res.data.data.files.length){
                            setResultOri(true);
                            console.log("ccccccccccccc")
                        }
                    }
                }else{
                    console.log("실패")
                    alert('댐 결함 검출을 실행해주세요.')
                }
                
                setImgListOri(OriImage);

            }).catch((err) => {
                console.log(err);
            });


        //결함 검출 결과 받아오기
        axios({
            method: 'get',
            url: API_URL+'/File/Files',
            headers: { "accept": `application/json`, "access-token": `${token}` },
            params: {
                path: `/project/${project_id}/stage6/${DamType}`
            }
            }).then((res)=>{
                if (res.data.check === true){
                    // console.log(res.data.data)
                    for(let i = 0; i<res.data.data.files.length; i++){
                        if(res.data.data.files[i].includes(String(".png")) || res.data.data.files[i].includes(String(".JPG"))){
                            ResultImage.push({
                                result_image : `${IMAGE_URL}/image?path=/project/${project_id}/stage6/${DamType}/${res.data.data.files[i]}&width=1440`,
                                no : i
                            })

                            ImgContents.push({
                                no : i%3 !== 0 ? (i+1)/3 : i,
                                name : <a style={{color:"black"}}>{res.data.data.files[i]}</a>
                            })
                        }                        
                    }

                    if(ResultImage.length > 0){
                        setResultDefect(true);
                        // console.log(resultDefect)
                    }else{
                        alert("결과가 나올 때까지 기다려주세요.")
                    }

                }else{
                    console.log("실패")
                    alert('댐 결함 검출을 실행해주세요.')
                }
                
                setImgListDefect(ResultImage); 
                setImgList(ImgContents) 

            }).catch((err) => {
                console.log(err);
            });

            // console.log(ImgListOri)
            // console.log(resultDefect)
            // console.log(resultOri)

    }, [DamType])

    const openWindow = () => {
        window.open('../../ViewerDefect', "결함 결과 수정", "width=1650px, height=600px, left=300, top=150");
    }

    const rendering = () => {
        const result = [];    
        
        resultDefect === true ? localStorage.setItem('edit_defect_image', ImgListDefect[num].result_image) : localStorage.setItem('edit_defect_image', "")
        
        for (let i = 1; i < DamTypeCount+1; i++) {
            result.push(
            <TabPane tab={setting.dam_type[i-1]} key={i}>
                <div className={styles.DetectorDiv} >
                    <span className={styles.DetectorTitle}>{resultOri === true ?  ImgListOri[num].original_image.substring(ImgListOri[num].original_image.indexOf("/stage") + 17, ImgListOri[num].original_image.indexOf("&width")) : ""}</span>
                    <Button className={styles.downloadBtn} onClick={downloadCouple}>{t.coupledownload}</Button> 
                    {/* <Button className={styles.downloadBtn} onClick={openWindow}>결함 결과 수정</Button> */}
                    <div className={styles.DetectorImage}>
                        <Image src={resultOri === true ? ImgListOri[num].original_image : ""} alt="" width={1080} height={250} />
                    </div>
                    <div className={styles.DetectorImage}>
                        <Image src={resultDefect === true ? ImgListDefect[num].result_image : ""} alt="" width={1080} height={250} />
                    </div>
                </div>
            </TabPane>
            );
        }
        return result;
    };

    const TabClick = (e:any) => {
        if(e === "1"){
            setDamType("Overflow")
        }else if(e === "2"){
            setDamType("DamFloor")
        }else if(e === "3"){
            setDamType("UpStream")
        }else if(e === "4"){
            setDamType("DownStream")
        }
    }

    const nextClick = () => {
        if (num < ImgListOri.length - 1) {
            setNum(num + 1);
        }
    };

        //커플 이미지 다운로드
        const downloadCouple = () => {
            // console.log(ImgListOri[num].original_image)
            // console.log(ImgListDefect[num].result_image)
            alert("잠시 기다리시면 다운로드 됩니다.")
    
            const indexFrontOri = ImgListOri[num].original_image.indexOf("/stage")
            const indexBackOri= ImgListOri[num].original_image.indexOf("&width")   
            const ImageUrlCutWidthOri = ImgListOri[num].original_image.substring(indexFrontOri+1, indexBackOri)
    
            console.log(ImageUrlCutWidthOri)
    
            const indexFrontName = ImgListOri[num].original_image.indexOf("/stage")
            const indexBackName= ImgListOri[num].original_image.indexOf("&width")   
            const ImageUrlCutWidthName = ImgListOri[num].original_image.substring(indexFrontName+17, indexBackName)
    
            console.log(ImageUrlCutWidthName)
    
            const indexFrontCrack = ImgListDefect[num].result_image.indexOf("/stage")
            const indexBackCrack= ImgListDefect[num].result_image.indexOf("&width")   
            const ImageUrlCutWidthCrack = ImgListDefect[num].result_image.substring(indexFrontCrack+1, indexBackCrack)
    
            console.log(ImageUrlCutWidthCrack)
    
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
                    task_name: "image_join",
                    interactive: false,
                    tasks: [{
                        image1_path: ImageUrlCutWidthOri,
                        image2_path: ImageUrlCutWidthCrack,
                        align: 0, //수평 //수직으로 하려면 0
                        output_folder: 'stage6_defect_Couple',
                        output_name: ImageUrlCutWidthName
                    }]
                    }
            }).then((res) => {
                console.log(res.data.check)
                if (res.data.check === true) {
                    job_id = res.data.data.job_id
                            /////30초마다 alert로 알려줌////////////
                            resultCouple = setInterval(confirm, 10000)
                } else {
                    console.log("실패")
                }
            })
        }

    let job_id = 0;
    let resultCouple :any;
    
    async function confirm(){
        
        axios({
            method: "post",
            url: API_URL + '/scheduler/job/query',
            headers: { "accept": `application/json`, "access-token": `${token}`, "Content-Type" : `application/json` },
                data: {
                    "job_id": job_id ,
                    "company_id": companyid
                }
                  }).then(async (res) => {
                console.log(res)
                if (res.data.check === true) {
                    if (res.data.data.status === "done") {
                        console.log("성공")
                        
                        setTimeout(()=>
                            download()
                        ,10000)

                    clearInterval(resultCouple)
                    } else if (res.data.data.status === "progress") {
                        // alert("이미지 추출중입니다.")
                    } else if(res.data.data.status === "error"){
                        alert("해당 파일이 없습니다.")
                    }
                } else {
                    console.log("실패")
                }
            })   
    }

    async function download(){

        console.log("download 받을거에유 이제,,")
        

        const indexFrontName = ImgListOri[num].original_image.indexOf("/stage")
        const indexBackName= ImgListOri[num].original_image.indexOf("&width")   
        const ImageUrlCutWidthName = ImgListOri[num].original_image.substring(indexFrontName+17, indexBackName)

        const link = document.createElement('a');
        let src = `${IMAGE_URL}/image?path=/project/${project_id}/stage6_defect_Couple/${ImageUrlCutWidthName}`;
        const imageBlob = await (await fetch(src)).blob();
        src = URL.createObjectURL(imageBlob);
        link.href = src;
        link.download = ImageUrlCutWidthName
        link.click();
    }

    return (
        <>
            <div className={styles.DivArea}>
                <div>
                    <p className={styles.subOrder}>{t.dmDetectorMeasure} &gt; {t.dmDetectorMeasureResult}</p>
                    <p className={styles.mainOrder}>{t.dmDetectorMeasureResult}</p>
                </div>
            

                <div className={styles.SetDiv}>
                    <div className={styles.CamList}>
                        <Table dataSource={resultOri === true ? ImgList:""} onRow={(record) => {
                            return {
                            onClick: (event) => {
                            setNum(record.no - 1);
                            // console.log(record.no)
                            },
                            };
                        }}>
                            <Column title={t.cnNumber} dataIndex="no" key="no" />
                            <Column title={t.cnName} dataIndex="name" key="no" />
                        </Table>
                    </div>

                    <Tabs defaultActiveKey="1" onTabClick={TabClick}>
                        {rendering()}
                    </Tabs>
                </div>
                <Button className={styles.nextBtn} onClick={nextClick}>
                    {t.next}
                </Button>
            </div>
        </>
    )
}
