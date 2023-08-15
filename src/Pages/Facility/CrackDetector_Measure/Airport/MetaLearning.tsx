import styles from '../../../../Styles/CrackDetector_Measure.module.css'
import { useRecoilState, atom } from 'recoil';
import { langState } from '../../../../Store/State/atom'
import { ko, en } from '../../../../translations';
import { useEffect, useState } from 'react';
import { API_URL, IMAGE_URL } from '../../../../Store/Global';
import axios from 'axios';
import { Button, Select, Slider, Table } from 'antd';
import { ThemeConsumer } from 'styled-components';

interface Image {
    num: Number;
    folderName: string;
    imageURL: Array<string>;
    cnt:Number
}

interface CNT {
    camera_number : number;
    cnt : number;
}

export default function MetaLearning() {

    let Newarr:any[] = [];

    const { Column } = Table;

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    let project_id : string | null = localStorage.getItem("project_id")
    let token : string | null = localStorage.getItem("token") 

    const project_Type=localStorage.getItem("project_Type")
    const setting :any = localStorage.getItem("settings")
    const count = JSON.parse(setting).cameraCount

    const images : Image [] = [];
    const cnt : CNT [] = [];

    const [ImgList, setImgList] = useState<any[]>(images);
    const [finalCNT, setFinalCNT] = useState<any[]>(cnt);
    const [result, setResult] = useState<boolean>(false)
    const [arr, setArr] = useState<any>([])
    const [URLarr, setURLarr] = useState<any>([])
    const [fileArr,setFileArr] = useState<any>([])

    for(let i = 1; i < count+1; i++){
        images.push({ 
            num:i, 
            // folderName:"C0"+ i, 
            folderName: "C"+String(i).padStart(2,"0"), 
            imageURL: [],
            cnt:0,
            })
            
        cnt.push({
            camera_number :  i-1, 
            cnt : 0})
    }

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

        axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers: { "accept": `application/json`, "access-token": `${token}` },
        }).then((res) => {
            if (res.data.check === true) {
                const settings: any = JSON.parse(res.data.data.settings)
                // setType(res.data.data.projectType)
            } else {
                console.log("실패")
            }
        })
        for(let i = 0; i < count; i++){
            Newarr[i] = {cam: 'C'+String(i+1).padStart(2,'0'), filename: []};
            axios({
                method: 'get',
                url: API_URL+'/File/Files',
                headers: { "accept": `application/json`, "access-token": `${token}` },
                params: {
                    path: `/project/${project_id}/stage1/${images[i].folderName}`
                }
            }).then((res)=>{
                if (res.data.check === true) {
                    console.log("성공")
                    // setImgList123(images);
                    setResult(true);

                    for(let j=0; j<res.data.data.files.length; j++){
                        images[i].imageURL.push(`${IMAGE_URL}/image?path=/project/${project_id}/stage1/${images[i].folderName}/${res.data.data.files[j]}&width=360`)
                        
                    }

                } else {
                    console.log("실패")
                }
            }).catch((err) => {
                console.log(err);
            });
        }
        setArr(Newarr)
    }, [])


    const rendering = (i:number) => {
        const result: any[] = [];     

        ImgList[i].imageURL.map((imageURL: any) => {
            let index1 = ""
            if (project_Type === "Tunnel") {
                index1 = imageURL.indexOf(".png")
            } else if(project_Type==="Airport") {
                index1=imageURL.indexOf(".JPG")
            }
            const index_c=imageURL.indexOf('C')
            const ImageUrlCutWidth = imageURL.substring(index_c+4, index1+4)
            result.push(<img src={imageURL} id={String(i)} alt={imageURL} key={imageURL} className={URLarr.includes(ImageUrlCutWidth) ? styles.JtagImageBorder : styles.JtagImage} onClick={onClickImage} />)
        })
        
        if(result.length < 1){
            setResult(false);
        }
        
        return result;
    }

    let copyArrImgList = [...ImgList];
    let copyArrCNT = [...finalCNT];
    let copyArr = [...URLarr];
    let copyfilename = [...arr]
    let filename = [...fileArr]

    const onClickImage = (e: any) => {
        const id = e.target.id
        filename = [...copyfilename[id].filename]
        const str = e.target.src
        
        let index1 = ""
        if (project_Type === "Tunnel") {
            index1 = str.indexOf(".png")
        } else if(project_Type==="Airport") {
            index1=str.indexOf(".JPG")
        }
        
        const index2 = str.indexOf("C")
        if (Number(id) === cnt[e.target.id].camera_number) {
            let name = str.substring(index2 + 4, index1 + 4)
            if (copyArr.includes(name) === false) {
                //border
                copyArr.push(name)
                //선택 개수 계산
                copyArrCNT[id] = { ...copyArrCNT[id], cnt: copyArrCNT[id].cnt + 1 }
                copyArrImgList[id] = { ...copyArrImgList[id], cnt: copyArrCNT[id].cnt, }
                //filename
                filename.push(name)
                setFileArr(filename)
                
            } else {//선택이미지 중복일때
                //  border없앰
                const i = copyArr.indexOf(name)
                copyArr.splice(i, 1)
                // 선택 개수 계산
                copyArrCNT[id] = { ...copyArrCNT[id], cnt: copyArrCNT[id].cnt -1 }
                copyArrImgList[id] = { ...copyArrImgList[id], cnt: copyArrCNT[id].cnt, }
                //filename 
                const j = filename.indexOf(name)
                filename.splice(j, 1)
            }
        }
        setFinalCNT(copyArrCNT)
        setImgList(copyArrImgList)
        setURLarr(copyArr)
        
        copyfilename[id] = {...copyfilename[id], filename: filename}
        setArr(copyfilename)
    }


    let job_id = 0;
    let metaLearning :any;
    const confirm = () => {
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
                if (res.data.check === true) {
                    console.log("성공",res.data.data.status)
                    if (res.data.data.status === "done") {
                        alert("Meta Learning 분류가 끝났습니다.")
                        clearInterval(metaLearning)
                        window.location.href='../CrackDetector_Measure/MetaLearningResult'
                    }else if(res.data.data.status === "wait") {
                        // alert("작업 대기 중입니다.")
                    } else if(res.data.data.status === "error"){
                        // alert("해당 파일이 없습니다.")
                    }
                } else {
                    console.log("실패")
                }
            })
        
    }

    const onClick = () => {
        // console.log(URLarr)
        console.log(arr)
        arr.map((ob: any, i: number) => {
            console.log(ob.filename)
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
                    task_name: "copy_folder",
                    interactive: false,
                    tasks : [{
                        input_folder : `stage1/`+ob.cam,
                        file_names : ob.filename,
                        output_folder : "stageMeta/original"
                    }]
                }
            }).then((res)=>{
                if (res.data.check === true) {
                    console.log("복사 성공")
                    
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
                            task_name: "airport_meta_learning",
                            interactive: false,
                            tasks: [{
                                input_folder : "stageMeta/original",
                                output_folder : "stageMeta/result"
                            }]
                        }
                    }).then((res2) => {
                        console.log(res2)
                        job_id = res2.data.data.job_id
                        metaLearning = setInterval(confirm, 10000)
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            }).catch((err)=>{
                console.log(err)
            })
            
        })
    }



    return (
        <>
            <div className={styles.DivArea}>
                <div>
                    <p className={styles.subOrder}>{t.dmDetectorMeasure} &gt; {t.dmMetaLearning}</p>
                    <p className={styles.mainOrder}>{t.dmMetaLearning}</p>   
                </div>

                <div className={styles.CamList}>
                <Table dataSource={ImgList}>
                            <Column title={t.cnNumber} dataIndex="num" key="num" />
                            <Column title={t.cnName} dataIndex="folderName" key="num" />
                            <Column title={t.cnt} dataIndex="cnt" key="num" />
                </Table>
                <Button onClick={onClick}>{t.btnComfirm}</Button>
                </div>

                <div className={styles.JtagDiv}>
                    { 
                        result === true ? 
                            images.map((_,i)=>(
                                <div className={styles.ImageScrollDivDrone} key={i}>
                                    <ul className={styles.ImageScrollDivUl}>
                                    <div className={styles.ImageDiv}>
                                        <div>{i+1}. {images[i].folderName}</div>
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
                </div>

            </div>
        </>
    )
}
