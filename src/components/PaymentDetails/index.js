import React, { useEffect, useState } from "react";
import "./style_PaymentDetails.scss"
import FormInput from "../forms/FormInput"
import Button from "../forms/Button"
import { firestore, auth } from "../../firebase/utils";
import { useHistory } from "react-router-dom";
import {collection, query, where, onSnapshot} from "firebase/firestore"

const PaymentDetails = (props) => {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [description, setDescription] = useState('')
    const [pmid, setPmid] = useState()
    const [carts, setCarts] = useState([])
    const [productData, setProductData] = useState([])
    const [msgerr, setMsgerr] = useState('')
    const [dmsg, setDmsg] = useState('notconfirm')
    const [err, setErr] = useState(false)
    const history = useHistory()
    var total = []
    var number = -1
    const userid = auth.currentUser.uid
    
    useEffect(() => {
        const q = query(collection(firestore, "cart"), where('uid', '==', userid));
        onSnapshot((q), (snapshot) =>{
            setCarts(snapshot.docs.map(doc => ({
                cid: doc.id, 
                pid: doc.data().pid, 
                quantity: doc.data().quantity, 
                size: doc.data().size
            })))
        })
    }, [])
    
    // useEffect(() => {
    //     loadcartdata()
    // }, [carts])

    console.log(carts)


    const loadcartdata2 = () => {
        carts.map((proQ) => {
            var newPid = proQ.pid
            firestore.collection('products').doc(newPid).onSnapshot(snapshot => {
                total= {productPrice: snapshot.data().productPrice, productName: snapshot.data().productName, productQuantity: snapshot.data().productQuantity}
                setProductData(productData => [...productData, total])
            })
        })
    }

    const loadcartdata = () => {
        carts.map((proQ) => {
            var newPid = proQ.pid
            firestore.collection('products').doc(newPid).get().then(snapshot => {
                total= {productPrice: snapshot.data().productPrice, productName: snapshot.data().productName, productQuantity: snapshot.data().productQuantity}
                console.log(proQ.quantity)
                if(total.productQuantity < proQ.quantity) {
                    alert('Sorry, but ' + total.productName + ' have only ' + total.productQuantity + ' left')
                    setErr(true)
                    return
                }
            })
        })
        loadcartdata2();
    }

    const checkQuantity = () => {
        loadcartdata();
        // carts.map((cart) => {
        //     number = number + 1
        //     if(productData[number].productQuantity < cart.quantity) {
        //         alert('Sorry, but ' + productData[number].productName + ' have only ' + productData[number].productQuantity + ' left')
        //         return
        //     }
        // })
    }
    
    useEffect(() => {
        carts.map((cart) => {
            // var number = -1;
            number = number + 1
            // if(productData[number].productQuantity < cart.quantity) {
            //     alert('Sorry, but ' + productData[number].productName + ' have only ' + productData[number].productQuantity + ' left')
            //     return
            // }
            if (err) return
            var quantityNumberleft = productData[number].productQuantity - cart.quantity;
            firestore.collection("paymentsproduct").add({
                pid: cart.pid,
                pmid: pmid,
                pname: productData[number].productName,
                price: productData[number].productPrice,
                psize: cart.size,
                quantity: cart.quantity       
            }).then(
                    firestore.collection("cart").doc(cart.cid).delete(),
                    (firestore.collection('products').doc(cart.pid).set({
                        productQuantity: quantityNumberleft
                    }, { merge: true })),
                    history.push("/dashboard")
                )
        })
    }, [pmid])
    
    const handleFormSubmit = async evt => {
        evt.preventDefault()
        const timestamp = new Date();
        if(name == '' || phone == '' || address == ''){
            setMsgerr("Besure your filled name, phone and address")
            return
        }
        checkQuantity()
        try{
            firestore.collection('payments').add({
                uid: userid,
                name: name,
                phone: phone,
                address: address,
                desc: description,
                stat: dmsg,
                timestamp: timestamp
            }).then(docRef => {
                setPmid(docRef.id)
            })
        }catch(err){
            setMsgerr("Plz filled your real number...")
            console.log(err)
        }
    }
    console.log(name)


    return(
        <div className="paymentDetails">
            <form onSubmit={handleFormSubmit}>
    
                <div className="group">
                    <h2>
                        Shipping Address
                    </h2>
                    
                    <div className="errMsg">
                        <span>{msgerr}</span>
                    </div>

                    <FormInput 
                        label="Name"
                        placeholder="Name"
                        type="text"
                        value={name}
                        handleChange={e => setName(e.target.value)}
                    />
                    
                    <FormInput 
                        label="Phone Number"
                        placeholder="Phone Number"
                        type="text"
                        minLength={9}
                        value={phone}
                        handleChange={e => setPhone(e.target.value.replace(/\D/,''))}
                    />
                    
                    <FormInput 
                        label="Address"
                        placeholder="Address"
                        type="text"
                        value={address}
                        handleChange={e => setAddress(e.target.value)}
                    />

                    <FormInput 
                        label="Description"
                        placeholder="Description"
                        type="text"
                        value={description}
                        handleChange={e => setDescription(e.target.value)}
                    />

                </div>


                <Button type="submit">Submit</Button>
            </form>
        </div>
    )
}  

export default PaymentDetails