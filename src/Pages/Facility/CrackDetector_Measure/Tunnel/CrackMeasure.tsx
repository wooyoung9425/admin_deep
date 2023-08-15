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
    sort : any
}

interface CrackImage {
    no : any
    original_image : string
}

interface ResultImage {
    no : any
    result_image : string
}

// let spanCount = 4;
// let CameraCount = 4;

export default function CrackMeasure() {

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    const { TabPane } = Tabs;
    const { Column } = Table;

    let token : string | null = localStorage.getItem("token") 
    let project_id : string | null = localStorage.getItem("project_id")

    const ImgContents : ImgContents[] = [];  
    const CrackImage : CrackImage[] = [];  
    const ResultImage : ResultImage[] = [];  

    const [spanCount, setspanCount] = useState<number>(0)
    const [CameraCount, setCameraCount] = useState<number>(0)


    const [num, setNum] = useState<number>(0);
    const [ImgList, setImgList] = useState<any | undefined>(ImgContents)

    const [ImgListCrack, setImgListCrack] = useState<any[]>(CrackImage);
    const [ImgListMeasure, setImgListMeasure] = useState<any[]>(ResultImage);

    const [resultCrack, setResultCrack] = useState<boolean>(false)
    const [resultMeasure, setResultMeasure] = useState<boolean>(false)

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

        const response = axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers : {"accept" : `application/json`, "access-token" : `${token}`}, 
        }).then((res) => {
                const settings: any = JSON.parse(res.data.data.settings)
                if (res.data.check === true) {
                    // console.log(settings.spanCount * settings.cameraCount)
                    setspanCount(settings.spanCount);
                    setCameraCount(settings.cameraCount);

                    axios({
                        method: 'get',
                        url: API_URL+'/file/files',
                        headers: { "accept": `application/json`, "access-token": `${token}` },
                        params: {
                            path: `/project/${project_id}/stage7`
                        }
                    }).then((res)=>{
                        if (res.data.check === true) {
                            // console.log("성공")
                            
                            for(let i = 0; i<res.data.data.files.length; i++){
                                // console.log(res.data.data.files[i])
                                const indexFront = res.data.data.files[i].indexOf("S") 
                                const indexBack = res.data.data.files[i].indexOf(".png") 
                                const SpanNum = res.data.data.files[i].substring(indexFront, indexBack-8)
                                if(res.data.data.files[i].includes(".png")){
            
                                    // console.log(res.data.data.files[i])
            
                                    ResultImage.push({
                                        result_image : `${IMAGE_URL}/image?path=/project/${project_id}/stage7/${res.data.data.files[i]}&width=1440`,
                                        no : SpanNum
                                    })
                                }
            
                                if(res.data.data.files[i].includes(".png")){
                                    ImgContents.push({
                                                no : i + 1,
                                                name : <a style={{color:"black"}}>{res.data.data.files[i]}</a>,
                                                sort : SpanNum
                                    })
                                }
                            }
            
                            if(ResultImage.length > 0){
                                setResultMeasure(true);
                            }else{
                                alert("결과가 나올 때까지 기다려주세요.")
                            }
            
                        } else {
                            console.log("실패")
                            alert('균열 측정을 실행해주세요.')
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
                        console.log(ImgList, "ImgList")
            
                        ResultImage.sort((obj1, obj2) => {
                            if (obj1.no > obj2.no) {
                                return 1;
                            }
                            if (obj1.no < obj2.no) {
                                return -1;
                            }
                            return 0;
                            })
            
                        setImgListMeasure(ResultImage);
            
                    }).catch((err) => {
                        console.log(err);
                    });
            
                    for(let i = 1; i <settings.spanCount + 1; i++){
                        axios({
                            method: 'get',
                            url: API_URL+'/file/files',
                            headers: { "accept": `application/json`, "access-token": `${token}` },
                            params: {
                                // path: `/project/${project_id}/stage6_2/S00${i}`
                                path: `/project/${project_id}/stage6/S${String(i).padStart(3,"0")}`
                            }
                        }).then((res)=>{
                            
                            if (res.data.check === true) {
            
                                for(let j = 0; j < res.data.data.files.length; j++){
                                    CrackImage.push({
                                        // original_image : `${IMAGE_URL}/image?path=/project/${project_id}/stage6_2/S00${i}/${res.data.data.files[j]}&width=1440`,
                                        original_image : `${IMAGE_URL}/image?path=/project/${project_id}/stage6/S${String(i).padStart(3,"0")}/${res.data.data.files[j]}&width=1440`,
                                        no : `${i}`
                                    })
                                }
                                
                            } else {
                                console.log("실패")
                            }

                            // console.log(CrackImage.length)
                            // console.log(settings.spanCount * settings.cameraCount)
            
                            if(CrackImage.length <= settings.cameraCount * settings.spanCount){
                                setResultCrack(true);
                                // console.log(resultCrack)
                            }
            
                            CrackImage.sort((obj1, obj2) => {
                                if (obj1.no > obj2.no) {
                                    return 1;
                                }
                                if (obj1.no < obj2.no) {
                                    return -1;
                                }
                                return 0;
                            })
            
                            setImgListCrack(CrackImage)
                            
                        }).catch((err) => {
                            console.log(err);
                        });
                    }
                }
            }).catch((err) => {
                console.log(err);
            });
            
    }, [])


        const nextClick = () => {
            // console.log(num);
            // Ori
            if (num < ImgListCrack.length - 1) {
                setNum(num + 1);
            } else if (num >= ImgListCrack.length - 1) {
                // window.location.replace("./MeasureSetting");
                alert("마지막 이미지 입니다!")
            }
            };


    const TabClick = (e:any) => {
        if(e === "1"){
            setNum(CameraCount * (Number(e)-1))
        }else if(e === "2"){
            setNum(CameraCount * (Number(e)-1))
        }else if(e === "3"){
            setNum(CameraCount * (Number(e)-1))
        }else if(e === "4"){
            setNum(CameraCount * (Number(e)-1))
        }else if(e === "5"){
            setNum(CameraCount * (Number(e)-1))
        }else if(e === "6"){
            setNum(CameraCount * (Number(e)-1))
        }else if(e === "7"){
            setNum(CameraCount * (Number(e)-1))
        }else if(e === "8"){
            setNum(CameraCount * (Number(e)-1))
        }else if(e === "9"){
            setNum(CameraCount * (Number(e)-1))
        }else if(e === "10"){
            setNum(CameraCount * (Number(e)-1))
        }
    }

    const rendering = () => {
        const result = [];
        for (let i = 1; i < spanCount+1; i++) {
            result.push(
            <TabPane tab={"Span" + `${i}`} key={i}>
                <div className={styles.DetectorDiv} >
                    <span className={styles.DetectorTitle}>{resultCrack === true ? ImgListCrack[num].original_image.substring(ImgListCrack[num].original_image.indexOf("/S") + 6, ImgListCrack[num].original_image.indexOf(".png") + 4) : ""}</span>                                                                                    
                    <Button className={styles.downloadBtn} onClick={downloadCouple}>{t.coupledownload}</Button>
                    {/* <Button className={styles.nextBtn}>{t.upload}</Button> */}
                    {/* <Button className={styles.nextBtn}>{t.save}</Button> */}
                    <div className={styles.DetectorImage}>
                        <Image src={resultCrack === true ? ImgListCrack[num].original_image : ""} alt="" width={1080} height={250} />
                    </div>
                    <div className={styles.DetectorImage}>
                        <Image src={resultMeasure === true ? ImgListMeasure[num].result_image : ""} alt="" width={1080} height={250} />
                    </div>
                </div>
            </TabPane>
            );
        }
        return result;
    };

    //커플 이미지 다운로드

    

    const downloadCouple = () => {


        // console.log(ImgListCrack[num].original_image)
        // console.log(ImgListMeasure[num].result_image)

        alert("30초 정도 기다리시면 다운로드 됩니다.")

        const indexFrontOri = ImgListCrack[num].original_image.indexOf("/stage")
        const indexBackOri= ImgListCrack[num].original_image.indexOf("&width")   
        const ImageUrlCutWidthOri = ImgListCrack[num].original_image.substring(indexFrontOri+1, indexBackOri)

        // console.log(ImageUrlCutWidthOri)

        const indexFrontName = ImgListCrack[num].original_image.indexOf("/stage")
        const indexBackName= ImgListCrack[num].original_image.indexOf("&width")   
        const ImageUrlCutWidthName = ImgListCrack[num].original_image.substring(indexFrontName+15, indexBackName)

        // console.log(ImageUrlCutWidthName)

        const indexFrontCrack = ImgListMeasure[num].result_image.indexOf("/stage")
        const indexBackCrack= ImgListMeasure[num].result_image.indexOf("&width")   
        const ImageUrlCutWidthCrack = ImgListMeasure[num].result_image.substring(indexFrontCrack+1, indexBackCrack)

        // console.log(ImageUrlCutWidthCrack)

        // console.log()

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
                    output_folder: 'stage7_Couple',
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
                        , 10000)
                    
                        clearInterval(resultCouple)
                        // window.location.href='../Preprocess/Jtag'
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

    async function download() {

        const indexFrontName = ImgListCrack[num].original_image.indexOf("/stage")
        const indexBackName= ImgListCrack[num].original_image.indexOf("&width")   
        const ImageUrlCutWidthName = ImgListCrack[num].original_image.substring(indexFrontName+15, indexBackName)

        const link = document.createElement('a');
        let src = `${IMAGE_URL}/image?path=/project/${project_id}/stage7_Couple/${ImageUrlCutWidthName}`;
        const imageBlob = await (await fetch(src)).blob();
        src = URL.createObjectURL(imageBlob);
        link.href = src;
        link.download = ImageUrlCutWidthName
        link.click();
    }

    return (
    <div>
        <div className={styles.DivArea}>
            <div>
                <p className={styles.subOrder}>{t.cnCrackDetectorMeasure} &gt; {t.cnMeasure}</p>
                <p className={styles.mainOrder}>{t.cnMeasure}</p>
            </div>

        <div className={styles.SetDiv}>
            <div className={styles.CamList}>
                <Table dataSource={resultCrack === true ? ImgList:""} onRow={(record) => {
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

            <Tabs className={styles.DetectorTP} defaultActiveKey="1" onTabClick={TabClick}>
            {rendering()}
            </Tabs>
            </div>
                <Button className={styles.nextBtn} onClick={nextClick}>
                    {t.next}
                </Button>
        </div>
        </div>
    )
}