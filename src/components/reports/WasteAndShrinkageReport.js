import React, { useState, useEffect } from 'react';
import { getWasteAndShrinkageReport } from '../../services/api';

const WasteAndShrinkageReport = () => {
    const [report, setReport] = useState({});

    useEffect(() => {
        getWasteAndShrinkageReport().then(setReport);
    }, []);

    return (
        <div>
            <h3>Waste & Shrinkage by Category</h3>
            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Total Value</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(report).map(category => (
                        <tr key={category}>
                            <td>{category}</td>
                            <td>${report[category].toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default WasteAndShrinkageReport;