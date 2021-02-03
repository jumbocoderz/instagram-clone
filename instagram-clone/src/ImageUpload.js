import React, { useState } from 'react'
import { storage, db } from './firebase';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import firebase from "firebase";
import './ImageUpload.css';

function ImageUpload(props) {

    const [caption,setCaption] = useState("");
    const [progress,setProgress] = useState(0);
    const [image,setImage] = useState(null);

    const setFileChange = (e) => {
        if(e.target.files[0])
            setImage(e.target.files[0]);
    };

    const handleUpload = (e) => {
        e.preventDefault();
        console.log(image.name);
        const uploadData = storage.ref(`images/${image.name}`).put(image);

        uploadData.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progress);                    
            },
            (error) => {
                alert(error.message)
            },
            () => {
                
                console.log(storage);
                storage.ref().child(`images/${image.name}`).getDownloadURL()
                .then((url) => {
                    db.collection("posts").add({
                        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption : caption,
                        img_url : url,
                        username: props.username
                    });

                    setProgress(0);
                    setCaption("");
                    setImage(null);
                });
            }
        )
    }
    
    return (
        <div className="imageupload">
            <form class="form">
                <progress className="progressbar" value={progress} max="100"/>
                <Input 
                    type = "text"
                    placeholder = "Enter a caption..."
                    value = {caption}
                    onChange = {(e)=>setCaption(e.target.value)}
                />
                <Input 
                    type = "file"
                    onChange = {setFileChange}
                />
                <Button 
                    type="submit"
                    onClick = {handleUpload}
                >Upload</Button>
            </form>
        </div>
    )
}

export default ImageUpload
