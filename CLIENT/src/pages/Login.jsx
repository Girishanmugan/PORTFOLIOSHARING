import { useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import '../App.css';

function Login({ onLogin, onMessage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(' https://portfoliosharing.onrender.com/api/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      onLogin(token, user);
      onMessage && onMessage(`Welcome back, ${user.name}!`, 'success');
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Login failed';
      setError(errMsg);
      onMessage && onMessage(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className="page-container">
      <div className="card-wrap">
        <Card className="card" elevation={3}>
          <div className="card-header gradient-header">
            <div className="brand-icon-wrap">
              <LoginIcon className="icon-large" />
            </div>
            <Typography variant="h5" className="card-title">Login</Typography>
          </div>
          <CardContent className="card-body">
            {error && <Alert severity="error" className="mb-3">{error}</Alert>}
            <form onSubmit={handleSubmit}>
              <TextField
                className="themed-textfield mb-2"
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                variant="outlined"
                placeholder="you@example.com"
              />
              <TextField
                className="themed-textfield mb-3"
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                variant="outlined"
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                className="primary-btn"
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

export default Login;
