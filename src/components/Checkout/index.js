import React, { useEffect, useState } from "react";
import "./style_Checkout.scss"
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { selectCartItems, selectCartTotal } from "../../redux/Cart/cart.selectors";
import { createStructuredSelector } from "reselect";
import Button from "../forms/Button";
import Item from "./Item";
import CartTotalPrice from "./CartTotalPrice";
import { auth, firestore } from "../../firebase/utils";
import {collection, query, where, orderBy, onSnapshot} from "firebase/firestore"
import { Link } from "react-router-dom";

const mapState = createStructuredSelector({
    cartItems: selectCartItems,
    total: selectCartTotal
})

const Checkout = ({}) => {
    const history = useHistory()
    const { cartItems, total } = useSelector(mapState)
    const [carts, setCarts] = useState([])
    const userid = auth.currentUser.uid
    const [totalPrice, setTotalPrice] = useState()

    const errMsg = "Cart is empty..."
    console.log(userid)

    useEffect(() => {
        
        const q = query(collection(firestore, "cart"), where('uid', '==', userid), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot((q), (snapshot) => { //snapshot mean every time database changed or something :v
            setCarts(snapshot.docs.map(doc => ({
                cid: doc.id, 
                pid: doc.data().pid, 
                quantity: doc.data().quantity, 
                size: doc.data().size,
                uid: doc.data().uid
              }))) //docs meaning to every single fucking thing u added into database
           })   
        
    }, []);

    const loadTotalPrice = (cart) => {
        firestore.collection('products').doc(cart.pid).get().then(snapshot => {
            
            setTotalPrice(totalPrice + cart.quantity * snapshot.data().productPrice)
                                
        })
    }
    console.log(carts)
    return(
        <div className="checkout">
            <h1>
                Checkout
            </h1>

            <div className="cart">
                {/* {cartItems.length > 0 ? ( */}
                {carts.length > 0 ? (
                <table border="0" cellPadding="0" cellSpacing="0">
                    <tbody>

                        <tr>
                            <table className="checkoutHeader" border="0" cellPadding="10" cellSpacing="0">
                                <tbody>
                                    <tr>
                                        <th>
                                            Product
                                        </th>
                                        <th>
                                            Description
                                        </th>
                                        <th>
                                            Quantity
                                        </th>
                                        <th>
                                            Price
                                        </th>
                                        <th>
                                            Remove
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </tr>

                        <tr>
                            <table border="0" cellPadding="0" cellSpacing="0">
                                {/* <tbody>
                                    {cartItems.map((item, pos) => {
                                        return (
                                            <tr key={pos}>
                                                <td>
                                                    <Item {...item} />
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody> */}
                                
                                <tbody>
                                    {carts.map((cart, pos) => {
                                        
                                        // firestore.collection('products').doc(cart.pid).get().then(snapshot => {
            
                                        //     setTotalPrice(totalPrice + cart.quantity * snapshot.data().productPrice)
                                
                                        // })
                                        // {loadTotalPrice(cart)}
                                        return (
                                            <tr key={pos}>
                                                <td>
                                                    <Item 
                                                        cart={cart}
                                                    />
                                                </td>
                                            </tr>
                                        )
                                        
                                    })}
                                </tbody>
                            </table>
                        </tr>

                        <tr>
                            <table align="right" border="0" cellSpacing="0" cellPadding="0">
                                <tr align="right">
                                    <td>
                                        {/* <h3>
                                            // Total: ${total}
                                        </h3> */}
                                        <CartTotalPrice />
                                        
                                    </td>
                                </tr>
                                <tr>
                                    <table border="0" cellPadding="10" cellSpacing="0">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <Button onClick={() => history.goBack()}>
                                                        Continue Shopping
                                                    </Button>
                                                </td>
                                                <td>
                                                    <Link className="linkButton" to="/payment">
                                                        <Button>
                                                            Checkout
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </tr>
                            </table>
                        </tr>

                    </tbody>
                </table>
                ) : (
                    <p>
                        {errMsg}
                    </p>
                )}
                {/* ) : (
                    <p>
                        {errMsg}
                    </p>
                )} */}
            </div>
        </div>
    )
}

export default Checkout