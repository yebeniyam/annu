import React, { useState, useEffect } from 'react';
import { getControllerCountVariance } from '../../services/api';

const ControllerCountVarianceReport = () => {
    const [variance, setVariance] = useState([]);

    useEffect(() => {
        getControllerCountVariance().then(setVariance);
    }, []);

    return (
        <div>
            <h3>Controller Count Variance Report</h3>
            <table>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Expected</th>
                        <th>Counted</th>
                        <th>Variance</th>
                    </tr>
                </thead>
                <tbody>
                    {variance.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.expected}</td>
                            <td>{item.counted}</td>
                            <td>{item.variance}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ControllerCountVarianceReport;