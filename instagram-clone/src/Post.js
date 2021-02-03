import React, { useState, useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar';
import './Post.css';
import { db } from './firebase';
import firebase from "firebase";

function Post(props) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (props.postid) {
            db
                .collection("posts")
                .doc(props.postid)
                .collection("comments")
                .orderBy("timeStamp", "desc")
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => {
                        return doc.data();
                    }))
                })
        }
    }, [props.postid]);

    const postComment = (event) => {
        event.preventDefault();

        db.collection("posts").doc(props.postid).collection("comments").add({
            text: comment,
            username: props.user.displayName,
            timeStamp: firebase.firestore.FieldValue.serverTimestamp()
        })

        setComment('');
    }
    return (

        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar" alt={props.username} src="./2.jpg" />
                <div>{props.username}</div>
            </div>

            <img className="post__image" src={props.img_url} alt="" />

            <div className="post__caption">
                <strong>{props.username}</strong> : {props.caption}
            </div>

            
                {props.user ?
                    (<form className = "post__comment__form">
                        <input
                            className="post__comment__input"
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button
                            classname="post__comment__button"
                            diabled={!comment}
                            type="submit"
                            onClick={postComment}
                        >Post</button>
                    </form>) :
                    (
                        <div> You need to login to comment on the post</div>
                    )
                }

                <div className="comments">
                    {
                        comments.map((comment) => {
                            return (<div className="individual__comment"> 
                                <strong>{comment.username}</strong> : {comment.text}
                            </div>)
                            
                        })
                    }
                </div>
            </div>
    )
}

export default Post
