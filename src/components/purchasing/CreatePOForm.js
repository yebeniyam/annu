import React, { useState, useContext } from 'react';
import { createPurchaseOrder } from '../../services/api';
import { AppContext } from '../../context/AppContext';

const CreatePOForm = ({ onAddPO }) => {
    const { dispatch } = useContext(AppContext);
    const [supplier, setSupplier] = useState('');
    const [expectedDate, setExpectedDate] = useState('');
    const [items, setItems] = useState([{ name: '', quantity: '' }]);

    const handleItemChange = (index, event) => {
        const newItems = [...items];
        newItems[index][event.target.name] = event.target.value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { name: '', quantity: '' }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch({ type: 'SET_LOADING', payload: true });
        createPurchaseOrder({ supplier, expectedDate, items, status: 'Ordered' })
            .then(() => {
                setSupplier('');
                setExpectedDate('');
                setItems([{ name: '', quantity: '' }]);
                onAddPO();
            })
            .catch(error => {
                dispatch({ type: 'SET_ERROR', payload: error });
                dispatch({ type: 'SET_LOADING', payload: false });
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Create Purchase Order</h3>
            <div>
                <label>Supplier</label>
                <input type="text" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
            </div>
            <div>
                <label>Expected Delivery Date</label>
                <input type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} />
            </div>
            <h4>Items</h4>
            {items.map((item, index) => (
                <div key={index}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Item Name"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, e)}
                    />
                    <input
                        type="text"
                        name="quantity"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, e)}
                    />
                </div>
            ))}
            <button type="button" onClick={addItem}>Add Item</button>
            <button type="submit">Create PO</button>
        </form>
    );
};

export default CreatePOForm;