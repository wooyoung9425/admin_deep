import React from 'react'
import styles from '../../../Styles/XAI.module.css'
import { langState } from '../../../Store/State/atom'
import { useRecoilState } from 'recoil';
import { API_URL, IMAGE_URL } from '../../../Store/Global';
import { ko, en } from '../../../translations';
import { Table , Button, Select} from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';


interface Image {
    key: number,
    name: string,
    url: string,
    couple:string|any,
}
const { Option } = Select;
export default function Result_Captioning() {
    let token : string | null = localStorage.getItem("token") 
    let project_id: string | null = localStorage.getItem("project_id")
    const project_Type = localStorage.getItem("project_Type")
    const setting: any = localStorage.getItem("settings")
    const typeArr: any = JSON.parse(setting).bridge_type
    let job_id = 0;
    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;
    const { Column } = Table;
    const oriImgUrl : Image[] = [];
    const [oriImgList, setOriImgList] = useState<any[]>(oriImgUrl);
    const [oriSelet, setOriSelect] = useState(0)
    const [oriList, setOriList] = useState<boolean>(false)
    const [resList,setResList]  = useState<boolean>(false)
    
    const resImgUrl : Image[] = [];
    const [resImgList, setResImgList] = useState<any[]>(resImgUrl);
    const [last, setLast] = useState(0)
    const [BridgeType, setBridgeType] = useState<string>()
    //text
    const [textArr,setTextArr]=useState("")
    const text: any = [];

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
        // 결과(captioning)이미지 가져오기
        
        (async () => {
            const img_path = project_Type!=='Bridge'? `/project/${project_id}/stageXAI/Captioning`:`/project/${project_id}/stageXAI/Captioning/${BridgeType}`
            console.log(project_Type,img_path)
            await axios({
                method: 'get',
                url: API_URL+'/File/Files',
                headers: { "accept": `application/json`, "access-token": `${token}` },
                params : {path : img_path}
            }).then(async (res) => {
                if (res.data.check === true) {
                    console.log("captioning 불러오기 성공")
                    let files = res.data.data.files
                    console.log(res.data.data.files)
                    let j =1
                    for (let i = 0; i < files.length; i++) {
                        if (files[i].substr(-3, 3) === 'txt') {
                            
                        } else {
                            console.log(files[i])
                            resImgUrl.push({
                                key: j,
                                name: files[i],
                                // url: imageURL+`${files[i]}&width=360`,
                                url: `${IMAGE_URL}/image?path=`+img_path+`/${files[i]}&width=360`,
                                couple:<a>Couple</a>
                            })
                            j = j + 1;
                        }
                        
                    }

                setResImgList(resImgUrl)
                setResList(true)
                } else {
                    console.log("captioning 불러오기 실패", res)
                }
                }).catch((err)=>{console.log(err)})
        })();
        //원본 original 이미지 가져오기
        const img_path =project_Type!=='Bridge'?`/project/${project_id}/stageXAI/original/captioning`:`/project/${project_id}/stageXAI/original/captioning/${BridgeType}`
        axios({
            method: 'get',
            url: API_URL+'/File/Files',
            headers: { "accept": `application/json`, "access-token": `${token}` },
            params : {path : img_path}
        }).then((res) => {
          
            if (res.data.check === true) {
                console.log("file 불러오기 성공")
                let files = res.data.data.files
                setLast(files.length - 1) 
                
                for (let i = 0; i < files.length; i++) {
                    oriImgUrl.push({
                        key: i + 1,
                        name: res.data.data.files[i],
                        url: `${IMAGE_URL}/image?path=`+img_path+`/${files[i]}&width=360`,
                        couple:"download"
                    })
                }

                setOriImgList(oriImgUrl)
                setOriList(true)
                
              } else {
                console.log("file 불러오기 실패")
                setResList(false)
              }
            // console.log(oriImgUrl)
        })

        // 결과(heatmap)이미지 가져오기
        
      
    }, [BridgeType])
    

    const nextClick = () => {
        console.log(resImgList)
        let n = oriSelet
        console.log(n, last)
        if (n === last) {
            // console.log("마지막 번호입니다.")
            setOriSelect(0)
        } else {
            setOriSelect(n+1)
        }
        
  }
   let result: any;
    // const confirm = (record : any) => {
    async function confirm (record : any) {
        console.log(job_id)
        
        axios({
            method: 'post',
            url: API_URL + '/scheduler/job/query',
            headers: { "accept": `application/json`, "access-token": `${token}`, "Content-Type" : `application/json` },
                data: {
                    "job_id": job_id ,
                    "company_id": companyid
                }
        }).then(async (res) => {
            console.log(res)
            if (res.data.check == true) {
                console.log("성공",res.data.data.status)
                if (res.data.data.status === "done") {
                    console.log(record)
                    const link = document.createElement('a');
                    let src = record.url.substring(0, 60) + `/Captioning/couple/${oriImgList[record.key - 1].name}`;
                    const imageBlob = await (await fetch(src)).blob();
                    src = URL.createObjectURL(imageBlob);
                    link.href = src;
                    link.download = oriImgList[record.key - 1].name.slice(0, -4)
                    link.click();
                    
                    clearInterval(result)
                    }  else if(res.data.data.status === "error"){
                        alert("해당 파일이 없습니다.")
                    }
                 } else {
                    console.log("실패")
                 }
            })
        
    }
  
    async function download() {
        const original_path =project_Type==='Bridge'? `stageXAI/original/captioning/${BridgeType}/`:'stageXAI/original/captioning/'
        const result_path =  project_Type==='Bridge'? `stageXAI/Captioning/${BridgeType}/`:'stageXAI/Captioning/'
        
        const link = document.createElement('a');
        let src = `${IMAGE_URL}/image?path=/project/${project_id}/`+original_path+`${oriImgList[oriSelet].name}`;
        const imageBlob =  (await fetch(src)).blob();
        src = URL.createObjectURL(await imageBlob);
        link.href = src;
        link.download = oriImgList[oriSelet].name.slice(0,-4)
        link.click();

        const link2 = document.createElement('a');
        let src2 = `${IMAGE_URL}/image?path=/project/${project_id}/`+result_path+`${resImgList[oriSelet].name}`;
        const imageBlob2 =  (await fetch(src2)).blob();
        src2 = URL.createObjectURL(await imageBlob2);
        link2.href = src2;
        link2.download = resImgList[oriSelet].name.slice(0,-4)
        link2.click();
      
    }

    const option_render=()=>{
        const arr: any[] = [];
        typeArr.map((type:any)=>{
                let name=''
            if (type === 'Girder') {
                name = '거더 하면'
            } else if (type === 'GirderSide') {
                name = '거더 측면'
            } else if (type === 'Slab') {
                name='슬라브 하면'
            }else if (type === 'SlabSide') {
                name='슬라브 측면'
            } else if (type === 'Pier') {
                name ='교각'
            } else if (type === 'Abutment') {
                name = '교대'
            }
            arr.push(<Option value={type}> {name}</Option>)
        })
        return arr;
    }
    const onChangeBridgeType = (e:any) => {
        setBridgeType(e)
    }
  return (
    <>
        <div className={styles.DivArea}>
            <div>
                <p className={styles.subOrder}>{t.xai} &gt; {t.captioning +' '+ t.result} </p>
                <p className={styles.mainOrder}>{t.captioning +' '+ t.result+ '  :  '}{ resList===true? resImgList[oriSelet].name:""}</p>
            </div>  
              
                  <div>
                  <div className={styles.xai_table}>
                      {project_Type === 'Bridge' ?
                          <div> 교량 구역 :
                              <Select placeholder="선택해주세요" className={styles.selectDiv} onChange={onChangeBridgeType}>
                                  {option_render()}
                              </Select></div> : <div></div>}
                      <Table dataSource={resList===true? resImgList : []}>
                          <Column title={t.cnNumber} dataIndex="key" key="num" />
                          <Column title={t.cnName} dataIndex="name" key="name" onCell={(record: any) => {
                              return {
                                  onClick: event => {
                                    setOriSelect(record.key-1)
                                     
                                  }
                              }
                          }} />
                          <Column title="Couple" dataIndex="couple" key="couple" onCell={(record: any) => {
                              return {
                                  onClick: async () => {
                                    //   const original_path = project_Type==='Bridge'? `stageXAI/original/captioning/${BridgeType}/`:'stageXAI/original/captioning/'
                                      console.log(record.key)
                                      const result_path = project_Type === 'Bridge' ? `stageXAI/Captioning/${BridgeType}/` : 'stageXAI/Captioning/'
                                      const link2 = document.createElement('a');
                                        let src2 = `${IMAGE_URL}/image?path=/project/${project_id}/`+result_path+`${resImgList[record.key-1].name}`;
                                        const imageBlob2 =  (await fetch(src2)).blob();
                                        src2 = URL.createObjectURL(await imageBlob2);
                                        link2.href = src2;
                                        link2.download = resImgList[record.key-1].name.slice(0,-4)
                                        link2.click();
                                    //   axios({
                                    //     method: 'post',
                                    //     url: API_URL+'/Job/Start',
                                    //     headers: { "accept": `application/json`, "access-token": `${token}` },  
                                    //     data: {
                                    //         project_id: project_id,
                                    //         task_name: "image_join",
                                    //         interactive: false,
                                    //         tasks: [{
                                    //             image1_path: original_path + oriImgList[record.key-1].name,
                                    //             image2_path: result_path+ resImgList[record.key-1].name,
                                    //             align: 1, //수평 //수직으로 하려면 0
                                    //             output_folder: 'stageXAI/Captioning/couple',
                                    //             output_name: oriImgList[record.key - 1].name
                                    //         }]
                                    //         }
                                    //   }).then((res) => {
                                    //       console.log(res)
                                    //       if (res.data.check === true) {
                                    //           alert("captioning couple image 진행중 기다려주세요.")
                                    //         job_id = res.data.data.job_id
                                    //         result = setInterval(()=>confirm(record), 30000)
                                    //       } else {
                                    //           console.log("실패")
                                    //       }
                                          
                                    //   })
                                  }
                              }
                          }} />
                </Table>
                <Button className={styles.nextBtn} onClick={download} >
                  {t.download}
                </Button>
                <Button className={styles.nextBtn} onClick={nextClick}>
                  {t.next}
                </Button>      
            </div>
            <div className={styles.resultImg}>
                { resList===true? 
                    <img src={resImgList[oriSelet].url} />
                    : "XAI 실행한 이미지가 없습니다."      
                }
            </div> 
            </div>
        </div>
    </>
  )
}