import { useEffect, useState } from 'react';
import { useRecoilState, atom, constSelector } from 'recoil';
import styles from '../../../Styles/Preprocess.module.css'
import { Button, Checkbox, Tabs} from 'antd';
import { langState } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import axios from "axios";
import { API_URL, IMAGE_URL } from '../../../Store/Global';


interface Image {
    folderName : string;
    imageURL : Array<string>;
}

export default function Jtag() {

    let CameraSet123:any[] = [];

    let RenameArr:any[] = [];
    let JDetectorArr:any[] = [];
    let Newarr123:any[] = [];

    const images : Image [] = [];

    let token : string | null = localStorage.getItem("token") 
    let project_id : string | null = localStorage.getItem("project_id")

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    const [ImgList, setImgList] = useState<any[]>(images);
    const [JDetectorTask, setJDetectorTask] = useState<any[]>([]);

    const [CameraSet, setCameraSet] = useState<any[]>(CameraSet123);

    const [arr, setArr] = useState<any>([])

    let [newArr2, setNewArr2] = useState<any>([])

    const [resultImageList, setresultImageList] = useState<boolean>(false)

    const { TabPane } = Tabs;

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


    const rendering = (i:number) => {
        const resultImage:any[] = [];        
        ImgList[i].imageURL.map((imageURL:any)=>{
            const indexFront = imageURL.indexOf("C") 
            const indexBack= imageURL.indexOf(".png")   
            const ImageUrlCutWidth = imageURL.substring(indexFront+4, indexBack+4)

            // const ImageUrlCutWidth = imageURL.slice(0, -10)
            resultImage.push(<img src={imageURL} id={String(i)} alt={imageURL} key={imageURL} className={newArr2.includes(ImageUrlCutWidth) ? styles.JtagImageBorder : styles.JtagImage} onClick={onClickimage}/>)
        })
            
        if(resultImage.length < 1){
            setresultImageList(false);
        }
        return resultImage;
    }

    const Tabrendering = (j:number) => {
        const resultTab:any[] = [];   

        resultTab.push(<TabPane tab={"CameraSet " + Number(j+1)} key={j}>
                    <div className={styles.JtagDiv}>
                        { 
                        resultImageList === true ? 
                            ImgList.map((_,i)=>(
                                // console.log(i);
                                // CameraSet[j].FirstCamera > 1 && 추가
                                CameraSet[j].FirstCamera > 1 && CameraSet[j].FirstCamera - 1 <= i || i < CameraSet[j].LastCamera ? 
                                <div className={styles.ImageScrollDiv} key={i}>
                                    <ul className={styles.ImageScrollDivUl}>
                                    <div className={styles.ImageDiv}>
                                        <div>{i+1}. {ImgList[i].folderName}</div>
                                        <div className={styles.ImageCheckDiv}>
                                            <Checkbox>{t.LRReverse}</Checkbox>
                                            {/* <Checkbox>{t.UDReverse}</Checkbox> */}
                                        </div>
                                        <br />
                                        <br />
                                        { rendering(i) }
                                    </div>
                                    </ul>
                                </div>
                                : <div>이미지 로드 실패</div>
                            ))
                            :   
                            <div>
                            이미지 로딩 중 입니다.
                            </div>
                    }
                    </div>
            </TabPane>)            
        if(resultTab.length < 1){
            setresultImageList(false);
        }
        return resultTab;
    }

    const [isBind, setIsBind] = useState(false);

    const DataBind = () => {
        if (!isBind) {
          // console.log(cameraCount)
        const response = axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers : {"accept" : `application/json`, "access-token" : `${token}`}, 
        }).then((res) => {
                const settings: any = JSON.parse(res.data.data.settings)
                if (res.data.check === true) {
                    setCameraSet(JSON.parse(settings.filmSetCount))
                    // console.log(JSON.parse(settings.filmSetCount)[0]);

                    for(let i = 0; i < settings.cameraCount; i++){
                        images.push({
                            // folderName:"C0" + Number(i + 1),
                            folderName:"C" + String(i + 1).padStart(2,"0"),
                            imageURL : []
                        })
                
                        RenameArr.push({
                            // input_folder:"stage1_2/C0" + Number(i + 1),
                            input_folder:"stage1_2/C" + String(i + 1).padStart(2,"0"),
                            file_list : []
                        })
                        // setresultRenameList(true);
                    }

                    for(let i = 0; i < JSON.parse(settings.filmSetCount).length; i++){
                        JDetectorArr.push({
                            input_folder: "stage1_2",
                            start_cam: "C" + String(JSON.parse(settings.filmSetCount)[i].FirstCamera).padStart(2,"0"),
                            cam_set_no: JSON.parse(settings.filmSetCount)[i].LastCamera - JSON.parse(settings.filmSetCount)[i].FirstCamera + 1,
                            reverse: false
                        })
                    }
                setJDetectorTask(JDetectorArr)
                setImgList(images);

                for(let i = 0; i < settings.cameraCount; i++){
                        axios({
                            method: 'get',
                            url: API_URL+'/file/files',
                            headers: { "accept": `application/json`, "access-token": `${token}` },
                            params: {
                                path: `/project/${project_id}/stage1/${images[i].folderName}`
                            }
                        }).then((res)=>{
                            if (res.data.check === true) {
                                console.log("성공")
                                
                                console.log(res.data.data)
                               
                                for(let j=0; j<res.data.data.files.length; j++){
                                    images[i].imageURL.push(`${IMAGE_URL}/image?path=/project/${project_id}/stage1/${images[i].folderName}/${res.data.data.files[j]}&width=360`)
                                }
                                // console.log(images)
                                setresultImageList(true);
                                setIsBind(true);
                                
                                
            
                            } else {
                                console.log("실패")
                            }
                        }).catch((err) => {
                            console.log(err);
                        });
                    }

                    setArr(RenameArr)
                    console.log(RenameArr);
                }
        }).catch((err) => {
            console.log(err);
        });
        }
      };

    useEffect(()=>{
        DataBind(); 
    },[isBind])

    /////////////////30초마다 status알려주는 alert//////////////////////////////////////////
    let job_id = 0;
    let result :any;
    const confirm = () => {
        console.log(job_id)
        axios({
            method: "post",
            url: API_URL + '/scheduler/job/query',
            headers: { "accept": `application/json`, "access-token": `${token}`, "Content-Type" : `application/json` },
                data: {
                    "job_id": job_id ,
                    "company_id": companyid
                }
            }).then((res) => {
                console.log(res)
                if (res.data.check == true) {
                    console.log("성공")
                    // console.log(res.data.data.status)
                    if (res.data.data.status === "done") {
                        alert("J-tag 작업이 끝났습니다.")
                        // setTask([])
                        clearInterval(result)
                        window.location.href='../Preprocess/JtagConfirm'
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
    /////////////////////////////////////////////////////////////////////////////////////////////////

    const onClickimage = (e:any) => {
        const indexFront = e.target.src.indexOf("C") 
        const indexBack= e.target.src.indexOf(".png")   
        const ImageUrlCutWidth = e.target.src.substring(indexFront+4, indexBack+4) 

        // const ImageUrlCutWidth = e.target.src.slice(0, -10)
        if(arr[Number(e.target.id)].file_list.includes(ImageUrlCutWidth) === false){
            arr[Number(e.target.id)].file_list.push(ImageUrlCutWidth);
        }else{
            for(let i = 0; i < arr[Number(e.target.id)].file_list.length; i++) {
                    if(arr[Number(e.target.id)].file_list[i] === ImageUrlCutWidth){
                        arr[Number(e.target.id)].file_list.splice(i, 1);
                    }
            }
        }
        console.log(arr);        

        ImgList.map((_,i) => {
            arr[i].file_list.map((nowUrl:String)=>{
                Newarr123.push(nowUrl)
            })
        })

        setNewArr2(Newarr123)
    }
    
    const onClickConfirm = (e:any) => {
        console.log(arr);
        // console.log(JDetectorArr);
        console.log(JDetectorTask);
        alert("j-tag 작업을 시작합니다.")
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
                task_name: "joint_rename",
                interactive: false,
                tasks: arr
            }
        }).then((res)=>{
            if (res.data.check === true) {
                console.log("이름 변경 성공")

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
                        task_name: "j_detector",
                        interactive: false,
                        tasks: JDetectorTask
                    }
                }).then((res)=>{
                    if (res.data.check === true) {
                        // console.log("j_detector 성공")
                        job_id = res.data.data.job_id
                        /////30초마다 alert로 알려줌////////////
                        result = setInterval(confirm, 30000)
                        alert("j_detector 작업")
                    } else {
                        console.log("실패")
                    }
                }).catch((err) => {
                    console.log(err);
                });
            } else {
                console.log("이름 변경 실패")
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <>
            <div className={styles.DivArea}>

            <div>
                <p className={styles.subOrder}>{t.ppPreprocessor} &gt; {t.ppJTag}</p>
                <p className={styles.mainOrder}>{t.ppJTag}</p>
            </div>      
            <Tabs defaultActiveKey="1">
                
                {/* {
                    CameraSet.map((_,j)=>(
                        Tabrendering(j)
                    ))
                } */}
                <TabPane tab="Set 1" key="1">
                    <div className={styles.JtagDiv}>
                            { 
                            resultImageList === true ? 
                            ImgList.map((_,i)=>(
                                    CameraSet[0].FirstCamera < i || i < CameraSet[0].LastCamera ? 
                                    i < 7 ? <div className={styles.ImageScrollDiv} key={i}>
                                    <ul className={styles.ImageScrollDivUl}>
                                    <div className={styles.ImageDiv}>
                                        <div>{i+1}. {ImgList[i].folderName}</div>
                                        <div className={styles.ImageCheckDiv}>
                                            <Checkbox>{t.LRReverse}</Checkbox>
                                            <Checkbox>{t.UDReverse}</Checkbox>
                                        </div>
                                        <br />
                                        <br />
                                        { rendering(i) }
                                    </div>
                                    </ul>
                                </div> : <></>
                                    : <></>
                                ))
                                :   
                                <div>
                                이미지 로딩 중 입니다.
                                </div>
                        }
                        </div>
                </TabPane>

                <TabPane tab="Set 2" key="2">
                    <div className={styles.JtagDiv}>
                            { 
                            resultImageList === true ? 
                            ImgList.map((_,i)=>(
                                    CameraSet[0].FirstCamera < i || i < CameraSet[0].LastCamera ? 
                                    i >= 7 ? <div className={styles.ImageScrollDiv} key={i}>
                                    <ul className={styles.ImageScrollDivUl}>
                                    <div className={styles.ImageDiv}>
                                        <div>{i+1}. {ImgList[i].folderName}</div>
                                        <div className={styles.ImageCheckDiv}>
                                            <Checkbox>{t.LRReverse}</Checkbox>
                                            <Checkbox>{t.UDReverse}</Checkbox>
                                        </div>
                                        <br />
                                        <br />
                                        { rendering(i) }
                                    </div>
                                    </ul>
                                </div> : <></>
                                    : <></>
                                ))
                                :   
                                <div>
                                이미지 로딩 중 입니다.
                                </div>
                        }
                        </div>
                </TabPane> : <></>
            </Tabs>

            <Button onClick={onClickConfirm}>확인</Button>


            </div>
        </>
    )
}
