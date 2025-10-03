// backend/server.js
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are not set!');
  process.exit(1);
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Annu ERP Backend API is running!' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Use Supabase Auth to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return res.status(401).json({ error: error.message });
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

    res.json({
      user: userData || data.user,
      token: data.session?.access_token,
    });
  } catch (error) {
    console.error('Login API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name, role = 'user' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('Registration auth error:', authError);
      return res.status(400).json({ error: authError.message });
    }

    // Add user to our custom users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        email,
        name,
        role,
      }])
      .select()
      .single();

    if (userError) {
      console.error('Error adding user to custom table:', userError);
      // Return success anyway since auth was created, but log the error
    }

    res.json({
      user: userData || authData.user,
      token: authData.session?.access_token,
    });
  } catch (error) {
    console.error('Registration API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/logout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/auth/me', async (req, res) => {
  try {
    // Get the user from the session
    // Note: In a real implementation, you'd validate a token passed in headers
    // For now, we'll simulate getting user data
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Get user details from our custom users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('Error getting user data:', userError);
      return res.status(500).json({ error: userError.message });
    }

    res.json(userData || user);
  } catch (error) {
    console.error('Get user API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Users routes
app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .is('is_active', true);

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Inventory routes
app.get('/api/inventory', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select(`
        *,
        category:categories(name),
        department:departments(name)
      `);

    if (error) {
      throw error;
    }

    // Format the data to match expected frontend structure
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

    res.json(formattedData);
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
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
      throw error;
    }

    res.json({
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
    });
  } catch (error) {
    console.error('Get inventory item error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/inventory', async (req, res) => {
  try {
    const item = req.body;
    
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
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Create inventory item error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = req.body;
    
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
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Update inventory item error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Delete inventory item error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Departments routes
app.get('/api/departments', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('*');

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Categories routes
app.get('/api/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*');

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Purchase Orders routes
app.get('/api/purchase-orders', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select(`
        *,
        created_by_user:users(name),
        items:purchase_order_items(*)
      `);

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Get purchase orders error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Sales routes
app.get('/api/sales', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sales')
      .select('*');

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add more routes as needed...

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Annu ERP Backend server is running on port ${port}`);
});