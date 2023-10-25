import { Grid, Typography, Card, TextField, Button, Dialog, DialogTitle, DialogActions } from '@mui/material';
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FlagIcon from '@mui/icons-material/Flag';
import Hardware from '@mui/icons-material/Hardware';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { axiosExperience } from '../../../../axios';
import { Progressing } from '../../../Progressing';

export function AreaDetails() {
    const mode = useParams().mode;
    const idOrganization = useParams().idOrganization;
    const idArea = useParams().idArea;

    const [organization, setOrganization] = useState(null);
    const [area, setArea] = useState(null);
    const [name, setName] = useState('');
    const [nameCheck, setNameCheck] = useState(false);

    const updateArea = async () => {
        try {
            if (name !== '' && name !== area.name) {
                area.name = name;
                const { data } = await axiosExperience.put<any>(
                    'administration/organization/' + idOrganization + '/areas', area,
                    {
                        headers: {
                            Accept: 'application/json',
                        },
                    },
                );
                console.log('response', data);
                window.location.href = window.location.href.replace('edit', 'view');
            } else {
                setNameCheck(true);
            }
        } catch (error) {
            console.log('error', JSON.stringify(error));
        };
    };

    const handleCloseDialog = () => {
        setNameCheck(false);
    };

    const changeToEditMode = () => {
        window.location.href = window.location.href.replace('view', 'edit');
    };

    const goBack = () => {
        const url = window.location.href;
        const parts = url.split('/organization');
        const newUrl = parts[0] + '/organization';
        window.location.href = newUrl;
    };

    useEffect(() => {
        axiosExperience.get('administration/organization/' + idOrganization).then((response) => {
            setOrganization(response.data);
            response.data.areas.forEach((area: any) => {
                if (area.id === idArea) {
                    setArea(area);
                }
            });
        });
    }, []);

    return (
        <Grid sx={{ mt: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Card sx={{ p: 3, width: '70%', backgroundColor: '#FCFCFC' }}>
                {organization && area && (mode === 'view' || mode === 'edit') ? <>
                    <Typography sx={{ p: 1, fontWeight: 'bold', fontSize: 25 }}>Area {area.name}</Typography>
                    <Grid container spacing={1} sx={{ mt: 1, p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Hardware />
                            <Typography sx={{ ml: 1.5, color: '#6486c2' }}>Organization Name:</Typography>
                            <Typography sx={{ ml: 1 }}>{organization.name}</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                            <FlagIcon />
                            <Typography sx={{ ml: 1.5, color: '#6486c2' }}>
                                Organization Country:
                            </Typography>
                            <Typography sx={{ ml: 1 }}>{organization.country}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} sx={{ mt: 1, p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Grid3x3Icon />
                            <Typography sx={{ ml: 1.5, color: '#6486c2' }}>
                                Id:
                            </Typography>
                            <Typography sx={{ ml: 1 }}>{area.id}</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarMonthIcon />
                            <Typography sx={{ ml: 1.5, color: '#6486c2' }}>
                                Creation Date:
                            </Typography>
                            <Typography sx={{ ml: 1 }}>{area.creationDate}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} sx={{ mt: 1, p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Grid item xs={area.country ? 6 : 12} sx={{ display: 'flex', alignItems: 'center' }}>
                            <DescriptionIcon />
                            <Typography sx={{ ml: 1.5, color: '#6486c2' }}>Name:</Typography>
                            {mode === 'edit' ? <TextField sx={{ ml: 1 }} fullWidth id="area-name" label="Name" variant="outlined" onChange={(e) => setName(e.target.value)} defaultValue={area.name} /> :
                                <Typography sx={{ ml: 1 }}>{area.name}</Typography>}
                        </Grid>
                        {area.country ? <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                            <FlagIcon />
                            <Typography sx={{ ml: 1.5, color: '#6486c2' }}>
                                Country:
                            </Typography>
                            {mode === 'edit' ? <TextField sx={{ ml: 1 }} fullWidth id="area-country" label="Country" variant="outlined" defaultValue={area.country} /> :
                                <Typography sx={{ ml: 1 }}>{area.country}</Typography>}
                        </Grid> : ''}
                    </Grid>
                    <Grid container spacing={1} sx={{ mt: 1, p: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarViewMonthIcon />
                            <Typography sx={{ ml: 1.5, color: '#6486c2' }}>Blueprints:</Typography>
                        </Grid>
                    </Grid>
                    <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                        {Array.from(Array(area?.blueprints?.length)).map((_, index) => (
                            <Grid key={index} sx={{ m: 1 }}>
                                <Card sx={{ p: 3 }}>
                                    <Grid>
                                        <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography sx={{ color: '#6486c2' }}>
                                                Id:
                                            </Typography>
                                            <Typography sx={{ ml: 1 }}>{area?.blueprints[index].id}</Typography>
                                        </Grid>
                                        <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography sx={{ color: '#6486c2' }}>
                                                CreationDate:
                                            </Typography>
                                            <Typography sx={{ ml: 1 }}>{area?.blueprints[index].creationDate}</Typography>
                                        </Grid>
                                        <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography sx={{ color: '#6486c2' }}>Name:</Typography>
                                            <Typography sx={{ ml: 1 }}>{area?.blueprints[index].name}</Typography>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Grid sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Grid>
                            <Button sx={{ 'height': '40px', 'borderColor': '#6486c2', 'color': '#6486c2', '&:hover': { borderColor: '#6486c2c9', color: '#6486c2c9' } }} onClick={goBack} variant="outlined" disableElevation>Back</Button>
                        </Grid>
                        {mode === 'edit' ? <Grid>
                            <Button sx={{ 'backgroundColor': '#6486c2', 'height': '40px', '&:hover': { backgroundColor: '#6486c2c9' } }} onClick={updateArea} variant="contained" disableElevation>Save</Button>
                        </Grid> : <Grid>
                            <Button sx={{ 'backgroundColor': '#6486c2', 'height': '40px', '&:hover': { backgroundColor: '#6486c2c9' } }} onClick={changeToEditMode} variant="contained" disableElevation>Edit</Button>
                        </Grid>}
                    </Grid>
                    {mode === 'edit' ? <Dialog
                        open={nameCheck}
                        onClose={handleCloseDialog}
                        aria-labelledby='alert-dialog-title'
                        aria-describedby='alert-dialog-description'
                    >
                        <DialogTitle id='alert-dialog-title'>
                            {'You have not made any changes'}
                        </DialogTitle>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} autoFocus>
                                OK
                            </Button>
                        </DialogActions>
                    </Dialog> : ''}
                </> : <Progressing text='LOADING' />}
            </Card>
        </Grid>
    );
}
