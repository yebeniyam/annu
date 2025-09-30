import React, { useState } from 'react';

const SettingsForm = () => {
    const [departments, setDepartments] = useState(['Kitchen', 'Bar', 'Hot Beverage']);
    const [categories, setCategories] = useState(['Dry Goods', 'Fresh Produce', 'Meat', 'Dairy']);
    const [users, setUsers] = useState(['Manager', 'Chef', 'Bartender']);

    const handleAddDepartment = () => {
        const newDepartment = prompt("Enter new department name:");
        if (newDepartment) {
            setDepartments([...departments, newDepartment]);
        }
    };

    const handleAddCategory = () => {
        const newCategory = prompt("Enter new category name:");
        if (newCategory) {
            setCategories([...categories, newCategory]);
        }
    };

    return (
        <div>
            <h3>Settings</h3>
            <div>
                <h4>Departments</h4>
                <ul>
                    {departments.map((dept, index) => <li key={index}>{dept}</li>)}
                </ul>
                <button onClick={handleAddDepartment}>Add Department</button>
            </div>
            <div>
                <h4>Categories</h4>
                <ul>
                    {categories.map((cat, index) => <li key={index}>{cat}</li>)}
                </ul>
                <button onClick={handleAddCategory}>Add Category</button>
            </div>
            <div>
                <h4>Users</h4>
                <ul>
                    {users.map((user, index) => <li key={index}>{user}</li>)}
                </ul>
                {/* User management will be more complex, so this is a placeholder */}
            </div>
        </div>
    );
};

export default SettingsForm;