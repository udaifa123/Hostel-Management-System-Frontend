import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Snackbar,
  Divider,
  IconButton
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Help as HelpIcon,
  ContactSupport as ContactSupportIcon,
  School as SchoolIcon,
  Home as HomeIcon,
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
  ReportProblem as ReportProblemIcon,
  Chat as ChatIcon,
  ArrowBack as ArrowBackIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Person as PersonIcon,
  QuestionAnswer as QuestionAnswerIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const StudentHelp = () => {
  const navigate = useNavigate();
  // const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubject, setSupportSubject] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportSubject.trim() || !supportMessage.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    toast.success('Support request sent successfully!');
    setSupportSubject('');
    setSupportMessage('');
  };

  const faqs = [
    {
      category: 'Account',
      icon: <SchoolIcon sx={{ color: '#10B981' }} />,
      questions: [
        {
          q: 'How do I reset my password?',
          a: 'Go to Settings > Profile, then click on "Change Password". You will need your current password to set a new one. If you forgot your password, use the "Forgot Password" link on the login page.'
        },
        {
          q: 'How do I update my profile information?',
          a: 'Navigate to Settings > Profile to update your personal information including name, phone number, and profile picture.'
        }
      ]
    },
    {
      category: 'Attendance',
      icon: <HomeIcon sx={{ color: '#10B981' }} />,
      questions: [
        {
          q: 'How is attendance marked?',
          a: 'Attendance is marked daily by the warden or through the QR code scanning system. You can view your attendance history in the Attendance section.'
        },
        {
          q: 'What should I do if attendance is marked wrong?',
          a: 'If you notice an error in your attendance, please contact your warden immediately or raise a complaint in the Complaints section.'
        }
      ]
    },
    {
      category: 'Leaves',
      icon: <DescriptionIcon sx={{ color: '#10B981' }} />,
      questions: [
        {
          q: 'How do I apply for leave?',
          a: 'Go to the Leave section and click on "Apply Leave". Fill in the dates, reason, and submit. Your request will be reviewed by the warden.'
        },
        {
          q: 'How long does leave approval take?',
          a: 'Leave requests are typically processed within 24-48 hours. You can check the status in the Leave section.'
        }
      ]
    },
    {
      category: 'Fees',
      icon: <AttachMoneyIcon sx={{ color: '#10B981' }} />,
      questions: [
        {
          q: 'How can I pay my hostel fees?',
          a: 'Fees can be paid online through the Fees section using credit/debit card, net banking, or UPI.'
        },
        {
          q: 'How do I download a fee receipt?',
          a: 'After successful payment, you can download the receipt from the Fees section by clicking on the payment record.'
        }
      ]
    },
    {
      category: 'Complaints',
      icon: <ReportProblemIcon sx={{ color: '#10B981' }} />,
      questions: [
        {
          q: 'How do I raise a complaint?',
          a: 'Go to the Complaints section and click "New Complaint". Select the category, describe the issue, and submit.'
        },
        {
          q: 'How can I track my complaint status?',
          a: 'All your complaints and their current status are visible in the Complaints section.'
        }
      ]
    }
  ];

  const quickGuides = [
    {
      title: 'Getting Started',
      steps: [
        'Complete your profile information',
        'Check your room allocation',
        'Review hostel rules and regulations',
        'Set up notification preferences'
      ]
    },
    {
      title: 'Daily Routine',
      steps: [
        'Mark attendance (if required)',
        'Check mess menu for the day',
        'Review any announcements',
        'Plan your day accordingly'
      ]
    }
  ];

  const contactInfo = {
    warden: {
      name: 'Mr. Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'warden@hostel.com',
      office: 'Room 101, Admin Block',
      hours: '9:00 AM - 5:00 PM'
    },
    security: {
      phone: '+91 98765 43211'
    },
    medical: {
      phone: '+91 98765 43212'
    },
    admin: {
      phone: '+91 98765 43213',
      email: 'admin@hostel.com'
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
       
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/student/dashboard')}>
              <ArrowBackIcon />
            </IconButton>
            <HelpIcon sx={{ fontSize: 32, color: '#10B981' }} />
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#10B981' }}>
              Help Center
            </Typography>
          </Box>
        </Paper>

        <Grid container spacing={4}>
         
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: 1 }}>
                <QuestionAnswerIcon /> Frequently Asked Questions
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {faqs.map((category, idx) => (
                <Box key={idx} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    {category.icon}
                    <Typography variant="h6">{category.category}</Typography>
                  </Box>
                  {category.questions.map((faq, index) => (
                    <Accordion
                      key={index}
                      expanded={expanded === `${idx}-${index}`}
                      onChange={handleAccordionChange(`${idx}-${index}`)}
                      sx={{ mb: 1 }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography sx={{ fontWeight: 500 }}>{faq.q}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography color="text.secondary">{faq.a}</Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              ))}
            </Paper>
          </Grid>

          
          <Grid item xs={12} md={4}>
           
            <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#10B981' }}>
                Quick Guides
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {quickGuides.map((guide, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                    {guide.title}
                  </Typography>
                  <List dense>
                    {guide.steps.map((step, stepIndex) => (
                      <ListItem key={stepIndex}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <CheckCircleIcon sx={{ fontSize: 18, color: '#10B981' }} />
                        </ListItemIcon>
                        <ListItemText primary={step} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
            </Paper>

          
            <Paper sx={{ p: 3, borderRadius: 2, mb: 4, bgcolor: '#fee2e2' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningIcon /> Emergency Contacts
              </Typography>
              <Divider sx={{ mb: 2, borderColor: '#fecaca' }} />

              <List>
                <ListItem>
                  <ListItemIcon><PhoneIcon sx={{ color: '#dc2626' }} /></ListItemIcon>
                  <ListItemText primary="Security" secondary={contactInfo.security.phone} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PhoneIcon sx={{ color: '#dc2626' }} /></ListItemIcon>
                  <ListItemText primary="Medical Emergency" secondary={contactInfo.medical.phone} />
                </ListItem>
              </List>
            </Paper>

           
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#10B981' }}>
                Contact Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <List>
                <ListItem>
                  <ListItemIcon><PersonIcon sx={{ color: '#10B981' }} /></ListItemIcon>
                  <ListItemText primary="Warden" secondary={contactInfo.warden.name} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PhoneIcon sx={{ color: '#10B981' }} /></ListItemIcon>
                  <ListItemText primary="Warden Phone" secondary={contactInfo.warden.phone} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><EmailIcon sx={{ color: '#10B981' }} /></ListItemIcon>
                  <ListItemText primary="Warden Email" secondary={contactInfo.warden.email} />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Admin Office
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phone: {contactInfo.admin.phone}<br />
                Email: {contactInfo.admin.email}
              </Typography>
            </Paper>

            
            <Paper sx={{ p: 3, borderRadius: 2, mt: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#10B981' }}>
                Need More Help?
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <form onSubmit={handleSupportSubmit}>
                <TextField
                  fullWidth
                  label="Subject"
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  sx={{ mb: 2 }}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Message"
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  endIcon={<SendIcon />}
                  sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}
                >
                  Send Message
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentHelp;