import { Typography } from '@mui/material';

export default function Footer(){
  return (
    <footer className="footer">
      <div className="footer-container">
        <Typography variant="body2" color="text.secondary">© {new Date().getFullYear()} Portfolio Share</Typography>
        <Typography variant="body2" color="text.secondary">Built with MUI · MERN</Typography>
      </div>
    </footer>
  );
}
