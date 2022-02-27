import React, { useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { auth, firestore } from '../../../../firebase/utils'
import {collection, query, where, orderBy, onSnapshot, doc} from "firebase/firestore"
import Modal_sup_2 from '../../../Modal_sup_2'
import Modal_sup from '../../../Modal_sup'
import Button from '../../../forms/Button'
import FormInput from '../../../forms/FormInput'

const mapState = (state) => ({ //this thing can happen if use redux
    currentUser: state.user.currentUser,
})

function ProductCardReplyComment(props) {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(mapState);

    const [editInput, setEditInput] = useState(props.replyComment.comment)
    const [replyinput, setReplyInput] = useState('')
    const [hideModal2, setHideModal2] = useState(true)
    const [hideModal3, setHideModal3]= useState(true)

    const toggleModal2 = () => setHideModal2(!hideModal2);
    const toggleModal3 = () => setHideModal3(!hideModal3);

    const configModal2 = {
        hideModal2,
        toggleModal2
    }

    const configModal3 = {
        hideModal3,
        toggleModal3
    }

    const addReplyComment = () => {
        if(replyinput == '') return
        const userid = auth.currentUser.uid
        const userName = auth.currentUser.displayName
        const timestamp = new Date();
        //update the todo with the new input text
        try{
            firestore.collection('comments').add({
                uid: userid,
                uname: userName,
                pid: props.replyComment.pid,
                comment: replyinput,
                replyid: props.replyComment.replyid,
                timestamp: timestamp
            })
            setHideModal2(true)
            setReplyInput('')
        }catch(err){
            console.log(err)
        }
    }

    const updateReplyComment = () => {
        if(editInput == '') return;
        //update the todo with the new input text
        firestore.collection('comments').doc(props.replyComment.cmid).set({
            comment: editInput
        }, { merge: true });
        setHideModal3(true)
    }

    return (
        <div className="wrap-2 re-comment">
            <Modal_sup {...configModal2}>
                
                {/* <Input value={input} onChange={event => setInput(event.target.value)} /> */}
                <FormInput className="paper" value={replyinput} onChange={event => setReplyInput(event.target.value)}  />
                <Button onClick={() => addReplyComment()}>Confirm</Button>
               
            </Modal_sup>

            <Modal_sup_2 {...configModal3}>

                {/* <Input value={input} onChange={event => setInput(event.target.value)} /> */}
                <FormInput className="paper" value={editInput} onChange={event => setEditInput(event.target.value)}  />
                <Button onClick={() => updateReplyComment()}>Confirm</Button>
            
            </Modal_sup_2>
            <div className="comment">
                <h3>{props.replyComment.uname}</h3>
                <div className="comment-text">
                    {props.replyComment.comment}
                </div>
                <div className="comment-button">
                    {currentUser && [
                        <div className="comment-button-item" onClick={() => toggleModal2()}>Reply</div>
                    ]}
                    {currentUser && props.replyComment.uid == currentUser.id && [
                        <div className="comment-button-item" onClick={() => toggleModal3()}>Edit</div>,
                        <div className="comment-button-item" onClick={
                            event => firestore.collection('comments').doc(props.replyComment.cmid).delete()
                        }>Delete</div>
                    ]}
                    {/* <div className="comment-button-item" onClick={() => toggleModal3()}>Edit</div>
                    <div className="comment-button-item" onClick={event => firestore.collection('comments').doc(props.replyComment.cmid).delete()}>Delete</div> */}
                </div>
            </div>
        </div>
    )
}

export default ProductCardReplyComment
