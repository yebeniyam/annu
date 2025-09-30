import React, { createContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
    inventory: [],
    purchaseOrders: [],
    users: [],
    sales: [],
    departments: [],
    categories: [],
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_INVENTORY':
            return { ...state, inventory: action.payload };
        case 'ADD_INVENTORY_ITEM':
            return { ...state, inventory: [...state.inventory, action.payload] };
        case 'UPDATE_INVENTORY_ITEM':
            return { ...state, inventory: state.inventory.map(item => item.id === action.payload.id ? action.payload : item) };
        case 'DELETE_INVENTORY_ITEM':
            return { ...state, inventory: state.inventory.filter(item => item.id !== action.payload) };
        case 'SET_PURCHASE_ORDERS':
            return { ...state, purchaseOrders: action.payload };
        case 'ADD_PURCHASE_ORDER':
            return { ...state, purchaseOrders: [...state.purchaseOrders, action.payload] };
        case 'UPDATE_PURCHASE_ORDER':
            return { ...state, purchaseOrders: state.purchaseOrders.map(po => po.id === action.payload.id ? action.payload : po) };
        case 'DELETE_PURCHASE_ORDER':
            return { ...state, purchaseOrders: state.purchaseOrders.filter(po => po.id !== action.payload) };
        case 'SET_USERS':
            return { ...state, users: action.payload };
        case 'ADD_USER':
            return { ...state, users: [...state.users, action.payload] };
        case 'UPDATE_USER':
            return { ...state, users: state.users.map(user => user.id === action.payload.id ? action.payload : user) };
        case 'DELETE_USER':
            return { ...state, users: state.users.filter(user => user.id !== action.payload) };
        case 'SET_SALES':
            return { ...state, sales: action.payload };
        case 'ADD_SALES':
            return { ...state, sales: [...state.sales, action.payload] };
        case 'SET_DEPARTMENTS':
            return { ...state, departments: action.payload };
        case 'ADD_DEPARTMENT':
            return { ...state, departments: [...state.departments, action.payload] };
        case 'UPDATE_DEPARTMENT':
            return { ...state, departments: state.departments.map(dept => dept.id === action.payload.id ? action.payload : dept) };
        case 'DELETE_DEPARTMENT':
            return { ...state, departments: state.departments.filter(dept => dept.id !== action.payload) };
        case 'SET_CATEGORIES':
            return { ...state, categories: action.payload };
        case 'ADD_CATEGORY':
            return { ...state, categories: [...state.categories, action.payload] };
        case 'UPDATE_CATEGORY':
            return { ...state, categories: state.categories.map(cat => cat.id === action.payload.id ? action.payload : cat) };
        case 'DELETE_CATEGORY':
            return { ...state, categories: state.categories.filter(cat => cat.id !== action.payload) };
        case 'LOGIN_SUCCESS':
            return { ...state, isAuthenticated: true, user: action.payload };
        case 'LOGOUT':
            return { ...state, isAuthenticated: false, user: null };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };