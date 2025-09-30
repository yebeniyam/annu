import { supabase } from './supabaseClient';

// Supabase-based API functions

// Auth API
export const login = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Get user details from our custom users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError && userError.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.error('Error getting user data:', userError);
    }

    return userData || data.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (userData) => {
  const { email, password, name, role = 'user' } = userData;

  try {
    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    // Add user to our custom users table
    const { error: userError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        email,
        name,
        role,
      }]);

    if (userError) {
      console.error('Error adding user to custom table:', userError);
      // Don't throw here since auth was successful, but log the error
    }

    return authData.user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Logout error:', error);
    throw error;
  }
  return Promise.resolve();
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting user:', error);
      return null;
    }

    if (!user) {
      return null;
    }

    // Get user details from our custom users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError && userError.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.error('Error getting user data:', userError);
      return user; // Return Supabase user data if custom table query fails
    }

    return userData || user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Password Reset API
export const requestPasswordReset = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
};

export const resetPassword = async (newPassword) => {
  // This should be called from a password reset page after user clicks the email link
  // The password reset link from Supabase will handle the token part
  try {
    // The new password is set through Supabase's password recovery flow
    // This function is a placeholder - actual password reset happens through Supabase's flow
    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

export const changePassword = async (newPassword) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

// Users API
export const getUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .is('is_active', true);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
};

export const getUser = async (id) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  // Creating users via API should also create Supabase auth user
  const { email, password, name, role = 'user' } = userData;

  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Automatically confirm email
    });

    if (authError) {
      throw new Error(authError.message);
    }

    // Add user to our custom users table
    const { data, error } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        email,
        name,
        role,
      }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    // Update in our custom users table
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    // Soft delete in our custom users table
    const { error } = await supabase
      .from('users')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
};

// Inventory API
export const getInventory = async () => {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select(`
        *,
        category:categories(name),
        department:departments(name)
      `);

    if (error) {
      throw new Error(error.message);
    }

    // Format the data to match the original structure
    const formattedData = data.map(item => ({
      id: item.id,
      name: item.name,
      unit: item.unit,
      category: item.category?.name || item.category_id,
      department: item.department?.name || item.department_id,
      quantity: parseFloat(item.quantity),
      cost: parseFloat(item.cost),
      supplier: item.supplier,
      par_level: parseFloat(item.par_level),
      reorder_point: parseFloat(item.reorder_point),
    }));

    return formattedData;
  } catch (error) {
    console.error('Get inventory error:', error);
    throw error;
  }
};

export const getInventoryItem = async (id) => {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select(`
        *,
        category:categories(name),
        department:departments(name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: data.id,
      name: data.name,
      unit: data.unit,
      category: data.category?.name || data.category_id,
      department: data.department?.name || data.department_id,
      quantity: parseFloat(data.quantity),
      cost: parseFloat(data.cost),
      supplier: data.supplier,
      par_level: parseFloat(data.par_level),
      reorder_point: parseFloat(data.reorder_point),
    };
  } catch (error) {
    console.error('Get inventory item error:', error);
    throw error;
  }
};

export const createInventoryItem = async (item) => {
  try {
    // Get category and department IDs from their names
    let categoryId = item.category_id;
    if (typeof item.category === 'string') {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('name', item.category)
        .single();
      categoryId = categoryData?.id;
    }

    let departmentId = item.department_id;
    if (typeof item.department === 'string') {
      const { data: departmentData } = await supabase
        .from('departments')
        .select('id')
        .eq('name', item.department)
        .single();
      departmentId = departmentData?.id;
    }

    const { data, error } = await supabase
      .from('inventory')
      .insert([{
        name: item.name,
        unit: item.unit,
        category_id: categoryId,
        department_id: departmentId,
        quantity: item.quantity,
        cost: item.cost,
        supplier: item.supplier,
        par_level: item.par_level,
        reorder_point: item.reorder_point,
      }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Create inventory item error:', error);
    throw error;
  }
};

export const updateInventoryItem = async (id, item) => {
  try {
    // Get category and department IDs from their names if provided as strings
    const updateData = { ...item };
    
    if (typeof item.category === 'string') {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('name', item.category)
        .single();
      updateData.category_id = categoryData?.id;
      delete updateData.category; // Remove the string field
    }
    
    if (typeof item.department === 'string') {
      const { data: departmentData } = await supabase
        .from('departments')
        .select('id')
        .eq('name', item.department)
        .single();
      updateData.department_id = departmentData?.id;
      delete updateData.department; // Remove the string field
    }

    const { data, error } = await supabase
      .from('inventory')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Update inventory item error:', error);
    throw error;
  }
};

export const deleteInventoryItem = async (id) => {
  try {
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Delete inventory item error:', error);
    throw error;
  }
};

// Purchase Orders API
export const getPurchaseOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select(`
        *,
        created_by_user:users(name),
        items:purchase_order_items(*)
      `);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Get purchase orders error:', error);
    throw error;
  }
};

export const getPurchaseOrder = async (id) => {
  try {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select(`
        *,
        created_by_user:users(name),
        items:purchase_order_items(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Get purchase order error:', error);
    throw error;
  }
};

export const createPurchaseOrder = async (po) => {
  try {
    // First create the purchase order
    const { data: poData, error: poError } = await supabase
      .from('purchase_orders')
      .insert([{
        supplier: po.supplier,
        expected_date: po.expectedDate || po.expected_date,
        status: po.status || 'Ordered',
        created_by: po.created_by || null, // This would be the current user ID
      }])
      .select()
      .single();

    if (poError) {
      throw new Error(poError.message);
    }

    // Then create associated items if any
    if (po.items && Array.isArray(po.items) && po.items.length > 0) {
      const itemsToInsert = po.items.map(item => ({
        purchase_order_id: poData.id,
        name: item.name,
        quantity: item.quantity,
        unit_cost: item.unit_cost,
      }));

      const { error: itemsError } = await supabase
        .from('purchase_order_items')
        .insert(itemsToInsert);

      if (itemsError) {
        throw new Error(itemsError.message);
      }
    }

    return poData;
  } catch (error) {
    console.error('Create purchase order error:', error);
    throw error;
  }
};

export const updatePurchaseOrder = async (id, po) => {
  try {
    const { data, error } = await supabase
      .from('purchase_orders')
      .update({
        supplier: po.supplier,
        expected_date: po.expectedDate || po.expected_date,
        status: po.status,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Update purchase order error:', error);
    throw error;
  }
};

export const deletePurchaseOrder = async (id) => {
  try {
    const { error } = await supabase
      .from('purchase_orders')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Delete purchase order error:', error);
    throw error;
  }
};

export const receiveItem = async (poId, itemId, quantity) => {
  try {
    // This function would update the purchase order status and inventory based on received items
    // Implementation would depend on your specific business logic
    const { data: poData, error: poError } = await supabase
      .from('purchase_orders')
      .select('*')
      .eq('id', poId)
      .single();

    if (poError) {
      throw new Error(poError.message);
    }

    // Update purchase order status to 'Received' or 'Partial' based on received quantities
    let newStatus = 'Received';
    if (quantity < getExpectedQuantityForItem(poId, itemId)) {
      newStatus = 'Partial';
    }

    const { error: updateError } = await supabase
      .from('purchase_orders')
      .update({ status: newStatus })
      .eq('id', poId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    // Update inventory with received items
    const { error: inventoryError } = await supabase
      .from('inventory')
      .update({
        quantity: await getCurrentInventoryQuantity(itemId) + quantity
      })
      .eq('id', itemId);

    if (inventoryError) {
      throw new Error(inventoryError.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Receive item error:', error);
    throw error;
  }
};

// Sales API
export const getSales = async () => {
  try {
    const { data, error } = await supabase
      .from('sales')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Get sales error:', error);
    throw error;
  }
};

export const createSale = async (sale) => {
  try {
    const { data, error } = await supabase
      .from('sales')
      .insert([{
        food_sales: sale.foodSales || sale.food_sales,
        beverage_sales: sale.beverageSales || sale.beverage_sales,
        total_sales: sale.totalSales || sale.total_sales,
        date: sale.date,
        recorded_by: sale.recorded_by || null, // Current user ID
      }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Create sale error:', error);
    throw error;
  }
};

// Departments API
export const getDepartments = async () => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Get departments error:', error);
    throw error;
  }
};

export const createDepartment = async (department) => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .insert([department])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Create department error:', error);
    throw error;
  }
};

export const updateDepartment = async (id, department) => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .update(department)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Update department error:', error);
    throw error;
  }
};

export const deleteDepartment = async (id) => {
  try {
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Delete department error:', error);
    throw error;
  }
};

// Categories API
export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Get categories error:', error);
    throw error;
  }
};

