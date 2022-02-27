import React, { useEffect, useState } from "react";
import "./style_OrderHistory.scss"
import { auth, firestore } from "../../firebase/utils";
import {collection, query, where, orderBy, onSnapshot} from "firebase/firestore"
import Order from "./Order";

const OrderHistory = ({}) => {
    const userid = auth.currentUser.uid
    const [payments, setPayments] = useState([])

    useEffect(() => {
        
        const q = query(collection(firestore, "payments"), where('uid', '==', userid), orderBy('timestamp', 'desc'));
        onSnapshot(q, (snapshot) => { //snapshot mean every time database changed or something :v
            setPayments(snapshot.docs.map(doc => ({
                pmid: doc.id, 
                name: doc.data().name, 
                phone: doc.data().phone, 
                address: doc.data().address,
                desc: doc.data().desc,
                stat: doc.data().stat,
                time: doc.data().timestamp
              }))) //docs meaning to every single fucking thing u added into database
           })
           
    }, [])
    

    return(
        <div className="orderHistory">
            <h1>
                Order history
            </h1>

            <div className="info">
                <span className="info-delivered">000</span>
                <span>: Delivered</span>
                <span className="info-confirmed">000</span>
                <span>: Confirmed</span>
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
                                                    <Order payment={payment} />
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

export default OrderHistory