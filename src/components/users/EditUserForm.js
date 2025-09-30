import React, { useState, useContext, useEffect } from 'react';
import { updateUser } from '../../services/api';
import { AppContext } from '../../context/AppContext';

const EditUserForm = ({ user, onUpdate }) => {
    const { dispatch } = useContext(AppContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Staff');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch({ type: 'SET_LOADING', payload: true });
        updateUser(user.id, { name, email, role })
            .then(updatedUser => {
                dispatch({ type: 'UPDATE_USER', payload: updatedUser });
                dispatch({ type: 'SET_LOADING', payload: false });
                onUpdate();
            })
            .catch(error => {
                dispatch({ type: 'SET_ERROR', payload: error });
                dispatch({ type: 'SET_LOADING', payload: false });
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Edit User</h3>
            <div>
                <label>Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label>Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="Staff">Staff</option>
                    <option value="Manager">Manager</option>
                    <option value="Chef">Chef</option>
                    <option value="Bartender">Bartender</option>
                    <option value="Controller">Controller</option>
                </select>
            </div>
            <button type="submit">Update User</button>
            <button type="button" onClick={onUpdate}>Cancel</button>
        </form>
    );
};

export default EditUserForm;