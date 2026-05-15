import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Chip,
  alpha,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const theme = {
  navy: '#0B1220',
  navyLight: '#1A1F36',
  navyCard: '#151F30',
  gold: '#C9A84C',
  slate: '#94A3B8',
  white: '#F1F5F9'
};

const WardenProfile = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ color: theme.white, fontWeight: 800, mb: 1 }}>
        Profile
      </Typography>
      <Typography variant="body1" sx={{ color: theme.slate, mb: 4 }}>
        Manage your profile information
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 4,
              bgcolor: alpha(theme.navyLight, 0.3),
              borderRadius: '24px',
              border: `1px solid ${alpha(theme.gold, 0.1)}`,
              textAlign: 'center'
            }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: alpha(theme.gold, 0.2),
                color: theme.gold,
                fontSize: '3rem',
                mx: 'auto',
                mb: 2
              }}
            >
              {user?.name?.charAt(0) || 'W'}
            </Avatar>
            <Typography variant="h5" sx={{ color: theme.white, fontWeight: 700 }}>
              {user?.name || 'Warden'}
            </Typography>
            <Chip
              label="Warden"
              sx={{ mt: 1, bgcolor: alpha(theme.gold, 0.1), color: theme.gold }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 4,
              bgcolor: alpha(theme.navyLight, 0.3),
              borderRadius: '24px',
              border: `1px solid ${alpha(theme.gold, 0.1)}`
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" sx={{ color: theme.white, fontWeight: 600 }}>
                Personal Information
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setEditMode(!editMode)}
                sx={{ borderColor: alpha(theme.gold, 0.3), color: theme.gold }}
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </Button>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" gap={2}>
                  <PersonIcon sx={{ color: theme.gold }} />
                  <Box flex={1}>
                    <Typography variant="caption" sx={{ color: theme.slate }}>Full Name</Typography>
                    {editMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        defaultValue={user?.name}
                        sx={{ '& .MuiOutlinedInput-root': { color: theme.white } }}
                      />
                    ) : (
                      <Typography sx={{ color: theme.white }}>{user?.name || 'Warden'}</Typography>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" gap={2}>
                  <EmailIcon sx={{ color: theme.gold }} />
                  <Box flex={1}>
                    <Typography variant="caption" sx={{ color: theme.slate }}>Email</Typography>
                    <Typography sx={{ color: theme.white }}>{user?.email}</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" gap={2}>
                  <PhoneIcon sx={{ color: theme.gold }} />
                  <Box flex={1}>
                    <Typography variant="caption" sx={{ color: theme.slate }}>Phone</Typography>
                    {editMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        defaultValue="+91 9876543210"
                        sx={{ '& .MuiOutlinedInput-root': { color: theme.white } }}
                      />
                    ) : (
                      <Typography sx={{ color: theme.white }}>+91 9876543210</Typography>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" gap={2}>
                  <BadgeIcon sx={{ color: theme.gold }} />
                  <Box flex={1}>
                    <Typography variant="caption" sx={{ color: theme.slate }}>Employee ID</Typography>
                    <Typography sx={{ color: theme.white }}>WRN001</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {editMode && (
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{ bgcolor: theme.gold, color: theme.navy }}
                >
                  Save Changes
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WardenProfile;