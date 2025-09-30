import React, { useContext, useEffect, useState } from 'react';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment, getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import { AppContext } from '../context/AppContext';

const SettingsPage = () => {
    const { state, dispatch } = useContext(AppContext);
    const [newDepartmentName, setNewDepartmentName] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');

    const fetchSettings = () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        Promise.all([getDepartments(), getCategories()])
            .then(([departments, categories]) => {
                dispatch({ type: 'SET_DEPARTMENTS', payload: departments });
                dispatch({ type: 'SET_CATEGORIES', payload: categories });
                dispatch({ type: 'SET_LOADING', payload: false });
            })
            .catch(error => {
                dispatch({ type: 'SET_ERROR', payload: error });
                dispatch({ type: 'SET_LOADING', payload: false });
            });
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleAddDepartment = (e) => {
        e.preventDefault();
        dispatch({ type: 'SET_LOADING', payload: true });
        createDepartment({ name: newDepartmentName })
            .then(() => {
                setNewDepartmentName('');
                fetchSettings();
            })
            .catch(error => {
                dispatch({ type: 'SET_ERROR', payload: error });
                dispatch({ type: 'SET_LOADING', payload: false });
            });
    };

    const handleDeleteDepartment = (id) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        deleteDepartment(id)
            .then(() => {
                fetchSettings();
            })
            .catch(error => {
                dispatch({ type: 'SET_ERROR', payload: error });
                dispatch({ type: 'SET_LOADING', payload: false });
            });
    };

    const handleAddCategory = (e) => {
        e.preventDefault();
        dispatch({ type: 'SET_LOADING', payload: true });
        createCategory({ name: newCategoryName })
            .then(() => {
                setNewCategoryName('');
                fetchSettings();
            })
            .catch(error => {
                dispatch({ type: 'SET_ERROR', payload: error });
                dispatch({ type: 'SET_LOADING', payload: false });
            });
    };

    const handleDeleteCategory = (id) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        deleteCategory(id)
            .then(() => {
                fetchSettings();
            })
            .catch(error => {
                dispatch({ type: 'SET_ERROR', payload: error });
                dispatch({ type: 'SET_LOADING', payload: false });
            });
    };

    return (
        <div className="container">
            <h1>Settings</h1>
            <div>
                <h3>Departments</h3>
                <form onSubmit={handleAddDepartment}>
                    <input
                        type="text"
                        placeholder="New Department Name"
                        value={newDepartmentName}
                        onChange={(e) => setNewDepartmentName(e.target.value)}
                    />
                    <button type="submit">Add Department</button>
                </form>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.departments && state.departments.map(dept => (
                            <tr key={dept.id}>
                                <td>{dept.name}</td>
                                <td>
                                    <button onClick={() => handleDeleteDepartment(dept.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <h3>Categories</h3>
                <form onSubmit={handleAddCategory}>
                    <input
                        type="text"
                        placeholder="New Category Name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <button type="submit">Add Category</button>
                </form>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.categories && state.categories.map(cat => (
                            <tr key={cat.id}>
                                <td>{cat.name}</td>
                                <td>
                                    <button onClick={() => handleDeleteCategory(cat.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {state.loading && <p>Loading...</p>}
            {state.error && <p>{state.error.message}</p>}
        </div>
    );
};

export default SettingsPage;