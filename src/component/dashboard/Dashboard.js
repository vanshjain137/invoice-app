import React from 'react'
import './dashboard.css'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { auth } from '../../firebase'
import { signOut } from 'firebase/auth'

const Dashboard = () => {
    const navigate = useNavigate()

    const logout = () => {
        signOut(auth).then(() => {
            localStorage.clear()
            navigate('/login')
        }).catch((error) => {
            console.log(error)
        });
    }

    return (
        <div className='dashboard-wrapper'>
            <div className='side-nav'>
                <div className='profile-info'>
                    <img src={localStorage.getItem('photoURL')} alt='profile' />
                    <div>
                        <p>{localStorage.getItem('cName')}</p>
                        <button onClick={logout} className="logout-btn">
                            <span className="logout-text">Logout</span>
                            <i className="fa-solid fa-right-from-bracket logout-icon"></i>
                        </button>
                    </div>
                </div>
                <hr />

                <input type="checkbox" id="menu-toggle" className="menu-checkbox" />
                <label htmlFor="menu-toggle" className="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </label>

                <div className='menu'>
                    <Link to='/dashboard/home' className='menu-link'><i className="fa-solid fa-house"></i> Home</Link>
                    <Link to='/dashboard/invoices' className='menu-link'><i className="fa-solid fa-file-invoice"></i> Invoices</Link>
                    <Link to='/dashboard/new-invoice' className='menu-link'><i className="fa-solid fa-file-circle-plus"></i> New Invoice</Link>
                    <Link to='/dashboard/setting' className='menu-link'><i className="fa-solid fa-gear"></i> Setting</Link>
                </div>
            </div>

            <div className='main-container'>
                <Outlet />
            </div>
        </div>
    )
}

export default Dashboard
