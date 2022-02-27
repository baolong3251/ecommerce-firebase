import React from 'react'
import ShopMen from './../../assets/shopMens.jpg'
import ShopWomen from './../../assets/shopWomens.jpg'
import ShopMen1 from './../../assets/shopMens1.jpg'
import ShopWomen1 from './../../assets/shopWomens1.jpg'
import img2 from './../../assets/img5.png'
import img1 from './../../assets/img4.png'
import { Link } from 'react-router-dom';
import './style_directory.scss';

const Directory = props => {
    return (
        <div className="directory">
            <div className="wrap">
                <div 
                    className="item women"
                    // style={{
                    //     backgroundImage: `url(${ShopWomen1})`
                    // }}
                >
                    <img src={img2}/>
                    <Link className="a" to="/search/womens">
                    {/* <img src={img2}/> */}
                        <div className='a1'>
                            Shop Womens
                        </div>
                    </Link>
                    
                </div>
                <div 
                    className="item men"
                    // style={{
                    //     backgroundImage: `url(${ShopMen1})`
                    // }}
                >
                    <img src={img1}/>
                    <Link className="a" to="/search/mens">
                        <div className='a1'>
                            Shop Mens
                        </div>
                        {/* <img src={img1}/> */}
                    </Link>
                    
                </div>
            </div>
        </div>
    )
}

export default Directory;