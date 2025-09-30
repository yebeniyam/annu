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
  useTheme
} from '@mui/material';
import { 
  AttachMoney as RevenueIcon, 
  Restaurant as FoodIcon, 
  LocalBar as BarIcon,
  LocalCafe as BeverageIcon,
  TrendingUp as TrendUpIcon,
  TrendingDown as TrendDownIcon
} from '@mui/icons-material';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

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

const DashboardPage = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    revenue: { current: 0, change: 0 },
    foodCost: { current: 0, change: 0 },
    barCost: { current: 0, change: 0 },
    beverageCost: { current: 0, change: 0 },
    salesData: {
      labels: [],
      datasets: [{
        label: 'Sales',
        data: [],
        backgroundColor: 'rgba(25, 118, 210, 0.7)',
      }]
    },
    costDistribution: {
      labels: ['Food', 'Bar', 'Beverage', 'Other'],
      datasets: [{
        data: [0, 0, 0, 0],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.info.main,
          theme.palette.grey[500]
        ],
      }]
    }
  });

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // In a real app, you would fetch this data from your API
        setTimeout(() => {
          setDashboardData({
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
                borderWidth: 1,
              }]
            }
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [theme.palette]);

  const renderMetricCard = (title, value, change, icon, color) => {
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
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
          {renderMetricCard(
            'TOTAL REVENUE',
            dashboardData.revenue.current,
            dashboardData.revenue.change,
            <RevenueIcon />,
            theme.palette.primary.main
          )}
        </Grid>

        {/* Food Cost Card */}
        <Grid item xs={12} sm={6} md={3}>
          {renderMetricCard(
            'FOOD COST %',
            dashboardData.foodCost.current,
            dashboardData.foodCost.change,
            <FoodIcon />,
            theme.palette.secondary.main
          )}
        </Grid>

        {/* Bar Cost Card */}
        <Grid item xs={12} sm={6} md={3}>
          {renderMetricCard(
            'BAR COST %',
            dashboardData.barCost.current,
            dashboardData.barCost.change,
            <BarIcon />,
            theme.palette.info.main
          )}
        </Grid>

        {/* Beverage Cost Card */}
        <Grid item xs={12} sm={6} md={3}>
          {renderMetricCard(
            'BEVERAGE COST %',
            dashboardData.beverageCost.current,
            dashboardData.beverageCost.change,
            <BeverageIcon />,
            theme.palette.success.main
          )}
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