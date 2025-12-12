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
  Chip,
  Stack,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
// App.css is now imported globally in src/main.jsx

function Home({ isLoggedIn }) {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const response = await axios.get(' https://portfoliosharing.onrender.com/api/portfolio/all');
      setPortfolios(response.data);
    } catch (err) {
      setError('Failed to load portfolios');
    } finally {
      setLoading(false);
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
      <div className="page-header" style={{ marginBottom: 40, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" className="page-title gradient-text">
          Discover Amazing Portfolios
        </Typography>
        <Typography variant="h6" className="subtitle mb-3">
          Explore creative work from talented designers and developers
        </Typography>
      </div>

      {error && <Alert severity="error" className="mb-2">{error}</Alert>}
      {portfolios.length === 0 ? (
        <div className="empty-state">
          <Typography variant="h6" className="mb-2">No portfolios yet</Typography>
          <Typography color="textSecondary">
            {!isLoggedIn ? 'Login to create your first portfolio!' : 'Be the first to create a portfolio!'}
          </Typography>
        </div>
      ) : (
        <Grid container spacing={3}>
          {portfolios.map((portfolio) => (
            <Grid item xs={12} sm={6} md={4} key={portfolio._id}>
              <Card className="portfolio-card">
                <div className="card-top-gradient" />
                <CardContent className="card-body">
                  <Typography variant="h6" component="div" className="card-heading">{portfolio.title}</Typography>
                  <Typography variant="caption" display="block" className="card-author">by {portfolio.userId?.name || 'Unknown'}</Typography>
                  <Typography variant="body2" color="textSecondary" className="card-desc">{portfolio.description}</Typography>
                    {(portfolio.technologies?.length > 0) && (
                    <div className="tech-row mb-2">
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {portfolio.technologies.map((tech, idx) => (
                          <Chip key={idx} label={tech} size="small" className="chip-gradient" />
                        ))}
                      </Stack>
                    </div>
                  )}
                </CardContent>
                {portfolio.link && (
                  <div className="card-footer">
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      endIcon={<OpenInNewIcon />}
                      href={portfolio.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Project
                    </Button>
                  </div>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}

export default Home;