export const createCategory = async (category) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Create category error:', error);
    throw error;
  }
};

export const updateCategory = async (id, category) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Update category error:', error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Delete category error:', error);
    throw error;
  }
};

// Reports API
export const getDepartmentalCostSummary = async () => {
  try {
    // This would be a complex query joining multiple tables to calculate departmental costs
    // For now, return a basic structure based on inventory and sales data
    
    // Get inventory by department
    const { data: inventoryData, error: inventoryError } = await supabase
      .from('inventory')
      .select(`
        *,
        department:departments(name)
      `);

    if (inventoryError) {
      throw new Error(inventoryError.message);
    }

    // Get sales data
    const { data: salesData, error: salesError } = await supabase
      .from('sales')
      .select('*');

    if (salesError) {
      throw new Error(salesError.message);
    }

    // Calculate departmental costs (simplified calculation)
    const departmentalCosts = inventoryData.reduce((acc, item) => {
      const deptName = item.department?.name || 'Unknown';
      if (!acc[deptName]) {
        acc[deptName] = { totalValue: 0, items: [] };
      }
      const itemValue = parseFloat(item.quantity) * parseFloat(item.cost);
      acc[deptName].totalValue += itemValue;
      acc[deptName].items.push({
        name: item.name,
        quantity: parseFloat(item.quantity),
        cost: parseFloat(item.cost),
        value: itemValue
      });
      
      return acc;
    }, {});

    return departmentalCosts;
  } catch (error) {
    console.error('Get departmental cost summary error:', error);
    throw error;
  }
};

export const getControllerCountVariance = async () => {
  try {
    const { data, error } = await supabase
      .from('counts')
      .select(`
        *,
        item:inventory(name),
        counted_by_user:users(name)
      `);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Get controller count variance error:', error);
    throw error;
  }
};

export const getWasteAndShrinkageReport = async () => {
  try {
    const { data, error } = await supabase
      .from('waste')
      .select(`
        *,
        item:inventory(name),
        recorded_by_user:users(name)
      `);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Get waste and shrinkage report error:', error);
    throw error;
  }
};

export const getPriceChangeVarianceReport = async () => {
  try {
    const { data, error } = await supabase
      .from('price_changes')
      .select(`
        *,
        item:inventory(name),
        changed_by_user:users(name)
      `);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Get price change variance report error:', error);
    throw error;
  }
};

export const getRecipeCostReport = async () => {
  try {
    const { data: recipesData, error: recipesError } = await supabase
      .from('recipes')
      .select(`
        *,
        created_by_user:users(name),
        ingredients:recipe_ingredients(*, inventory(*))
      `);

    if (recipesError) {
      throw new Error(recipesError.message);
    }

    // Calculate recipe costs based on ingredients
    const recipesWithCosts = recipesData.map(recipe => {
      let totalCost = 0;
      
      if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
        recipe.ingredients.forEach(ingredient => {
          if (ingredient.inventory) {
            const ingredientCost = parseFloat(ingredient.quantity) * parseFloat(ingredient.inventory.cost);
            totalCost += ingredientCost;
          }
        });
      }
      
      return {
        ...recipe,
        total_ingredient_cost: totalCost,
        profit_margin: recipe.selling_price - totalCost,
        cost_percentage: totalCost > 0 ? (totalCost / recipe.selling_price) * 100 : 0
      };
    });

    return recipesWithCosts;
  } catch (error) {
    console.error('Get recipe cost report error:', error);
    throw error;
  }
};

// Helper functions
const getExpectedQuantityForItem = async (poId, itemId) => {
  // Implementation would fetch the expected quantity from purchase order items
  // This is a simplified version
  return 0;
};

const getCurrentInventoryQuantity = async (itemId) => {
  const { data, error } = await supabase
    .from('inventory')
    .select('quantity')
    .eq('id', itemId)
    .single();

  if (error) {
    console.error('Error getting current inventory quantity:', error);
    return 0;
  }

  return parseFloat(data.quantity) || 0;
};
