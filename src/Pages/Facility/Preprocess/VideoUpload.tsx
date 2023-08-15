import React, { useState, useEffect, useCallback, ChangeEvent, useRef } from 'react'
import styles from '../../../Styles/Preprocess.module.css'
import { Table, Progress, Tooltip } from 'antd';
import { VideoContents } from '../../../Store/Type/type';
import { videoURL, VideoList, TimeSet, project_info } from '../../../Store/State/atom';
import { useRecoilValue, useRecoilState, constSelector } from 'recoil';
import axios from "axios";
import { API_URL} from '../../../Store/Global';


export default function VideoUpload() {
    let token: string | null = localStorage.getItem("token") 
    let project_id: string | null = localStorage.getItem("project_id")


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


  let ProjectInfo = useRecoilValue<any>(project_info)
  useEffect(() => {
        if (typeof window !== 'undefined' || "null") {
            // console.log('You are on the browser');
            token = localStorage.getItem("token");
        } else {
            console.log('You are on the server');
            // 👉️ can't use localStorage1
        }
        
    })
    
    //video upload url 
    const [videoUrl, setVideoUrl] = useRecoilState(videoURL);
    const [videoList, setVideoList] = useRecoilState<VideoContents[]>(VideoList);
    const { Column } = Table;
  
    const [files, setFiles] = useState<VideoContents[]>([]);
    let video_url = useRecoilValue(videoURL);
  
    // 드래그 중일때와 아닐때의 스타일을 구분하기 위한 state 변수
    const [isDragging, setIsDragging] = useState<boolean>(false);
  
    // 각 선택했던 파일들의 고유값 id
    const fileId = useRef<number>(0);
  
    // 드래그 이벤트를 감지하는 ref 참조변수 (label 태그에 들어갈 예정)
    const dragRef = useRef<HTMLLabelElement | null>(null);
    
    let tempFiles: VideoContents[] = files;

    const [errMsg, setErrMsg] = useState<any>();
    const text = <span>{errMsg}</span>;
    let ob : any= [];

    const onChangeFiles = useCallback(
        (e: ChangeEvent<HTMLInputElement> | any): void => {
      let selectFiles: File[] = [];
      if (e.type === "drop") {
        console.log(e.dataTransfer.files)
        selectFiles = e.dataTransfer.files;
      } else {
        selectFiles = e.target.files;
      }
      // selectFiles = [...selectFiles].sort((a, b) => a.name > b.name ? 1 : -1)
      
      for (const file of selectFiles) {
        // selectFiles.forEach((file, idx) => {

        // })
        
        let url = URL.createObjectURL(file);
        
        let n = file.name.indexOf('C')

        // videoList.filter((a: any) =>console.log( a.Video_name.props.children === file.name))
        ob = videoList.filter((a: any) => a.Video_name.props.children !== file.name) //videolist에 중복 제거
        if (ob.length === 0 ) {
          // console.log("ob배열 비였어")
          tempFiles = [
          ...tempFiles, 
          {
            // no: Number(file.name.substring(n+1,n+3)),
            no:1+fileId.current++,
            url: url,//file,
            Video_name: <a>{file.name}</a>,
            start: '00:00',
            end: '00:00',
            reversal: 0,
            status: <Progress type="circle" percent={0} width= {40} />
          }];
          
        } else {
          // console.log("중복 배열 카메라수", ob[0].no,tempFiles)
          const a = tempFiles.findIndex(a => (a.no === ob[0].no))
          if (a !== -1) { 
            console.log(ob)
            tempFiles = [...ob, {
              no: 1+ob.length,
              // no: Number(file.name.substring(n+1,n+3)),
              url: url,//file,
              Video_name: <a>{file.name}</a>,
              start: '00:00',
              end: '00:00',
              reversal: 0,
              status: <Progress type="circle" percent={0} width= {40} />
            }]
          }
        }
        
        
          // 오름차순 코드
        tempFiles.sort((obj1, obj2) => {
          if (obj1.no > obj2.no) {
            return 1;
          }
          if (obj1.no < obj2.no) {
             return -1;
          }
          return 0;
        })
        setVideoList(tempFiles)
        let projectId = project_id;
        let path = 'stage0/C' + String(file.name.substring(n+1,n+3)).padStart(2,'0')
        let filename = file.name
           // 서버 업로드
           const upload_res = axios({
             method: 'post',
            //  url: API_URL+`/File/Upload/${projectId}/${path}/${filename}`,
             url: API_URL + `/file/upload/${project_id}?path=${path}&filename=${filename}`,
             headers: { 
             "accept": `application/json`,
             "access-token": `${token}`,
             "Content-Type": `multipart/form-data`  },
             data: { upload: file },
                    onUploadProgress: (progressEvent: { loaded: any; total: any }) => {
              //  console.log(timeSet, videoList)
                  
                  let copyarr = [...tempFiles] 
                  let a = Math.round((progressEvent.loaded*100)/progressEvent.total)
                  const ind = copyarr.findIndex(element => element.Video_name.props.children === filename)
                  
                  if (ind !== -1) {
                    // console.log(ind, ' : ', a)  
                    copyarr[ind] = { ...copyarr[ind],status: <Progress type="circle" percent={a} width={40} /> }
                    tempFiles =copyarr
                   }
                  setVideoList(copyarr)
            },
            
           }).then((res) => {
          // setVideoList(tempFiles)
            if (res.data.check === true) {
                console.log("성공")
                setFiles(tempFiles)
              } else {
              console.log("실패 : ", res.data.message)
              let copyarr = [...tempFiles]
              const ind = copyarr.findIndex(element => element.Video_name.props.children === filename)
              if (ind !== -1) {
                  copyarr[ind] = { ...copyarr[ind], status: <Progress type="circle" status='exception' width={40} /> }
              }
                setVideoList(copyarr)
                tempFiles =copyarr
              if (res.data.message === '해당 파일이 이미 존재합니다.') {
                  setErrMsg('이미 파일이 존재합니다.')
                  alert(res.data.message)

                }
              }
            }).catch((err) => {
              console.log(err);
            });
          }
          setVideoList(tempFiles)
        console.log(tempFiles)
      }, [files]);
    
    const handleFilterFile = useCallback((id: number): void => {
      setFiles(files.filter((file: VideoContents) => file.no !== id));
    }, [files]);
  
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
    if (dragRef.current !== null) {
      dragRef.current.addEventListener("dragenter", handleDragIn);
      dragRef.current.addEventListener("dragleave", handleDragOut);
      dragRef.current.addEventListener("dragover", handleDragOver);
      dragRef.current.addEventListener("drop", handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  const resetDragEvents = useCallback((): void => {
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
  }, [initDragEvents, resetDragEvents, videoList]);
    
  return (
      <div>
        <div className={styles.DragDrop}>
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
        
        <Table dataSource={videoList}>
          <Column title='no' dataIndex='no' key='no' />
          <Column title='name' dataIndex='Video_name' key='Video_name' onCell={(record: string | any) => {
            return {
              onClick: event => {
                setVideoUrl([record.no, record.url])
                console.log(videoList)
              }
                      
            }
          }} />
          <Column title='Start' dataIndex='start' key='startTime' />
          <Column title='End' dataIndex='end' key='endTime' />
          <Column title='상태' dataIndex='status' key='status' onCell={(record: any) => {
            return {
              onClick: () => {
                console.log('여기다', record)
              },
              onMouseEnter: () => {
                // {console.log(record)}
                <Tooltip placement="right" title={text} />
              }
            }

          }} />
        </Table>
        
      </div>
          
    </div>
  )
}