import React, { useState, useEffect, useCallback, ChangeEvent, useRef } from 'react';
import styles from '../../../Styles/Preprocess.module.css';
import { Table, Progress, Tooltip,Select } from 'antd';
import axios from "axios";
import { API_URL} from '../../../Store/Global';

interface IFileTypes {
    key: number; // 파일들의 고유값 id
    object: File;
    name: string;
    status: any;
    url: any;
}

interface Image_folder {
    typeFolderName : string;
    SpanFolderName: string;
    SubSpanFolderName: string;
}
const { Option } = Select;

export default function ImageUploadBuilding() {
    let token: string | null = localStorage.getItem("token") 
    let project_id: string | null = localStorage.getItem("project_id")
    const project_Type = localStorage.getItem("project_Type")
    let job_id=0
    const { Column } = Table;
    // const firstImgFiles :IFileTypes[]= [];
    const [imgFiles, setImgFiles] = useState<IFileTypes[]>([]);
    const dragRef = useRef<HTMLLabelElement | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [imageName, setImageName] = useState<boolean>(false)
    const [typeArr, setType]=useState<string[]>([])
    const [selectType, SetSelectType] = useState('')
    const [optionCount, setOptionCount] = useState([])
    const [confirmOption, setConfirmOption] = useState<boolean>(false);
    const [selectOption, setSelectOption] = useState()
    const [BridgeType, setBridgeType] = useState("")
    const [spanNumber,setSpanNumber] =useState([])
    const [pierNumber, setPierNumber] = useState([])


    const [subConfirm, setSubConfirm] = useState<boolean>(false)
    const [folderName, setFolderName]= useState<Image_folder>({typeFolderName:"",SpanFolderName:"",SubSpanFolderName:""})

    let ob : any= [];//중복제거
    const[selectNum,setSelectNum] = useState<number>(1)


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


    let settings: any;
    useEffect(() => {
        // console.log("빌딩 이미지 업로드")
        axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers : {"accept" : `application/json`, "access-token" : `${token}`}, 
        }).then((res) => {
            settings = JSON.parse(res.data.data.settings)
            let countList :any= [];
                if (res.data.check === true) {
                    if (project_Type === 'Dam') {
                        setType(settings.dam_type)
                    } else if (project_Type === 'Bridge') {
                        setType(settings.bridge_type)
                        countList.push(settings.girder_count)
                        countList.push(settings.pier_count)
                        countList.push(settings.slab_count)
                        setOptionCount(countList)
                        setSpanNumber(settings.span_number_list)
                        setPierNumber(settings.pier_number_list)
                    }    
                }
        })
    },[])
    const onChangeFiles = useCallback((e: ChangeEvent<HTMLInputElement> | any): void => {
        if (selectType === '' && project_Type === 'Dam') {
            alert('댐구역을 선택해주세요.')
        } else if (selectType===''&&project_Type==='Bridge') {
            alert('교량 구역을 선택해주세요.')
        } else {    
            let selectFiles: File[] = [];
            if (e.type === "drop") {
                selectFiles = e.dataTransfer.files;
            } else {
                selectFiles = e.target.files;
            }
            selectFiles = [...selectFiles].sort((a, b) => a.name > b.name ? 1 : -1)

            let files: any = imgFiles.length === 0? []:[...imgFiles];
            // let files: any = [];
            let i = 1 ;
            for (const file of selectFiles) {
                ob = imgFiles.filter((a: any) => a.name !== file.name) //videolist에 중복 제거
                let url = URL.createObjectURL(file);
                setImageName(false)
                if (ob.length === 0) {
                    console.log(1)
                    files.push({
                        key: i,
                        object: file,
                        name: file.name,
                        status: <Progress type="circle" percent={0} width={40} />,
                        url: url
                    })
                    setImageName(true)
                } else {
                    console.log(2)
                    console.log(imgFiles,ob)
                    const a = imgFiles.findIndex(a => (a.name === file.name))
                    if (a !== -1) {
                        files = [...ob,{
                            key: a + 1,
                            object: file,
                            name: file.name,
                            status: <Progress type="circle" percent={0} width={40} />,
                            url: url
                        }]
                    } else {
                        console.log('111111111111111111111')
                        files.push(
                        {
                            key: imgFiles.length + i,
                            object: file,
                            name: file.name,
                            status: <Progress type="circle" percent={0} width={40} />,
                            url: url
                        }
                    )
                    }
                    
                    setImageName(true)
                }
                
                i += 1;
                // 오름차순
                files.sort((obj1: { name: String; }, obj2: { name: String; }) => {
                    if (obj1.name > obj2.name) {
                        return 1;
                    }
                    if (obj1.name < obj2.name) {
                        return -1;
                    }
                    return 0;
                })

                setImgFiles(files)
                console.log(selectType,folderName)
                const aaa = '_'+folderName.typeFolderName+'_'+folderName.SpanFolderName+'_'+folderName.SubSpanFolderName
                console.log(aaa)
                const upload_res = axios({
                    method: 'post',
                    // url: API_URL + `/File/Upload/${project_id}/stage0${aaa}/${file.name}`,
                    url: API_URL + `/file/upload/${project_id}?path=stage0${aaa}&filename=${file.name}`,
                    headers: { 
                    "accept": `application/json`,
                    "access-token": `${token}`,
                    "Content-Type": `multipart/form-data`  },
                    data: { upload: file },
                    onUploadProgress: (progressEvent: { loaded: any; total: any }) => {
                        //  console.log(timeSet, videoList)
                    
                        let copyarr = [...files]
                        // console.log(copyarr)
                        let a = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        const ind = copyarr.findIndex(element => element.name === file.name)
                    
                        if (ind !== -1) {
                            // console.log(ind, ' : ', a)  
                            copyarr[ind] = { ...copyarr[ind], status: <Progress type="circle" percent={a} width={40} /> }
                            files = copyarr;
                        }
                        setImgFiles(copyarr)
                    },
                
                }).then((res) => {
                    // console.log(file)
                }).catch((err) => {
                    console.log(err)
                })
            }
        }
    }, [imgFiles, selectType,folderName]);


    const handleDragIn = useCallback((e: DragEvent): void => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragOut = useCallback((e: DragEvent): void => {
        e.preventDefault();
        e.stopPropagation();

        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: DragEvent): void => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer!.files) {
        setIsDragging(true);
        }
    }, []);

    const handleDrop = useCallback(
        (e: DragEvent): void => {
        e.preventDefault();
        e.stopPropagation();

        onChangeFiles(e);
        setIsDragging(false);
        },
        [onChangeFiles]
    );

    const initDragEvents = useCallback((): void => {
        // 앞서 말했던 4개의 이벤트에 Listener를 등록합니다. (마운트 될때)
        
        if (dragRef.current !== null) {
        dragRef.current.addEventListener("dragenter", handleDragIn);
        dragRef.current.addEventListener("dragleave", handleDragOut);
        dragRef.current.addEventListener("dragover", handleDragOver);
        dragRef.current.addEventListener("drop", handleDrop);
        }
    }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

    const resetDragEvents = useCallback((): void => {
        // 앞서 말했던 4개의 이벤트에 Listener를 삭제합니다. (언마운트 될때)
        
        if (dragRef.current !== null) {
        dragRef.current.removeEventListener("dragenter", handleDragIn);
        dragRef.current.removeEventListener("dragleave", handleDragOut);
        dragRef.current.removeEventListener("dragover", handleDragOver);
        dragRef.current.removeEventListener("drop", handleDrop);
        }
    }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

    useEffect(() => {
        initDragEvents();

        return () => resetDragEvents();
    }, [initDragEvents, resetDragEvents]);
    
    
    const imageList: any = [];
        const imageRender = () => {
            // console.log(selectNum)
            if (imgFiles.length === 0) {
                imageList.push(<p className={styles.uploadImage2}>이미지를 업로드해주세요</p>)
            } else {
                // console.log(imgFiles[selectNum-1].url)
                imageList.push(<img src={imgFiles[selectNum - 1].url} className={styles.uploadImage1} />)                
            }
            return imageList
    }
    const prevImage = () => {
        
        const num = selectNum - 1
        // console.log(selectNum, num)
        if (num === 0) {
            setSelectNum(imgFiles.length)
        } else {
            setSelectNum(num)
        }
    }
    const nextImage = () => {
        const num = selectNum + 1
        if (num === imgFiles.length+1) {
            setSelectNum(1)
        } else {
            setSelectNum(num)
        }
    }
    let result: any;
    const imageFiltering = () => {
        // console.log(selectType)
        if (project_Type === 'Airport') {
            alert("90도 Rotation시작했습니다.")
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
                    task_name: "imageRotation_airport",
                    interactive: false,
                    tasks: [{
                        input_folder: "stage0",
                        output_folder: "stage0_r",
                        rotation_angle: 90
                    }]
                }
            }).then((res) => {
                if (res.data.check === true) {
                    job_id = res.data.data.job_id
                    result = setInterval(confirm, 10000)
                } else {
                    console.log("실패", res)
                }
            })
        // } else if (project_Type === 'Bridge' && typeArr.includes('Pier') === true) {
        } else if (project_Type === 'Bridge') {
            alert("270도 Rotation시작했습니다.")
            
            pierNumber.map((pier: any) => {
                let name:any = 'P'+String(pier.num).padStart(2,'0')
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
                        task_name: "imageRotation_airport",
                        interactive: false,
                        tasks: [{
                            input_folder: `stage0/Pier/${name}`,
                            output_folder: `stage0_r/Pier/${name}`,
                            rotation_angle: 270
                        }]
                    }
                }).then((res) => {
                    if (res.data.check === true) {
                        job_id = res.data.data.job_id
                        result = setInterval(confirm, 10000)
                    } else {
                        console.log("실패", res)
                    }
                })
            })
        } else {
            console.log(selectType)
            window.location.replace("./Filter")
        }
        
    }
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
            if (res.data.data.status === "done") {
                if (project_Type === 'Dam') {
                    //없음
                } else if (project_Type === 'Airport') {
                    alert("90도 rotation 종료되었습니다.")
                } else if (project_Type === 'Bridge') {
                    alert("270도 rotation 종료되었습니다.")
                }
                clearInterval(result)
                window.location.replace("./Filter")
            }
        })
        
    }

    const onChange1 = (e:any) => {
        console.log(e)
        SetSelectType('_' + e)
    }

    const onChange2 = (e: any) => {
        // setImgFiles(firstImgFiles)
        setFolderName({...folderName,typeFolderName:e})
        let optionArr: any = [];
        if (e === 'Girder' || e==='Slab') {//거더 하면 또는 슬라브 하면
            setBridgeType(e)
            setConfirmOption(true)
            spanNumber.map((span: any) => {
                let name: string = 'S' + String(span.num).padStart(3, '0')
                optionArr.push(<Option value={name} > Span {String(span.num)}</Option>)
            })
        } else if (e === 'Pier') {//교각
            setConfirmOption(false)
            setBridgeType(e)
            pierNumber.map((pier: any) => {
                let name: string = 'P' + String(pier.num).padStart(2, '0')
                optionArr.push(<Option value={name} > Pier {String(pier.num)}</Option>)
            })
            
        } else if (e === 'GirderSide') { //거더 측면
            setConfirmOption(false)
            setBridgeType(e)
            spanNumber.map((span: any) => {
                let name: string = 'S' + String(span.num).padStart(3, '0')
                optionArr.push(<Option value={name} > Span {String(span.num)}</Option>)
            })
        }
        SetSelectType('_'+e)
        setSelectOption(optionArr)
    }

    const onChange3 = (e: any, select_id: string) => {
        if (select_id === 'sub2') {
            setFolderName({...folderName, SpanFolderName:e})
        } else {
            setFolderName({...folderName, SubSpanFolderName:e})
        }
        
    }

   const option_render=()=>{
       const arr: any[] = [];
       if (project_Type === 'Dam') {
           typeArr.map((type:any)=>{
               let name=''
               if(type==='Overflow'){
                   name='월류부'
               }else if(type==='DamFloor'){
                   name='댐마루'
               }else if(type==='UpStream'){
                   name='상류면'
               }else if(type==='DownStream'){
                   name='비월류부'
               }
               arr.push(<Option value={type} > {name}</Option>)
           })
       } else if (project_Type === 'Bridge') {
            // console.log(typeArr)
           typeArr.map((type:any)=>{
               let name=''
               if (type === 'Girder') {
                   name = '거더 하면'
               } else if (type === 'GirderSide') {
                   name = '거더 측면'
               } else if (type === 'Slab') {
                   name = '슬라브 하면'
               } else if (type === 'SlabSide') {
                   name = '슬라브 측면'
               } else if (type === 'Pier') {
                   name = '교각'
               } else if(type==='Abutment') {
                   name = '교대'
               }
               arr.push(<Option value={type} > {name}</Option>)
           })
       }
    return arr;
    }
    
    const girder_render=()=>{
        const spanArr: any[] = [];
        if (BridgeType === 'Girder') {
            for (let i = 1; i < Number(optionCount[0])+1; i++){
                spanArr.push(<Option value={'G'+String(i).padStart(2,'0')}> Girder {i}</Option>)
            }
        } else if (BridgeType === 'Slab') {
            for (let i = 1; i < Number(optionCount[2] + 1); i++){
                spanArr.push(<Option value={'Slab' + String(i).padStart(2,'0')}>Slab {i}</Option>)
            }
        }
        return spanArr;
    }
    
    return (
        <div >
            <div className={styles.DragDrop}>
                <div className={styles.option}>
                    {project_Type === 'Dam' ?
                        <div>
                            <Select placeholder="선택해주세요" className={styles.selectDiv} onChange={onChange1}>
                                {option_render()}
                            </Select>
                        </div> : <div></div>}
                    
                  
                    {project_Type === 'Bridge' ?
                        <Select placeholder="선택해주세요" className={styles.BridgeAreaDiv} onChange={onChange2}>
                            {option_render()}
                        </Select> : <div></div>}
                    
                    {project_Type === 'Bridge' ?
                        <Select placeholder="선택해주세요" className={styles.BridgeAreaDiv} onChange={(e:any)=>onChange3(e,"sub2")} >
                            {selectOption}
                        </Select>: <div></div>
                    }
                    {confirmOption === true?
                            <div><Select placeholder="선택해주세요" className={styles.BridgeOptionDiv} onChange={(e:any)=>onChange3(e,"sub3")}>{girder_render() }</Select></div>
                        : <div></div>}
                    
                </div>
            <input
                type="file"
                id="fileUpload"
                style={{ display: "none" }} // label을 이용하여 구현하기에 없애줌
                multiple={true} // 파일 다중선택 허용
                onChange={onChangeFiles}
                accept=".mov, .mp4"
            />

            <label
                className={styles.isDragging ? "DragDrop-File-Dragging" : "DragDrop-File"}
                // 드래그 중일때와 아닐때의 클래스 이름을 다르게 주어 스타일 차이
                htmlFor="fileUpload"
                ref={dragRef}
            >
                <div className={styles.upload}>
                    <p/>
                    <img src="/images/upload.png" className={styles.uploadimg}/>
                    <p className={styles.uploadText}> Click or drag file to this area to upload</p>  
                    <p className={styles.uploadText}> Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                          band fileList
                    </p>
                </div>
              </label>
            </div>
            <div className={styles.uploadList}>
                <Table dataSource={imgFiles}>
                    <Column title='no' dataIndex='key' key='key' />
                    <Column title='name' dataIndex='name' key='name' onCell={(record: string | any) => {
                        return {
                            onClick: event => {
                                setSelectNum(record.key)
                        }
                                
                        }
                    }} />
                    
                    <Column title='상태' dataIndex='status' key='status' onCell={(record: any) => {
                        return {
                        onClick: () => {
                            
                        },
                        onMouseEnter: () => {
                            // {console.log(record)}
                            // <Tooltip placement="right" title={text} />
                        }
                        }

                    }} />
                </Table>
            </div>
            <div>
                {
                    imageRender()
                }
                <div>
                    {imageName === true ?
                        <>
                            <button style={{ marginLeft: '4vw',  width: '8vw', marginTop:'2vw', backgroundColor: 'rgb(206, 211, 233)',float:'left'}} onClick={prevImage}>
                                이전
                            </button>
                            <p style={{ marginLeft: "10vw", marginTop: '2vw', fontSize: '20px', float: 'left' }}>{imgFiles[selectNum - 1].name}</p>
                            <button  style={{ marginLeft: '10vw', width: '8vw', marginTop:'2vw', backgroundColor: 'rgb(206, 211, 233)'  }} onClick={nextImage}>
                                다음
                            </button>
                            
                        </>
                        :
                        <>
                            <button style={{ marginLeft: '2vw',  width: '8vw', marginTop:'2vw', backgroundColor: 'rgb(206, 211, 233)',float:'left'}} onClick={prevImage}>
                                이전
                            </button>
                            <p  style={{ marginLeft: "10vw", marginTop: '2vw', fontSize: '20px', float: 'left' }}>  </p>
                            <button  style={{ marginLeft: '17.5vw', width: '8vw', marginTop:'2vw', backgroundColor: 'rgb(206, 211, 233)'  }} onClick={nextImage}>
                                다음
                            </button>
                        </>
                    }
                
                </div>
                <div>
                    <button  style={{ marginRight: '16vw', width: '8vw', marginTop:'2vw', backgroundColor: 'rgb(206, 211, 233)', float:'right'}} onClick={imageFiltering}>
                        이미지 필터링
                    </button>
                </div>
            </div>
        </div>
  )
}
