import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import styles from '../../../Styles/Preprocess.module.css'
import { Button, Checkbox, Modal, Slider, Table} from 'antd';
import styled from "styled-components";
import { langState } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import axios from "axios";
import { API_URL, IMAGE_URL } from '../../../Store/Global';


interface Image {
    num : Number;
    folderName : string;
    imageURL : Array<string>;
    lean: string;
}

interface Lean {
    input_folder : string;
    lean_mean : number;
}

interface Copy {
    input_folder : string;
    output_folder : string;
}

const CosSliderUp = styled(Slider)`
    
    .ant-slider-tooltip .ant-tooltip-inner {
        none
    }

    .ant-slider-handle {
        position: absolute;
        width: 0.5px;
        height: 720px;
        margin-top: -755px;       
        border-left: solid 0.5px #230;
        opacity: 1;
        border-radius: 10%;
        cursor: pointer;
    }
    `;

    const CosSliderDown = styled(Slider)`
    
    .ant-slider-tooltip .ant-tooltip-inner {
        none
    }

    .ant-slider-handle {
        position: absolute;
        width: 0.5px;
        height: 720px;
        margin-top: -810px;       
        border-left: solid 0.5px #230;
        opacity: 1;
        border-radius: 10%;
        cursor: pointer;
    }
    `;

