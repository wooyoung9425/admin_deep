import { useEffect, useState } from 'react';
import styles from '../../../Styles/XAI.module.css'
import { langState, projectType } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import { useRecoilState } from 'recoil';
import { Button, Select, Slider, Table } from 'antd';
import styled from "styled-components";
import { API_URL, IMAGE_URL } from '../../../Store/Global';
import axios from 'axios';

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
    choice_weight: string;
}


const { Option } = Select;
export default function Heatmap() {
    let Newarr:any[] = [];
    
    const images : Image [] = [];
    const cnt : CNT [] = [];
    const folder_copy: Copy[] = [];
    
    const project_Type=localStorage.getItem("project_Type")
    const setting: any = localStorage.getItem("settings")
    const typeArr: any = JSON.parse(setting).dam_type

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

    
  const [DamType, setDamType] = useState<string>("");
  const [dam_type_name, setDamTypeName]=useState<string>("")

    for(let i = 0; i < typeArr.length; i++){
        images.push({ 
            num:i+1, 
            folderName:typeArr[i], 
            imageURL: [],
            cnt:0,
            })
            
        cnt.push({
            camera_number :  i,  
            cnt : 0})
    }
    const [weight, setWeight]=useState('model_bridge.pt')

    folder_copy.push({
        input_folder: "stageXAI/original/heatmap",
        output_folder: "stageXAI/Heatmap",
        choice_weight : "model/"+weight
    },
    )

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

    
    const rendering = (i:number) => {
        const result: any[] = [];     
        ImgList[i].imageURL.map((imageURL: any) => {
            let index1 = ""
            if (project_Type === 'Dam') {
                index1=imageURL.indexOf(".jpg")
            }
            const index_c = imageURL.indexOf(typeArr[i])
            const len = typeArr[i].length
            const ImageUrlCutWidth = imageURL.substring(index_c+len+1, index1+4)
            result.push(<img src={imageURL} id={String(i)} alt={imageURL} key={imageURL} className={URLarr.includes(ImageUrlCutWidth) ? styles.JtagImageBorder : styles.JtagImage} onClick={onClickImage} />)
        })
        
        if(result.length < 1){
            setResult(false);
        }
        
        return result;
    }
    
    //프로젝트 정보 가져오기
    useEffect(() => {
        axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers: { "accept": `application/json`, "access-token": `${token}` },
        }).then((res) => {
            if (res.data.check === true) {
                const settings: any = JSON.parse(res.data.data.settings)
            } else {
                console.log("실패")
            }
        })

        for (let i = 0; i < typeArr.length; i++){
            Newarr[i] = { folder: typeArr[i], filename: [] };
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
                    setResult(true);
                    console.log(res)

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
        const id = e.target.id
        if (DamType !== typeArr[id]) { alert("모델과 동일한 사진을 클릭해주세요"); }
        else {
            const len = typeArr[id].length
            filename = [...copyfilename[id].filename]
            const str = e.target.src
            let index1 = ""
            if (project_Type === "Dam") {
                index1 = str.indexOf(".jpg")
            }
            const index2 = str.indexOf(typeArr[id])
            if (Number(id) === cnt[e.target.id].camera_number) {
                let name = str.substring(index2 + len + 1, index1 + 4)
                console.log(name)
                console.log(copyArr)
                if (copyArr.includes(name) === false) {
                    console.log("여기1")
                    //border
                    copyArr.push(name)
                    //선택 개수 계산
                    copyArrCNT[id] = { ...copyArrCNT[id], cnt: copyArrCNT[id].cnt + 1 }
                    copyArrImgList[id] = { ...copyArrImgList[id], cnt: copyArrCNT[id].cnt, }
                    //filename
                    filename.push(name)
                    setFileArr(filename)
                    
                } else {//선택이미지 중복일때
                    console.log("여기2")
                    //  border없앰
                    const i = copyArr.indexOf(name)
                    copyArr.splice(i, 1)
                    // 선택 개수 계산
                    copyArrCNT[id] = { ...copyArrCNT[id], cnt: copyArrCNT[id].cnt - 1 }
                    copyArrImgList[id] = { ...copyArrImgList[id], cnt: copyArrCNT[id].cnt, }
                    //filename 
                    const j = filename.indexOf(name)
                    filename.splice(j, 1)
                }
            }
            setFinalCNT(copyArrCNT)
            setImgList(copyArrImgList)
            setURLarr(copyArr)
            
            copyfilename[id] = { ...copyfilename[id], filename: filename }
            setArr(copyfilename)
        }    
    }

    let [model,setModel] =useState("")
    let job_id = 0;
    let heatmap :any;
    const onClick = () => {
        if (model === "") {
            alert("모델을 선택해주세요.")
        } else {
            console.log(weight)
            folder_copy[0] = { ...folder_copy[0], choice_weight: 'model/' + weight  }
            console.log(ImgList)
            
            console.log(filename)
            console.log(folder_copy)
            arr.map((ob: any, i: number) => {
                console.log(ob)
                if (ImgList[i].cnt !== 0) {
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
                            tasks: [{
                                input_folder: `stage1/` + ob.folder,
                                file_names: ob.filename,
                                output_folder: "stageXAI/original/heatmap/"
                            }]
                        }
                    }).then((res) => {
                        if (res.data.check === true) {
                            alert("heatmap 진행중입니다. 기다려주세요.")
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
                                    task_name: "xai_heatmap",
                                    interactive: false,
                                    tasks: folder_copy
                                }
                            }).then((res2) => {
                                console.log(res2)
                                job_id = res2.data.data.job_id
                                heatmap = setInterval(confirm, 30000)
                            }).catch((err) => {
                                console.log(err);
                            });
                        }
                        
                    }).catch((err) => {
                        console.log(err)
                    })
                }
            })
        }
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
                        alert("Heatmap이 끝났습니다.")
                        clearInterval(heatmap)
                        window.location.href='../XAI/Result_heatmap'
                    } else if(res.data.data.status === "error"){
                        alert("해당 파일이 없습니다.")
                    }
                 } else {
                    console.log("실패")
                 }
            })
        
    }

    const onChange1 = (select: any) => {
        if (project_Type === 'Tunnel') {
            setModel(select)
            if (select === 'tunnel1') {
                setWeight('Tunnel_model.pt')
            } else if (select === 'tunnel2') {
                setWeight('myresnet.pt')
            }
        } else if (project_Type === 'Airport') {
            if (select === 'Airport1') {
                setWeight('Fod_model.pt')
                setModel("Fod")

            } else if (select === 'Airport2') {
                setWeight('Airport_model.pt')
                setModel("AirLine")
            } 
        } else if (select === 'Dam') {
            console.log(select)
            if (select === 'dam1') {
                setWeight('Dam_model.pt')
            }
        }
       
    }


    const  modelSelect :any[]= [];
    const selectModel = () => {
        if (project_Type === 'Tunnel') {
            modelSelect.push(
                <Select placeholder="선택해주세요" className={styles.selectDiv} onChange={onChange1}>
                    <Option value='tunnel1' > Tunnel 1</Option>   {/*model_bridge.pt */}    
                    <Option value='tunnel2' > Tunnel 2</Option>    {/*GolfModel.pt */}
                    <Option value='tunnel3'> Tunnel 3</Option>    {/*BridgeModel.pt */}    
                </Select>
            )
            
        } else if (project_Type === 'Airport') {
             modelSelect.push(
                <Select placeholder="선택해주세요" className={styles.selectDiv} onChange={onChange1}>
                    <Option value='Airport1' > FOD</Option>   {/*model_bridge.pt */}    
                    <Option value='Airport2' > 활주로</Option>    {/*GolfModel.pt */}
                </Select>
            ) 
        } else if (project_Type === 'Dam') {
            modelSelect.push(
                <Select placeholder="선택해주세요" className={styles.selectDiv} onChange={onChangeDamType}>
                    {option_render()}    
                </Select>
            ) 
        }
        return modelSelect;
    }
     const option_render=()=>{
        const arr:any[]=[];
        typeArr.map((type:any)=>{
            let name=''
            if(type==='Overflow'){
                name='월류부'
            }else if(type==='DamFloor'){
                name='댐마루'
            }else if (type === 'UpStream') {
                name='상류면'
            } else if (type === 'DownStream') {
                name ='비월류부'
            }
            arr.push(<Option value={type}> {name}</Option>)
        })
        return arr;
    }
     const onChangeDamType = (e:any) => {
        console.log(e)
        const copy = [...ImgList]
        if(e === "Overflow"){
            setDamType("Overflow")
            setDamTypeName("월류부")
            setWeight('Dam_model.pt')
        }else if(e === "DamFloor"){
            setDamType("DamFloor")
            setDamTypeName("댐마루")
            setWeight('Dam_model.pt')
        }else if(e === "DownStream"){
            setDamType("DownStream")
            setDamTypeName("비월류부")
            setWeight('Dam_model.pt')
        }else if(e === "UpStream"){
            setDamType("UpStream")
            setDamTypeName("상류면")
            setWeight('Dam_model.pt')
        }
         setURLarr([])
         for (let i = 0; i < typeArr.length; i++){
             copy[i] = { ...copy[i], cnt: 0 }
         }
         setImgList(copy)
         setModel("Dam")
    }
  return (
      <>
            <div className={styles.DivArea}>

            <div>
                <p className={styles.subOrder}>{t.xaiDashboard} &gt; {t.heatmap}</p>
                <p className={styles.mainOrder}>{t.heatmap}</p>
            
            </div>  
              <div className={styles.CamList}>
                   Model :  {selectModel()}
                
                <Table dataSource={ImgList}>
                        <Column title={t.cnNumber} dataIndex="num" key="num" />
                        <Column title={t.cnName} dataIndex="folderName" key="num" />
                        <Column title={t.cnt} dataIndex="cnt" key="num" />
                        {/* <Column title={t.cnStatus}  key="no" /> */}
                </Table>
                <Button onClick={onClick}>{t.btnComfirm}</Button>
            </div>      
            <div className={styles.toolSelect}>
                  {/* <Select defaultValue="Crack" style={{ width: 120 }} onChange={onChange2}>
                      {selectRendering()}
                </Select> */}
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
