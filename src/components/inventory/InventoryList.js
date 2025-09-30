import React, { useContext } from 'react';
import { deleteInventoryItem } from '../../services/api';
import { AppContext } from '../../context/AppContext';

const InventoryList = ({ items, onEdit }) => {
    const { dispatch } = useContext(AppContext);

    const handleDelete = (id) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        deleteInventoryItem(id)
            .then(() => {
                dispatch({ type: 'DELETE_INVENTORY_ITEM', payload: id });
                dispatch({ type: 'SET_LOADING', payload: false });
            })
            .catch(error => {
                dispatch({ type: 'SET_ERROR', payload: error });
                dispatch({ type: 'SET_LOADING', payload: false });
            });
    };

    return (
        <div>
            <h3>Inventory List</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Unit</th>
                        <th>Category</th>
                        <th>Department</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.unit}</td>
                            <td>{item.category}</td>
                            <td>{item.department}</td>
                            <td>
                                <button onClick={() => onEdit(item)}>Edit</button>
                                <button onClick={() => handleDelete(item.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryList;