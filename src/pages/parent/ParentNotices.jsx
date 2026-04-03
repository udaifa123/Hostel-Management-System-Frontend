import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  alpha,
  LinearProgress,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Button
} from '@mui/material';
import {
  Announcement as AnnouncementIcon,
  CalendarToday as CalendarIcon,
  PushPin as PinIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  EventNote as EventNoteIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import parentService from '../../services/parentService';

// ==================== Green Design Tokens ====================
const G = {
  900: '#0D3318',
  800: '#1A5C2A',
  700: '#1E7A35',
  600: '#2E9142',
  500: '#3AAF51',
  400: '#5DC470',
  300: '#8FD9A0',
  200: '#C1EDCA',
  100: '#E4F7E8',
  50: '#F4FBF5',
};

const CARD_SHADOW = '0 1px 4px rgba(30,122,53,0.10), 0 0 0 1px rgba(30,122,53,0.08)';

// ==================== Category Config ====================
const categoryConfig = {
  general: { label: 'General', color: G[500], bg: alpha(G[500], 0.1), icon: <AnnouncementIcon sx={{ fontSize: '14px' }} /> },
  maintenance: { label: 'Maintenance', color: G[600], bg: alpha(G[600], 0.1), icon: <WarningIcon sx={{ fontSize: '14px' }} /> },
  event: { label: 'Event', color: '#F59E0B', bg: alpha('#F59E0B', 0.1), icon: <EventNoteIcon sx={{ fontSize: '14px' }} /> },
  mess: { label: 'Mess', color: '#8B5CF6', bg: alpha('#8B5CF6', 0.1), icon: <InfoIcon sx={{ fontSize: '14px' }} /> },
  emergency: { label: 'Emergency', color: '#EF4444', bg: alpha('#EF4444', 0.1), icon: <WarningIcon sx={{ fontSize: '14px' }} /> },
};

const ParentNotices = () => {
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  // Fetch notices from API
  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await parentService.getNotices();
      console.log('Parent notices response:', response);
      
      let noticesData = [];
      if (response.success && response.data) {
        noticesData = response.data;
      } else if (Array.isArray(response)) {
        noticesData = response;
      } else if (response.data && Array.isArray(response.data)) {
        noticesData = response.data;
      }
      
      setNotices(noticesData);
    } catch (error) {
      console.error('Error fetching notices:', error);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Filter notices
  const filteredNotices = notices.filter(notice => {
    const matchesSearch = 
      notice.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || notice.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort: pinned first, then by date
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
  });

  const getCategoryConfig = (category) => {
    return categoryConfig[category] || categoryConfig.general;
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: G[50], minHeight: '100vh', p: 3 }}>
        <LinearProgress sx={{ borderRadius: 5, bgcolor: G[100], '& .MuiLinearProgress-bar': { bgcolor: G[600] } }} />
        <Typography sx={{ textAlign: 'center', mt: 2, color: G[600] }}>Loading notices...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: G[50], minHeight: '100vh' }}>
      {/* Top accent bar */}
      <Box sx={{ height: 4, bgcolor: G[600] }} />

      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Paper elevation={0} sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          bgcolor: '#ffffff',
          border: `1px solid ${G[200]}`,
          boxShadow: '0 2px 8px rgba(13,51,24,0.10)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: G[800], width: 46, height: 46, borderRadius: 2 }}>
              <AnnouncementIcon sx={{ color: G[200], fontSize: 22 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: G[800], letterSpacing: '-0.01em' }}>
                Notice Board
              </Typography>
              <Typography variant="body2" sx={{ color: G[500], mt: 0.25 }}>
                Important announcements and updates from the hostel
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchNotices}
            sx={{
              borderColor: G[200],
              color: G[600],
              '&:hover': { borderColor: G[400], bgcolor: G[50] }
            }}
          >
            Refresh
          </Button>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={0} sx={{
              borderRadius: 3,
              bgcolor: G[800],
              border: `1px solid ${G[700]}`,
              boxShadow: '0 4px 16px rgba(13,51,24,0.25)',
              height: '100%',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ color: G[300], fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1 }}>
                  Total Notices
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#ffffff', fontSize: '2rem' }}>
                  {notices.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={0} sx={{
              borderRadius: 3,
              bgcolor: '#ffffff',
              border: `1px solid ${G[200]}`,
              boxShadow: CARD_SHADOW,
              height: '100%',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ color: G[600], fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1 }}>
                  Pinned
                </Typography>
                <Typography sx={{ fontWeight: 700, color: G[600], fontSize: '2rem' }}>
                  {notices.filter(n => n.pinned).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={0} sx={{
              borderRadius: 3,
              bgcolor: '#ffffff',
              border: `1px solid ${G[200]}`,
              boxShadow: CARD_SHADOW,
              height: '100%',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ color: G[600], fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1 }}>
                  This Week
                </Typography>
                <Typography sx={{ fontWeight: 700, color: G[600], fontSize: '2rem' }}>
                  {notices.filter(n => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(n.createdAt || n.date) > weekAgo;
                  }).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={0} sx={{
              borderRadius: 3,
              bgcolor: '#ffffff',
              border: `1px solid ${G[200]}`,
              boxShadow: CARD_SHADOW,
              height: '100%',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ color: G[600], fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1 }}>
                  Categories
                </Typography>
                <Typography sx={{ fontWeight: 700, color: G[600], fontSize: '2rem' }}>
                  {Object.keys(categoryConfig).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filter */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: '#ffffff', border: `1px solid ${G[200]}` }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search notices by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: G[400] }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchTerm('')}>
                        <CloseIcon fontSize="small" sx={{ color: G[400] }} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: G[200] },
                    '&:hover fieldset': { borderColor: G[400] },
                    '&.Mui-focused fieldset': { borderColor: G[600] },
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                sx={{
                  borderColor: G[200],
                  color: G[600],
                  '&:hover': { borderColor: G[400], bgcolor: G[50] }
                }}
              >
                {filterCategory === 'all' ? 'All Categories' : categoryConfig[filterCategory]?.label}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Filter Menu */}
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={() => setFilterAnchorEl(null)}
          PaperProps={{
            sx: {
              bgcolor: '#ffffff',
              border: `1px solid ${G[200]}`,
              borderRadius: 2,
              boxShadow: CARD_SHADOW,
              minWidth: 180
            }
          }}
        >
          <MenuItem onClick={() => { setFilterCategory('all'); setFilterAnchorEl(null); }}>
            <Typography sx={{ color: G[700] }}>All Categories</Typography>
          </MenuItem>
          {Object.entries(categoryConfig).map(([key, config]) => (
            <MenuItem key={key} onClick={() => { setFilterCategory(key); setFilterAnchorEl(null); }}>
              <Box display="flex" alignItems="center" gap={1}>
                {config.icon}
                <Typography sx={{ color: G[700] }}>{config.label}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>

        {/* Notices Grid */}
        {sortedNotices.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3, border: `1px solid ${G[200]}` }}>
            <AnnouncementIcon sx={{ fontSize: 80, color: G[400], mb: 2 }} />
            <Typography variant="h6" sx={{ color: G[600], mb: 1 }}>
              No Notices Available
            </Typography>
            <Typography variant="body2" sx={{ color: G[500] }}>
              {searchTerm || filterCategory !== 'all' ? 'Try adjusting your search or filters' : 'Check back later for updates'}
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {sortedNotices.map((notice) => {
              const category = getCategoryConfig(notice.category);
              const noticeId = notice._id || notice.id;
              return (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={noticeId}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      bgcolor: '#ffffff',
                      border: `1px solid ${notice.pinned ? G[400] : G[200]}`,
                      boxShadow: notice.pinned ? `0 4px 12px ${alpha(G[600], 0.15)}` : CARD_SHADOW,
                      transition: 'all 0.2s ease',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 24px ${alpha(G[600], 0.12)}`,
                        borderColor: G[300]
                      },
                      position: 'relative',
                      overflow: 'visible'
                    }}
                  >
                    {notice.pinned && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: 16,
                          bgcolor: G[600],
                          color: '#ffffff',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        <PinIcon sx={{ fontSize: 12 }} />
                        Pinned
                      </Box>
                    )}
                    <CardContent sx={{ p: 3, flex: 1 }}>
                      <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                        <Avatar sx={{ bgcolor: category.bg, color: category.color, width: 48, height: 48 }}>
                          {category.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: G[800], lineHeight: 1.2 }}>
                            {notice.title}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                            <Chip
                              label={category.label}
                              size="small"
                              sx={{
                                bgcolor: category.bg,
                                color: category.color,
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                height: 22
                              }}
                            />
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <CalendarIcon sx={{ color: G[400], fontSize: 12 }} />
                              <Typography variant="caption" sx={{ color: G[500] }}>
                                {notice.date || new Date(notice.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>

                      <Typography variant="body2" sx={{ color: G[600], lineHeight: 1.6 }}>
                        {notice.content}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default ParentNotices;