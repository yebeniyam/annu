import React, { useState, useContext } from 'react';
import { createSale } from '../../services/api';
import { AppContext } from '../../context/AppContext';

const SalesInputForm = ({ onAddSales }) => {
    const { dispatch } = useContext(AppContext);
    const [foodSales, setFoodSales] = useState('');
    const [beverageSales, setBeverageSales] = useState('');
    const [totalSales, setTotalSales] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch({ type: 'SET_LOADING', payload: true });
        createSale({ foodSales, beverageSales, totalSales, date: new Date().toISOString().split('T')[0] })
            .then(() => {
                setFoodSales('');
                setBeverageSales('');
                setTotalSales('');
                onAddSales();
            })
            .catch(error => {
                dispatch({ type: 'SET_ERROR', payload: error });
                dispatch({ type: 'SET_LOADING', payload: false });
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Enter Daily Sales</h3>
            <div>
                <label>Food Sales</label>
                <input type="text" value={foodSales} onChange={(e) => setFoodSales(e.target.value)} />
            </div>
            <div>
                <label>Beverage Sales</label>
                <input type="text" value={beverageSales} onChange={(e) => setBeverageSales(e.target.value)} />
            </div>
            <div>
                <label>Total Sales</label>
                <input type="text" value={totalSales} onChange={(e) => setTotalSales(e.target.value)} />
            </div>
            <button type="submit">Submit Sales</button>
        </form>
    );
};

export default SalesInputForm;