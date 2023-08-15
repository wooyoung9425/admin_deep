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

interface OriImage {
    no : any
    original_image : string
}

interface ResultImage {
    no : any
    result_image : string
}

// let spanCount = 4;
// let CameraCount = 4;

export default function AirportCrackDetector() {

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    const { TabPane } = Tabs;
    const { Column } = Table;

    let token : string | null = localStorage.getItem("token") 
    let project_id : string | null = localStorage.getItem("project_id")

    const ImgContents : ImgContents[] = [];  
    const OriImage : OriImage[] = [];  
    const ResultImage : ResultImage[] = [];  

    const [spanCount, setspanCount] = useState<number>(0)
    const [CameraCount, setCameraCount] = useState<number>(0)

    const [num, setNum] = useState<number>(0);
    const [ImgList, setImgList] = useState<any | undefined>(ImgContents)

    const [ImgListOri, setImgListOri] = useState<any[]>(OriImage);
    const [ImgListCrack, setImgListCrack] = useState<any[]>(ResultImage);

    const [resultOri, setResultOri] = useState<boolean>(false)
    const [resultCrack, setResultCrack] = useState<boolean>(false)

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
                    console.log(settings)
                    // *******************span 개수랑 카메라 몇개인지 받아와야 함 **********************
                    setspanCount(settings.spanCount);
                    // setspanCount(4);
                    setCameraCount(settings.cameraCount);
                    // setCameraCount(1);
                    console.log("성공")

                    axios({
                        method: 'get',
                        url: API_URL+'/File/Files',
                        headers: { "accept": `application/json`, "access-token": `${token}` },
                        params: {
                            path: `/project/${project_id}/stage6_crack`
                        }
                    }).then((res)=>{
                        if (res.data.check === true) {
                            console.log("성공")
                            
                            for(let i = 0; i<res.data.data.files.length; i++){
                                const indexFront = res.data.data.files[i].indexOf("S") 
                                const indexBack = res.data.data.files[i].indexOf(".png") 
                                const SpanNum = res.data.data.files[i].substring(indexFront, indexBack-6)
                                // console.log(SpanNum)
                                if(res.data.data.files[i].includes(".png")){
                                    ResultImage.push({
                                        result_image : `${IMAGE_URL}/image?path=/project/${project_id}/stage6_crack/${res.data.data.files[i]}&width=1440`,
                                        no : SpanNum
                                    })
                
                                    ImgContents.push({
                                                    no : i + 1,
                                                    name : <a style={{color:"black"}}>{res.data.data.files[i]}</a>,
                                                    sort : SpanNum
                                                })                                
                                }
                                
                            }
            
                            if(ResultImage.length > 0){
                                setResultCrack(true);
                                // console.log(ResultImage)
                            }else{
                                alert("결과가 나올 때까지 기다려주세요.")
                            }
            
                        } else {
                            console.log("실패")
                            alert('균열 검출을 실행해주세요.')
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
                        // console.log(ImgList, "ImgList")
            
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
            
                    // *******************span 개수랑 카메라 몇개인지 받아와야 함 **********************            
                    for(let i = 1; i <settings.spanCount + 1; i++){
                        // for(let i = 1; i <4 + 1; i++){
                        axios({
                            method: 'get',
                            url: API_URL+'/File/Files',
                            headers: { "accept": `application/json`, "access-token": `${token}` },
                            params: {
                                path: `/project/${project_id}/stage4/S${String(i).padStart(3,"0")}`
                            }
                        }).then((res)=>{
                            
                            if (res.data.check === true) {
                                console.log("성ㅇㅇㅇㅇㅇㅇㅇㅇㅇ공ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ")
            
                                for(let j = 0; j < res.data.data.files.length; j++){
                                    OriImage.push({
                                        // original_image : `${IMAGE_URL}/image?path=/project/${project_id}/stage4/S00${i}/${res.data.data.files[j]}&width=1440`,
                                        original_image : `${IMAGE_URL}/image?path=/project/${project_id}/stage4/S${String(i).padStart(3,"0")}/${res.data.data.files[j]}&width=1440`,
                                        no : `${i}`
                                    })
                                }
                                
                            } else {
                                console.log("실패")
                            }
            
                             // *******************span 개수랑 카메라 몇개인지 받아와야 함 **********************
                            if(OriImage.length === settings.cameraCount * settings.spanCount){
                                // if(OriImage.length === 1 * 4){
                                setResultOri(true);
                            }
            
                            OriImage.sort((obj1, obj2) => {
                                if (obj1.no > obj2.no) {
                                    return 1;
                                }
                                if (obj1.no < obj2.no) {
                                    return -1;
                                }
                                return 0;
                            })
            
                            setImgListOri(OriImage)
                            
                        }).catch((err) => {
                            console.log(err);
                        });
                    }
                } else {
                    console.log("실패");
                }
            }).catch((err) => {
                console.log(err);
            });

            // console.log(spanCount)
            // console.log(CameraCount)
        
    }, [])


        const nextClick = () => {
            // console.log(num);
            // Ori
            if (num < ImgListOri.length - 1) {
                setNum(num + 1);
            } else if (num >= ImgListOri.length - 1) {
                window.location.replace("./MeasureSetting");
            }
            };


    const TabClick = (e:any) => {

        // console.log(ImgListOri);
        // console.log(CameraCount);
        // console.log(Number(e)-1);
        // console.log(CameraCount * (Number(e)-1));

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
        // console.log(ImgListOri)

        // const indexFrontName = ImgListOri[num].original_image.indexOf("/stage")
        // const indexBackName= ImgListOri[num].original_image.indexOf("&width")   
        // const ImageUrlCutWidthName = ImgListOri[num].original_image.substring(indexFrontName+13, indexBackName)
        
        for (let i = 1; i < spanCount+1; i++) {

            result.push(
            <TabPane tab={"Span" + `${i}`} key={i}>
                <div className={styles.DetectorDiv} >
                    <span className={styles.DetectorTitle}>{resultOri === true ?  ImgListOri[num].original_image.substring(ImgListOri[num].original_image.indexOf("/stage") + 13, ImgListOri[num].original_image.indexOf("&width")) : ""}</span>
                    <Button className={styles.downloadBtn} onClick={downloadCouple}>{t.coupledownload}</Button> 
                    {/* <Button className={styles.nextBtn}>{t.upload}</Button> */}
                    {/* <Button className={styles.nextBtn}>{t.save}</Button> */}
                    <div className={styles.DetectorImage}>
                        <Image src={resultOri === true ? ImgListOri[num].original_image : ""} alt="" width={1080} height={250} />
                    </div>
                    <div className={styles.DetectorImage}>
                        <Image src={resultCrack === true ? ImgListCrack[num].result_image : ""} alt="" width={1080} height={250} />
                    </div>
                </div>
            </TabPane>
            );
        }
        return result;
    };

    //커플 이미지 다운로드
    const downloadCouple = () => {


        // console.log(ImgListOri[num].original_image)
        // console.log(ImgListCrack[num].result_image)

        const indexFrontOri = ImgListOri[num].original_image.indexOf("/stage")
        const indexBackOri= ImgListOri[num].original_image.indexOf("&width")   
        const ImageUrlCutWidthOri = ImgListOri[num].original_image.substring(indexFrontOri+1, indexBackOri)

        // console.log(ImageUrlCutWidthOri)

        const indexFrontName = ImgListOri[num].original_image.indexOf("/stage")
        const indexBackName= ImgListOri[num].original_image.indexOf("&width")   
        const ImageUrlCutWidthName = ImgListOri[num].original_image.substring(indexFrontName+13, indexBackName)

        // console.log(ImageUrlCutWidthName)

        const indexFrontCrack = ImgListCrack[num].result_image.indexOf("/stage")
        const indexBackCrack= ImgListCrack[num].result_image.indexOf("&width")   
        const ImageUrlCutWidthCrack = ImgListCrack[num].result_image.substring(indexFrontCrack+1, indexBackCrack)

        // console.log(ImageUrlCutWidthCrack)

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
                    output_folder: 'stage6_crack_Couple',
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

        const indexFrontName = ImgListOri[num].original_image.indexOf("/stage")
        const indexBackName= ImgListOri[num].original_image.indexOf("&width")   
        const ImageUrlCutWidthName = ImgListOri[num].original_image.substring(indexFrontName+13, indexBackName)

        const link = document.createElement('a');
        let src = `${IMAGE_URL}/image?path=/project/${project_id}/stage6_crack_Couple/${ImageUrlCutWidthName}`;
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
                <p className={styles.subOrder}>{t.dmDetectorMeasure} &gt; {t.cnCrackDetectorMeasureResult}</p>
                <p className={styles.mainOrder}>{t.cnCrackDetectorMeasureResult}</p>
            </div>

        <div className={styles.SetDiv}>
            <div className={styles.CamList}>
                <Table dataSource={resultOri === true ? ImgList:""} onRow={(record) => {
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

            <Tabs defaultActiveKey="1" onTabClick={TabClick}>
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