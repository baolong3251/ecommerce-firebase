import moment from 'moment'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function DeliveredItem(props) {
    const [stat, setStat] = useState(props.payment.stat)
    return (
        <div>
            <table className="orderItem" border="0" cellSpacing="10" cellPadding="0">
                <Link className="orderItem-item" to={`/ordercheck/${props.payment.pmid}`}>
                    <tbody>
                        <tr>
                            <td> 
                                {props.payment.pmid}
                            </td>
                            <td>
                                {props.payment.name}
                            </td>
                            <td>
                                {props.payment.phone}
                            </td>
                            <td>
                                {props.payment.address}
                            </td>
                            <td>
                                {props.payment.desc}
                            </td>
                            <td>
                                {moment(props.payment.time.toDate()).calendar()}
                            </td>
                        </tr>
                    </tbody>
                </Link>
            </table>
        </div>
    )
}

export default DeliveredItem
