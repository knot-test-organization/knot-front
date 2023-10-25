import { Grid, Typography, Card, TextField, Button, Dialog, DialogTitle, DialogActions } from '@mui/material';
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import DescriptionIcon from '@mui/icons-material/Description';
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FlagIcon from '@mui/icons-material/Flag';
import { useState } from 'react';
import { axiosExperience } from '../../../../axios';

export function CreateOrganization() {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [idCheck, setIdCheck] = useState(false);
    const [emptyCheck, setEmptyCheck] = useState(false);

    const createOrganization = async () => {
        try {
            if (id !== '' && name !== '') {
                const { data } = await axiosExperience.post<any>(
                    'administration/organization',
                    {
                        id: id,
                        name: name,
                        country: country,
                        creationDate: '',
                        areas: [],
                    },
                    {
                        headers: {
                            Accept: 'application/json',
                        },
                    },
                );
                console.log('response', data);
                if (data) {
                    window.location.href = window.location.href;
                } else {
                    setIdCheck(true);
                }
            } else {
                setEmptyCheck(true);
            }
        } catch (error) {
            console.log('error', JSON.stringify(error));
        };
    };

    const handleCloseDialog = () => {
        setIdCheck(false);
    };

    const handleCloseEmptyDialog = () => {
        setEmptyCheck(false);
    };

    return (
        <Card sx={{ p: 3, width: '80%' }}>
            <Typography sx={{ p: 1, fontWeight: 'bold', fontSize: 25 }}>Create Organization</Typography>
            <Grid container spacing={1} sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Grid3x3Icon />
                    <Typography sx={{ ml: 1.5, color: '#6486c2' }}>ID:</Typography>
                    {idCheck ? <TextField sx={{ ml: 1 }} error fullWidth id="Id" label="Id" variant="outlined" onChange={(e) => setId(e.target.value)} /> : <TextField sx={{ ml: 1 }} fullWidth id="Id" label="Id" variant="outlined" onChange={(e) => setId(e.target.value)} />}
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
                    <DescriptionIcon />
                    <Typography sx={{ ml: 1.5, color: '#6486c2' }}>Name:</Typography>
                    <TextField sx={{ ml: 1 }} fullWidth id="Name" label="Name" variant="outlined" onChange={(e) => setName(e.target.value)} />
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={3} sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
                    <FlagIcon />
                    <Typography sx={{ ml: 1.5, color: '#6486c2' }}>
                        Country:
                    </Typography>
                    <TextField sx={{ ml: 1 }} fullWidth id="Country" label="Country" variant="outlined" onChange={(e) => setCountry(e.target.value)} />
                </Grid>
            </Grid>
            <Grid sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Button sx={{ 'backgroundColor': '#6486c2', 'height': '40px', '&:hover': { backgroundColor: '#6486c2c9' } }} onClick={createOrganization} variant="contained" disableElevation>Create</Button>
            </Grid>
            <Dialog
                open={idCheck}
                onClose={handleCloseDialog}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle id='alert-dialog-title'>
                    {'The ID of the organization already exist'}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseDialog} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={emptyCheck}
                onClose={handleCloseEmptyDialog}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle id='alert-dialog-title'>
                    {'You have to complete the id and name fields at least'}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseEmptyDialog} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}
