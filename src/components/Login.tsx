import { Typography, Paper, Grid, Button } from '@mui/material';
import Divider from '@mui/material/Divider';

export function Login() {
  const loginGitHub = () => {
    const clientID = '9d5b3500c699be3762b0';
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user,codespace,read:org`;
  };
  return (
    <Grid className='margin-container' sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ p: '20px', width: '30em', marginTop: '1em' }}>
        <Grid >
          <Grid item xs={2} >
            <Typography sx={{ 'font-size': '2rem', 'color': 'rgba(0,0,0)', 'fontWeight': 'bold' }} textAlign="center">GitHub</Typography>
          </Grid>
          <Divider sx={{ width: '100%' }} />
          <Grid item xs={4} sx={{ marginTop: '1em' }} >
            <Typography sx={{ 'font-size': '1rem', 'color': 'rgba(0,0,0)' }} textAlign="left">Sign in using GitHub</Typography>
          </Grid>
          <Grid item sx={{ marginLeft: '24.5em', marginTop: '1em' }}>
            <Button variant="outlined" onClick={loginGitHub}>SIGN IN</Button>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}
