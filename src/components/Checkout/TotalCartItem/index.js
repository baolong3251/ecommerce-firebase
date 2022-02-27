import React, {useEffect, useState} from 'react'
import { firestore, auth } from '../../../firebase/utils';
import {collection, query, where, orderBy, onSnapshot} from "firebase/firestore"

const TotalCartItem = () => {
    const [carts, setCarts] = useState([])
    useEffect(() => {
        const userid = auth.currentUser.uid
        const q = query(collection(firestore, "cart"), where('uid', '==', userid));
        const unsubscribe = onSnapshot(q, (snapshot) => { //snapshot mean every time database changed or something :v
            setCarts(snapshot.docs.map(doc => ({
                cid: doc.id
              }))) //docs meaning to every single fucking thing u added into database
           })
    }, [])

    return(
        <span>{carts.length}</span>
    )
}

export default TotalCartItem
