import React, { useState, useEffect } from 'react';
import { getRecipeCostReport } from '../../services/api';

const RecipeCostReport = () => {
    const [report, setReport] = useState([]);

    useEffect(() => {
        getRecipeCostReport().then(setReport);
    }, []);

    return (
        <div>
            <h3>Recipe Cost vs. Selling Price</h3>
            <table>
                <thead>
                    <tr>
                        <th>Recipe Name</th>
                        <th>Total Cost</th>
                        <th>Selling Price</th>
                        <th>Profit Margin ($)</th>
                        <th>Profit Margin (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {report.map(recipe => (
                        <tr key={recipe.id}>
                            <td>{recipe.name}</td>
                            <td>${recipe.totalCost.toFixed(2)}</td>
                            <td>${recipe.sellingPrice.toFixed(2)}</td>
                            <td>${recipe.profitMarginAmount.toFixed(2)}</td>
                            <td>{recipe.profitMarginPercentage.toFixed(2)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RecipeCostReport;