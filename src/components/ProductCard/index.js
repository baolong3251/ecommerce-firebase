import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductStart, setProduct } from "../../redux/Products/products.actions";
import { addProduct } from "../../redux/Cart/cart.actions";
import { firestore, auth } from "../../firebase/utils";
import {collection, query, where, orderBy, onSnapshot} from "firebase/firestore"
import FormSelect from "../forms/FormSelect";
import Button from "../forms/Button";
import "./style_ProductCard.scss"
import FormInput from "../forms/FormInput";
import ProductCardComment from "./ProductCardComment";

const mapState = state => ({
    product: state.productsData.product,
    currentUser: state.user.currentUser,
})

const ProductCard = ({}) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { productID } = useParams()
    const { currentUser } = useSelector(mapState);
    const { product } = useSelector(mapState)
    const [productSize, setProductSize] = useState('')
    const [productArraySize, setProductArraySize] = useState([])
    const [sizedemo, setSizeDemo] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [commentText, setCommentText] = useState('')
    const [comments, setComments] = useState([])
    // const [userName, setUserName] = useState('')

    const {
        productThumbnail,
        productName,
        productPrice,
        productQuantity,
        productDesc,
        arraysizes,
    } = product

    
    useEffect(() => {
        dispatch(
            fetchProductStart(productID)
        )

        const q = query(collection(firestore, "comments"), where("replyid", "==", ""),where("pid", "==", productID), orderBy('timestamp', 'desc'));
        onSnapshot(q, (snapshot) => {
            setComments(snapshot.docs.map(doc => ({
                cmid: doc.id, 
                pid: doc.data().pid, 
                comment: doc.data().comment, 
                uid: doc.data().uid,
                uname: doc.data().uname,
                replyid: doc.data().replyid,
                time: doc.data().timestamp
              })))
           })
        
        return () => {
            dispatch(
                setProduct({})
            )
        }
    }, [])

    // useEffect(() => {
    //     const userid = auth.currentUser.uid
    //     firestore.collection('users').doc(userid).onSnapshot(snapshot => {
    //         setUserName(snapshot.data().displayName)
    //     })
    // },[product])

    // console.log(userName)

    useEffect(() => {
        if(arraysizes){ 
            arraysizes.map((arraysize) => {
                if(productSize == ''){
                    setProductSize(arraysizes[0])
                }
                addSize(arraysize)      
                console.log(arraysize)    
        })}
        console.log(productSize)
    }, [arraysizes])

    const addSize = (arraysize) => {
        setProductArraySize(productArraySize => [...productArraySize, {value: arraysize, name: arraysize}])
    }


    
    // console.log(arraysizes.map)

    const handleAddToCart2 = (product) => {
        if(!product) return
        if(quantity > productQuantity) {
            alert('Sorry, but we only have ' + productQuantity + ' of them')
            return
        }
        if(quantity <= 0) {
            alert('Sorry, but plz choose your actual quantity')
            return
        }
        const userid = auth.currentUser.uid
        const timestamp = new Date();
        try{
        firestore.collection('cart').add({
            uid: userid,
            pid: productID,
            quantity: quantity,
            size: productSize,
            timestamp: timestamp
          })
          alert("Success")
        }catch(err){
            console.log(err)
        }
    }

    // console.log(auth.currentUser.displayName)

    const handleAddComment = (e) => {
        e.preventDefault();
        if(commentText == '') return
        const userid = auth.currentUser.uid
        const userName = auth.currentUser.displayName
        const timestamp = new Date();
        if(userName == null){
            
            firestore.collection('users').doc(userid).onSnapshot(snapshot => {
               var userName2 = snapshot.data().displayName

               try{
                firestore.collection('comments').add({
                    uid: userid,
                    uname: userName2,
                    pid: productID,
                    comment: commentText,
                    replyid: '',
                    timestamp: timestamp
                })
                setCommentText('')
            }catch(err){
                console.log(err)
            }
            })
        }else{
        
            try{
                firestore.collection('comments').add({
                    uid: userid,
                    uname: userName,
                    pid: productID,
                    comment: commentText,
                    replyid: '',
                    timestamp: timestamp
                })
                setCommentText('')
            }catch(err){
                console.log(err)
            }
        }
    }



    const handleAddToCart = (product) => {
        if(!product) return;
        dispatch(
            addProduct(product)
        )
        history.push('/cart')
    }

    const configAddToCartBtn = {
        type: 'button',

    }
    
    return (
        <>
        <div className="productCard">
            <div className="hero">
                <img src={[productThumbnail]} />
            </div>
            <div className="productDetails">
                <ul>
                    <li className="card">
                        <i>
                            <h1>
                                {productName}
                            </h1>
                        </i>
                        
                    </li>
                    <hr/>
                    <li>
                            <FormSelect 
                                label="Size:"
                                options={productArraySize}
                                handleChange={e => setProductSize(e.target.value)}
                            />
                    </li>
                    <li>
                        <div className="quantity">
                            <div className="quantity-number">
                            {productQuantity == 0 
                                ?   <FormInput 
                                        label="Quantity:"
                                        type="number" 
                                        min="1"
                                        max={productQuantity}
                                        step="1"
                                        onKeyDown="return false"
                                        value="0"   
                                    /> 
                                :   <FormInput 
                                        label="Quantity:"
                                        type="number" 
                                        min="1"
                                        max={productQuantity}
                                        step="1"
                                        onKeyDown="return false"
                                        value={quantity}
                                        handleChange={e => setQuantity(e.target.value)}
                                    />
                            }
                            </div>

                            <div className="quantity-left">
                                Total product in shop {productQuantity}
                            </div>
                        </div>
                    </li>
                    <li>
                        <span>
                            Price: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(productPrice)}
                        </span>
                    </li>
                    {currentUser && [
                        <li>
                            <div className="addToCart">
                                {/* <Button {...configAddToCartBtn} onClick={() => handleAddToCart(product)}>
                                    Add to Cart
                                </Button> */}
                                <Button {...configAddToCartBtn} onClick={() => handleAddToCart2(productID)}>
                                    Add to Cart
                                </Button>
                            </div>
                        </li>
                    ]}
                    {!currentUser && [
                        <>
                        <br></br>
                        <li>
                            
                            Want to buy it? Then&nbsp;<Link to={'/login'}>login</Link>.
                            
                        </li>
                        </>
                    ]}
                    <li>
                    <hr/>
                        <h3>Desc: </h3>
                        <span 
                            dangerouslySetInnerHTML={{ __html: productDesc}} 
                        />
                    </li>
                </ul>
            </div>
        </div>
        <hr/>
        <br></br>
        {/* =============================THIS IS THE COMMENT REGION======================== */}
        
        {currentUser && [
        <form className="comment" onSubmit={handleAddComment}>
            <h1>
                Comments: 
            </h1>
            <div className="comment-form">
                <div className="text">
                    <FormInput 
                        className="text-child"
                        type="text"
                        placeholder="Type Comment..."
                        value={commentText}
                        handleChange={e => setCommentText(e.target.value)}
                    />
                </div>
                <div className="button">
                    <Button type="submit">Comment</Button>
                </div>
            </div>
        </form>
        ]}

        {!currentUser && [
        <div className="comment">
            <h1>
                Comments: 
            </h1>
            <div className="comment-form">
                Want to comment? Then&nbsp;<Link to={'/login'}>login</Link>.
            </div>
        </div>
        ]}
        <br></br>
        {comments.map((comment, pos) => {
            return(
                <div key={pos}>
                    <ProductCardComment comment={comment}/>
                </div>
            )
            })
            
        }
        </>
    )
}

export default ProductCard