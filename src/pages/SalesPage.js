import React, { useContext, useEffect } from 'react';
import SalesInputForm from '../components/sales/SalesInputForm';
import SalesSummary from '../components/sales/SalesSummary';
import { getSales } from '../services/api';
import { AppContext } from '../context/AppContext';

const SalesPage = () => {
    const { state, dispatch } = useContext(AppContext);

    const fetchSales = () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        getSales()
            .then(data => {
                dispatch({ type: 'SET_SALES', payload: data });
                dispatch({ type: 'SET_LOADING', payload: false });
            })
            .catch(error => {
                dispatch({ type: 'SET_ERROR', payload: error });
                dispatch({ type: 'SET_LOADING', payload: false });
            });
    };

    useEffect(() => {
        fetchSales();
    }, []);

    return (
        <div className="container">
            <h1>Sales</h1>
            <SalesInputForm onAddSales={fetchSales} />
            {state.loading ? <p>Loading...</p> : <SalesSummary sales={state.sales} />}
            {state.error && <p>{state.error.message}</p>}
        </div>
    );
};

export default SalesPage;