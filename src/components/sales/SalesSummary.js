import React from 'react';

const SalesSummary = ({ sales }) => {
    return (
        <div>
            <h3>Sales Summary</h3>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Food Sales</th>
                        <th>Beverage Sales</th>
                        <th>Total Sales</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map(sale => (
                        <tr key={sale.id}>
                            <td>{sale.date}</td>
                            <td>${sale.foodSales}</td>
                            <td>${sale.beverageSales}</td>
                            <td>${sale.totalSales}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalesSummary;