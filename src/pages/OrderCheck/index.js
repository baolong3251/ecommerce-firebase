import React, { useEffect, useState } from 'react'
import "./style_OrderCheck.scss"
import { firestore } from "../../firebase/utils";
import {collection, query, where, orderBy, onSnapshot} from "firebase/firestore"
import OrderItemCheck from './OrderItemCheck';

function OrderCheck() {
    const [payments, setPayments] = useState([])

    useEffect(() => {
        const q = query(collection(firestore, "payments"), where("stat", "!=", "delivered"), orderBy("stat", "desc"), orderBy("timestamp", "desc"));
        onSnapshot(q, (snapshot) => {
            setPayments(snapshot.docs.map(doc => ({
                pmid: doc.id, 
                name: doc.data().name, 
                phone: doc.data().phone, 
                address: doc.data().address,
                desc: doc.data().desc,
                stat: doc.data().stat,
                time: doc.data().timestamp
              })))
           })
    }, [])

    return (
        <div className="orderCheck">
            <div className="info">
                <h1>
                    Order history
                </h1>
                <div>
                    <span className="info-confirm">000</span>
                    <span>: Confirmed</span>
                </div>
            </div>
            

            <div className="order">
                <table border="0" cellPadding="0" cellSpacing="0">
                    <tbody>

                        <tr>
                            <table className="orderHeader" border="0" cellPadding="10" cellSpacing="0">
                                <tbody>
                                    <tr>
                                        <th>
                                            Payment ID
                                        </th>
                                        <th>
                                            Name
                                        </th>
                                        <th>
                                            Phone
                                        </th>
                                        <th>
                                            Address
                                        </th>
                                        <th>
                                            Desc
                                        </th>
                                        <th>
                                            Time
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </tr>

                        <tr>
                            <table border="0" cellPadding="0" cellSpacing="0">
                                <tbody>
                                    {payments.map((payment, pos) => {
                                        
                                        return (
                                            <tr key={pos}>
                                                <td>
                                                    <OrderItemCheck payment={payment} />
                                                </td>
                                            </tr>
                                        )}
                                        
                                    )}
                                </tbody>
                            </table>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrderCheck
