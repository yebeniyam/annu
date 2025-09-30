import React, { useContext, useEffect, useState } from 'react';
import CreatePOForm from '../components/purchasing/CreatePOForm';
import EditPOForm from '../components/purchasing/EditPOForm';
import POList from '../components/purchasing/POList';
import { getPurchaseOrders } from '../services/api';
import { AppContext } from '../context/AppContext';

const PurchasingPage = () => {
    const { state, dispatch } = useContext(AppContext);
    const [editingPO, setEditingPO] = useState(null);

    const fetchPOs = () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        getPurchaseOrders()
            .then(data => {
                dispatch({ type: 'SET_PURCHASE_ORDERS', payload: data });
                dispatch({ type: 'SET_LOADING', payload: false });
            })
            .catch(error => {
                dispatch({ type: 'SET_ERROR', payload: error });
                dispatch({ type: 'SET_LOADING', payload: false });
            });
    };

    useEffect(() => {
        fetchPOs();
    }, []);

    const handleEdit = (po) => {
        setEditingPO(po);
    };

    const handleUpdate = () => {
        setEditingPO(null);
    };

    return (
        <div className="container">
            <h1>Purchasing</h1>
            {editingPO ? (
                <EditPOForm po={editingPO} onUpdate={handleUpdate} />
            ) : (
                <CreatePOForm onAddPO={fetchPOs} />
            )}
            {state.loading ? <p>Loading...</p> : <POList pos={state.purchaseOrders} onEdit={handleEdit} />}
            {state.error && <p>{state.error.message}</p>}
        </div>
    );
};

export default PurchasingPage;