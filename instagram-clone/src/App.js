import React, { useState, useEffect } from 'react'
import './App.css';
import { db, auth } from './firebase';
import Post from './Post';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Logo from './Logo';
import ImageUpload from './ImageUpload';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {

  const [posts, setPosts] = useState([]);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [opensignin, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      }
      else {
        setUser(null);
      }
    })
    return () => {
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timeStamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({id: doc.id, post: doc.data()})));
    })
  }, []);

  const signup = (event) => {

    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => {
        alert(error.message)
      });

    setOpen(false);
    setEmail("");
    setPassword("");
    setUsername("");
  }

  const signin = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
      .catch(error => alert(error.message));

    setOpenSignIn(false);
    setEmail("");
    setPassword("");
  }

  return (
    <div className="app">

      <div className="header">
        <Logo />
        <Modal open={open} onClose={() => setOpen(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form className="modal">
              <center><Logo /></center>
              <Input
                type="text"
                placeholder="enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="text"
                placeholder="enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signup}>Submit</Button>

            </form>
          </div>
        </Modal>

        <Modal open={opensignin} onClose={() => setOpenSignIn(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form className="modal">
              <center><Logo /></center>
              <Input
                type="text"
                placeholder="enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signin}>Submit</Button>

            </form>
          </div>
        </Modal>
        {user ?
          (<Button onClick={() => auth.signOut()}>LogOut</Button>) :
          (<div>
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>)
        }
      </div>

      {user ? (
        <ImageUpload username={user.displayName} />
      ) : (
          <h3> You need to login to upload something</h3>
        )
      }

      <center>
        <h1>Welcome to Jumbo's Instagram Clone App</h1>
        <div className="posts">
          {posts.map(({id,post}) => {
            return <Post key={id} postid={id} className="post" user = {user} username={post.username} img_url={post.img_url} caption={post.caption} />
          })}
        </div>
      </center>


    </div>
  );
}

export default App;
