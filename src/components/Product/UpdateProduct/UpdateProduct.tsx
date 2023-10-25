import {
    Paper, Grid, TextField, Typography, SvgIcon, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Button, Dialog,
    DialogActions,
    DialogTitle,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ReactComponent as ProductIcon } from '../../../assets/icons/product.svg';
import { useFormContext } from 'react-hook-form';
import { useConfig } from '../../ConfigContext';
import { useParams } from 'react-router-dom';
import { axiosExperience } from '../../../axios';
import { Progressing } from '../../Progressing';
import React from 'react';


export function UpdateProduct() {
    const { org, area, id } = useParams();
    const [product, setProduct] = useState(null);
    const [name, setname] = useState(' ');
    const [desc, setdesc] = useState(' ');
    const [open, setOpen] = React.useState(false);
    const [idCheck, setidCheck] = React.useState(false);
    const [dialogData, setDialogData] = React.useState('');
    const [editingProject, setEditngProject] = React.useState(false);
    const [users, setUser] = useState([
        { label: '', id: '0', username: '' },
    ]);
    const [selectedUser, setSelectedUser] = useState('');
    const ITEM_HEIGHT = 30;
    const ITEM_PADDING_TOP = 10;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };
    const changeUser = (user: any) => {
        setSelectedUser(user);
    };
    useEffect(() => {
        axiosExperience.get('products/' + org + '/' + area + '/' + id).then((response) => {
            setProduct(response.data);
            setdesc(response.data.description);
            setname(response.data.name);
            setSelectedUser(response.data.po);
        },
        );
    }, []);

    useEffect(() => {
        axiosExperience.get('users').then((response) => {
            setUser(response.data);
        });
    }, []);

    const handleClose = () => {
        setOpen(false);
        cancel();
    };

    const save = async () => {
        setEditngProject(true);
        setOpen(true);
        const { data } = await axiosExperience.put<any>(
            'products', {
            id: product.id,
            name: name,
            description: desc,
            organization: product.organization,
            area: product.area,
            po: selectedUser,
            teams: product.teams,
            version: product.version,
            environments: product.environments,
            components: product.components,
            date: product.date,
        },
            {
                headers: {
                    Accept: 'application/json',
                },
            },
        );
        setDialogData('Project Edited successfully');
        setEditngProject(false);
    };
    const cancel = () => {
        const url = window.location.href;

        const parts = url.split('/editproduct');

        const newUrl = parts[0];

        window.location.href = newUrl;
    };
    return (
        <Grid>
            {product ? <Grid>
                <form>
                    <div className='margin-container'>
                        {<Paper sx={{ p: '20px', m: '10px' }} elevation={1}>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xl={1} md={1} xs={12} sm={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <SvgIcon sx={{ fontSize: 70 }} component={ProductIcon} inheritViewBox />
                                </Grid>
                                <Grid item xl={11} md={11} xs={12} sm={12}>
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid>
                                            <Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>Edit {product.name}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid item md sm={6} xs={12}>
                                            <Typography sx={{ mt: 0.5, fontSize: 14 }}><b>Organization: </b>{`${product.organization} > ${product.area}`}</Typography>
                                        </Grid>
                                        <Grid item md sm={6} xs={12}>
                                            <Typography sx={{ mt: 0.5, fontSize: 14 }}><b>Product Owner: </b>{product.po}</Typography>
                                        </Grid>
                                        <Grid item md sm={6} xs={12}>
                                            <Typography sx={{ mt: 0.5, fontSize: 14 }}><b>Creation Date: </b>{product.date}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id='name'
                                        label='Name'
                                        variant='outlined'
                                        name='name'
                                        defaultValue={product.name}
                                        fullWidth
                                        onChange={(e) => setname(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl>
                                        <InputLabel id="demo-multiple-name-label">Owner</InputLabel>
                                        <Select
                                            sx={{ width: 530 }}
                                            id="demo-select"
                                            value={selectedUser}
                                            label='user'
                                            input={<OutlinedInput id="select-multiple-chip" label="name" />}
                                            onChange={(e) => changeUser(e.target.value)}
                                            MenuProps={MenuProps}>
                                            {users.map((user) => (
                                                <MenuItem
                                                    key={user.id}
                                                    value={user.label}
                                                >
                                                    {user.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id='description'
                                        label='Description'
                                        variant='outlined'
                                        name='description'
                                        defaultValue={product.description}
                                        multiline
                                        fullWidth
                                        onChange={(e) => setdesc(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                        }
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby='alert-dialog-title'
                            aria-describedby='alert-dialog-description'
                        >
                            <DialogTitle id='alert-dialog-title'>
                                {editingProject ? <Progressing text='SAVING' /> : dialogData}
                            </DialogTitle>
                            {editingProject ? '' : <DialogActions>
                                <Button onClick={handleClose} autoFocus>
                                    OK
                                </Button>
                            </DialogActions>}
                        </Dialog>
                        <Grid sx={{ m: '10px', mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Button sx={{ 'color': '#6486c2', 'height': '40px', '&:hover': { color: '#6486c2c9' } }} onClick={cancel} variant="text" disableElevation>Cancel</Button>
                            <Button sx={{ 'color': '#6486c2', 'height': '40px', '&:hover': { color: '#6486c2c9' } }} onClick={save} variant="text" disableElevation>Save</Button>
                        </Grid>
                    </div>
                </form>
            </Grid> : <Progressing text='LOADING' />}
        </Grid>
    );
}
