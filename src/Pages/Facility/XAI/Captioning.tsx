import { useEffect, useState } from 'react';
import styles from '../../../Styles/XAI.module.css'
import { langState } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import { useRecoilState } from 'recoil';
import { Button, Select, Slider, Table, Input } from 'antd';
import styled from "styled-components";
import { API_URL, IMAGE_URL } from '../../../Store/Global';
import axios from 'axios';
import { Experimental_CssVarsProvider } from '@mui/material';

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

interface Copy {
    input_folder : string;
    output_folder: string;
    choice_model: string;
    cls_model: string;
    choice_dic: string;
    fsize: number;
}

const { Option } = Select;
export default function Captioning() {
    let Newarr:any[] = [];
    
    const images : Image [] = [];
    const cnt : CNT [] = [];
    const folder_copy: Copy[] = [];
    
    const project_Type = localStorage.getItem("project_Type")
    const setting :any = localStorage.getItem("settings")
    const count = JSON.parse(setting).cameraCount
    let job_id = 0;

    for(let i = 0; i < count; i++){
        images.push({ 
            num:i, 
            folderName:"C" + String(i+1).padStart(2,"0"), 
            imageURL: [],
            cnt:0,
            })
            
        cnt.push({
            camera_number :  i-1, 
            cnt : 0})
    }
    const [model, setModel]=useState('')
    const [Fsize, setFsize] =useState(100)
    const [word, setWord] = useState('')
    const [cls, setCls] = useState("")
    
    
    

    const [ImgList, setImgList] = useState<any[]>(images);


    const [finalCNT, setFinalCNT] = useState<any[]>(cnt);

    let token : string | null = localStorage.getItem("token") 
    let project_id : string | null = localStorage.getItem("project_id")

    
    const [result, setResult] = useState<boolean>(false)

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    const { Column } = Table;
    let [fileArr,setFileArr] = useState<any>([])

    const [arr, setArr] = useState<any>([])
    let [URLarr, setURLarr] = useState<any>([])

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
        
        ImgList[i].imageURL.map((imageURL: any) => {
            let index1 = ""
            if (project_Type === "Tunnel") {
                index1 = imageURL.indexOf(".png")
            } else if(project_Type==="Airport") {
                index1=imageURL.indexOf(".JPG")
            }
            const index_c=imageURL.indexOf('C')
            const ImageUrlCutWidth = imageURL.substring(index_c+4, index1+4)
            // console.log(ImageUrlCutWidth)
            result.push(<img src={imageURL} id={String(i)} alt={imageURL} key={imageURL} className={URLarr.includes(ImageUrlCutWidth) ? styles.JtagImageBorder : styles.JtagImage} onClick={onClickImage} />)
        })
        
        if(result.length < 1){
            setResult(false);
            // console.log(result);
        }
        
        return result;
    }
    
    //프로젝트 정보 가져오기
    //type
    const [type, setType]=useState("")

    useEffect(() => {
        console.log(count)
        
        axios({
             method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers: { "accept": `application/json`, "access-token": `${token}` },
        }).then((res) => {
            if (res.data.check === true) {
                const settings: any = JSON.parse(res.data.data.settings)
                // console.log(res.data.data.projectType)
                setType(res.data.data.projectType)
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

    let copyArrImgList = [...ImgList];
    let copyArrCNT = [...finalCNT];
    let copyArr = [...URLarr];
    let copyfilename = [...arr]
    let filename = [...fileArr]

    const onClickImage = (e: any) => {
        // console.log(e.target)
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
            console.log(name)
            console.log(copyArr)
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

    let captioning: any;
    const onClick = () => {
        folder_copy.push({
            input_folder: "stageXAI/original/captioning",
            output_folder: "stageXAI/Captioning",
            choice_model: model, 
            cls_model : "model/"+cls,
            choice_dic: "caption_data/"+word,
            fsize: Fsize,
        })
     
        console.log(folder_copy)
        alert("Captioning 진행중입니다. 기다려주세요.")
            setTimeout(function() {
                alert("Captioning이 생성되었습니다.")
              }, 1000);
        // arr.map((ob: any, i: number) => {
        //     // console.log(ob.cam, ob.filename)
        //      axios({
        //         method: "post",
        //         url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
        //         headers: {
        //           "accept": `application/json`,
        //           "access-token": `${token}`,
        //           "Content-Type": `application/json`
        //         },
        //         data: {
        //             project_id: project_id,
        //             task_name: "copy_folder",
        //             interactive: false,
        //             tasks: [{
        //                 input_folder: "stage1/"+ob.cam,
        //                 file_names: ob.filename,
        //                 output_folder:"stageXAI/original/captioning/"
        //                 }]
        //             }
        //     }).then((res) => {
        //         if (res.data.check === true) {
        //             console.log("복제 성공")
        //             axios({
        //                 method: "post",
        //                 url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
        //                 headers: {
        //                   "accept": `application/json`,
        //                   "access-token": `${token}`,
        //                   "Content-Type": `application/json`
        //                 },
        //                 data: {
        //                     project_id: project_id,
        //                     task_name: "xai_captioning",
        //                     interactive: false,
        //                     tasks: folder_copy
        //                 }
        //             }).then((res2)=>{
        //                 console.log("captioning성공")
        //                 job_id=res2.data.data.job_id
        //                 captioning = setInterval(confirm, 30000)
        //                 console.log(res2)
        //             }).catch((err) => {
        //                 console.log(err);
        //             });
        //         }
                
        //     }).catch((err) => {
        //         console.log(err)
        //     })
        // })


        
    }

    const onChange1 = (select: any) => {
        if (project_Type === 'Tunnel') {
            if (select === 'model1') {
                setModel('BEST_checkpoint_tunnel_5_cap_per_img_5_min_word_freq.pth.tar')
                setWord('WORDMAP_tunnel_5_cap_per_img_5_min_word_freq.json')
                setCls('Tunnel_model.pt')
            } else if(select === 'model2') {
                setModel('BEST_checkpoint_golf_5_cap_per_img_5_min_word_freq.pth.tar')
                setWord('WORDMAP_golf_5_cap_per_img_5_min_word_freq.json')
                setCls('myresnet.pt')
            }
            
        } else if (project_Type === 'Airport') {
            if (select === 'model1') {
                setModel('BEST_checkpoint_air_5_cap_per_img_5_min_word_freq.pth.tar')
                setWord('WORDMAP_air_5_cap_per_img_5_min_word_freq.json')
                setCls('Airport_model.pt')
            } else if(select === 'model2') {
                setModel('BEST_checkpoint_fod_5_cap_per_img_5_min_word_freq.pth.tar')
                setWord('WORDMAP_fod_5_cap_per_img_5_min_word_freq.json')
                setCls('Fod_model.pt')
            }
        }
        
       
    }

    

    const modelSelect :any[] =[]
    const selectModel = () => {
        if (project_Type === 'Tunnel') {
            modelSelect.push(
                <Select  placeholder="선택해주세요" className={styles.selectDiv} onChange={onChange1}>
                    <Option value='model1' > Tunnel1</Option>   {/*birdge */}    
                    <Option value='model2' > Tunnel2</Option>    {/*GolfModel*/}
                </Select> 

            )
        } else if (project_Type === 'Airport') {
            modelSelect.push(
                <Select placeholder="선택해주세요" className={styles.selectDiv} onChange={onChange1}>
                    <Option value='model1' > Airport</Option>   {/*birdge */}    
                    <Option value='model2' > FOD</Option>    {/*GolfModel*/}
                </Select>
            )
        }
        return modelSelect;
    }
  
    const confirm = () => {
        // console.log(job_id)
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
                    console.log("성공",res.data.data.status)
                    if (res.data.data.status === "done") {
                        alert("Captioning이 끝났습니다.")
                        clearInterval(captioning)
                        window.location.href='../XAI/Result_Captioning'
                    } else if(res.data.data.status === "error"){
                        alert("해당 파일이 없습니다.")
                    }
                 } else {
                    console.log("실패")
                 }
            })
        
    }
    const handleChange = (e: any) => {
        setFsize(e.target.value)
    }

   
  return (
      <>
            <div className={styles.DivArea}>

            <div>
                <p className={styles.subOrder}>{t.xaiDashboard} &gt; {t.captioning}</p>
                <p className={styles.mainOrder}>{t.captioning}</p>
            
            </div>  
              <div className={styles.CamList}>
                  Model : &nbsp;
                  {selectModel()}
                <Table dataSource={ImgList}>
                        <Column title={t.cnNumber} dataIndex="num" key="num" />
                        <Column title={t.cnName} dataIndex="folderName" key="num" />
                        <Column title={t.cnt} dataIndex="cnt" key="num" />
                        {/* <Column title={t.cnStatus}  key="no" /> */}
                  </Table>
                  
                  Font Size : <Input type="number" name="fsize" defaultValue={100} className={styles.fsize} onChange={handleChange} />
                  {/* onChange={handleChange} */}
                <Button onClick={onClick}>{t.btnComfirm}</Button>
            </div>      
            
            <div className={styles.ImageTaskDiv}>
                    { 
                        result === true ? 
                            images.map((_,i)=>(
                                <div className={styles.ImageScrollDiv} key={i}>
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
