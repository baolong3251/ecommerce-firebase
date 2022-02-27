import React, {useEffect} from 'react'
import { useSelector, useDispatch } from "react-redux"
import { signOutUserStart } from '../../redux/User/user.action'
import { selectCartItemsCount } from '../../redux/Cart/cart.selectors'
import TotalCartItem from '../Checkout/TotalCartItem'
import './style_Header.scss'
import { Link } from "react-router-dom"

const mapState = (state) => ({ //this thing can happen if use redux
    currentUser: state.user.currentUser,
    totalNumCartItems: selectCartItemsCount(state)
})

const Header = props => {
    const dispatch = useDispatch();
    const { currentUser, totalNumCartItems } = useSelector(mapState);

    const signOut = () => {
        dispatch(signOutUserStart());
    }

    useEffect(() => {
        
    }, [])

    return (
        <header className="header">
            <div className="wrap">
                <div className="logo">
                    {/* <img className="img_logo" src={Logo} alt="Zesta logo" /> */}
                    <Link to="/">
                        <span className="text_logo">Zesta</span>
                    </Link>
                </div>

                <nav>
                    <ul>
                        <li>
                            <Link to="/">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/search/">
                                Products
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="callToActions">

                    <ul>

                        <li>
                            {/* <Link to="/cart">
                                Your Cart ({totalNumCartItems})
                            </Link> */}
                                {currentUser && [
                                    <Link to="/cart">
                                        Your Cart ({<TotalCartItem />})
                                    </Link>
                                ]}
                                {/* Your Cart ({<TotalCartItem />}) */}
                                {!currentUser && [
                                    <Link to="/cart">
                                        Your Cart (0)
                                    </Link>
                                ]}
                        </li>

                        {/* user it login */}
                        {currentUser && [
                            
                                <li>
                                    <Link to="/dashboard">
                                        My Account
                                    </Link>
                                </li>,
                                <li>
                                    <span onClick={() => signOut()}>
                                        LogOut
                                    </span>
                                </li>
                            
                        ]}

                        {/* user not login */}
                        {!currentUser && [
                            
                                <li>
                                    <Link to="/registration">
                                        Register
                                    </Link>
                                </li>,
                                <li>
                                    <Link to="/login">
                                        Login
                                    </Link>
                                </li>
                            
                        ]}
                    </ul>
                    
                </div>
            </div>
        </header>
    )
}

Header.defaultProps = {
    currentUser: null
}

export default Header;
