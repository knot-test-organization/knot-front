import { Card, Typography, Grid, SvgIcon, Dialog, DialogTitle, DialogActions, DialogContent, IconButton, Paper, Button, Box, Tabs, Tab, styled } from '@mui/material';
import { ReactComponent as ProductIcon } from '../../../assets/icons/product.svg';
import { grey } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { axiosExperience } from '../../../axios';
import { Progressing } from '../../Progressing';
import { useParams } from 'react-router-dom';
import { Components } from './Components/Components';
import { Environments } from './Environments/Environments';
import React from 'react';
// import Cookies from 'js-cookie';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
};

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 1.5, pb: 1.5, pl: 3, pr: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

interface StyledTabsProps {
    children?: React.ReactNode;
    value: number;
    onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
    <Tabs
        {...props}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
))({
    '& .MuiTabs-indicator': {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
        maxWidth: 70,
        width: '100%',
        backgroundColor: '#6486c2',
    },
});

interface StyledTabProps {
    label: string;
}
const StyledTab = styled((props: StyledTabProps) => (
    <Tab disableRipple {...props} />
))(({ theme }) => ({
    'textTransform': 'none',
    'fontWeight': theme.typography.fontWeightRegular,
    'fontSize': theme.typography.pxToRem(15),
    'color': '#6486c299',
    '&.Mui-selected': {
        color: '#6486c299',
    },
}));

export function ProductDetails() {
    const { org, area, id } = useParams();
    const [product, setProduct] = useState(null);
    const [value, setValue] = useState(0);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [deletingProject, setDeletingProject] = React.useState(false);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const [typesWithComponents, setTypesWithComponents] = useState(null);
    const [envsWithComponents, setEnvsWithComponents] = useState(null);

    useEffect(() => {
        axiosExperience.get('products/' + org + '/' + area + '/' + id).then((response) => {
            setProduct(response.data);
        });
        axiosExperience.get('products/' + org + '/' + area + '/' + id + '/components/types').then((response) => {
            setTypesWithComponents(response.data);
        });
        axiosExperience.get('products/' + org + '/' + area + '/' + id + '/components/environments').then((response) => {
            setEnvsWithComponents(response.data);
        });
    }, []);

    const deleteProject = async () => {
        try {
            setDeletingProject(true);
            await axiosExperience.delete(`products/${org}/${area}/${id}`);
            window.location.href = 'http://knot.westeurope.cloudapp.azure.com/';
        } catch (error) {
            console.log(error);
        }
    };
    const handleOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };
    return (
        <Grid sx={{ pt: 2, pb: 2, pl: 3, pr: 3 }}>
            {product && typesWithComponents && envsWithComponents ? <Grid>
                <Card sx={{ pt: 2, pb: 2, pl: 1, pr: 1 }}>
                    <Grid container spacing={1}>
                        <Grid item xl={1} md={1} xs={12} sm={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <SvgIcon sx={{ fontSize: 70 }} component={ProductIcon} inheritViewBox />
                        </Grid>
                        <Grid item xl={10} md={10} xs={12} sm={12}>
                            <Grid
                                container
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Grid>
                                    <Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>{product.name}</Typography>
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
                            <Grid
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                            >
                                <Grid item xl={12} md={12} sm={12} xs={12}>
                                    <Typography sx={{ mt: 0.5, fontSize: 14, whiteSpace: 'pre-line', minHeight: '3em', maxHeight: '3em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <b>Description: </b>{product.description}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xl={1} md={1} xs={12} sm={12}
                            container
                            direction="column"
                            justifyContent="flex-end"
                            alignItems="center"
                        >
                            <Grid>
                                <Button sx={{ 'fontSize': '11px', 'width': '55px', 'border': '1px solid #6486c2', 'color': '#6486c2', 'height': '30px', '&:hover': { border: '1px solid #6486c2c9', color: '#6486c2c9' } }} variant="outlined" href={`${product.id}/editproduct`}>Edit</Button>
                            </Grid>
                            <Grid>
                                <Button sx={{ 'mt': '10px', 'fontSize': '11px', 'width': '55px', 'border': '1px solid #6486c2', 'color': '#6486c2', 'height': '30px', '&:hover': { border: '1px solid #6486c2c9', color: '#6486c2c9' } }} variant="outlined" onClick={handleOpen}>Delete</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>
                <Grid sx={{ display: 'flex', mt: 2 }}>
                    <Box sx={{ mb: 2 }}>
                        <StyledTabs
                            value={value}
                            onChange={handleChange}
                            sx={{
                                '& .MuiTabs-indicator': { backgroundColor: 'transparent' },
                                '& .MuiTab-root.Mui-selected': { color: '#6486c2' },
                            }}
                        >
                            <StyledTab label="Components" sx={{ textTransform: 'none' }} />
                            <StyledTab label="Environments" sx={{ textTransform: 'none' }} />
                        </StyledTabs>
                    </Box>
                    <Grid sx={{ width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', height: '40px' }}>
                        <Button sx={{ 'marginRight': '18px', 'fontSize': '11px', 'border': '1px solid #6486c2', 'color': '#6486c2', '&:hover': { border: '1px solid #6486c2c9', color: '#6486c2c9' } }} href={'/productDetails/' + product.organization + '/' + product.area + '/' + product.id + '/newcomponent'} startIcon={<AddIcon />} variant="outlined" size="small" disableElevation>New Component</Button>
                    </Grid>
                </Grid>
                <Paper sx={{ 'bgcolor': grey[50] }}>
                    <TabPanel value={value} index={0}>
                        <Components typesWithComponents={typesWithComponents}></Components>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Environments envsWithComponents={envsWithComponents}></Environments>
                    </TabPanel>
                </Paper>
                <Dialog
                    open={openDialog}
                    onClose={handleClose}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                >
                    <DialogTitle id='alert-dialog-title' sx={{ mt: '15px', ml: '15px', mr: '15px' }}>
                        {deletingProject ? '' : 'Are you sure you want to delete the ' + product.name + ' product?'}
                    </DialogTitle>
                    <DialogContent>
                        {deletingProject ? <Progressing text='DELETING' /> : ''}
                    </DialogContent>
                    {deletingProject ? '' : <DialogActions sx={{ mb: '20px', ml: '15px', mr: '35px' }}>
                        <Button onClick={handleClose} variant="outlined">
                            Cancel
                        </Button>
                        <Button onClick={deleteProject} variant="outlined">
                            OK
                        </Button>
                    </DialogActions>}
                </Dialog>
            </Grid> : <Progressing text='LOADING' />
            }
        </Grid >
    );
}
