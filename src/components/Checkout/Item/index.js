import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { removeCartItem, addProduct, reduceCartItem } from '../../../redux/Cart/cart.actions';
import { handleReduceCartItem } from '../../../redux/Cart/cart.utils';
import { firestore, auth } from '../../../firebase/utils';
import {collection, query, where, onSnapshot, doc, getDoc} from "firebase/firestore"

const mapState = (state) => ({ //this thing can happen if use redux
    currentUser: state.user.currentUser,
    
})

const Item = (props, product) => {
    const dispatch = useDispatch()
    const { currentUser } = useSelector(mapState);
    const [cartProductName, setCartProductName] = useState()
    const [cartProductThumbnail, setCartProductThumbnail] = useState()
    const [cartProductPrice, setCartProductPrice] = useState()
    const [cartProductQuantity, setCartProductQuantity] = useState()
    const [cartQuantity, setCartQuantity] = useState(props.cart.quantity)
    const userid = auth.currentUser.uid
    const [items, setItems] = useState([])
    const {
        productName,
        productThumbnail,
        productPrice,
        quantity,
        documentID
    } = product;
    
    useEffect(() => {
        const q = query();
        if(props.cart)
        firestore.collection('products').doc(props.cart.pid).onSnapshot((doc) => { //snapshot mean every time database changed or something :v
            
            setCartProductThumbnail(doc.data().productThumbnail)
            setCartProductName(doc.data().productName)
            setCartProductPrice(doc.data().productPrice)
            setCartProductQuantity(doc.data().productQuantity)
               //docs meaning to every single fucking thing u added into database
           })
        //  handleLoadCart()
    }, [props.cart.pid])
    
    const handleLoadCart = () => {
        const userid = auth.currentUser.uid
        if(props.cart.uid == userid)
        firestore.collection('products').doc(props.cart.pid).get().then(snapshot => {
            
            setCartProductThumbnail(snapshot.data().productThumbnail)
            setCartProductName(snapshot.data().productName)
            setCartProductPrice(snapshot.data().productPrice)

        })
    }

    const handleRemoveCartItem = (documentID) => {
        dispatch(
            removeCartItem({
                documentID
            })
        )
    }

    const handleReduceProductItem = () => {    
        const reductedItem = props.cart.quantity - 1
        firestore.collection('cart').doc(props.cart.cid).set({
            quantity: reductedItem
        }, { merge: true });
        setCartQuantity(reductedItem)
    }

    const handleAddProductItem = () => {
        const addedItem = props.cart.quantity + 1
        firestore.collection('cart').doc(props.cart.cid).set({
            quantity: addedItem
        }, { merge: true });
        setCartQuantity(addedItem)
    }

    const handleAddProduct = (product) => {
        dispatch(
            addProduct(product)
        )
    }

    const handleReduceItem = (product) => {
        dispatch(
            reduceCartItem(product)
        )
    }

    return (
        <table className="cartItem" border="0" cellSpacing="10" cellPadding="0">
            <tbody>
                <tr>
                    <td className="ci-thumb">
                        {/* <img src={productThumbnail} alt={productName}/> */}
                        <img src={cartProductThumbnail}/>
                    </td>
                    <td>
                        {/* {productName} */}
                        {cartProductName}
                    </td>
                    <td>
                        {/* <span className="cartBtn"
                            onClick={() => handleReduceItem(product)}>
                            {`< `}
                        </span> */}
                        <span className="cartBtn"
                            onClick={event => cartQuantity > 1 ? handleReduceProductItem() : firestore.collection('cart').doc(props.cart.cid).delete()}>
                            {`< `}
                        </span>
                        <span>
                            {/* {quantity} */}
                            {cartQuantity}
                        </span>
                        {/* <span className="cartBtn" 
                            onClick={() => handleAddProduct(product)}>
                            {` >`}
                        </span> */}
                        <span className="cartBtn" 
                            onClick={() => cartQuantity >= cartProductQuantity 
                                ? alert('Sorry, but we only have ' + cartProductQuantity + ' of them') 
                                : handleAddProductItem()}
                        >
                            {` >`}
                        </span>
                    </td>
                    <td>
                        {/* ${productPrice} */}
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(props.cart.quantity * cartProductPrice)}
                    </td>
                    <td align="center">
                        {/* <span className="cartBtn" onClick={() => handleRemoveCartItem(documentID)}>
                            X
                        </span> */}
                        <span className="cartBtn" onClick={() => firestore.collection('cart').doc(props.cart.cid).delete()}>
                            X
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default Item
