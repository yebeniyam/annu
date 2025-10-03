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
  Button
} from '@mui/material';
import { 
  AttachMoney as RevenueIcon, 
  Restaurant as FoodIcon, 
  LocalBar as BarIcon,
  LocalCafe as BeverageIcon,
  TrendingUp as TrendUpIcon,
  TrendingDown as TrendDownIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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

const MetricCard = ({ title, value, change, icon, color }) => {
  const isPositive = change >= 0;
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography color="textSecondary" variant="subtitle2">
            {title}
          </Typography>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: '50%',
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography variant="h4">
          ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Typography>
        <Box display="flex" alignItems="center" mt={1}>
          {isPositive ? (
            <TrendUpIcon color="success" fontSize="small" />
          ) : (
            <TrendDownIcon color="error" fontSize="small" />
          )}
          <Typography
            variant="body2"
            sx={{
              color: isPositive ? 'success.main' : 'error.main',
              ml: 0.5,
            }}
          >
            {Math.abs(change)}% {isPositive ? 'increase' : 'decrease'} from last period
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const DashboardPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, you would fetch this data from your API
      // For now, we'll use mock data
      const mockData = {
        revenue: { current: 12547.89, change: 12.5 },
        foodCost: { current: 4231.75, change: -2.3 },
        barCost: { current: 1876.50, change: 5.2 },
        beverageCost: { current: 987.25, change: 1.8 },
        salesData: {
          labels: Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return format(date, 'EEE');
          }),
          datasets: [{
            label: 'Sales ($)',
            data: [1200, 1900, 1500, 2000, 1800, 2400, 2100],
            backgroundColor: theme.palette.primary.main,
          }]
        },
        costDistribution: {
          labels: ['Food', 'Bar', 'Beverage', 'Other'],
          datasets: [{
            data: [45, 25, 20, 10],
            backgroundColor: [
              theme.palette.primary.main,
              theme.palette.secondary.main,
              theme.palette.info.main,
              theme.palette.grey[500]
            ],
          }]
        }
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDashboardData(mockData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  if (loading && !dashboardData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" flexDirection="column">
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" mt={2}>Loading dashboard data...</Typography>
      </Box>
    );
  }

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