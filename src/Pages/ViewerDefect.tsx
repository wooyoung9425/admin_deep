    import { useEffect, useState, useRef, ChangeEvent } from 'react';
    import { Radio, Col, InputNumber, Row, Slider, Button, Upload, Input } from 'antd';
    import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
    import type { RadioChangeEvent, UploadProps } from 'antd';
    // import type { UploadProps } from 'antd';
    import styles from '../Styles/CrackDetector_Measure.module.css';
    import {v4 as uuidv4} from "uuid"
    import axios from "axios";
    import { API_URL, IMAGE_URL} from '../Store/Global';

    interface AddBbox {
        // number : number,
        defect : string,
        x : number,
        y : number,
        width : number,
        height : number
    }

    export default function ViewerDefect() {  

    //Corrosion 부식 #F59331
    //Crack 균열 #322770
    //Desquamation 박락 #B971F0
    //Efflorescence 백태 #E21F5D
    //Fail 파손 #275D0E
    //Leakage 누수 #02BABC
    //PaintDesquamation 도장박락 #1B8F73
    //PaintSpalling 도장박리 #0E4DDE
    //RebarExposure 철근노출 #B83DF5
    //Segregation 재료분리 #FF6037
    //Spalling 박리 #1B8F05

    const AddBbox : AddBbox[] = [];  

    const [AddNewBbox, setAddNewBbox] = useState<any | undefined>(AddBbox)

    let token : string | null = localStorage.getItem("token") 

    let project_id: string | null = localStorage.getItem("project_id")

    let EditImageStore : string | null = localStorage.getItem("edit_defect_image");

    const [EditImageUrl, setEditImageUrl] = useState<string>("")

    let project_type: string | null = localStorage.getItem("project_Type");

    let bridge_type: string | null = localStorage.getItem("bridge_type");

    let dam_type: string | null = localStorage.getItem("dam_type");

    // console.log(project_type);

    const canvasRef = useRef<any>(null);

    const [ctx, setCtx] = useState<any>();

        // Slider
        const [inputValue, setInputValue] = useState(20);

        //color
        const [color, setColor] = useState<string>("#F59331");

        //defect
        const [defect, setDefect] = useState<string>("Corrosion");

        // getCtx
        const [getCtx, setGetCtx] = useState<any>(null);
    
        // getCanvas
        const [getCanvas, setGetCanvas] = useState(null);

        // painting state
        const [painting, setPainting] = useState(false);

        const [TestImage, setTestImage] = useState<any>();
        const [TestImageW, setTestImageW] = useState<number>();
        const [TestImageH, setTestImageH] = useState<number>();
        const [TestImageLen, setTestImageLen] = useState<boolean>(false);

        //박스 그리기에 필요한 선언
        const [pos, setPos] = useState<any>([]);
        const [isDraw, setIsDraw] = useState(false);

        const [RemoveNewBbox, setRemoveNewBbox] = useState([{
            number: '',
            id:uuidv4(),
        }])

        const addMemberRow = () => {
            let _RemoveNewBbox=[...RemoveNewBbox]
                _RemoveNewBbox.push({
                number:'',
                id:uuidv4(),
            })
            setRemoveNewBbox(_RemoveNewBbox)
        }

        const removeMemberRow = (id:string) => {
            let _inviteMembers=[...RemoveNewBbox]
            _inviteMembers = _inviteMembers.filter(member=>member.id!==id)
            setRemoveNewBbox(_inviteMembers)
        }

        const handleMemberChange = (id:string, event:ChangeEvent<HTMLInputElement>) => {
            // console.log(e)
            const index=RemoveNewBbox.findIndex(m=>m.id===id)
            let _inviteMembers =[...RemoveNewBbox] as any
            _inviteMembers[index][event.target.name]= event.target.value
            setRemoveNewBbox(_inviteMembers)
        }

    useEffect(() => {
        setEditImageUrl(String(EditImageStore));

        const indexFront = EditImageStore?.indexOf("/stage")
        const indexBack = EditImageStore?.indexOf("&")

        const uploadImgName = project_type === "Bridge"  ?  bridge_type === "Girder" ? 
                                                                            String(EditImageStore).substring(Number(indexFront)+22, Number(indexBack)-11)
                                                                            : bridge_type === "GirderSide" ? String(EditImageStore).substring(Number(indexFront)+26, Number(indexBack)-11)
                                                                            : bridge_type === "Slab" ? String(EditImageStore).substring(Number(indexFront)+20, Number(indexBack)-11)
                                                                            : String(EditImageStore).substring(Number(indexFront)+20, Number(indexBack)-11)
                                                    :String(EditImageStore).substring(Number(indexFront), indexBack)
        
        axios({
            method: 'get',
            url: API_URL+'/File/Files',
            headers : { "accept": `application/json`, "access-token": `${token}`},
            params: {
            path : `/project/${project_id}/stage6_defect/${bridge_type}/Visualization_Categories`
                }
        }).then((res)=>{
            for(let i =  0; i<res.data.data.files.length; i++){
                console.log(uploadImgName)
                console.log(res.data.data.files[i])
                console.log(res.data.data.files[i].includes(defect))
                console.log(res.data.data.files[i].includes(uploadImgName))
                // console.log(uploadImgName)
                if(res.data.data.files[i].includes(defect) && res.data.data.files[i].includes(uploadImgName)){
                    // `${IMAGE_URL}/image?path=/project/${project_id}/stage6_crack/${res.data.data.files[i]}&width=1440`
                    // console.log(res.data.data.files[i])
                    // console.log(`${IMAGE_URL}/image?path=/project/${project_id}/stage6_defect_binary/${bridge_type}/${res.data.data.files[i]}`)
                    console.log(res.data.data.files[i])

                    const image = new Image();
                    image.src = `${IMAGE_URL}/image?path=/project/${project_id}/stage6_defect/${bridge_type}/Visualization_Categories/${res.data.data.files[i]}`;
                    image.crossOrigin = 'Anonymous';

                    image.onload = function() {

                    canvas.width = image.width;
                    canvas.height = image.height;

                    // console.log(image)
                    ctx.drawImage(image, 0, 0, image.width, image.height);


                    setTestImage(image)
                    // setTestImageW(image.width / 10)
                    // setTestImageW(project_type === "Dam" ? image.width / 10 : project_type === "Airport" ? image.width / 4 : image.width / 17)
                    // project_type === "Bridge" && bridge_type === "Girder" ? image.width / 20 : image.width / 10
                    setTestImageW(project_type === "Bridge" && bridge_type === "Girder" ? image.width / 20 : project_type === "Airport" ? image.width / 4 : image.width / 10)
                    // setTestImageH(image.height / 10)
                    setTestImageH(project_type === "Bridge" && bridge_type === "Girder" ? image.height / 20 : project_type === "Airport" ? image.height / 4 : image.height / 10)
                    // setTestImageH(image.height / 10)
                    };
                }
            }
        })

        // const indexBack = EditImageStore?.indexOf("&") 
        // const uploadImgName = String(EditImageStore).substring(0, indexBack)

        const canvas : any = canvasRef.current;
        const ctx : any = canvas.getContext("2d");
        setCtx(canvas.getContext("2d"));

        ctx.lineJoin = "round";
        ctx.lineWidth = inputValue; // 라인 크기 조절
        ctx.strokeStyle = color; // 흰색 #ffffff, 회색 #808080, 검은색 #0000000

        if(String(TestImage).length > 0){
        setTestImageLen(true)
        }

        // console.log(TestImageLen)

        setGetCtx(ctx);
        setGetCanvas(canvas);
    }, [defect])

    function drawStart(e : any) {
        setIsDraw(true);
        project_type === "Bridge" && bridge_type === "Girder" ? setPos([(e.clientX - canvasRef.current.offsetLeft) * 20, (e.clientY - canvasRef.current.offsetTop) * 20])
                                                                : project_type === "Airport" ? setPos([(e.clientX - canvasRef.current.offsetLeft) * 4, (e.clientY - canvasRef.current.offsetTop) * 4])
                                                                : setPos([(e.clientX - canvasRef.current.offsetLeft) * 10, (e.clientY - canvasRef.current.offsetTop) * 10])
    }

    // 박스 그리기
    function drawSquare(e : any) {
        ctx.strokeStyle = color;  // 색상
        ctx.lineWidth = inputValue; // 붓 크기 조절
    }

    let copyArrAddNewBbox = [...AddNewBbox]

    function drawEnd(e : any) {
        setIsDraw(false);
        let currentX:any;
        let currentY:any;
        if(project_type === "Bridge"){
            if(bridge_type === "Girder"){
                currentX = ((e.clientX - canvasRef.current.offsetLeft) * 20);
                currentY = ((e.clientY - canvasRef.current.offsetTop) * 20);
            }else{
                currentX = ((e.clientX - canvasRef.current.offsetLeft) * 10);
                currentY = ((e.clientY - canvasRef.current.offsetTop) * 10);
            }
        }else if(project_type === "Airport"){
            currentX = ((e.clientX - canvasRef.current.offsetLeft) * 4);
            currentY = ((e.clientY - canvasRef.current.offsetTop) * 4);
        }else{
            currentX = ((e.clientX - canvasRef.current.offsetLeft) * 10);
            currentY = ((e.clientY - canvasRef.current.offsetTop) * 10);
        }
        ctx.strokeRect(pos[0], pos[1], currentX - pos[0], currentY - pos[1]); // 사각형의 (x좌표, y좌표, width, height)

        copyArrAddNewBbox.push({
            // number : 0,
            defect : defect,
            x : pos[0],
            y : pos[1],
            width : currentX - pos[0],
            height : currentY - pos[1]
        })

        setAddNewBbox(copyArrAddNewBbox)

        // 좌표 콘솔 출력
        // console.log("x, y: ", pos[0], ", ", pos[1]); // 좌측 상단 좌표
        // console.log("가로: ", currentX - pos[0], ", ", "세로: ", currentY - pos[1]); // 가로 길이, 세로 길이
    }

    const drawFn = (e:any) => {
    // mouse position
    // const mouseX = e.nativeEvent.offsetX * 10;
    // const mouseX = project_type === "Tunnel"  || project_type === "Dam"? e.nativeEvent.offsetX * 10 : project_type === "Airport"? e.nativeEvent.offsetX * 4 : e.nativeEvent.offsetX * 17;
    const mouseX = project_type === "Bridge" && bridge_type === "Girder" ? e.nativeEvent.offsetX * 20 
                                                                            : project_type === "Airport" ? e.nativeEvent.offsetX * 4
                                                                            : e.nativeEvent.offsetX * 10

    // const mouseY = e.nativeEvent.offsetY * 10;
    // const mouseY = project_type === "Tunnel"  || project_type === "Dam"? e.nativeEvent.offsetY * 10 : project_type === "Airport"? e.nativeEvent.offsetY * 4 : e.nativeEvent.offsetY * 17;
    const mouseY = project_type === "Bridge" && bridge_type === "Girder" ? e.nativeEvent.offsetY * 20 
                                                                            : project_type === "Airport" ? e.nativeEvent.offsetY * 4
                                                                            : e.nativeEvent.offsetY * 10
    // drawing
    // console.log(painting);

    if (!painting) {
        getCtx.beginPath();
        getCtx.moveTo(mouseX, mouseY);
    } else {
        getCtx.lineTo(mouseX, mouseY);
        getCtx.stroke();
    }
    }

    const onChange = (value:any) => {
    

    const canvas : any = canvasRef.current;
        // console.log(canvas);
    const ctx : any = canvas.getContext("2d");

        ctx.lineJoin = "round";
        ctx.lineWidth = inputValue; // 라인 크기 조절
        ctx.strokeStyle = color; // 흰색 #ffffff, 회색 #808080, 검은색 #0000000

        setGetCtx(ctx);
        setGetCanvas(canvas);

    if (isNaN(value)) {
        return;
    }
    setInputValue(value);
    };

    const onChangeColor = (e: RadioChangeEvent) => {

    const canvas : any = canvasRef.current;
        // console.log(canvas);
        const ctx : any = canvas.getContext("2d");

        ctx.lineJoin = "round";
        ctx.lineWidth = inputValue; // 라인 크기 조절
        ctx.strokeStyle = color; // 흰색 #ffffff, 회색 #808080, 검은색 #0000000

        setGetCtx(ctx);
        setGetCanvas(canvas);

    if(e.target.value===1){
        setColor("#F59331")
        setDefect("Corrosion")
    }else if(e.target.value===2){
        setColor("#322770")
        setDefect("Crack")
    }else if(e.target.value===3){
        setColor("#B971F0")
        setDefect("Desquamation")
    }else if(e.target.value===4){
        setColor("#E21F5D")
        setDefect("Efflorescence")
    }else if(e.target.value===5){
        setColor("#275D0E")
        setDefect("Fail")
    }else if(e.target.value===6){
        setColor("#02BABC")
        setDefect("Leakage")
    }else if(e.target.value===7){
        setColor("#1B8F73")
        setDefect("Paint Desquamation")
    }else if(e.target.value===8){
        setColor("#0E4DDE")
        setDefect("PaintSpalling")
    }else if(e.target.value===9){
        setColor("#B83DF5")
        setDefect("RebarExposure")
    }else if(e.target.value===10){
        setColor("#FF6037")
        setDefect("Segregation")
    }else if(e.target.value===11){
        setColor("#1B8F05")
        setDefect("Spalling")
    }
    }

    const onClickSetting = () => {
    const canvas : any = canvasRef.current;
    const ctx : any = canvas.getContext("2d");

    ctx.lineJoin = "round";
    ctx.lineWidth = inputValue; // 라인 크기 조절
    ctx.strokeStyle = color; //

    setGetCtx(ctx);
    setGetCanvas(canvas);
    }


    const onClickUpload = () => {
    alert("수정이 완료 되었습니다.")   
    // console.log(String(TestImage))
    // console.log(String(TestImage).length);
    // console.log(TestImage.width, TestImage.height);
    // console.log(TestImageLen);

    // const canvas = document.querySelector(`.${document.getElementById("imageID")?.className} canvas:nth-child(1)`) as HTMLCanvasElement;
    
    // const canvasAddress = canvas.toDataURL("image/png");
    // console.log(canvasAddress);

    // const indexFront = EditImageStore?.indexOf("/stage")
    // const indexBack = EditImageStore?.indexOf("&") 
    // // const uploadImgName = String(EditImageStore).substring(Number(indexFront)+8, indexBack)
    // const uploadImgName = project_type === "Tunnel" ? String(EditImageStore).substring(Number(indexFront)+8, indexBack) 
    //                                                 : project_type === "Bridge" ? String(EditImageStore).substring(Number(indexFront)+15, indexBack)
    //                                                 : project_type === "Airport" ? String(EditImageStore).substring(Number(indexFront)+15, indexBack)
    //                                                 : String(EditImageStore).substring(Number(indexFront)+17, indexBack)

    // console.log(uploadImgName);


    // const downloadImage = document.createElement("a");
    // downloadImage.href = canvasAddress;
    // downloadImage.download = uploadImgName;
    // downloadImage.click();
    // console.log(downloadImage)

    // console.log(API_URL + `/File/Upload/${project_id}/stage6/${dam_type}/${uploadImgName}`);

    //공항이랑 댐은 결과 저장 업로드가 안되고, 교량은 확인해야 돼
    // axios({
    //     method: 'post',
    //     url: project_type === "Tunnel" ? API_URL + `/File/Upload/${project_id}/stage6/${uploadImgName}` 
    //                                     : project_type === "Bridge" ? API_URL + `/File/Upload/${project_id}/stage6`+`_${bridge_type}/${uploadImgName}`
    //                                     : project_type === "Airport" ? API_URL + `/File/Upload/${project_id}/stage6`+"_"+`defect/${uploadImgName}`
    //                                     : API_URL + `/File/Upload/${project_id}/stage6`+`_${dam_type}/${uploadImgName}`,
    //     headers: { "accept": `multipart/form-data` },
    //     data: { upload: dataURLtoFile(canvasAddress,uploadImgName) },
    // }).then((res) => {
    //     console.log(res.data.check, res)
    // }).catch((err) => {
    //     console.log(err)
    // })

    // axios({
    //   method: 'post',
    //   url: `/File/Upload/${project_id}`,
    //   headers: { "accept": `multipart/form-data` },
    //   params: {
    //     path: "stage6",
    //     filename: `${uploadImgName}`
    //   },
    //   data: { upload: dataURLtoFile(canvasAddress,uploadImgName) },
    // }).then((res) => {
    //     // console.log(API_URL + `/File/Upload/${project_id}/stage6` + `${bridge_type}/${uploadImgName}`)
    //     console.log(res.data.check, res)
    // }).catch((err) => {
    //     console.log(err)
    // })  
    }

    const dataURLtoFile = (dataurl: any, fileName: string) => {
    var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], fileName, {type:mime});
    }

    // ###########################################
    const [clicked, setClicked] = useState<string>("Box");

    const changeValue = (e: RadioChangeEvent) => {
        if(e.target.value===1){
            setClicked("Box")
        }else if(e.target.value===2){
            setClicked("Line")
        }
    }
    // ###########################################

    const Test = () => {
        console.log(AddNewBbox)
        console.log(RemoveNewBbox)
    }

    return (
        <>
        <div className={styles.viewerDiv} id="imageID">
            <p/>
            <p className={styles.mainOrder}>결함 검출 결과를 수정하세요.</p>
            {
                EditImageUrl.length > 0 ?
                <img src={EditImageUrl} style={{width:TestImageW, height:TestImageH}}/>
                :
                <div></div>
            }
            <br />
            <br />
            <div className={styles.canvasWrap}>
                {/* <div> */}
                {/* 시연용 예비 코드 삭제 필요 */}
                {/* </div> */}
            {clicked === "Box" ? // 버튼이 클릭되면
            <canvas // 상자 그리기
                style={{width: TestImageLen === true ? TestImageW: "", height : TestImageLen === true ? TestImageH : ""}}
                className="canvas"
                ref={canvasRef}
                onMouseDown={e => drawStart(e)}
                onMouseMove={e => drawSquare(e)}
                onMouseUp={e => drawEnd(e)}
            >
            </canvas>
            :       // 버튼이 클릭되지 않으면
            <canvas    
            // style={{width: TestImage.width, height: TestImage.height}}    
            // style={{width: 1425, height: 293}}    
            style={{width: TestImageLen === true ? TestImageW: "", height : TestImageLen === true ? TestImageH : ""}}
            className="canvas"
            ref={canvasRef}
            onMouseDown={() => setPainting(true)}
            onMouseUp={() => setPainting(false)}
            onMouseMove={e => drawFn(e)}
            onMouseLeave={() => setPainting(false)}
            >
            </canvas>
            }
            </div>
            <div>
            <br/>
            <Row>
            <Col span={6}/>
            <Col span={6}>
                <div className={styles.subOrder}>삭제할 결함 번호 : </div>
            </Col>
            <Col span={6}>
            {RemoveNewBbox.map((member, index) => (
                                    <div className="form-row" key={member.id} style={{display:"flex"}}>
                                        <div className="input-group" style={{display:"flex", marginBottom: "10px"}}>
                                            <Input name="number" 
                                            key=""
                                            type="number"
                                            placeholder="number"
                                            onChange={(e) => handleMemberChange(member.id, e)}
                                            style={{marginRight: "10px", width: "200px"}}
                                            ></Input>                                   
                                        </div>
                                        {
                                            RemoveNewBbox.length > 1 && (
                                                <MinusCircleOutlined onClick={()=> {
                                                    removeMemberRow(member.id)}}
                                            style={{marginTop: "10px"}}
                                            />
                                        )}
                                        <PlusCircleOutlined onClick={() => {addMemberRow()}} 
                                        style={{marginTop: "10px" , marginLeft: "10px"}}
                                        />                                        
                                    </div>
                                    ))}
            </Col>
            <Col span={6}/>

            </Row>

            <Row>
                <Col span={4}/>

                <Col span={5}>
                <div className={styles.subOrder}>붓 두께 설정 : </div>
                </Col>

                <Col span={6}>
                <Slider
                    min={0}
                    max={100}
                    onChange={onChange}
                    value={inputValue}
                    step={1}
                />
                </Col>

                <Col span={5}>
                <InputNumber
                    min={0}
                    max={100}
                    step={1}
                    value={inputValue}
                    onChange={onChange}
                />
                </Col>

                <Col span={4}/>

            </Row>

            <br />

            <Row>
            <Col span={4}/>

            <Col span={2}>
                <div className={styles.subOrder}> 붓 색상 설정 : </div>
            </Col>

            <Col span={12}>
                <Radio.Group optionType="button">
                        <Radio value={1} onChange={onChangeColor} style={{backgroundColor:"#F59331", color:"white"}}> 부식 </Radio>
                        <Radio value={2} onChange={onChangeColor} style={{backgroundColor:"#322770", color:"white"}}> 균열 </Radio>
                        <Radio value={3} onChange={onChangeColor} style={{backgroundColor:"#B971F0", color:"white"}}> 박락 </Radio>
                        <Radio value={4} onChange={onChangeColor} style={{backgroundColor:"#E21F5D", color:"white"}}> 백태 </Radio>
                        <Radio value={5} onChange={onChangeColor} style={{backgroundColor:"#275D0E", color:"white"}}> 파손 </Radio>
                        <Radio value={6} onChange={onChangeColor} style={{backgroundColor:"#02BABC", color:"white"}}> 누수 </Radio>
                        <Radio value={7} onChange={onChangeColor} style={{backgroundColor:"#1B8F73", color:"white"}}> 도장박락 </Radio>
                        <Radio value={8} onChange={onChangeColor} style={{backgroundColor:"#0E4DDE", color:"white"}}> 도장박리 </Radio>
                        <Radio value={9} onChange={onChangeColor} style={{backgroundColor:"#B83DF5", color:"white"}}> 철근노출 </Radio>
                        <Radio value={10} onChange={onChangeColor} style={{backgroundColor:"#FF6037", color:"white"}}> 재료분리 </Radio>
                        <Radio value={11} onChange={onChangeColor} style={{backgroundColor:"#1B8F05", color:"white"}}> 박리 </Radio>
                </Radio.Group>
            </Col>

            <Col span={2}>
                
            </Col>

            <Col span={4}/>

            </Row>

            <br/>

            <Row>
            <Col span={3}/>

            <Col span={6}>
                <Button onClick={onClickSetting}> 붓 설정 적용하기 </Button>
            </Col>

            <Col span={6}>
                {/* <Button onClick={changeValue}> Box / Line 변경 </Button> */}
                <Radio.Group optionType="button">
                        <Radio value={1} onChange={changeValue}>Box</Radio>
                        <Radio value={2} onChange={changeValue}>Line</Radio>
                </Radio.Group>
            </Col>

            <Col span={6}>
                {/* <Upload {...props}> */}
                {/* <Button> 업로드하기 </Button> */}
                <Button onClick={Test}> 테스트 </Button>
                <Button onClick={onClickUpload}> 업로드하기 </Button>
                {/* </Upload> */}
            </Col>

            <Col span={3}/>

            </Row>

            <br/>
            </div>
        </div>
        </>
        
    )
    }
