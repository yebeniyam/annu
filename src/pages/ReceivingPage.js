import React, { useContext, useEffect } from 'react';
import ReceiveItemForm from '../components/receiving/ReceiveItemForm';
import ReceivingLog from '../components/receiving/ReceivingLog';
import { getPurchaseOrders, getInventory } from '../services/api';
import { AppContext } from '../context/AppContext';

const ReceivingPage = () => {
    const { state, dispatch } = useContext(AppContext);

    const fetchData = () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        Promise.all([getPurchaseOrders(), getInventory()])
            .then(([pos, inventory]) => {
                dispatch({ type: 'SET_PURCHASE_ORDERS', payload: pos });
                dispatch({ type: 'SET_INVENTORY', payload: inventory });
                dispatch({ type: 'SET_LOADING', payload: false });
            })
            .catch(error => {
                dispatch({ type: 'SET_ERROR', payload: error });
                dispatch({ type: 'SET_LOADING', payload: false });
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="container">
            <h1>Receiving</h1>
            <ReceiveItemForm onReceive={fetchData} />
            {state.loading ? <p>Loading...</p> : <ReceivingLog />}
            {state.error && <p>{state.error.message}</p>}
        </div>
    );
};

export default ReceivingPage;