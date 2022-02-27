import React, {useState, useEffect} from 'react'
import "./style_Delivered.scss"
import { firestore } from "../../firebase/utils";
import {collection, query, where, orderBy, onSnapshot} from "firebase/firestore"
import DeliveredItem from './DeliveredItem';

function Delivered() {
    const [payments, setPayments] = useState([])

    useEffect(() => {
        const q = query(collection(firestore, "payments"), where("stat", "==", "delivered"), orderBy("timestamp", "desc"));
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
        <div className="delivered">
            <h1>
                Delivered
            </h1>
            

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
                                                    <DeliveredItem payment={payment} />
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

export default Delivered
