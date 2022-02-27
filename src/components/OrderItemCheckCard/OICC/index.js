import React from 'react'

function OICC(props) {
    return (
        <div>
            <table className="orderItem" border="0" cellSpacing="10" cellPadding="0">
                <tbody>
                    <tr>
                        <td>
                            {props.orderItem.pname}
                        </td>
                        <td>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(props.orderItem.price)}
                        </td>
                        <td>
                            {props.orderItem.psize}
                        </td>
                        <td>
                            {props.orderItem.quantity}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default OICC
