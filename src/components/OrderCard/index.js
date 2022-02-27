import React, { useEffect, useState } from 'react'
import { useParams, useHistory, Link } from "react-router-dom";
import { firestore } from '../../firebase/utils';
import {collection, query, where, orderBy, onSnapshot} from "firebase/firestore"
import OrderItem from './OrderItem';
import "./style_OrderCard.scss"
import Button from '../forms/Button';

function OrderCard() {
    const { paymentID } = useParams()
    const history = useHistory()
    const [msgd, setMsgd] = useState('delivered')
    const [stat, setStat] = useState()
    const [orderItems, setOrderItems] = useState([])
    useEffect(() => {
        const q = query(collection(firestore, "paymentsproduct"), where('pmid', '==', paymentID));
        onSnapshot(q, (snapshot) => { //snapshot mean every time database changed or something :v
            setOrderItems(snapshot.docs.map(doc => ({
                ppid: doc.id, 
                pid: doc.data().pid, 
                pname: doc.data().pname, 
                price: doc.data().price,
                psize: doc.data().psize,
                quantity: doc.data().quantity
              }))) //docs meaning to every single fucking thing u added into database
           })
    }, [])

    useEffect(() => {
        if (paymentID)
        firestore.collection('payments').doc(paymentID).get().then((doc) => {
            setStat(doc.data().stat)
        })
    },[orderItems])

    const handleDelivered = () => {
        firestore.collection('payments').doc(paymentID).set({
            stat: msgd
        }, { merge: true });
        history.goBack()
    }

    const handleDelete = () => {
        var payment_product = firestore.collection('paymentsproduct').where('pmid','==',paymentID);
        payment_product.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.delete();
            });
        }).then(
            firestore.collection('payments').doc(paymentID).delete()
        )
        history.push('/dashboard')
    }

    return (
        <div className="orderCard">
            <h1>Order Details</h1>

            <div className="order">
                <table border="0" cellPadding="0" cellSpacing="0">
                    <tbody>

                        <tr>
                            <table className="orderHeader" border="0" cellPadding="10" cellSpacing="0">
                                <tbody>
                                    <tr>
                                        <th>
                                            Name
                                        </th>
                                        <th>
                                            Price
                                        </th>
                                        <th>
                                            Size
                                        </th>
                                        <th>
                                            Quantity
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </tr>

                        <tr>
                            <table border="0" cellPadding="0" cellSpacing="0">
                                <tbody>
                                    {orderItems.map((orderItem, pos) => {
                                        
                                        return (
                                            <tr key={pos}>
                                                <td>
                                                    <OrderItem orderItem={orderItem} />
                                                </td>
                                            </tr>
                                        )}
                                        
                                    )}
                                </tbody>
                            </table>
                        </tr>

                        <tr>
                            <table align="right" border="0" cellSpacing="0" cellPadding="0">
                                <tr>
                                    <table border="0" cellPadding="10" cellSpacing="0">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <Button onClick={() => history.goBack()}>
                                                        Go Back
                                                    </Button>
                                                </td>
                                                <td>
                                                    {stat == 'notconfirm' ? (
                                                        <div className="msg">
                                                            Waiting for admin confirmed
                                                        </div>
                                                    ) : stat == "delivered" ? (
                                                        <Button onClick={() => handleDelete()}>
                                                            Delete
                                                        </Button>
                                                    ) : (
                                                        <Button onClick={() => handleDelivered()}>
                                                            Delivered
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </tr>
                            </table>
                        </tr>


                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrderCard
