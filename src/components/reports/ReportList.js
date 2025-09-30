import React from 'react';
import { Link } from 'react-router-dom';

const ReportList = () => {
    return (
        <div>
            <h3>Available Reports</h3>
            <ul>
                <li><Link to="/reports/cost-summary">Departmental Cost Summary</Link></li>
                <li><Link to="/reports/non-food">Non-Food Consumables Report</Link></li>
                <li><Link to="/reports/variance">Controller Count Variance Report</Link></li>
                <li><Link to="/reports/waste">Waste & Shrinkage by Category</Link></li>
                <li><Link to="/reports/price-change">Price Change & Variance Alerts</Link></li>
                <li><Link to="/reports/recipe-cost">Recipe Cost vs. Selling Price</Link></li>
            </ul>
        </div>
    );
};

export default ReportList;