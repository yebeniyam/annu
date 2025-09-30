import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  role: Yup.string().required('Role is required'),
  status: Yup.boolean(),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .when('$isEditing', (isEditing, schema) => 
      isEditing ? schema.notRequired() : schema.required('Password is required')
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .when('password', {
      is: (val) => val && val.length > 0,
      then: Yup.string().required('Please confirm your password'),
    }),
});

const UserForm = ({ user, onSubmit, onCancel }) => {
  const isEditing = !!user;
  
  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'staff',
      status: user?.status !== undefined ? user.status : true,
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    context: { isEditing },
    onSubmit: (values) => {
      // Remove confirmPassword before submitting
      const { confirmPassword, ...userData } = values;
      // Only include password if it's being set/changed
      if (!userData.password) {
        delete userData.password;
      }
      onSubmit(userData);
    },
  });

  const roles = [
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Manager' },
    { value: 'staff', label: 'Staff' },
  ];

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Full Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            margin="normal"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            margin="normal"
            disabled={isEditing}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal" error={formik.touched.role && Boolean(formik.errors.role)}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={formik.values.role}
              label="Role"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.role && formik.errors.role && (
              <FormHelperText>{formik.errors.role}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.status}
                onChange={formik.handleChange}
                name="status"
                color="primary"
              />
            }
            label="Active"
            sx={{ mt: 2 }}
          />
        </Grid>

        {!isEditing && (
          <>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Set Password
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                margin="normal"
              />
            </Grid>
          </>
        )}

        {isEditing && (
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              Leave password fields empty to keep current password
            </Typography>
            <TextField
              fullWidth
              id="password"
              name="password"
              label="New Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              margin="normal"
            />
            {formik.values.password && (
              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                margin="normal"
              />
            )}
          </Grid>
        )}

        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button onClick={onCancel} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              {isEditing ? 'Update User' : 'Create User'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default UserForm;
