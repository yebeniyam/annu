import React, { useState, useContext } from 'react';
import { receiveItem } from '../../services/api';
import { AppContext } from '../../context/AppContext';

const ReceiveItemForm = ({ onReceive }) => {
    const { dispatch } = useContext(AppContext);
    const [poNumber, setPoNumber] = useState('');
    const [itemId, setItemId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch({ type: 'SET_LOADING', payload: true });
        receiveItem(poNumber, itemId, parseInt(quantity))
            .then(() => {
                setPoNumber('');
                setItemId('');
                setQuantity('');
                setNotes('');
                onReceive();
            })
            .catch(error => {
                dispatch({ type: 'SET_ERROR', payload: error });
                dispatch({ type: 'SET_LOADING', payload: false });
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Receive Item</h3>
            <div>
                <label>PO Number</label>
                <input type="text" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} />
            </div>
            <div>
                <label>Item ID</label>
                <input type="text" value={itemId} onChange={(e) => setItemId(e.target.value)} />
            </div>
            <div>
                <label>Quantity</label>
                <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>
            <div>
                <label>Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <button type="submit">Receive Item</button>
        </form>
    );
};

export default ReceiveItemForm;