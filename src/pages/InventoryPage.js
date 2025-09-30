import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Paper, 
  Typography, 
  Grid, 
  TextField, 
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Inventory as InventoryIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

// Mock data - replace with API calls in a real app
const mockInventory = [
  { id: 1, name: 'Chicken Breast', category: 'Meat', unit: 'kg', currentStock: 15.5, minStock: 10, costPerUnit: 5.99, lastUpdated: '2023-05-15' },
  { id: 2, name: 'Tomatoes', category: 'Produce', unit: 'kg', currentStock: 25.2, minStock: 15, costPerUnit: 2.49, lastUpdated: '2023-05-16' },
  { id: 3, name: 'Olive Oil', category: 'Pantry', unit: 'L', currentStock: 8.0, minStock: 5, costPerUnit: 12.99, lastUpdated: '2023-05-14' },
  { id: 4, name: 'Pasta', category: 'Dry Goods', unit: 'kg', currentStock: 12.75, minStock: 8, costPerUnit: 3.49, lastUpdated: '2023-05-13' },
  { id: 5, name: 'Parmesan Cheese', category: 'Dairy', unit: 'kg', currentStock: 3.2, minStock: 2, costPerUnit: 18.99, lastUpdated: '2023-05-16' },
];

const categories = ['All', 'Meat', 'Produce', 'Dairy', 'Pantry', 'Dry Goods', 'Beverages', 'Frozen'];
const units = ['kg', 'g', 'L', 'ml', 'pcs', 'boxes', 'bottles'];

const InventoryPage = () => {
  const theme = useTheme();
  const { user } = useAuth();
  
  // State for inventory data and UI
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  
  // State for dialogs
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: '',
    currentStock: '',
    minStock: '',
    costPerUnit: ''
  });
  
  // Fetch inventory data
  useEffect(() => {
    const fetchInventory = () => {
      setLoading(true);
      // In a real app, you would fetch from your API
      setTimeout(() => {
        setInventory(mockInventory);
        setLoading(false);
      }, 800);
    };
    
    fetchInventory();
  }, []);
  
  // Handle sorting
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Filter and sort inventory
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    } else {
      return a[orderBy] < b[orderBy] ? 1 : -1;
    }
  });
  
  // Pagination
  const paginatedInventory = filteredInventory.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  // Dialog handlers
  const handleOpenAddDialog = () => {
    setFormData({
      name: '',
      category: '',
      unit: '',
      currentStock: '',
      minStock: '',
      costPerUnit: ''
    });
    setOpenAddDialog(true);
  };
  
  const handleOpenEditDialog = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      unit: item.unit,
      currentStock: item.currentStock,
      minStock: item.minStock,
      costPerUnit: item.costPerUnit
    });
    setOpenEditDialog(true);
  };
  
  const handleOpenDeleteDialog = (item) => {
    setSelectedItem(item);
    setOpenDeleteDialog(true);
  };
  
  const handleCloseDialogs = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setSelectedItem(null);
  };
  
  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would make an API call here
    if (openAddDialog) {
      // Add new item
      const newItem = {
        id: Math.max(...inventory.map(i => i.id), 0) + 1,
        ...formData,
        currentStock: parseFloat(formData.currentStock),
        minStock: parseFloat(formData.minStock),
        costPerUnit: parseFloat(formData.costPerUnit),
        lastUpdated: format(new Date(), 'yyyy-MM-dd')
      };
      setInventory([...inventory, newItem]);
    } else if (openEditDialog && selectedItem) {
      // Update existing item
      const updatedInventory = inventory.map(item => 
        item.id === selectedItem.id 
          ? { 
              ...item, 
              ...formData,
              currentStock: parseFloat(formData.currentStock),
              minStock: parseFloat(formData.minStock),
              costPerUnit: parseFloat(formData.costPerUnit),
              lastUpdated: format(new Date(), 'yyyy-MM-dd')
            } 
          : item
      );
      setInventory(updatedInventory);
    }
    handleCloseDialogs();
  };
  
  const handleDelete = () => {
    if (selectedItem) {
      // In a real app, you would make an API call here
      const updatedInventory = inventory.filter(item => item.id !== selectedItem.id);
      setInventory(updatedInventory);
      handleCloseDialogs();
    }
  };
  
  // Check stock status
  const getStockStatus = (current, min) => {
    if (current === 0) return 'out-of-stock';
    if (current <= min) return 'low-stock';
    return 'in-stock';
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'in-stock': return 'success';
      case 'low-stock': return 'warning';
      case 'out-of-stock': return 'error';
      default: return 'default';
    }
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'in-stock': return 'In Stock';
      case 'low-stock': return 'Low Stock';
      case 'out-of-stock': return 'Out of Stock';
      default: return 'Unknown';
    }
  };

  // Render sort direction indicator
  const renderSortDirection = (property) => {
    if (orderBy !== property) return null;
    return order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center">
            <InventoryIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h4" component="h1">
              Inventory Management
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
          >
            Add Item
          </Button>
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => window.location.reload()}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="inventory table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={() => handleRequestSort('name')}
                    >
                      Item Name
                      {orderBy === 'name' && (
                        <Box component="span" sx={{ ml: 1 }}>
                          {renderSortDirection('name')}
                        </Box>
                      )}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Current Stock</TableCell>
                  <TableCell align="right">Min. Stock</TableCell>
                  <TableCell align="right">Unit</TableCell>
                  <TableCell align="right">Cost/Unit ($)</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedInventory.map((item) => {
                  const status = getStockStatus(item.currentStock, item.minStock);
                  return (
                    <TableRow hover key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell align="right">{item.currentStock}</TableCell>
                      <TableCell align="right">{item.minStock}</TableCell>
                      <TableCell align="right">{item.unit}</TableCell>
                      <TableCell align="right">${item.costPerUnit.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(status)}
                          color={getStatusColor(status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{format(new Date(item.lastUpdated), 'MMM d, yyyy')}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenEditDialog(item)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenDeleteDialog(item)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {paginatedInventory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                      <Typography color="textSecondary">
                        No inventory items found. Try adjusting your search or filters.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredInventory.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      {/* Add/Edit Item Dialog */}
      <Dialog open={openAddDialog || openEditDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>{openAddDialog ? 'Add New Item' : 'Edit Item'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="name"
                  label="Item Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense" required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    label="Category"
                  >
                    {categories
                      .filter(cat => cat !== 'All')
                      .map(category => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense" required>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    label="Unit"
                  >
                    {units.map(unit => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  name="currentStock"
                  label="Current Stock"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.currentStock}
                  onChange={handleInputChange}
                  inputProps={{ min: 0, step: '0.01' }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  name="minStock"
                  label="Minimum Stock Level"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.minStock}
                  onChange={handleInputChange}
                  inputProps={{ min: 0, step: '0.01' }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  name="costPerUnit"
                  label="Cost Per Unit ($)"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.costPerUnit}
                  onChange={handleInputChange}
                  inputProps={{ min: 0, step: '0.01' }}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={handleCloseDialogs} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {openAddDialog ? 'Add' : 'Update'} Item
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>Delete Inventory Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{selectedItem?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleCloseDialogs} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InventoryPage;