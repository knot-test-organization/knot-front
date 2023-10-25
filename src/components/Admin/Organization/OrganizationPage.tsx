import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, IconButton, Button, Collapse, Box, Dialog, DialogTitle, DialogActions } from '@mui/material';
import { useState, useEffect } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { axiosExperience } from '../../../axios';
import { CreateOrganization } from './CreateOrganization/CreateOrganization';
import { CreateArea } from './CreateArea/CreateArea';
import { CreateBlueprint } from './CreateBlueprint/CreateBlueprint';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
// import { ReactComponent as OrganizationIcon } from '../../assets/images/organization.svg';
// import { ReactComponent as AreaIcon } from '../../assets/images/area.svg';
import BlueprintIcon from '../../../assets/images/blueprint.png';
import AreaIcon from '../../../assets/images/area.png';
import OrganizationIcon from '../../../assets/images/organization.png';
import { useNavigate } from 'react-router-dom';
import { Progressing } from '../../Progressing';

export function OrganizationPage() {
    const [rows, setRows] = useState([
        // {
        //     id: 'zurich-spain',
        //     name: 'Zurich Spain',
        //     country: 'Spain',
        //     creationDate: '08/09/1884',
        //     areas: [
        //         {
        //             id: 'base',
        //             name: 'Base',
        //             creationDate: '08/09/1884',
        //             blueprints: [
        //                 {
        //                     id: 'base',
        //                     name: 'Base',
        //                 },
        //             ],
        //         },
        //         {
        //             id: 'desarrollo',
        //             name: 'Desarrollo',
        //             creationDate: '11/03/1886',
        //             blueprints: [
        //                 {
        //                     id: 'front-angular',
        //                     name: 'Front con Angular',
        //                 },
        //                 {
        //                     id: 'front-react',
        //                     name: 'Front con React',
        //                 },
        //             ],
        //         },
        //     ],
        // },
        // {
        //     id: 'sabadell-zurich',
        //     name: 'Sabadell Zurich',
        //     country: 'Switzerland',
        //     creationDate: '15/03/2008',
        //     areas: [
        //         {
        //             id: 'base',
        //             name: 'Base',
        //             creationDate: '15/03/2008',
        //             blueprints: [
        //                 {
        //                     id: 'base',
        //                     name: 'Base',
        //                 },
        //             ],
        //         },
        //         {
        //             id: 'desarrollo',
        //             name: 'Desarrollo',
        //             creationDate: '20/05/2008',
        //             blueprints: [],
        //         },
        //         {
        //             id: 'marketing',
        //             name: 'Marketing',
        //             creationDate: '15/03/2008',
        //             blueprints: [
        //                 {
        //                     id: 'angular-telerik',
        //                     name: 'Angular con Telerik',
        //                 },
        //             ],
        //         },
        //     ],
        // },
    ]);
    const [openNewOrganization, setOpenNewOrganization] = useState(false);
    const [openNewArea, setOpenNewArea] = useState(false);
    const [openNewBlueprint, setOpenNewBlueprint] = useState(false);
    const [organization, setOrganization] = useState(rows ? rows[0] : null);
    const [area, setArea] = useState(rows[0] ? rows[0].areas[0] : null);

    function Row(props: { row: any }) {
        const { row } = props;
        const [open, setOpen] = useState(false);
        const [openDialog, setOpenDialog] = useState(false);
        const navigate = useNavigate();

        const addArea = () => {
            if (organization === row && openNewArea) {
                setOpenNewArea(false);
            } else {
                setOrganization(row);
                setOpenNewArea(true);
                setOpenNewOrganization(false);
                setOpenNewBlueprint(false);
            }
        };

        const deleteOrganization = async () => {
            try {
                const { data } = await axiosExperience.delete('administration/organization/' + row.id);
                console.log('response', data);
                window.location.href = window.location.href;
            } catch (error) {
                console.log('error', JSON.stringify(error));
            }
        };

        const handleOpenDialog = () => {
            setOpenDialog(true);
        };

        const handleCloseDialog = () => {
            setOpenDialog(false);
        };

        return (
            <>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell sx={{ width: '35px' }}>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            sx={{ width: '35px' }}
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell sx={{ width: '45px' }} align="center">
                        <img src={OrganizationIcon} style={{ width: '35px' }} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '250px' }}>{row.name}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '150px' }}>{row.country}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{row.creationDate}</TableCell>
                    <TableCell sx={{ width: '45px' }} align="center">
                        <AddCircleIcon onClick={addArea} sx={{ 'cursor': 'pointer', 'color': '#6486c2', '&:hover': { color: '#6486c2c9' } }} />
                    </TableCell>
                    <TableCell sx={{ width: '45px' }} align="center">
                        <VisibilityIcon onClick={() => navigate('organizationDetails/view/' + row.id)} sx={{ 'cursor': 'pointer', 'color': '#6486c2', '&:hover': { color: '#6486c2c9' } }} />
                    </TableCell>
                    <TableCell sx={{ width: '45px' }} align="center">
                        <EditIcon onClick={() => navigate('organizationDetails/edit/' + row.id)} sx={{ 'cursor': 'pointer', 'color': '#6486c2', '&:hover': { color: '#6486c2c9' } }} />
                    </TableCell>
                    <TableCell sx={{ width: '45px' }} align="center">
                        <RemoveCircleIcon onClick={handleOpenDialog} sx={{ 'cursor': 'pointer', 'color': '#6486c2', '&:hover': { color: '#6486c2c9' } }} />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ p: 0 }} colSpan={Object.keys(row).length + 4}>
                        <Collapse in={open}>
                            <Table size="small">
                                <TableBody>
                                    {row.areas.map((area: any) => (
                                        <Area key={area.id} area={area} organization={row} />
                                    ))}
                                </TableBody>
                            </Table>
                        </Collapse>
                    </TableCell>
                </TableRow>
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                >
                    <DialogTitle id='alert-dialog-title' sx={{ mt: '15px', ml: '15px', mr: '15px' }}>
                        {'Are you sure you want to delete the organization ' + row.name + '?'}
                    </DialogTitle>
                    <DialogActions sx={{ mb: '20px', ml: '15px', mr: '35px' }}>
                        <Button onClick={handleCloseDialog} variant="outlined">
                            Cancel
                        </Button>
                        <Button onClick={deleteOrganization} variant="outlined">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    };

    function Area(props: { area: any, organization: any }) {
        const { area, organization } = props;
        const [open, setOpen] = useState(false);
        const [openDialog, setOpenDialog] = useState(false);
        const [openDialogBlueprint, setOpenDialogBlueprint] = useState(false);
        const navigate = useNavigate();

        const deleteArea = async () => {
            try {
                const { data } = await axiosExperience.delete('administration/organizations/' + organization.id + '/areas/' + area.id);
                console.log('response', data);
                window.location.href = window.location.href;
            } catch (error) {
                console.log('error', JSON.stringify(error));
            }
        };

        const addBlueprint = () => {
            if (!openNewOrganization && !openNewArea && openNewBlueprint) {
                setOpenNewBlueprint(false);
            } else {
                setOrganization(organization);
                setArea(area);
                setOpenNewBlueprint(true);
                setOpenNewOrganization(false);
                setOpenNewArea(false);
            }
        };

        const deleteBlueprint = async (blueprint: any) => {
            try {
                const { data } = await axiosExperience.delete('administration/blueprint/' + organization.id + '/' + area.id + '/' + blueprint.id);
                console.log('response', data);
                window.location.href = window.location.href;
            } catch (error) {
                console.log('error', JSON.stringify(error));
            }
        };

        const handleOpenDialog = () => {
            setOpenDialog(true);
        };

        const handleCloseDialog = () => {
            setOpenDialog(false);
        };

        const handleOpenDialogBlueprint = () => {
            setOpenDialogBlueprint(true);
        };

        const handleCloseDialogBlueprint = () => {
            setOpenDialogBlueprint(false);
        };

        return (
            <>
                <TableRow sx={{ 'backgroundColor': '#FDFAF6' }}>
                    <TableCell sx={{ width: '35px' }}>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            sx={{ width: '35px' }}
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell sx={{ width: '45px' }} align="center">
                        <img src={AreaIcon} style={{ width: '35px' }} />
                    </TableCell>
                    <TableCell sx={{ width: '250px' }}>{area.name}</TableCell>
                    <TableCell sx={{ width: '150px' }}>{area.country}</TableCell>
                    <TableCell>{area.creationDate}</TableCell>
                    <TableCell sx={{ width: '45px' }} align="center">
                        <AddCircleIcon onClick={addBlueprint} sx={{ 'cursor': 'pointer', 'color': '#6486c2', '&:hover': { color: '#6486c2c9' } }} />
                    </TableCell>
                    <TableCell sx={{ width: '45px' }} align="center">
                        <VisibilityIcon onClick={() => navigate('areaDetails/view/' + organization.id + '/' + area.id)} sx={{ 'cursor': 'pointer', 'color': '#6486c2', '&:hover': { color: '#6486c2c9' } }} />
                    </TableCell>
                    <TableCell sx={{ width: '45px' }} align="center">
                        <EditIcon onClick={() => navigate('areaDetails/edit/' + organization.id + '/' + area.id)} sx={{ 'cursor': 'pointer', 'color': '#6486c2', '&:hover': { color: '#6486c2c9' } }} />
                    </TableCell>
                    <TableCell sx={{ width: '45px' }} align="center">
                        <RemoveCircleIcon onClick={handleOpenDialog} sx={{ 'cursor': 'pointer', 'color': '#6486c2', '&:hover': { color: '#6486c2c9' } }} />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ p: 0 }} colSpan={Object.keys(area).length + 5}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Table size="small">
                                <TableBody>
                                    {area.blueprints.map((blueprint: any) => (
                                        <TableRow key={blueprint.id} sx={{ 'backgroundColor': '#FDFAF6c9' }}>
                                            <TableCell sx={{ width: '67px' }} />
                                            <TableCell sx={{ width: '45px' }} align="center">
                                                <img src={BlueprintIcon} style={{ width: '35px' }} />
                                            </TableCell>
                                            <TableCell sx={{ width: '250px' }}>{blueprint.name}</TableCell>
                                            <TableCell sx={{ width: '150px' }}>{blueprint.country}</TableCell>
                                            <TableCell>{blueprint.creationDate}</TableCell>
                                            <TableCell sx={{ width: '45px' }} align="center" />
                                            <TableCell sx={{ width: '45px' }} align="center">
                                                <VisibilityIcon onClick={() => navigate('blueprintDetails/view/' + organization.id + '/' + area.id + '/' + blueprint.id)} sx={{ 'cursor': 'pointer', 'color': '#6486c2', '&:hover': { color: '#6486c2c9' } }} />
                                            </TableCell>
                                            <TableCell sx={{ width: '45px' }} align="center">
                                                <EditIcon onClick={() => navigate('blueprintDetails/edit/' + organization.id + '/' + area.id + '/' + blueprint.id)} sx={{ 'cursor': 'pointer', 'color': '#6486c2', '&:hover': { color: '#6486c2c9' } }} />
                                            </TableCell>
                                            <TableCell sx={{ width: '45px' }} align="center">
                                                <RemoveCircleIcon onClick={handleOpenDialogBlueprint} sx={{ 'cursor': 'pointer', 'color': '#6486c2', '&:hover': { color: '#6486c2c9' } }} />
                                            </TableCell>
                                            <Dialog
                                                open={openDialogBlueprint}
                                                onClose={handleCloseDialogBlueprint}
                                                aria-labelledby='alert-dialog-title'
                                                aria-describedby='alert-dialog-description'
                                            >
                                                <DialogTitle id='alert-dialog-title' sx={{ mt: '15px', ml: '15px', mr: '15px' }}>
                                                    {'Are you sure you want to delete the blueprint ' + blueprint.name + '?'}
                                                </DialogTitle>
                                                <DialogActions sx={{ mb: '20px', ml: '15px', mr: '35px' }}>
                                                    <Button onClick={handleCloseDialogBlueprint} variant="outlined">
                                                        Cancel
                                                    </Button>
                                                    <Button onClick={() => deleteBlueprint(blueprint)} variant="outlined">
                                                        OK
                                                    </Button>
                                                </DialogActions>
                                            </Dialog>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Collapse>
                    </TableCell>
                </TableRow>
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                >
                    <DialogTitle id='alert-dialog-title' sx={{ mt: '15px', ml: '15px', mr: '15px' }}>
                        {'Are you sure you want to delete the area ' + area.name + '?'}
                    </DialogTitle>
                    <DialogActions sx={{ mb: '20px', ml: '15px', mr: '35px' }}>
                        <Button onClick={handleCloseDialog} variant="outlined">
                            Cancel
                        </Button>
                        <Button onClick={deleteArea} variant="outlined">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    };

    const handleNewOrganization = () => {
        if (openNewOrganization) {
            setOpenNewOrganization(false);
        } else {
            setOpenNewOrganization(true);
            setOpenNewArea(false);
            setOpenNewBlueprint(false);
        }
    };

    useEffect(() => {
        axiosExperience.get('administration/organization').then((response) => {
            setRows(response.data);
        });
    }, []);

    return (
        <Grid>
            {rows && rows.length !== 0 ? <>
                <Box sx={{ mr: 3, mt: 2, display: 'flex', flexDirection: 'row-reverse', flexGrow: 1 }}>
                    <Button sx={{ 'backgroundColor': '#6486c2', 'height': '40px', 'borderRadius': '20px', '&:hover': { backgroundColor: '#6486c2c9' } }} onClick={handleNewOrganization} startIcon={<AddIcon />} variant="contained" disableElevation>New Organization</Button>
                </Box>
                <Grid sx={{ pl: 3, pr: 3, pb: 3 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 25 }}>Organization List</Typography>
                    <TableContainer component={Paper}>
                        <Table aria-label="collapsible table" size="small">
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#6486c2', color: '#fff' }}>
                                    <TableCell />
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center">Type</TableCell>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Name</TableCell>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Country</TableCell>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Creation Date</TableCell>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center">Add</TableCell>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center">View</TableCell>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center">Edit</TableCell>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center">Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <Row key={row.name} row={row} />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Grid sx={{ mt: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {openNewOrganization ? <CreateOrganization /> : ''}
                        {openNewArea ? <CreateArea organization={organization} /> : ''}
                        {openNewBlueprint ? <CreateBlueprint organization={organization} area={area} /> : ''}
                    </Grid>
                </Grid>
            </> : <Progressing text='LOADING' />}
        </Grid>
    );
}
