import React, { useState, useEffect } from 'react';
import { getInventory } from '../../services/api';

const NonFoodConsumablesReport = () => {
    const [nonFoodItems, setNonFoodItems] = useState([]);

    useEffect(() => {
        getInventory().then(inventory => {
            const nonFood = inventory.filter(item => item.category === 'Non-Food');
            setNonFoodItems(nonFood);
        });
    }, []);

    return (
        <div>
            <h3>Non-Food Consumables Report</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Unit</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {nonFoodItems.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.unit}</td>
                            <td>{item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NonFoodConsumablesReport;