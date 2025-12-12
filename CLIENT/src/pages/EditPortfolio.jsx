import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import '../App.css';

function EditPortfolio({ portfolioId, onMessage, onSuccess, onNavigate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, [portfolioId]);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/portfolio/${portfolioId}`);
      const { title, description, link, technologies } = response.data;
      setTitle(title);
      setDescription(description);
      setLink(link || '');
      setTechnologies(technologies.join(', '));
    } catch (err) {
      setError('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const techArray = technologies
        .split(',')
        .map((tech) => tech.trim())
        .filter((tech) => tech);

      await axios.put(
        `http://localhost:5000/api/portfolio/${portfolioId}`,
        {
          title,
          description,
          link,
          technologies: techArray,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onMessage('Portfolio updated successfully!', 'success');
      if (onSuccess) onSuccess();
      if (onNavigate) onNavigate('my-portfolios');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update portfolio';
      setError(errorMsg);
      onMessage(errorMsg, 'error');
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
    <Container maxWidth="sm" className="page-container">
      <div className="card-wrap">
        <Card className="card">
          <div className="card-header gradient-header">
            <EditIcon className="icon-large" />
            <Typography variant="h5" className="card-title">
              Edit Portfolio
            </Typography>
          </div>

          <div className="card-body">
            {error && <Alert severity="error" className="alert-margin">{error}</Alert>}
            <form onSubmit={handleSubmit}>
              <Stack spacing={2.5} className="form-stack">
                <TextField
                  className="themed-textfield"
                  fullWidth
                  label="Project Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  variant="outlined"
                  placeholder="e.g., E-commerce Website"
                />
                <TextField
                  className="themed-textfield"
                  fullWidth
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Describe your project..."
                />
                <TextField
                  className="themed-textfield"
                  fullWidth
                  label="Project Link"
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://example.com"
                  variant="outlined"
                />
                <TextField
                  className="themed-textfield"
                  fullWidth
                  label="Technologies"
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                  placeholder="React, Node.js, MongoDB"
                  helperText="Separate with commas"
                  variant="outlined"
                />
                <div className="button-row">
                  <Button
                    fullWidth
                    className="primary-btn"
                    variant="contained"
                    type="submit"
                  >
                    Update Portfolio
                  </Button>
                  <Button
                    fullWidth
                    className="outline-btn"
                    variant="outlined"
                    onClick={() => onNavigate?.('my-portfolios')}
                  >
                    Cancel
                  </Button>
                </div>
              </Stack>
            </form>
          </div>
        </Card>
      </div>
    </Container>
  );
}

export default EditPortfolio;
