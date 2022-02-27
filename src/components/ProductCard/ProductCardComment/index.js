import React, { useEffect, useState } from 'react'
import Modal from '../../Modal'
import { auth, firestore } from '../../../firebase/utils'
import { useSelector, useDispatch } from "react-redux"
import {collection, query, where, orderBy, onSnapshot, doc} from "firebase/firestore"
import FormInput from '../../forms/FormInput'
import Button from '../../forms/Button'
import Modal_sup from '../../Modal_sup'
import Modal_sup_2 from '../../Modal_sup_2'
import ProductCardReplyComment from './ProductCardReplyComment'

const mapState = (state) => ({ //this thing can happen if use redux
    currentUser: state.user.currentUser,
})


function ProductCardComment(props) {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(mapState);

    const [hideModal, setHideModal] = useState(true)
    const [hideModal2, setHideModal2] = useState(true)
    const [input, setInput] = useState(props.comment.comment)
    const [editInput, setEditInput] = useState(props.comment.comment)
    const [replyinput, setReplyInput] = useState('')
    const [uname, setUname] = useState(props.comment.uname)
    const [replyComments, setReplyComments] = useState([])

    const toggleModal = () => setHideModal(!hideModal);
    const toggleModal2 = () => setHideModal2(!hideModal2);

    const configModal = {
        hideModal,
        toggleModal
    }

    const configModal2 = {
        hideModal2,
        toggleModal2
    }

    

    useEffect(() => {
        const q = query(collection(firestore, "comments"), where("replyid", "==", props.comment.cmid), orderBy('timestamp'));
        onSnapshot(q, (snapshot) => {
            setReplyComments(snapshot.docs.map(doc => ({
                cmid: doc.id, 
                pid: doc.data().pid, 
                comment: doc.data().comment, 
                uid: doc.data().uid,
                uname: doc.data().uname,
                replyid: doc.data().replyid,
                time: doc.data().timestamp
              })))
        })
    }, [props.comment])

    const updateComment = () => {
        if(input == '') return
        //update the todo with the new input text
        firestore.collection('comments').doc(props.comment.cmid).set({
            comment: input
        }, { merge: true });
        setHideModal(true)
    }

    const addReplyComment = () => {
        if(replyinput == '') return
        const userid = auth.currentUser.uid
        const userName = auth.currentUser.displayName
        const timestamp = new Date();
        //update the todo with the new input text
        if(userName == null){
            
            firestore.collection('users').doc(userid).onSnapshot(snapshot => {
               var userName2 = snapshot.data().displayName

               try{
                firestore.collection('comments').add({
                    uid: userid,
                    uname: userName2,
                    pid: props.comment.pid,
                    comment: replyinput,
                    replyid: props.comment.cmid,
                    timestamp: timestamp
                })
                setHideModal2(true)
                setReplyInput('')
                }catch(err){
                    console.log(err)
                }
            })
        }
        else{
            try{
                firestore.collection('comments').add({
                    uid: userid,
                    uname: userName,
                    pid: props.comment.pid,
                    comment: replyinput,
                    replyid: props.comment.cmid,
                    timestamp: timestamp
                })
                setHideModal2(true)
                setReplyInput('')
            }catch(err){
                console.log(err)
            }
        }
    }

    const handleDelete = () =>{
        var comment = firestore.collection('comments').where('replyid', '==', props.comment.cmid);
        comment.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.delete();
            });
        })
    }

    return (
        <div className="cm-container">
            <Modal {...configModal}>
                
                {/* <Input value={input} onChange={event => setInput(event.target.value)} /> */}
                <FormInput className="paper" value={input} onChange={event => setInput(event.target.value)}  />
                <Button onClick={() => updateComment()}>Confirm</Button>
               
            </Modal>

            <Modal_sup {...configModal2}>
                
                {/* <Input value={input} onChange={event => setInput(event.target.value)} /> */}
                <FormInput className="paper" value={replyinput} onChange={event => setReplyInput(event.target.value)}  />
                <Button onClick={() => addReplyComment()}>Confirm</Button>
               
            </Modal_sup>

            <div className="wrap-2">
                <div className="comment">
                    <h3>{props.comment.uname}</h3>
                    <div className="comment-text">
                        {props.comment.comment}
                    </div>
                    <div className="comment-button">
                        {currentUser && [
                            <div className="comment-button-item" onClick={() => toggleModal2()}>Reply</div>
                        ]}
                        {currentUser && props.comment.uid == currentUser.id && [
                            <div className="comment-button-item" onClick={() => toggleModal()}>Edit</div>,
                            <div className="comment-button-item" onClick={event => firestore.collection('comments').doc(props.comment.cmid).delete().then(
                                
                                handleDelete()
                                    // firestore.collection('comments').where('replyid', '==', props.comment.cmid).delete()
                                    
                            )}>Delete</div>
                        ]}
                    </div>
                </div>
            </div>

            <br></br>

            {props.comment.replyid == '' ? (
                replyComments.map((replyComment, dm) => {
                    return(
                        <>
                        <div key={dm}>
                            {replyComment.replyid == props.comment.cmid ? (
                                <>
                                    <ProductCardReplyComment replyComment={replyComment}/>
                                    <br></br>
                                </>
                                )
                            : null}
                        </div>
                        
                        </>
                    )
                })
            ) : ( <br></br> )}
        </div>
    )
}

export default ProductCardComment
