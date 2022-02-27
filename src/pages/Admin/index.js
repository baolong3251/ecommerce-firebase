import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux"
import { addProductStart, fetchProductsStart, deleteProductStart } from "../../redux/Products/products.actions";
import Modal from "../../components/Modal"
import FormInput from "../../components/forms/FormInput"
import FormSelect from "../../components/forms/FormSelect"
import Button from "../../components/forms/Button"
import LoadMore from "../../components/LoadMore"
import {CKEditor} from "ckeditor4-react"
import { storage } from "../../firebase/utils";
import "./style_Admin.scss"
import AdminProductQuantity from "./AdminProductQuantity";

const mapState = ({ productsData }) => ({
    products: productsData.products
})

const Admin = props => {
    const { products } = useSelector(mapState)
    const dispatch = useDispatch()
    // const [loading, setLoading] = useState(false);
    const [hideModal, setHideModal] = useState(true)
    const [productCategory, setProductCategory] = useState('mens')
    const [productName, setProductName] = useState('')
    const [productThumbnail, setProductThumbnail] = useState('')
    const [productPrice, setProductPrice] = useState(0)
    const [productQuantity, setProductQuantity] = useState(1)
    const [productDesc, setProductDesc] = useState('')
    const [sizeText, setSizeText] = useState('')
    const [arraysizes, setArraySizes] = useState([])
    // const [confirm, setConfirm] = useState()
    const [errMsg, setErrMsg] = useState('Plz write name, choose Thumbnail and write the price')

    const [images, setImages] = useState([]);
    const [urls, setUrls] = useState([]);
    const [progress, setProgress] = useState(0);

    const { data, queryDoc, isLastPage } = products

    useEffect(() => {
        dispatch(
            fetchProductsStart()
        );
        
        
    }, []);

    const toggleModal = () => setHideModal(!hideModal);

    const configModal = {
        hideModal,
        toggleModal
    }

    const resetForm = () => {
        setHideModal(true)
        setProductCategory('mens');
        setProductName('');
        setProductThumbnail('');
        setProductPrice(0);
        setProductQuantity(1);
        setProductDesc('');
        setArraySizes([]);
        setSizeText('')
    }

    const handleChange = (e) => {
        for (let i = 0; i < e.target.files.length; i++) {
        const newImage = e.target.files[i];
        newImage["id"] = Math.random();
        setProductThumbnail(newImage)
        setImages((prevState) => [...prevState, newImage])
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(productName == '' || productThumbnail == '' || productPrice == '') alert(errMsg)
        else{
            
        const promises = [];
        images.map((image) => {
            const uploadTask = storage.ref(`images/${image.name}`).put(image);
            promises.push(uploadTask);
            uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
            },
            async () => {
                await storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then((urls) => {
                    // setUrls((prevState) => [...prevState, urls]);
                    // setProductThumbnail(urls)
                    // console.log(urls)
                    // console.log(productThumbnail)
                    var productThumbnail = urls
                    dispatch(
                        addProductStart({
                            productCategory,
                            productName,
                            productThumbnail,
                            productPrice,
                            productQuantity,
                            productDesc,
                            arraysizes,
                        })
                    )
                });
            }
            );
        });
        
        Promise.all(promises)
            .then(() => 
            
        console.log("images: ", productThumbnail),
        console.log("urls", urls),
        resetForm()

        ).catch((err) => console.log(err));

        }
    }

    // console.log("images: ", productThumbnail);
    // console.log("urls", urls);

    // useEffect(() => {
    //     dispatch(
    //         addProductStart({
    //             productCategory,
    //             productName,
    //             // productThumbnail,
    //             productThumbnail,
    //             productPrice,
    //             productDesc,
    //             arraysizes,
    //         })
    //     )

    //     resetForm()
    // }, [urls])

    const handleAddSize = () => {
        setArraySizes([...arraysizes, sizeText])
        setSizeText('')
    }

    const handleLoadMore = () => {
        dispatch(
            fetchProductsStart({
                startAfterDoc: queryDoc,
                persistProducts: data
            })
        );
    }

    const configLoadMore = {
        onLoadMoreEvt: handleLoadMore,
    }
    
    return(
        <div className="admin">

            <div className="callToActions_Admin">
                <ul>
                    <li>
                        <Button onClick={() => toggleModal()}>
                            Add new product
                        </Button>
                    </li>
                </ul>
            </div>
            

            <Modal {...configModal}>
                <div className="addNewProductForm">
                    <form onSubmit={handleSubmit}>
                        <h2>
                            Add new product
                        </h2>

                        <div className="something-for-size">
                            <FormSelect 
                                label="Category"
                                options={[{
                                    value: "mens",
                                    name: "Mens"
                                }, {
                                    value: "womens",
                                    name: "Womens"
                                }]}
                                handleChange={e => setProductCategory(e.target.value)}
                            />
                                                   
                            <div className="current-size"> 
                                <div className="current-size-text">Current Size</div>
                                <div className="wrap-size">
                                    <div className="current-size-clear" onClick={() => setArraySizes([])}>clear</div>
                                    <select>
                                    {
                                        arraysizes.map((arraysize) => {
                                            return(
                                            <option selected>
                                                {arraysize}
                                            </option>
                                            
                                            )
                                        })
                                    }
                                    </select>
                                </div>
                            </div>

                            <FormInput 
                                label="Size"
                                type="Text"
                                placeholder="Type size"
                                value={sizeText}
                                handleChange={e => setSizeText(e.target.value)}
                            />
                            <div className="plus-button">
                                <span onClick={() => handleAddSize()}>+</span>
                            </div>
                        </div>

                        <FormInput 
                            label="Name"
                            type="Text"
                            value={productName}
                            handleChange={e => setProductName(e.target.value)}
                        />

                        {/* <FormInput 
                            label="Main image URL"
                            type="url"
                            value={productThumbnail}
                            handleChange={e => setProductThumbnail(e.target.value)}
                        /> */}

                        <FormInput 
                            label="Main image URL"
                            type="file"
                            multiple 
                            onChange={handleChange}
                        />

                        <FormInput 
                            label="Quantity"
                            type="number"
                            min="1"
                            max="5000"
                            step="1"
                            value={productQuantity}
                            handleChange={e => setProductQuantity(e.target.value)}
                        />
                        
                        <FormInput 
                            label="Price"
                            type="number"
                            min="0"
                            max="100000000"
                            step="500"
                            value={productPrice}
                            handleChange={e => setProductPrice(e.target.value)}
                        />

                        <div className="price">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(productPrice)}
                        </div>

                        <CKEditor 
                            onChange={evt => setProductDesc(evt.editor.getData())}
                        />

                        <br />

                        <Button type="submit">
                            Add product
                        </Button>
                    </form>
                </div>
            </Modal>

            <div className="manageProducts">
                
                <table border="0" cellPadding="0" cellSpacing="0">
                    <tbody>
                        <tr>
                            <th>
                                <h1>
                                    Manage Products
                                </h1>
                            </th>
                        </tr>
                        <tr>
                            <td>
                                <table className="results" border="0" cellPadding="10" cellSpacing="0">
                                    <tbody>
                                        {(Array.isArray(data) && data.length > 0) && data.map((product, index) => {
                                            const {
                                                productName,
                                                productThumbnail,
                                                productPrice,
                                                documentID,
                                                productQuantity,
                                            } = product;

                                            return(
                                                <tr key={index}>
                                                    {/* <td>
                                                        <div className="td-pro">
                                                            <div className="td-img2"> <img className="thumb2" src={productThumbnail} /></div>
                                                            <div className="td-info">{productName} ${productPrice}</div>
                                                        </div>
                                                    </td> */}
                                                    <td className="td-img">
                                                        <img className="thumb" src={productThumbnail} />
                                                    </td>
                                                    <td>
                                                        {productName}
                                                    </td>
                                                    <td>
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(productPrice)}
                                                    </td>
                                                    <td>
                                                        <Button onClick={() => dispatch(deleteProductStart(documentID))}> 
                                                            Delete
                                                        </Button>
                                                    </td>
                                                    <td>
                                                        <AdminProductQuantity pid = {documentID} quantity = {productQuantity} />
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>

                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table border="0" cellPadding="10" cellSpacing="0">
                                    <tbody>
                                        <tr>
                                            <td>
                                                {!isLastPage && (
                                                    <LoadMore {...configLoadMore}/>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default Admin