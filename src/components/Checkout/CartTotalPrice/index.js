import React, {useEffect, useState} from 'react'
import { firestore, auth } from '../../../firebase/utils';
import {collection, query, where, onSnapshot} from "firebase/firestore"

const CartTotalPrice = () => {
    const [proQuantity, setProQuantity] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    var total = 0
    const userid = auth.currentUser.uid
    useEffect(() => {
        const q = query(collection(firestore, "cart"), where('uid', '==', userid));
        onSnapshot(q, (snapshot) => {
            setProQuantity(snapshot.docs.map(doc => ({
                cid: doc.id, 
                pid: doc.data().pid, 
                quantity: doc.data().quantity, 
                uid: doc.data().uid
            })))                   
        })

    }, [])

    useEffect(() => {
        proQuantity.map((proQ) => {
            var newPid = proQ.pid
            firestore.collection('products').doc(newPid).get().then(snapshot => {

                total = total + proQ.quantity * snapshot.data().productPrice
                setTotalPrice(total)

            })
        })
    }, [proQuantity])
    
    return(
        <h3>
            Total: {proQuantity.length == 0 ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(0) : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
        </h3>
    )
}

export default CartTotalPrice
