import React, { useState, useEffect } from 'react';
import { getDepartmentalCostSummary } from '../../services/api';

const DepartmentalCostSummary = () => {
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        getDepartmentalCostSummary().then(setSummary);
    }, []);

    if (!summary) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h3>Departmental Cost Summary</h3>
            <table>
                <thead>
                    <tr>
                        <th>Department</th>
                        <th>COGS</th>
                        <th>Sales</th>
                        <th>Cost %</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(summary).map(dept => (
                        <tr key={dept}>
                            <td>{dept}</td>
                            <td>${summary[dept].cogs.toFixed(2)}</td>
                            <td>${summary[dept].sales.toFixed(2)}</td>
                            <td>{summary[dept].costPercentage.toFixed(2)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DepartmentalCostSummary;