import React, { useState, useEffect } from 'react';
import { getPriceChangeVarianceReport } from '../../services/api';

const PriceChangeVarianceReport = () => {
    const [report, setReport] = useState([]);

    useEffect(() => {
        getPriceChangeVarianceReport().then(setReport);
    }, []);

    return (
        <div>
            <h3>Price Change & Variance Alerts</h3>
            <table>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Old Price</th>
                        <th>New Price</th>
                        <th>Variance (%)</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {report.map(change => (
                        <tr key={change.id}>
                            <td>{change.itemName}</td>
                            <td>${change.oldPrice.toFixed(2)}</td>
                            <td>${change.newPrice.toFixed(2)}</td>
                            <td>{change.variancePercentage.toFixed(2)}%</td>
                            <td>{change.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PriceChangeVarianceReport;