import React, { useContext } from 'react';
import { deletePurchaseOrder } from '../../services/api';
import { AppContext } from '../../context/AppContext';

const POList = ({ pos, onEdit }) => {
    const { dispatch } = useContext(AppContext);

    const handleDelete = (id) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        deletePurchaseOrder(id)
            .then(() => {
                dispatch({ type: 'DELETE_PURCHASE_ORDER', payload: id });
                dispatch({ type: 'SET_LOADING', payload: false });
            })
            .catch(error => {
                dispatch({ type: 'SET_ERROR', payload: error });
                dispatch({ type: 'SET_LOADING', payload: false });
            });
    };

    return (
        <div>
            <h3>Purchase Orders</h3>
            <table>
                <thead>
                    <tr>
                        <th>PO #</th>
                        <th>Supplier</th>
                        <th>Expected Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pos.map(po => (
                        <tr key={po.id}>
                            <td>{po.id}</td>
                            <td>{po.supplier}</td>
                            <td>{po.expectedDate}</td>
                            <td>{po.status}</td>
                            <td>
                                <button onClick={() => onEdit(po)}>Edit</button>
                                <button onClick={() => handleDelete(po.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default POList;