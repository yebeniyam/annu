import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Toolbar, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as PurchaseIcon,
  Receipt as ReceivingIcon,
  PointOfSale as SalesIcon,
  InsertChartOutlined as ReportsIcon,
  Settings as SettingsIcon,
  People as UsersIcon,
  Restaurant as KitchenIcon,
  LocalBar as BarIcon,
  LocalCafe as BeverageIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { 
    text: 'Inventory', 
    icon: <InventoryIcon />, 
    path: '/inventory',
    children: [
      { text: 'All Items', path: '/inventory' },
      { text: 'Kitchen', path: '/inventory/kitchen' },
      { text: 'Bar', path: '/inventory/bar' },
      { text: 'Beverage', path: '/inventory/beverage' },
      { text: 'Storage', path: '/inventory/storage' },
    ]
  },
  { 
    text: 'Purchasing', 
    icon: <PurchaseIcon />, 
    path: '/purchasing',
    roles: ['manager', 'purchaser']
  },
  { 
    text: 'Receiving', 
    icon: <ReceivingIcon />, 
    path: '/receiving',
    roles: ['manager', 'receiver']
  },
  { 
    text: 'Sales', 
    icon: <SalesIcon />, 
    path: '/sales',
    roles: ['manager', 'cashier']
  },
  { 
    text: 'Reports', 
    icon: <ReportsIcon />, 
    path: '/reports',
    children: [
      { text: 'Cost Summary', path: '/reports/cost-summary' },
      { text: 'Waste & Shrinkage', path: '/reports/waste' },
      { text: 'Price Variance', path: '/reports/price-variance' },
      { text: 'Recipe Costs', path: '/reports/recipe-costs' },
    ]
  },
  { 
    text: 'Users', 
    icon: <UsersIcon />, 
    path: '/users',
    roles: ['admin']
  },
  { 
    text: 'Settings', 
    icon: <SettingsIcon />, 
    path: '/settings',
    roles: ['admin', 'manager']
  },
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = React.useState({});

  const handleDrawerToggle = () => {
    onClose();
  };

  const handleItemClick = (item) => {
    if (item.children) {
      setOpenSubmenu(prev => ({
        ...prev,
        [item.text]: !prev[item.text]
      }));
    } else {
      navigate(item.path);
      if (mobileOpen) {
        onClose();
      }
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const renderMenuItems = (items) => {
    return items.map((item) => (
      <React.Fragment key={item.text}>
        <ListItem 
          button 
          onClick={() => handleItemClick(item)}
          selected={isActive(item.path)}
          sx={{
            '&.Mui-selected': {
              backgroundColor: theme.palette.action.selected,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.text} />
          {item.children && (
            <Box component="span" sx={{ ml: 'auto' }}>
              {openSubmenu[item.text] ? '▼' : '▶'}
            </Box>
          )}
        </ListItem>
        
        {item.children && openSubmenu[item.text] && (
          <List component="div" disablePadding>
            {item.children.map((child) => (
              <ListItem
                key={child.path}
                button
                onClick={() => handleItemClick(child)}
                selected={isActive(child.path)}
                sx={{
                  pl: 4,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.action.selected,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  },
                }}
              >
                <ListItemText primary={child.text} />
              </ListItem>
            ))}
          </List>
        )}
      </React.Fragment>
    ));
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Menu
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {renderMenuItems(menuItems)}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

Sidebar.propTypes = {
  mobileOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;