export default function ImageTask() {

    let Newarr:any[] = [];
    
    const images : Image [] = [];
    const lean : Lean [] = [];
    const folder_copy : Copy [] = [];

    // 프로젝트 영문이름 + 상행,하행 (폴더, 이미지 만들 때 상관있음)
    const [ProjectNameEn, setProjectNameEn] = useState<string>("")

    folder_copy.push({
        input_folder: "stage1",
        output_folder: "stage1_2"
    },
    {
        input_folder: "stage1",
        output_folder: `stage2/${ProjectNameEn}`
    })

    const [ImgList, setImgList] = useState<any[]>(images);

    const [finalLean, setFinalLean] = useState<any[]>(lean);

    let token : string | null = localStorage.getItem("token") 
    let project_id : string | null = localStorage.getItem("project_id")

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [value1, setvalue1] = useState<any>(0)
    const [value2, setvalue2] = useState<any>(0)
    const [value3, setvalue3] = useState<number>(0)

    const [choiceImg, setChoiceImg] = useState<string>("")
    const [choiceIndex, setChoiceIndex] = useState<number>()
    
    const [resultImageList, setResultImageList] = useState<boolean>(false)
    const [resultTableList, setResultTableList] = useState<boolean>(false)


    const [userid, setUserId] = useState<number>(-1);
    const [companyid, setCompanyId] = useState<number>(-1);
  
    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    const { Column } = Table;

    const [arr, setArr] = useState<any>([])

    const rendering = (i:number) => {
        const resultImage:any[] = [];

        ImgList[i].imageURL.map((imageURL:any)=>{
            resultImage.push((<img src={imageURL} id={String(i)} key={imageURL} alt={imageURL} className={styles.JtagImage} onClick={showModal}/>))
        })
            
        if(resultImage.length < 1){
            setResultImageList(false);
        }

        return resultImage;
    }

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


    const [isBind, setIsBind] = useState(false);

    const DataBind = () => {
        if (!isBind) {
            const response = axios({
                method: 'get',
                url: API_URL + `/project/view/${project_id}`,
                headers : {"accept" : `application/json`, "access-token" : `${token}`}, 
            }).then((res) => {
                    const settings: any = JSON.parse(res.data.data.settings)
                    if (res.data.check === true) {
    
                        setProjectNameEn(settings.tunnel_eng + '_' + settings.direction)
                        // console.log(file_prefix)
    
                        // if(settings.cameraCount > 0 ){
                            for(let i = 0; i < settings.cameraCount; i++){
                            images.push({
                                num:i+1, 
                                // folderName:"C0"+ Number(i + 1), 
                                folderName: "C" + String(i+1).padStart(2,"0"), 
                                imageURL: [],
                                lean: ""
                            })
    
                            lean.push({
                                // input_folder : "stage1_2/C0"+ Number(i + 1), 
                                input_folder : "stage1_2/C"+ String(i+1).padStart(2, "0"), 
                                lean_mean : 0})
                                setResultTableList(true);
                        }
    
                        // }
    
                    setImgList(images);
  
    
                    for(let i = 0; i < settings.cameraCount; i++){
                        
                            Newarr[i] = [];
                            axios({
                                method: 'get',
                                url: API_URL+'/file/files',
                                headers: { "accept": `application/json`, "access-token": `${token}` },
                                params: {
                                    path: `/project/${project_id}/stage1/${ImgList[i].folderName}`
                                }
                            }).then((res)=>{
                                if (res.data.check === true) {
                                    console.log("성공")
                                    console.log(res.data)
                
                                    for(let j=0; j<res.data.data.files.length; j++){
                                        ImgList[i].imageURL.push(`${IMAGE_URL}/image?path=/project/${project_id}/stage1/${images[i].folderName}/${res.data.data.files[j]}&width=360`)
                                    }
    
                                    setIsBind(true);
                                    setResultImageList(true);            
                                } else {
                                    console.log("실패 : "+res.data.value)
                                    console.log(res)
                                }
                            }).catch((err) => {
                                console.log(err);
                            });
                        }
                        setArr(Newarr)
    
                    } else {
                        console.log("실패");
                    }
                }).catch((err) => {
                    console.log(err);
                });
      };
    }

    useEffect(() => {
        DataBind();
    }, [isBind])
    

    const showModal = (e:any) => {
        setIsModalVisible(true);
        setChoiceIndex(e.target.id);
        setChoiceImg(e.target.src);
    };

    /////////////////30초마다 status알려주는 alert//////////////////////////////////////////
    let job_id = 0;
    let result :any;
    const confirm = () => {
        console.log(job_id)
        axios({
            method: 'post',
            url: API_URL + '/scheduler/job/query',
            headers : {"accept" : `application/json`, "access-token" : `${token}`, "Content-Type" : `application/json`},
            data: { job_id: job_id}
            }).then((res) => {
                console.log(res)
                if (res.data.check == true) {
                    console.log("성공")
                    if (res.data.data.status === "done") {
                        alert("lean_mean 작업이 끝났습니다.")
                        // setTask([])
                        clearInterval(result)
                        window.location.href='../Preprocess/Jtag'
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

    let copyArrImgList = [...ImgList];
    let copyArrleanList = [...finalLean];

    const handleOk = () => {
        setIsModalVisible(false);
        setvalue3(value1 - value2)
        
        arr[Number(choiceIndex)].push(Number(value3));

        console.log(arr);

        let sumlean : number = 0;

        for ( let i = 0; i < arr[Number(choiceIndex)].length; i++){
            sumlean += arr[Number(choiceIndex)][i]
        }
        
        //평균 값 계산 후 표에 값 추가
        // lean[Number(choiceIndex)].lean_mean = (sumlean / arr[Number(choiceIndex)].length);
        copyArrImgList[Number(choiceIndex)] = { ...copyArrImgList[Number(choiceIndex)], lean : String(sumlean / arr[Number(choiceIndex)].length)};
        copyArrleanList[Number(choiceIndex)] = { ...copyArrleanList[Number(choiceIndex)], lean_mean : sumlean / arr[Number(choiceIndex)].length * 4};

        setImgList(copyArrImgList);
        setFinalLean(copyArrleanList);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onChange1 = (value: number | any) => {
        setvalue1(value)
        setvalue3(value1 - value2)
    };

    const onChange2 = (value: number | any) => {
        setvalue2(value)
        setvalue3(value1 - value2)
    };

    const onClick = () => {
        console.log(finalLean);
        // alert("해당 이미지들을 작업에 반영합니다.")

        // console.log(filePrefix);
        // console.log(folder_copy);

        axios({
            method: 'post',
            url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
            headers: {
              "accept": `application/json`,
              "access-token": `${token}`,
              "Content-Type": `application/json`
            },
            data: {
                project_id: project_id,
                task_name: "copy_folder",
                interactive: false,
                tasks: folder_copy
                
            }
        }).then((res)=>{
            if (res.data.check === true) {
                console.log("복사 성공")

                axios({
                    method: 'post',
                    url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
                    headers: {
                      "accept": `application/json`,
                      "access-token": `${token}`,
                      "Content-Type": `application/json`
                    },
                              data: {
                        project_id: project_id,
                        task_name: "lean_mean",
                        interactive: false,
                        tasks: finalLean
                    }
                }).then((res)=>{
                    if (res.data.check === true) {
                        console.log("성공")
                        job_id = res.data.data.job_id
                        /////30초마다 alert로 알려줌////////////
                        result = setInterval(confirm, 30000)
                        alert("lean_mean 작업")
                    } else {
                        console.log("실패")
                    }
                }).catch((err) => {
                    console.log(err);
                });
            } else {
                console.log("복사 실패")
            }
        }).catch((err) => {
            console.log(err);
        });        
    }

    const TableRendering = () => {
        const resultTable:any[] = [];        
        resultTableList === true ? 
        resultTable.push(<Table dataSource={ImgList}>
                <Column title={t.cnNumber} dataIndex="num" key="num" />
                <Column title={t.cnName} dataIndex="folderName" key="num" />
                <Column title={t.cnAvgLean} dataIndex="lean" key="num" />
        </Table>) 
        : resultTable.push(<div>????</div>)   

        return resultTable;
    }

    return (
        <>
            <div className={styles.DivArea}>

            <div>
                <p className={styles.subOrder}>{t.ppPreprocessor} &gt; {t.ppImageTask}</p>
                <p className={styles.mainOrder}>{t.ppImageTask}</p>
            </div>      
            <div className={styles.CamList}>
                {TableRendering()}
                <Button onClick={onClick}>{t.btnComfirm}</Button>
            </div>

            <div className={styles.ImageTaskDiv}>
                    { 
                        resultImageList === true ? 
                            ImgList.map((_,i)=>(
                                <div className={styles.ImageScrollDiv} key={i}>
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
                                </div>
                            ))
                            :   
                            <div>
                                이미지 로딩 중 입니다.
                            </div>
                    }
                                    <Modal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                                        <div style={{textAlign:"center"}}>
                                            {/* 원본크기는 가로 pixel이 1440,, 1/4배로 화면에 출력 */}
                                            <img src={choiceImg} style={{width:"360px", textAlign:"center"}}/>
                                        </div>
                                        <div style={{paddingLeft:"11%"}}>
                                            위 : <CosSliderUp style={{width:"360px"}} defaultValue={0} min={0} max={360} onChange={onChange1}/>
                                            아래 : <CosSliderDown style={{width:"360px"}} defaultValue={0} min={0} max={360} onChange={onChange2}/>
                                            {/* <CosSlider range defaultValue={[0,360]} min={0} max={360}  /> */}
                                            {/* 아래 : <CosSlider style={{width:"360px"}} defaultValue={0} min={0} max={360} onChange={onChange2}/> */}
                                        </div>
                                    </Modal>
            </div>  


            </div>
        </>
    )
}