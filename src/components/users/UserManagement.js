import React, { useState, useContext } from 'react';
import { addUser } from '../../services/api';
import { AppContext } from '../../context/AppContext';

const UserManagement = ({ onAddUser }) => {
    const { dispatch } = useContext(AppContext);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteName, setInviteName] = useState('');
    const [inviteRole, setInviteRole] = useState('Staff');

    const handleInvite = (e) => {
        e.preventDefault();
        dispatch({ type: 'SET_LOADING', payload: true });
        addUser({ name: inviteName, email: inviteEmail, role: inviteRole })
            .then(() => {
                setInviteEmail('');
                setInviteName('');
                setInviteRole('Staff');
                onAddUser();
            })
            .catch(error => {
                dispatch({ type: 'SET_ERROR', payload: error });
                dispatch({ type: 'SET_LOADING', payload: false });
            });
    };

    return (
        <form onSubmit={handleInvite}>
            <h4>Invite New User</h4>
            <input
                type="text"
                placeholder="Enter name"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
            />
            <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                <option value="Staff">Staff</option>
                <option value="Manager">Manager</option>
                <option value="Chef">Chef</option>
                <option value="Bartender">Bartender</option>
                <option value="Controller">Controller</option>
            </select>
            <button type="submit">Invite User</button>
        </form>
    );
};

export default UserManagement;