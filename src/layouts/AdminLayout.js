import React from "react"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { signOutUserStart } from "./../redux/User/user.action"

import Header from "../components/Header"
import VerticalNav from "../components/VerticalNav"
import Footer from "../components/Footer"

const AdminLayout = props => {
    const dispatch = useDispatch();

    const signOut = () => {
        dispatch(signOutUserStart());
    }

    return (
        <div className="adminLayout">
            <Header />
            <div className="controlPanel">
                <div className="sidebar">
                    <VerticalNav>
                        <ul>
                            <li>
                                <Link to="/admin">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/orderchecks">
                                    Orders
                                </Link>
                            </li>
                            <li>
                                <Link to="/delivered">
                                    Delivered
                                </Link>
                            </li>
                            <li>
                                <span className="signOut" onClick={() => signOut()}>
                                    Sign Out
                                </span>
                            </li>
                        </ul>
                    </VerticalNav>
                    
                    
                </div>
                
                <div className="content">
                    {props.children}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default AdminLayout