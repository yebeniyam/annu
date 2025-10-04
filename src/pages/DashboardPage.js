import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
  Divider,
  CircularProgress,
  useTheme,
  Alert,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  Chip
} from '@mui/material';
import { 
  AttachMoney as RevenueIcon, 
  Restaurant as FoodIcon, 
  LocalBar as BarIcon,
  LocalCafe as BeverageIcon,
  TrendingUp as TrendUpIcon,
  TrendingDown as TrendDownIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Timeline as TimelineIcon,
  ShowChart as ShowChartIcon,
  PieChart as PieChartIcon,
  TableChart as TableChartIcon,
  DateRange as DateRangeIcon,
  Today as TodayIcon,
  ViewWeek as ViewWeekIcon,
  CalendarToday as CalendarMonthIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  ShoppingCart as SalesIcon,
  People as CustomersIcon,
  Inventory as InventoryIcon,
  Receipt as OrdersIcon,
  FileDownload as FileDownloadIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  Title, 
  Tooltip as ChartTooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { format, subDays, subWeeks, subMonths, subHours } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const MetricCard = ({ title, value, change, icon, color, onClick, prefix = '$', suffix = '' }) => {
  const isPositive = change >= 0;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();

  const handleClick = (event) => {
    if (onClick) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action) => {
    if (onClick) {
      onClick(action);
      handleClose();
    }
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease',
        border: `1px solid ${theme.palette.divider}`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
          cursor: onClick ? 'pointer' : 'default',
          borderColor: color ? `${color}80` : theme.palette.divider,
          backgroundColor: color ? `${color}08` : 'background.paper'
        }
      }}
      onClick={onClick ? () => handleClick({ action: 'view' }) : undefined}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography 
              color="textSecondary" 
              variant="subtitle2" 
              gutterBottom
              sx={{ 
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                mb: 1,
                background: color ? `linear-gradient(45deg, ${color}, ${theme.palette.primary.main})` : 'none',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
            >
              {prefix}{typeof value === 'number' 
                ? value.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })
                : value}{suffix}
            </Typography>
            <Box display="flex" alignItems="center">
              {change !== undefined && (
                <Box 
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    backgroundColor: isPositive 
                      ? theme.palette.success.light + '30' 
                      : theme.palette.error.light + '30',
                    color: isPositive ? 'success.dark' : 'error.dark',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                >
                  {isPositive ? (
                    <TrendUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                  ) : (
                    <TrendDownIcon fontSize="small" sx={{ mr: 0.5 }} />
                  )}
                  {Math.abs(change)}% {isPositive ? '↑' : '↓'}
                </Box>
              )}
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ ml: 1 }}
              >
                vs. last period
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: color ? `${color}15` : theme.palette.action.hover,
              borderRadius: '12px',
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color || theme.palette.primary.main,
              ml: 2,
              flexShrink: 0,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: 2
              }
            }}
          >
            {React.cloneElement(icon, { 
              fontSize: 'medium',
              style: { 
                filter: color ? 'none' : 'grayscale(100%)',
                opacity: color ? 1 : 0.8
              } 
            })}
          </Box>
        </Box>
      </CardContent>
      {onClick && (
        <>
          <Divider />
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              p: 1,
              backgroundColor: 'action.hover',
              borderBottomLeftRadius: 'inherit',
              borderBottomRightRadius: 'inherit'
            }}
          >
            <Typography 
              variant="caption" 
              color="textSecondary"
              sx={{ px: 1 }}
            >
              Click for details
            </Typography>
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                handleClick(e);
              }}
              aria-label="more"
              aria-controls={open ? 'metric-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)'
                }
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
          <Menu
            id="metric-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={(e) => e.stopPropagation()}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              elevation: 3,
              sx: {
                minWidth: 180,
                borderRadius: 2,
                overflow: 'visible',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '\"\"',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
          >
            <MenuItem 
              onClick={() => handleAction('view')}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                }
              }}
            >
              <ListItemIcon>
                <ShowChartIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>View Details</ListItemText>
            </MenuItem>
            <MenuItem 
              onClick={() => handleAction('export')}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                }
              }}
            >
              <ListItemIcon>
                <TableChartIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Export Data</ListItemText>
            </MenuItem>
          </Menu>
        </>
      )}
    </Card>
  );
};

const DashboardPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [viewMode, setViewMode] = useState('charts');
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 7),
    end: new Date()
  });

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`
        }
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Generate mock data based on time range
  const generateMockData = (range) => {
    const now = new Date();
    let labels = [];
    let salesData = [];
    let visitorsData = [];
    let ordersData = [];
    
    if (range === 'day') {
      // Last 24 hours in 2-hour intervals
      labels = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setHours(now.getHours() - (22 - i * 2));
        return format(date, 'ha');
      });
      
      // Generate random data with a trend
      for (let i = 0; i < 12; i++) {
        const base = 100 + Math.random() * 50;
        const trend = i * (Math.random() * 20 + 10);
        const noise = (Math.random() - 0.5) * 50;
        salesData.push(Math.round(base + trend + noise));
        visitorsData.push(Math.round((base + trend + noise) * (0.5 + Math.random() * 0.5)));
        ordersData.push(Math.round((base + trend + noise) * (0.3 + Math.random() * 0.2)));
      }
    } else if (range === 'week') {
      // Last 7 days
      labels = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(now, 6 - i);
        return format(date, 'EEE');
      });
      
      for (let i = 0; i < 7; i++) {
        const base = 500 + Math.random() * 200;
        const trend = i * (Math.random() * 100 + 50);
        const noise = (Math.random() - 0.5) * 200;
        salesData.push(Math.round(base + trend + noise));
        visitorsData.push(Math.round((base + trend + noise) * (0.5 + Math.random() * 0.5)));
        ordersData.push(Math.round((base + trend + noise) * (0.3 + Math.random() * 0.2)));
      }
    } else {
      // Last 30 days
      labels = Array.from({ length: 30 }, (_, i) => {
        const date = subDays(now, 29 - i);
        return format(date, 'MMM d');
      });
      
      for (let i = 0; i < 30; i++) {
        const base = 200 + Math.random() * 100;
        const trend = i * (Math.random() * 30 + 10);
        const noise = (Math.random() - 0.5) * 100;
        salesData.push(Math.round(base + trend + noise));
        visitorsData.push(Math.round((base + trend + noise) * (0.5 + Math.random() * 0.5)));
        ordersData.push(Math.round((base + trend + noise) * (0.3 + Math.random() * 0.2)));
      }
    }

    // Calculate metrics
    const totalSales = salesData.reduce((sum, val) => sum + val, 0);
    const totalVisitors = visitorsData.reduce((sum, val) => sum + val, 0);
    const totalOrders = ordersData.reduce((sum, val) => sum + val, 0);
    const avgOrderValue = totalSales / (totalOrders || 1);

    return {
      metrics: {
        revenue: { 
          current: totalSales, 
          change: (Math.random() * 20 - 5).toFixed(1) 
        },
        orders: { 
          current: totalOrders, 
          change: (Math.random() * 15 - 3).toFixed(1) 
        },
        customers: { 
          current: totalVisitors, 
          change: (Math.random() * 10 + 2).toFixed(1) 
        },
        avgOrder: { 
          current: avgOrderValue, 
          change: (Math.random() * 8 - 2).toFixed(1) 
        },
      },
      charts: {
        sales: {
          labels,
          datasets: [
            {
              label: 'Sales ($)',
              data: salesData,
              borderColor: theme.palette.primary.main,
              backgroundColor: `${theme.palette.primary.main}20`,
              borderWidth: 2,
              tension: 0.3,
              fill: true
            },
            {
              label: 'Visitors',
              data: visitorsData,
              borderColor: theme.palette.secondary.main,
              backgroundColor: `${theme.palette.secondary.main}20`,
              borderWidth: 2,
              tension: 0.3,
              fill: false
            },
            {
              label: 'Orders',
              data: ordersData,
              borderColor: theme.palette.success.main,
              backgroundColor: `${theme.palette.success.main}20`,
              borderWidth: 2,
              tension: 0.3,
              fill: false
            }
          ]
        },
        categories: {
          labels: ['Food', 'Beverages', 'Alcohol', 'Desserts', 'Sides'],
          datasets: [{
            data: [
              Math.round(totalSales * 0.4),
              Math.round(totalSales * 0.25),
              Math.round(totalSales * 0.2),
              Math.round(totalSales * 0.1),
              Math.round(totalSales * 0.05)
            ],
            backgroundColor: [
              theme.palette.primary.main,
              theme.palette.secondary.main,
              theme.palette.error.main,
              theme.palette.warning.main,
              theme.palette.info.main
            ],
            borderWidth: 0,
          }]
        }
      },
      recentOrders: Array.from({ length: 5 }, (_, i) => ({
        id: `ORD-${1000 + i}`,
        customer: `Customer ${i + 1}`,
        items: Math.floor(Math.random() * 5) + 1,
        total: (Math.random() * 200 + 20).toFixed(2),
        status: ['Completed', 'Processing', 'Pending', 'Cancelled'][Math.floor(Math.random() * 4)],
        date: format(subHours(now, Math.random() * 72), 'MMM d, yyyy hh:mm a')
      })),
      topProducts: [
        { id: 1, name: 'Margherita Pizza', sales: 124, revenue: 1488.00 },
        { id: 2, name: 'Caesar Salad', sales: 98, revenue: 1078.00 },
        { id: 3, name: 'Pasta Carbonara', sales: 87, revenue: 1305.00 },
        { id: 4, name: 'Red Wine', sales: 76, revenue: 1520.00 },
        { id: 5, name: 'Tiramisu', sales: 65, revenue: 487.50 },
      ]
    };
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate mock data based on selected time range
      const mockData = generateMockData(timeRange);
      
      setDashboardData(mockData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
      setLoading(false);
    }
  };

  // Handle time range change
  const handleTimeRangeChange = (event, newRange) => {
    if (newRange !== null) {
      setTimeRange(newRange);
      
      // Update date range based on selection
      const now = new Date();
      if (newRange === 'day') {
        setDateRange({
          start: subDays(now, 1),
          end: now
        });
      } else if (newRange === 'week') {
        setDateRange({
          start: subWeeks(now, 1),
          end: now
        });
      } else {
        setDateRange({
          start: subMonths(now, 1),
          end: now
        });
      }
    }
  };

  // Handle view mode change
  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  // Handle metric card click
  const handleMetricClick = (metric, action) => {
    console.log(`${action} ${metric} data`);
    // In a real app, you would navigate to a detailed view or show a dialog
  };

  // Load data on component mount and when time range changes
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    } else {
      navigate('/login');
    }
  }, [user, navigate, timeRange]);

  // Show loading state
  if (loading && !dashboardData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" flexDirection="column">
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" mt={2} color="textSecondary">
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box p={3}>
        <Alert 
          severity="error"
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={fetchDashboardData}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name || 'User'}!
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Here's what's happening with your business today.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Revenue Card */}
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="TOTAL REVENUE"
            value={dashboardData.revenue.current}
            change={dashboardData.revenue.change}
            icon={<RevenueIcon />}
            color={theme.palette.primary.main}
          />
        </Grid>

        {/* Food Cost Card */}
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="FOOD COST %"
            value={dashboardData.foodCost.current}
            change={dashboardData.foodCost.change}
            icon={<FoodIcon />}
            color={theme.palette.error.main}
          />
        </Grid>

        {/* Bar Cost Card */}
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="BAR COST %"
            value={dashboardData.barCost.current}
            change={dashboardData.barCost.change}
            icon={<BarIcon />}
            color={theme.palette.warning.main}
          />
        </Grid>

        {/* Beverage Cost Card */}
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="BEVERAGE COST %"
            value={dashboardData.beverageCost.current}
            change={dashboardData.beverageCost.change}
            icon={<BeverageIcon />}
            color={theme.palette.info.main}
          />
        </Grid>

        {/* Sales Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Weekly Sales Overview
            </Typography>
            <Box sx={{ height: 300, mt: 3 }}>
              <Bar
                data={dashboardData.salesData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        drawBorder: false,
                      },
                      ticks: {
                        callback: (value) => `$${value}`,
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Cost Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Cost Distribution
            </Typography>
            <Box sx={{ height: 300, mt: 3, position: 'relative' }}>
              <Pie
                data={dashboardData.costDistribution}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = Math.round((value / total) * 100);
                          return `${label}: ${percentage}% ($${value.toLocaleString()})`;
                        },
                      },
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;