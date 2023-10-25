import { Grid, Typography, Card, TextField, Button, Dialog, DialogTitle, DialogActions } from '@mui/material';
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import DescriptionIcon from '@mui/icons-material/Description';
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import FlagIcon from '@mui/icons-material/Flag';
import { useState } from 'react';
import { axiosExperience } from '../../../../axios';

export function CreateArea(props: { organization: any }) {
    const { organization } = props;
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [idCheck, setIdCheck] = useState(false);
    const [emptyCheck, setEmptyCheck] = useState(false);

    const createArea = async () => {
        try {
            if (id !== '' && name !== '') {
                const { data } = await axiosExperience.post<any>(
                    'administration/organization/' + organization.id + '/areas',
                    {
                        id: id,
                        name: name,
                        creationDate: '',
                        blueprints: [],
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
            <Typography sx={{ p: 1, fontWeight: 'bold', fontSize: 25 }}>Create Area into the {organization.name} Organization</Typography>
            <Grid container spacing={1} sx={{ mt: 1, p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Grid item xs={5} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Grid3x3Icon />
                    <Typography sx={{ ml: 1.5, color: '#6486c2' }}>ID:</Typography>
                    {idCheck ? <TextField sx={{ ml: 1 }} error fullWidth id="Id" label="Id" variant="outlined" onChange={(e) => setName(e.target.value)} /> : <TextField sx={{ ml: 1 }} fullWidth id="Id" label="Id" variant="outlined" onChange={(e) => setId(e.target.value)} />}
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={5} sx={{ display: 'flex', alignItems: 'center' }}>
                    <DescriptionIcon />
                    <Typography sx={{ ml: 1.5, color: '#6486c2' }}>Name:</Typography>
                    <TextField sx={{ ml: 1 }} fullWidth id="Name" label="Name" variant="outlined" onChange={(e) => setName(e.target.value)} />
                </Grid>
            </Grid>
            <Grid sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Button sx={{ 'backgroundColor': '#6486c2', 'height': '40px', '&:hover': { backgroundColor: '#6486c2c9' } }} onClick={createArea} variant="contained" disableElevation>Create</Button>
            </Grid>
            <Dialog
                open={idCheck}
                onClose={handleCloseDialog}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle id='alert-dialog-title'>
                    {'The ID of the area already exist'}
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
                    {'You have to complete the empty fields'}
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
