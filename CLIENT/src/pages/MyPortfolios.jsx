import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

function MyPortfolios({ onEdit, onMessage }) {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMyPortfolios();
  }, []);

  const fetchMyPortfolios = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(' https://portfoliosharing.onrender.com/api/portfolio/my-portfolios', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPortfolios(response.data);
    } catch (err) {
      onMessage?.('Failed to load portfolios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/portfolio/${selectedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPortfolios(portfolios.filter((p) => p._id !== selectedId));
      setDeleteDialogOpen(false);
      onMessage?.('Portfolio deleted successfully!', 'success');
    } catch (err) {
      onMessage?.('Failed to delete portfolio', 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="center-box">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header mb-3">
        <Typography variant="h3" component="h1" className="page-title gradient-text">My Portfolios</Typography>
        <Typography variant="h6" className="subtitle">Manage and showcase your work</Typography>
      </div>

      {portfolios.length === 0 ? (
        <Alert severity="info" className="info-alert">You haven't created any portfolios yet. Create one to get started!</Alert>
      ) : (
        <Grid container spacing={3}>
          {portfolios.map((portfolio) => (
            <Grid item xs={12} sm={6} md={4} key={portfolio._id}>
              <Card className="portfolio-card">
                <div className="card-top-gradient" />
                <CardContent className="card-body">
                  <Typography variant="h6" component="div" className="card-heading">{portfolio.title}</Typography>
                  <Typography variant="body2" color="textSecondary" className="card-desc">{portfolio.description}</Typography>
                  {portfolio.technologies.length > 0 && (
                    <div className="tech-row mb-2">
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {portfolio.technologies.map((tech, idx) => (
                          <Chip key={idx} label={tech} size="small" className="chip-gradient" />
                        ))}
                      </Stack>
                    </div>
                  )}
                </CardContent>
                <div className="card-footer" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Button size="small" variant="outlined" color="primary" startIcon={<EditIcon />} onClick={() => onEdit(portfolio._id)} className="footer-btn">Edit</Button>
                  {portfolio.link && (
                    <Button size="small" variant="outlined" color="primary" endIcon={<OpenInNewIcon />} href={portfolio.link} target="_blank" rel="noopener noreferrer" className="footer-btn">View</Button>
                  )}
                  <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(portfolio._id)} className="footer-btn">Delete</Button>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="dialog-title">Delete Portfolio?</DialogTitle>
        <DialogContent>
          <DialogContentText className="dialog-content-text">Are you sure you want to delete this portfolio? This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MyPortfolios;
