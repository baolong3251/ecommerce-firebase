import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Button from "../../forms/Button"
import { useDispatch, useSelector } from 'react-redux'
import { addProduct } from '../../../redux/Cart/cart.actions'
import { firestore, auth } from '../../../firebase/utils'


const Product = (product, productid) => {
    const dispatch = useDispatch()
    const [quantity, setQuantity] = useState(1)
    const history = useHistory()
    const {
        documentID,
        productThumbnail, 
        productName, 
        productPrice,
    } = product

    if (!documentID || !productThumbnail || !productName || 
        typeof productPrice === 'undefined') return null

    const configAddToCartBtn = {
        type: 'button'
    }

    const handleAddToCart2 = (product) => {
        if(!product) return
        const userid = auth.currentUser.uid
        const timestamp = new Date();
        try{
        firestore.collection('cart').add({
            uid: userid,
            pid: documentID,
            quantity: quantity,
            timestamp: timestamp
          })
          alert("Success")
        }catch(err){
            console.log(err)
        }
    }

    const handleAddToCart = (product) => {
        if (!product) return;
        dispatch(
            addProduct(product)
        )
        history.push('/cart')
    }

    return(
        <div className="product">

            <Link to={`/product/${documentID}`}>
                <div className="thumb">       
                    <img src={productThumbnail} alt={productName} />    
                </div>
            </Link>

            <div className="details">
                <ul>
                    <li>
                        <span className="name">
                            <Link to={`/product/${documentID}`}>
                                {productName}
                            </Link>
                        </span>
                    </li>
                    <li>
                        <span className="price">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(productPrice)}
                        </span>
                    </li>
                    <li>
                        <div className="addToCart">
                            {/* <Button {...configAddToCartBtn} onClick={() => handleAddToCart(product)}>
                                Add to cart
                            </Button> */}
                            {/* <Button  onClick={() => handleAddToCart2(productid)}>
                                Add to cart
                            </Button> */}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Product
