import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const Navbar = () => {
    const { state, dispatch } = useContext(AppContext);

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <nav>
            <ul>
                {state.isAuthenticated ? (
                    <>
                        <li><Link to="/">Dashboard</Link></li>
                        <li><Link to="/inventory">Inventory</Link></li>
                        <li><Link to="/purchasing">Purchasing</Link></li>
                        <li><Link to="/receiving">Receiving</Link></li>
                        <li><Link to="/sales">Sales</Link></li>
                        <li><Link to="/reports">Reports</Link></li>
                        <li><Link to="/settings">Settings</Link></li>
                        <li><Link to="/users">Users</Link></li>
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </>
                ) : (
                    <li><Link to="/login">Login</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;