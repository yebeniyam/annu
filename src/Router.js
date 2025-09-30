import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import PurchasingPage from './pages/PurchasingPage';
import ReceivingPage from './pages/ReceivingPage';
import SalesPage from './pages/SalesPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/common/PrivateRoute';
import DepartmentalCostSummary from './components/reports/DepartmentalCostSummary';
import NonFoodConsumablesReport from './components/reports/NonFoodConsumablesReport';
import ControllerCountVarianceReport from './components/reports/ControllerCountVarianceReport';
import WasteAndShrinkageReport from './components/reports/WasteAndShrinkageReport';
import PriceChangeVarianceReport from './components/reports/PriceChangeVarianceReport';
import RecipeCostReport from './components/reports/RecipeCostReport';

const Router = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<PrivateRoute />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/purchasing" element={<PurchasingPage />} />
                <Route path="/receiving" element={<ReceivingPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/reports/cost-summary" element={<DepartmentalCostSummary />} />
                <Route path="/reports/non-food" element={<NonFoodConsumablesReport />} />
                <Route path="/reports/variance" element={<ControllerCountVarianceReport />} />
                <Route path="/reports/waste" element={<WasteAndShrinkageReport />} />
                <Route path="/reports/price-change" element={<PriceChangeVarianceReport />} />
                <Route path="/reports/recipe-cost" element={<RecipeCostReport />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/users" element={<UsersPage />} />
            </Route>
        </Routes>
    );
};

export default Router;