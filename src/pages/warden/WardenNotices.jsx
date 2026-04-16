import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  alpha,
  Paper,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
  Snackbar,
  Alert,
  InputAdornment,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Announcement as AnnouncementIcon,
  CalendarToday as CalendarIcon,
  PushPin as PinIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  EventNote as EventNoteIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import wardenService from '../../services/wardenService';

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

const WardenNotices = () => {
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [newNotice, setNewNotice] = useState({ title: '', content: '', category: 'general' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch notices from API
  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await wardenService.getNotices();
      console.log('Notices response:', response);
      
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
      showSnackbar('Failed to load notices', 'error');
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

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

  // Create Notice
  const handleCreateNotice = async () => {
    if (!newNotice.title || !newNotice.content) {
      showSnackbar('Please fill all fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await wardenService.createNotice(newNotice);
      if (response.success) {
        showSnackbar('Notice published successfully', 'success');
        setOpenDialog(false);
        setNewNotice({ title: '', content: '', category: 'general' });
        await fetchNotices();
      } else {
        showSnackbar(response.message || 'Failed to create notice', 'error');
      }
    } catch (error) {
      console.error('Error creating notice:', error);
      showSnackbar(error.response?.data?.message || 'Failed to create notice', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Update Notice
  const handleUpdateNotice = async () => {
    if (!newNotice.title || !newNotice.content) {
      showSnackbar('Please fill all fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const noticeId = editingNotice._id || editingNotice.id;
      if (!noticeId) {
        showSnackbar('Invalid notice ID', 'error');
        return;
      }
      
      const response = await wardenService.updateNotice(noticeId, newNotice);
      if (response.success) {
        showSnackbar('Notice updated successfully', 'success');
        setOpenDialog(false);
        setEditingNotice(null);
        setNewNotice({ title: '', content: '', category: 'general' });
        await fetchNotices();
      } else {
        showSnackbar(response.message || 'Failed to update notice', 'error');
      }
    } catch (error) {
      console.error('Error updating notice:', error);
      showSnackbar(error.response?.data?.message || 'Failed to update notice', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Pin/Unpin Notice
  const handlePin = async (noticeId, currentPinned) => {
    if (!noticeId) {
      showSnackbar('Invalid notice ID', 'error');
      return;
    }
    
    try {
      const response = await wardenService.pinNotice(noticeId, !currentPinned);
      if (response.success) {
        showSnackbar(currentPinned ? 'Notice unpinned' : 'Notice pinned', 'success');
        await fetchNotices();
      } else {
        showSnackbar(response.message || 'Failed to update notice', 'error');
      }
    } catch (error) {
      console.error('Error pinning notice:', error);
      showSnackbar(error.response?.data?.message || 'Failed to pin notice', 'error');
    }
    setMenuAnchorEl(null);
  };

  // Delete Notice
  const handleDelete = async (noticeId) => {
    if (!noticeId) {
      showSnackbar('Invalid notice ID', 'error');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    
    try {
      const response = await wardenService.deleteNotice(noticeId);
      if (response.success) {
        showSnackbar('Notice deleted successfully', 'success');
        await fetchNotices();
      } else {
        showSnackbar(response.message || 'Failed to delete notice', 'error');
      }
    } catch (error) {
      console.error('Error deleting notice:', error);
      showSnackbar(error.response?.data?.message || 'Failed to delete notice', 'error');
    }
    setMenuAnchorEl(null);
  };

  const handleEditClick = (notice) => {
    setEditingNotice(notice);
    setNewNotice({ 
      title: notice.title, 
      content: notice.content, 
      category: notice.category 
    });
    setOpenDialog(true);
    setMenuAnchorEl(null);
  };

  const handleSave = () => {
    if (editingNotice) {
      handleUpdateNotice();
    } else {
      handleCreateNotice();
    }
  };

  const handleRefresh = () => {
    fetchNotices();
  };

  const handleMenuOpen = (event, noticeId) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedNoticeId(noticeId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedNoticeId(null);
  };

  const getSelectedNotice = () => {
    return notices.find(n => n._id === selectedNoticeId || n.id === selectedNoticeId);
  };

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
                Manage hostel announcements and notices
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingNotice(null);
              setNewNotice({ title: '', content: '', category: 'general' });
              setOpenDialog(true);
            }}
            sx={{
              bgcolor: G[700], color: '#ffffff', fontWeight: 600,
              borderRadius: 2, textTransform: 'none',
              boxShadow: '0 4px 12px rgba(30,122,53,0.30)',
              '&:hover': { bgcolor: G[800] }
            }}
          >
            Create Notice
          </Button>
        </Paper>

        {/* Stats Cards - Fixed Grid Gap */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{
              borderRadius: 3,
              bgcolor: G[800],
              border: `1px solid ${G[700]}`,
              boxShadow: '0 4px 16px rgba(13,51,24,0.25)',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ color: G[300], fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', mb: 1, letterSpacing: '0.5px' }}>
                  Total Notices
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#ffffff', fontSize: '2.5rem' }}>
                  {notices.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{
              borderRadius: 3,
              bgcolor: '#ffffff',
              border: `1px solid ${G[200]}`,
              boxShadow: CARD_SHADOW,
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ color: G[600], fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', mb: 1, letterSpacing: '0.5px' }}>
                  Pinned
                </Typography>
                <Typography sx={{ fontWeight: 700, color: G[600], fontSize: '2.5rem' }}>
                  {notices.filter(n => n.pinned).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{
              borderRadius: 3,
              bgcolor: '#ffffff',
              border: `1px solid ${G[200]}`,
              boxShadow: CARD_SHADOW,
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ color: G[600], fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', mb: 1, letterSpacing: '0.5px' }}>
                  This Week
                </Typography>
                <Typography sx={{ fontWeight: 700, color: G[600], fontSize: '2.5rem' }}>
                  {notices.filter(n => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(n.createdAt || n.date) > weekAgo;
                  }).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{
              borderRadius: 3,
              bgcolor: '#ffffff',
              border: `1px solid ${G[200]}`,
              boxShadow: CARD_SHADOW,
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ color: G[600], fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', mb: 1, letterSpacing: '0.5px' }}>
                  Categories
                </Typography>
                <Typography sx={{ fontWeight: 700, color: G[600], fontSize: '2.5rem' }}>
                  {Object.keys(categoryConfig).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filter */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: '#ffffff', border: `1px solid ${G[200]}` }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={3}>
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
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                sx={{
                  borderColor: G[200],
                  color: G[600],
                  '&:hover': { borderColor: G[400], bgcolor: G[50] }
                }}
              >
                Refresh
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
              No Notices Found
            </Typography>
            <Typography variant="body2" sx={{ color: G[500] }}>
              {searchTerm || filterCategory !== 'all' ? 'Try adjusting your search or filters' : 'Create your first notice to get started'}
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {sortedNotices.map((notice) => {
              const category = getCategoryConfig(notice.category);
              const noticeId = notice._id || notice.id;
              return (
                <Grid item xs={12} md={6} lg={4} key={noticeId}>
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
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Avatar sx={{ bgcolor: category.bg, color: category.color, width: 40, height: 40 }}>
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
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, noticeId)}
                          sx={{ color: G[400] }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <Typography variant="body2" sx={{ color: G[600], mb: 2, lineHeight: 1.6 }}>
                        {notice.content}
                      </Typography>

                      <Divider sx={{ borderColor: G[100], my: 2 }} />

                      <Box display="flex" justifyContent="flex-end" gap={1}>
                        <Tooltip title="Edit Notice">
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(notice)}
                            sx={{
                              color: G[600],
                              bgcolor: G[100],
                              borderRadius: 1.5,
                              '&:hover': { bgcolor: G[200] }
                            }}
                          >
                            <EditIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={notice.pinned ? 'Unpin Notice' : 'Pin Notice'}>
                          <IconButton
                            size="small"
                            onClick={() => handlePin(noticeId, notice.pinned)}
                            sx={{
                              color: notice.pinned ? G[600] : G[400],
                              bgcolor: G[100],
                              borderRadius: 1.5,
                              '&:hover': { bgcolor: G[200] }
                            }}
                          >
                            <PinIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Notice">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(noticeId)}
                            sx={{
                              color: '#c0392b',
                              bgcolor: '#fef2f2',
                              borderRadius: 1.5,
                              '&:hover': { bgcolor: '#fee2e2' }
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Menu for notice actions */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              bgcolor: '#ffffff',
              border: `1px solid ${G[200]}`,
              borderRadius: 2,
              boxShadow: CARD_SHADOW,
              minWidth: 150
            }
          }}
        >
          {getSelectedNotice() && (
            <>
              <MenuItem onClick={() => handleEditClick(getSelectedNotice())}>
                <EditIcon sx={{ fontSize: 16, mr: 1, color: G[600] }} />
                Edit Notice
              </MenuItem>
              <MenuItem onClick={() => handlePin(getSelectedNotice()._id || getSelectedNotice().id, getSelectedNotice().pinned)}>
                <PinIcon sx={{ fontSize: 16, mr: 1, color: G[600] }} />
                {getSelectedNotice().pinned ? 'Unpin Notice' : 'Pin Notice'}
              </MenuItem>
              <Divider sx={{ borderColor: G[100] }} />
              <MenuItem onClick={() => handleDelete(getSelectedNotice()._id || getSelectedNotice().id)} sx={{ color: '#c0392b' }}>
                <DeleteIcon sx={{ fontSize: 16, mr: 1 }} />
                Delete Notice
              </MenuItem>
            </>
          )}
        </Menu>

        {/* Create/Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
            setEditingNotice(null);
            setNewNotice({ title: '', content: '', category: 'general' });
          }}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              bgcolor: '#ffffff',
              border: `1px solid ${G[200]}`,
              boxShadow: '0 24px 48px rgba(13,51,24,0.15)',
            }
          }}
        >
          <Box sx={{ height: 4, bgcolor: G[600], borderRadius: '12px 12px 0 0' }} />
          <DialogTitle sx={{ pt: 2.5, pb: 1.5 }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Avatar sx={{ bgcolor: G[800], width: 38, height: 38, borderRadius: 1.5 }}>
                <AnnouncementIcon sx={{ color: G[200], fontSize: 18 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700, color: G[800] }}>
                {editingNotice ? 'Edit Notice' : 'Create New Notice'}
              </Typography>
            </Box>
          </DialogTitle>
          <Divider sx={{ borderColor: G[100] }} />
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="Enter notice title"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                      '&:hover fieldset': { borderColor: G[400] },
                      '&.Mui-focused fieldset': { borderColor: G[600] },
                    },
                    '& .MuiInputLabel-root': { color: G[600] },
                    '& .MuiInputLabel-root.Mui-focused': { color: G[700] },
                    '& input': { color: G[800] },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Content"
                  multiline
                  rows={4}
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  placeholder="Enter notice details..."
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                      '&:hover fieldset': { borderColor: G[400] },
                      '&.Mui-focused fieldset': { borderColor: G[600] },
                    },
                    '& .MuiInputLabel-root': { color: G[600] },
                    '& .MuiInputLabel-root.Mui-focused': { color: G[700] },
                    '& textarea': { color: G[800] },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Category"
                  select
                  value={newNotice.category}
                  onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                  SelectProps={{
                    native: true,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: G[50],
                      '& fieldset': { borderColor: G[200] },
                      '&:hover fieldset': { borderColor: G[400] },
                      '&.Mui-focused fieldset': { borderColor: G[600] },
                    },
                    '& .MuiInputLabel-root': { color: G[600] },
                    '& .MuiInputLabel-root.Mui-focused': { color: G[700] },
                    '& select': { color: G[800] },
                  }}
                >
                  <option value="general">General</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="event">Event</option>
                  <option value="mess">Mess</option>
                  <option value="emergency">Emergency</option>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <Divider sx={{ borderColor: G[100] }} />
          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <Button
              onClick={() => {
                setOpenDialog(false);
                setEditingNotice(null);
                setNewNotice({ title: '', content: '', category: 'general' });
              }}
              sx={{
                color: G[600],
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                border: `1px solid ${G[200]}`,
                px: 3,
                '&:hover': { bgcolor: G[50] }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={submitting}
              sx={{
                bgcolor: G[700],
                color: '#ffffff',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                boxShadow: '0 4px 12px rgba(30,122,53,0.30)',
                '&:hover': { bgcolor: G[800] }
              }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : (editingNotice ? 'Save Changes' : 'Publish Notice')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default WardenNotices;