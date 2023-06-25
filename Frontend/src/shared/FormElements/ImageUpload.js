import { useEffect, useRef, useState } from "react";

import Button from "./Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const filePickerRef = useRef();
  const [file,setFile] = useState();

  useEffect(() => {
    if(!file){
        return
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
        setPreviewUrl(fileReader.result)
    }
    fileReader.readAsDataURL(file);
  },[file])

  const[isValid, setIsValid] = useState(false);
  const[previewUrl, setPreviewUrl] = useState();

  const pickImageHandler = () => {
    filePickerRef.current.click();
  }
  
  const pickedHandler = (event) => {
    console.log("triggered")
    console.log(event.target)
    let pickedFile;
    let fileIsValid = isValid;
    if(event.target.files && event.target.files.length === 1){
        pickedFile = event.target.files[0];
        setFile(pickedFile);
        setIsValid(true);
        fileIsValid = true;
    }
    else{
        console.log("Not Valid");
        setIsValid(false);
        fileIsValid = false;
    }
    //Apan yahin se pata krlete hain ki file valid hai ya nhi aur uski value ko argument ke through pass krdete hain onInput function ko, jo ki 
    //formstate ki overall validity judge krne ke liye, har type ke input component ki validity (here isValid) ko check krta hai.
    props.onInput(props.id, pickedFile, fileIsValid)
  }

  return (
    <div className="form-control">
      <input
        id={props.id}
        style={{ display: "none" }}
        ref={filePickerRef}
        type="file"
        accept=".jpg, .png, .jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className="image-upload__preview">
            {previewUrl && <img src={previewUrl} alt="Preview"/>}
            {!previewUrl && <p>Please pick up an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;