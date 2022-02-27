import React, { useEffect, useState } from 'react'
import Button from '../../../components/forms/Button';
import FormInput from '../../../components/forms/FormInput';
import { firestore } from '../../../firebase/utils';

function AdminProductQuantity(props) {
    const [quantity, setQuantity] = useState(props.quantity)
    const [statQuantity, setStatQuantity] = useState(false)
    const [tempQuantity, setTempQuantity] = useState(quantity)

    useEffect(() => {
        firestore.collection('products').doc(props.pid).onSnapshot((snapshot) => {
            setQuantity(snapshot.data().productQuantity) 
           })
    }, [])

    useEffect(() => {
        setTempQuantity(quantity)
    }, [quantity])

    const handleReduceQuantity = () => {    
        const reductedQuantity = quantity - 1
        firestore.collection('products').doc(props.pid).set({
            productQuantity: reductedQuantity
        }, { merge: true });
    }

    const handleIncreaseQuantity = () => {
        var increasedQuantity = 0
        increasedQuantity = 1 + parseInt(quantity) 
        firestore.collection('products').doc(props.pid).set({
            productQuantity: increasedQuantity
        }, { merge: true });
    }

    const handleUpdate = (e) => {
        e.preventDefault()
        if (tempQuantity <= 0){ 
            alert('plz add 1 or more than 1'); 
            return
        }
        firestore.collection('products').doc(props.pid).set({
            productQuantity: tempQuantity
        }, { merge: true });
        setStatQuantity(false)
    }

    return (
        <div>
            
            {statQuantity ? (
                <>  
                    <div className="container-editQuantity">
                        <form onSubmit={e => handleUpdate(e)}>
                            <FormInput 
                                type="number"
                                min="1"
                                step="1"
                                value={tempQuantity} 
                                onChange={event => setTempQuantity(event.target.value)} 
                            />
                            <div className = "wrap-editQuantity">
                                <Button className="btn" type="submit">+</Button>
                                <Button className="btn" onClick = {() => setStatQuantity(false)}>x</Button>
                            </div>
                        </form>
                    </div>
                </>
            ) : (
                <>
                    <span className="customBtn" onClick={() => quantity <= 0 ? null : handleReduceQuantity()}>
                        {`< `}
                    </span>
                    <span className="customBtn" onClick = {() => setStatQuantity(true)}>
                        {quantity}
                    </span>
                    <span className="customBtn" onClick={() => handleIncreaseQuantity()}>
                        {` >`}
                    </span>
                </>
            )}
        </div>
    )
}

export default AdminProductQuantity
