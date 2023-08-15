import { useEffect, useState } from 'react';
import { useRecoilState, atom, constSelector } from 'recoil';
import styles from '../../../Styles/Preprocess.module.css'
import { Button, Checkbox, Table} from 'antd';
import { langState } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import axios from "axios";
import { API_URL, IMAGE_URL } from '../../../Store/Global';
import { copyFile } from 'fs';


interface Image {
    num : Number;
    folderName : string;
    imageURL : Array<string>;
    joint: Number;
}

interface JointEdit {
    input_folder : string;
    add : Array<string>;
    remove : Array<string>;
}

    // let count = 4;

export default function JtagConfirm() {

    let Newarr:any[] = [];
    
    const imagesAll : Image [] = [];
    const imagesJoint : Image [] = [];
    const JointEdit : JointEdit [] = [];
    const JointCopy:any[] = [];
    const SpanMove :any[] = [];

    let UpdateArr:any[] = [];

    let [nowImage, setNowImage] = useState<any[]>(imagesJoint)

    const [ImgListAll, setImgListAll] = useState<any[]>(imagesAll);
    const [ImgListJoint, setImgListJoint] = useState<any[]>(imagesJoint);

    //???????????????????????????????????
    const [ChangeJointList, setChangeJointList] = useState<any[]>(JointEdit);

    const [spanMoveTask, setspanMoveTask] = useState<any[]>([]);
    const [JointCopyTask, setJointCopyTask] = useState<any[]>([]);

    // 프로젝트 영문이름 + 상행,하행 (폴더, 이미지 만들 때 상관있음)
    const [ProjectNameEn, setProjectNameEn] = useState<string>("")

    let token : string | null = localStorage.getItem("token") 
    let project_id : string | null = localStorage.getItem("project_id")
    
    const [result, setResult] = useState<boolean>(false)
    const [all, setAll] = useState<boolean>(true)

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    const { Column } = Table;

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
        const result:any[] = [];
        // console.log(nowImage, "::::::::::::::::::::::::::::::::::::::");
;
        if(all === true){
            ImgListAll[i].imageURL.map((imageURL:any)=>{
                // console.log(ImgListJoint[i].imageURL.includes(imageURL))
                result.push((<img src={imageURL} id={String(i)} key={imageURL} alt={imageURL} className={ImgListJoint[i].imageURL.includes(imageURL) ? styles.JtagImageBorder : styles.JtagImage} onClick={onClickimage}/>))
            })
        }else{
            ImgListJoint[i].imageURL.map((imageURL:any)=>{
                result.push((<img src={imageURL} id={String(i)} key={imageURL} alt={imageURL} className={ImgListJoint[i].imageURL.includes(imageURL) ? styles.JtagImageBorder : styles.JtagImage} onClick={onClickimage}/>))
            })
        }
            
        if(result.length < 1){
            setResult(false);
        }

        return result;
    }

    useEffect(() => {
        const response = axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers : {"accept" : `application/json`, "access-token" : `${token}`}, 
        }).then((res) => {
                const settings: any = JSON.parse(res.data.data.settings)
                if (res.data.check === true) {
                    // console.log(settings.cameraCount)

                    setProjectNameEn(settings.tunnel_eng + '_' + settings.direction)

                    for(let i = 1; i < settings.cameraCount+1; i++){
                        imagesAll.push({ 
                            num:i, 
                            folderName:"C"+ String(i).padStart(2,"0"), 
                            imageURL: [],
                            joint: 0})
                
                        imagesJoint.push({ 
                            num:i, 
                            folderName:"C"+ String(i).padStart(2,"0"), 
                            imageURL: [],
                            joint: 0})
                
                        JointEdit.push({
                            // input_folder : "stage1_2/C0" + i,
                            input_folder : "stage1_2/C" + String(i).padStart(2,"0"),
                            add : [],
                            remove : []
                        })
                
                        JointCopy.push({
                            input_folder : "stage1_2/C" + String(i).padStart(2,"0"),
                            output_folder : `stage2/${settings.tunnel_eng + '_' + settings.direction}/C` + String(i).padStart(2,"0")
                        })
                
                        SpanMove.push({
                            input_folder : `stage2/${settings.tunnel_eng + '_' + settings.direction}/C` + String(i).padStart(2,"0"),
                            start_no :  0
                        })
                    }

                    let copyArrImgListAll = [...ImgListAll];

        for(let i = 0; i < settings.cameraCount; i++){
            axios({
                method: 'get',
                url: API_URL+'/File/Files',
                headers: { "accept": `application/json`, "access-token": `${token}` },
                params: {
                    path: `/project/${project_id}/stage1_2/${imagesAll[i].folderName}`
                }
            }).then((res)=>{
                if (res.data.check === true) {
                    console.log("성공")
                    // setImgList123(images);
                    setResult(true);

                    for(let j=0; j<res.data.data.files.length; j++){
                        imagesAll[i].imageURL.push(`${IMAGE_URL}/image?path=/project/${project_id}/stage1_2/${imagesAll[i].folderName}/${res.data.data.files[j]}&width=360`)

                        if(imagesAll[i].imageURL[j].includes("_J")){
                            imagesJoint[i].imageURL.push(`${IMAGE_URL}/image?path=/project/${project_id}/stage1_2/${imagesAll[i].folderName}/${res.data.data.files[j]}&width=360`)
                        }
                    }
                // console.log(imagesJoint[i].imageURL.length)
                copyArrImgListAll[i] = { ...copyArrImgListAll[i], joint : imagesJoint[i].imageURL.length};
                setImgListAll(copyArrImgListAll)
                } else {
                    console.log("실패")
                }
            }).catch((err) => {
                console.log(err);
            });
            
        }

        console.log(ImgListAll)
        console.log(imagesJoint)

                }

        }).catch((err) => {
            console.log(err);
        });


        setJointCopyTask(JointCopy)
        setspanMoveTask(SpanMove)
    }, [])

    const onClickAll = () => {
        setAll(true);
    }

    const onClickJtag = () => {
        setAll(false);
    }

    let copyArrJointEdit = [...ChangeJointList];

    const onClickimage = (e:any) => {     
        console.log(ImgListJoint,"ImgListJoint")
        
        const indexFront = e.target.src.indexOf("C") 
        const indexBack= e.target.src.indexOf(".png")   
        const ImageUrlCutWidth = e.target.src.substring(indexFront+4, indexBack+4)

        if(ImgListJoint[e.target.id].imageURL.includes(e.target.src) === false){
            ImgListJoint[e.target.id].imageURL.push(e.target.src)


            if(e.target.src.includes("_J") === false){
                console.log("ADD")
                copyArrJointEdit[e.target.id].add.push(ImageUrlCutWidth);
            }else{
                console.log("OUTREMOVE")
                for(let i = 0; i < copyArrJointEdit[e.target.id].remove.length; i++) {
                    console.log(copyArrJointEdit[e.target.id].remove.length)
                    if(copyArrJointEdit[e.target.id].remove[i] === e.target.src)  {
                        copyArrJointEdit[e.target.id].remove.splice(i, 1);
                    }
                }
            }
        }else{
            for(let i = 0; i < ImgListJoint[e.target.id].imageURL.length; i++) {
                if(ImgListJoint[e.target.id].imageURL[i] === e.target.src)  {
                    ImgListJoint[e.target.id].imageURL.splice(i, 1);
                }
            }
            if(e.target.src.includes("_J") === false){
                console.log("OUTADD")
                for(let i = 0; i < copyArrJointEdit[e.target.id].add.length; i++) {
                    console.log(copyArrJointEdit[e.target.id].add.length)
                    if(copyArrJointEdit[e.target.id].add[i] === e.target.src)  {
                        copyArrJointEdit[e.target.id].add.splice(i, 1);
                    }
                }
            }else{
                console.log("REMOVE")
                copyArrJointEdit[e.target.id].remove.push(ImageUrlCutWidth);
            }
        }

        ImgListAll.map((_,i) => {
            ImgListJoint[i].imageURL.map((nowUrl:String)=>{
                // console.log(nowUrl)
                UpdateArr.push(nowUrl)
            })
        })
        
        setNowImage(UpdateArr)
        setChangeJointList(copyArrJointEdit);

        console.log(ChangeJointList);
    }

    /////////////////30초마다 status알려주는 alert//////////////////////////////////////////
    let job_id = 0;
    let resultstatus :any;
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
                        alert("J-tag Confirm 작업이 끝났습니다.")
                        // setTask([])
                        clearInterval(resultstatus)
                        window.location.href='../Panorama/Setting'
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

    const onClickJtagEdit = () => {
        // console.log(JointCopyTask)
        // console.log(ChangeJointList)
        // console.log(spanMoveTask)
        // alert("J-tag 편집이 완료되었습니다.")
        // Joint 편집 실행
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
                task_name: "joint_edit",
                interactive: false,
                tasks: ChangeJointList
            }
        }).then((res)=>{
            if (res.data.check === true) {
                console.log(" 성공")
                alert("J-tag 편집")

                //Joint 복사 (stage1_2 -> stage2)
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
                        task_name: "joint_copy",
                        interactive: false,
                        tasks: JointCopyTask
                    }
                }).then((res)=>{
                    if (res.data.check === true) {
                        console.log(" 성공")

                        //SpanMove 실행
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
                                task_name: "span_move",
                                interactive: false,
                                tasks: spanMoveTask
                            }
                        }).then((res)=>{
                            if (res.data.check === true) {
                                console.log(" 성공")
                                
                                job_id = res.data.data.job_id
                                /////30초마다 alert로 알려줌////////////
                                resultstatus = setInterval(confirm, 30000)
                                alert("J-tag 편집이 완료되었습니다.")
                                window.history.go(0);
                            } else {
                                console.log(" 실패")
                            }
                        }).catch((err) => {
                            console.log(err);
                        });

                    } else {
                        console.log(" 실패")
                    }
                }).catch((err) => {
                    console.log(err);
                });

            } else {
                console.log(" 실패")
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <>
            <div className={styles.DivArea}>

            <div>
                <p className={styles.subOrder}>{t.ppPreprocessor} &gt; {t.ppJTagConfirm}</p>
                <p className={styles.mainOrder}>{t.ppJTagConfirm}</p>

                <Button onClick={onClickAll} style={{position:"absolute", right:"150px", width:"100px"}}>{t.ppAll}</Button>
                <Button onClick={onClickJtag} style={{position:"absolute", right:"30px", width:"100px"}}>{t.ppJTag}</Button>
            </div>      

            <div className={styles.CamList}>
                <Table dataSource={result === true ? ImgListAll : imagesAll}>
                        <Column title={t.cnNumber} dataIndex="num" key="num" />
                        <Column title={t.cnName} dataIndex="folderName" key="num" />
                        <Column title={t.ppJCount} dataIndex="joint" key="num" />
                        {/* <Column title={t.cnStatus}  key="no" /> */}
                </Table>
                <Button onClick={onClickJtagEdit}>{t.PPJTagEdit}</Button>
            </div>

            <div className={styles.ImageTaskDiv}>
                    { 
                        result === true ? 
                        ImgListAll.map((_,i)=>(
                                <div className={styles.ImageScrollDiv} key={i}>
                                    <ul className={styles.ImageScrollDivUl}>
                                    <div className={styles.ImageDiv}>
                                        <div>{i+1}. {ImgListAll[i].folderName}</div>
                                        {/* <div className={styles.ImageCheckDiv}>
                                            <Checkbox>{t.LRReverse}</Checkbox>
                                            <Checkbox>{t.UDReverse}</Checkbox>
                                        </div> */}
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
            </div>  


            </div>
        </>
    )
}