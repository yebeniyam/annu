import React, { useState, useContext, useEffect } from 'react';
import { updatePurchaseOrder } from '../../services/api';
import { AppContext } from '../../context/AppContext';

const EditPOForm = ({ po, onUpdate }) => {
    const { dispatch } = useContext(AppContext);
    const [supplier, setSupplier] = useState('');
    const [expectedDate, setExpectedDate] = useState('');
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState('Ordered');

    useEffect(() => {
        if (po) {
            setSupplier(po.supplier);
            setExpectedDate(po.expectedDate);
            setItems(po.items || []);
            setStatus(po.status);
        }
    }, [po]);

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
        updatePurchaseOrder(po.id, { supplier, expectedDate, items, status })
            .then(updatedPO => {
                dispatch({ type: 'UPDATE_PURCHASE_ORDER', payload: updatedPO });
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
            <h3>Edit Purchase Order</h3>
            <div>
                <label>Supplier</label>
                <input type="text" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
            </div>
            <div>
                <label>Expected Delivery Date</label>
                <input type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} />
            </div>
            <div>
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Ordered">Ordered</option>
                    <option value="Received">Received</option>
                    <option value="Partial">Partial</option>
                </select>
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
            <button type="submit">Update PO</button>
            <button type="button" onClick={onUpdate}>Cancel</button>
        </form>
    );
};

export default EditPOForm;