import React, { useState, useContext, useEffect } from 'react';
import { updateInventoryItem } from '../../services/api';
import { AppContext } from '../../context/AppContext';

const EditItemForm = ({ item, onUpdate }) => {
    const { dispatch } = useContext(AppContext);
    const [itemName, setItemName] = useState('');
    const [unit, setUnit] = useState('');
    const [category, setCategory] = useState('');
    const [department, setDepartment] = useState('');

    useEffect(() => {
        if (item) {
            setItemName(item.name);
            setUnit(item.unit);
            setCategory(item.category);
            setDepartment(item.department);
        }
    }, [item]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch({ type: 'SET_LOADING', payload: true });
        updateInventoryItem(item.id, { name: itemName, unit, category, department })
            .then(updatedItem => {
                dispatch({ type: 'UPDATE_INVENTORY_ITEM', payload: updatedItem });
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
            <h3>Edit Item</h3>
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
            <button type="submit">Update Item</button>
            <button type="button" onClick={onUpdate}>Cancel</button>
        </form>
    );
};

export default EditItemForm;