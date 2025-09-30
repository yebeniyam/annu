import React, { useState, useContext } from 'react';
import { addInventoryItem } from '../../services/api';
import { AppContext } from '../../context/AppContext';

const AddItemForm = ({ onAddItem }) => {
    const { dispatch } = useContext(AppContext);
    const [itemName, setItemName] = useState('');
    const [unit, setUnit] = useState('');
    const [category, setCategory] = useState('');
    const [department, setDepartment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch({ type: 'SET_LOADING', payload: true });
        addInventoryItem({ name: itemName, unit, category, department })
            .then(() => {
                setItemName('');
                setUnit('');
                setCategory('');
                setDepartment('');
                onAddItem();
            })
            .catch(error => {
                dispatch({ type: 'SET_ERROR', payload: error });
                dispatch({ type: 'SET_LOADING', payload: false });
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Add New Item</h3>
            <div>
                <label>Item Name</label>
                <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} />
            </div>
            <div>
                <label>Unit</label>
                <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} />
            </div>
            <div>
                <label>Category</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div>
                <label>Department</label>
                <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} />
            </div>
            <button type="submit">Add Item</button>
        </form>
    );
};

export default AddItemForm;