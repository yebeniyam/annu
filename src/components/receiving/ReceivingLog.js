import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const ReceivingLog = () => {
    const { state } = useContext(AppContext);

    const receivedItems = state.purchaseOrders.filter(po => po.status === 'Received' || po.status === 'Partial');

    return (
        <div>
            <h3>Receiving Log</h3>
            <table>
                <thead>
                    <tr>
                        <th>PO #</th>
                        <th>Supplier</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {receivedItems.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.supplier}</td>
                            <td>{item.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReceivingLog;