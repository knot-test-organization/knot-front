import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { axiosExperience } from '../../../../axios';
import { Box, IconButton, Table, TableBody, TableHead, TableCell, TableFooter, TablePagination, TableRow, Button, Modal, TextField } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import { Progressing } from '../../../Progressing';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
};

interface Release {
  tagName: String,
  nameTitle: String,
  versionPre: String,
  versionPro: String,
  status: Status,
  actions: Action[],
};

interface Status {
  id: String,
  name: String,
};

interface Action {
  id: String,
  name: String,
  enabled: Boolean,
}

export function GeneralDetails(prop: { dataParentToChild: any, org: any, area: any, product: any }) {
  const { dataParentToChild, org, area, product } = prop;
  const [listReleases, setListReleases] = useState([]);
  const [release, setRelease] = useState('');
  const [releaseTitle, setReleaseTitle] = useState('');
  const [component, setComponent] = useState(dataParentToChild);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listReleases.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const createRelease = async () => {
    try {
      const rel: Release = {
        'tagName': `${release}-RC`,
        'nameTitle': `${releaseTitle}`,
        'versionPre': null,
        'versionPro': null,
        'status': {
          'id': 'waiting-create_release',
          'name': 'Waiting for the release to be created',
        },
        'actions': [
          {
            'id': 'approve_pre',
            'name': 'Approve PRE',
            'enabled': false,
          },
          {
            'id': 'approve_pro',
            'name': 'Approve PRO',
            'enabled': false,
          },
          {
            'id': 'promote_pro',
            'name': 'Promote PRO',
            'enabled': false,
          },
        ],
      };
      const { data } = await axiosExperience.post<any>(`components/${org}/${area}/${product}/${component.id}/releases`, rel);
      await refreshListReleases();
      handleClose();
    } catch (error) {
      console.log('error', JSON.stringify(error));
      handleClose();
    }
  };

  const promoteRelease = async (rel: Release, type: String) => {
    try {
      const updatedListReleases = [...listReleases];
      const releaseToUpdate = updatedListReleases.find((obj: Release) => obj.tagName === rel.tagName);
      if (releaseToUpdate) {
        releaseToUpdate.status.id = 'waiting-create_release';
        releaseToUpdate.status.name = 'Waiting for the pro release to be created';
        releaseToUpdate.actions.map((action: Action) => {
          if (action.id === type) {
            action.enabled = false;
          }
        });
        releaseToUpdate.versionPro = rel.tagName;
        const { data } = await axiosExperience.put<any>(`components/${org}/${area}/${product}/${component.id}/releases/action/${type}`, rel);
        // setListReleases(updatedListReleases);
        await refreshListReleases();
      }
      handleClose();
    } catch (error) {
      console.log('error', JSON.stringify(error));
      handleClose();
    }
  };

  const approveRelease = async (rel: Release, type: String) => {
    try {
      const updatedListReleases = [...listReleases];
      const releaseToUpdate = updatedListReleases.find((obj: Release) => obj.tagName === rel.tagName);
      if (releaseToUpdate) {
        releaseToUpdate.status.id = 'waiting-create_release';
        releaseToUpdate.status.name = 'Waiting for the pro release to be created';
        releaseToUpdate.actions.map((action: Action) => {
          if (action.id === type) {
            action.enabled = false;
          }
        });
        releaseToUpdate.versionPro = rel.tagName;
        const { data } = await axiosExperience.put<any>(`components/${org}/${area}/${product}/${component.id}/releases/action/${type}`, releaseToUpdate);
        // setListReleases(updatedListReleases);
        await refreshListReleases();
        handleClose();
      }
    } catch (error) {
      console.log('error', JSON.stringify(error));
      handleClose();
    }
  };

  const renderApproveRelease = (rel: Release) => {
    const actionToDisplay = rel.actions.find((action: any) => action.enabled && action.id.includes('approve')) || rel.actions.find((action: any) => action.id === 'approve_pro');

    return <Button onClick={() => approveRelease(rel, actionToDisplay.id)} sx={{ 'border': '1px solid #6486c2', 'color': '#6486c2', '&:hover': { border: '1px solid #6486c2c9', color: '#6486c2c9' } }} variant="outlined" size="small" disabled={!actionToDisplay.enabled}>
      {actionToDisplay.name}
    </Button>;
  };

  // Declare updateTimer in the outer scope
  let updateTimer: NodeJS.Timeout;

  const refreshListReleases = async () => {
    if (dataParentToChild) {
      setComponent(dataParentToChild);
    }
    if (component) {
      axiosExperience.get(`components/${org}/${area}/${product}/${component?.id}/releases`).then((response) => {
        setListReleases(response.data);
      });
    };
  };

  useEffect(() => {
    if (dataParentToChild) {
      setComponent(dataParentToChild);
      axiosExperience.get(`components/${org}/${area}/${product}/${dataParentToChild?.id}/releases`).then((response) => {
        setListReleases(response.data);
      });
    };
    return () => {
      clearInterval(updateTimer);
    };
  }, [dataParentToChild]);

  useEffect(() => {
    if (component) {
      updateTimer = setInterval(() => {
        axiosExperience.get(`components/${org}/${area}/${product}/${component?.id}`).then((response) => {
          setComponent(response.data);
        });
        axiosExperience.get(`components/${org}/${area}/${product}/${component?.id}/releases`).then((response) => {
          setListReleases(response.data);
        });
      }, 30000);
    };
    return () => {
      clearInterval(updateTimer);
    };
  }, [component]);

  // console.log('response', dataParentToChild);

  return (
    <Grid sx={{ width: '100%' }}>
      {/* <div>{JSON.stringify(dataParentToChild?.[0])}</div> */}
      {component ? <Grid sx={{ display: 'grid', alignItems: 'center', justifyContent: 'stretch' }}>
        <Grid sx={{ width: '100%' }}>
          <Card sx={{ backgroundColor: '#FFF', p: 3 }}>
            <Typography sx={{ mb: 2, fontWeight: 'bold', fontSize: 20 }}>Versions Deployed by Environment</Typography>
            <Grid container direction="row" alignItems="stretch" justifyContent="center" spacing={3}>
              {Array.from(Array(component?.environments?.length)).map((_, index) => (
                <Grid key={index} item xl md sm={6} xs={12}>
                  <Card sx={{ flex: 1 }}>
                    <Grid sx={{ backgroundColor: '#6486c2', height: '5px' }}></Grid>
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography sx={{ mb: 1, fontWeight: 'bold' }}>{component?.environments[index].envPath.slice(0, 1).toUpperCase() + component?.environments[index].envPath.slice(1)}</Typography>
                      <Card sx={{ p: 2, mt: 1, display: 'grid', alignItems: 'stretch', justifyContent: 'stretch', backgroundColor: '#ECF0F7' }}>
                        <Typography sx={{ mb: 1 }}><b>Namespace:</b> {component?.environments[index].nameSpace}</Typography>
                        <Typography sx={{ mb: 1 }}><b>Version:</b> {component?.environments[index].version.slice(0, 10)}</Typography>
                        <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography><b>Status:</b></Typography>
                          <Grid sx={{ backgroundColor: component?.environments[index].version !== '' ? '#69C82D' : '#9C9999', p: 1, ml: 1, borderRadius: 15 }}></Grid>
                        </Grid>
                      </Card>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {/* <Grid item xl md sm={6} xs={12}>
                <Card sx={{ flex: 1 }}>
                  <Grid sx={{ backgroundColor: '#6486c2', height: '5px' }}></Grid>
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography sx={{ mb: 1, fontWeight: 'bold' }}>Development</Typography>
                    <Card sx={{ p: 2, mt: 1, display: 'grid', alignItems: 'stretch', justifyContent: 'stretch', backgroundColor: '#ECF0F7' }}>
                      <Typography sx={{ mb: 1 }}><b>Namespace:</b> dev</Typography>
                      <Typography sx={{ mb: 1 }}><b>Version:</b> 73bc8e1a97</Typography>
                      <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography><b>Status:</b></Typography>
                        <Grid sx={{ backgroundColor: '#69C82D', p: 1, ml: 1, borderRadius: 15 }}></Grid>
                      </Grid>
                    </Card>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xl md sm={6} xs={12}>
                <Card sx={{ flex: 1 }}>
                  <Grid sx={{ backgroundColor: '#6486c2', height: '5px' }}></Grid>
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography sx={{ mb: 1, fontWeight: 'bold' }}>Preproduccion</Typography>
                    <Card sx={{ p: 2, mt: 1, display: 'grid', alignItems: 'stretch', justifyContent: 'stretch', backgroundColor: '#ECF0F7' }}>
                      <Typography sx={{ mb: 1 }}><b>Namespace:</b> pre</Typography>
                      <Typography sx={{ mb: 1 }}><b>Version:</b> 1.0.1-RC</Typography>
                      <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography><b>Status:</b></Typography>
                        <Grid sx={{ backgroundColor: '#69C82D', p: 1, ml: 1, borderRadius: 15 }}></Grid>
                      </Grid>
                    </Card>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xl md sm={6} xs={12}>
                <Card sx={{ flex: 1 }}>
                  <Grid sx={{ backgroundColor: '#6486c2', height: '5px' }}></Grid>
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography sx={{ mb: 1, fontWeight: 'bold' }}>Produccion</Typography>
                    <Card sx={{ p: 2, mt: 1, display: 'grid', alignItems: 'stretch', justifyContent: 'stretch', backgroundColor: '#ECF0F7' }}>
                      <Typography sx={{ mb: 1 }}><b>Namespace:</b> pro</Typography>
                      <Typography sx={{ mb: 1 }}><b>Version:</b> 1.0.0</Typography>
                      <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography><b>Status:</b></Typography>
                        <Grid sx={{ backgroundColor: '#69C82D', p: 1, ml: 1, borderRadius: 15 }}></Grid>
                      </Grid>
                    </Card>
                  </CardContent>
                </Card>
              </Grid> */}
            </Grid>
          </Card>
          <Grid sx={{ mt: 3 }}>
            <Card sx={{ backgroundColor: '#FFF', p: 3 }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: 20 }}>List of Releases</Typography>
              <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right', mb: 1 }}>
                <Button sx={{ 'border': '1px solid #6486c2', 'color': '#6486c2', '&:hover': { border: '1px solid #6486c2c9', color: '#6486c2c9' } }} onClick={handleOpen} startIcon={<AddIcon />} variant="outlined" size="small" disableElevation>Create Release</Button>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" fontWeight="bold">
                      Create Release
                    </Typography>
                    <Grid sx={{ mt: 3, mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Grid sx={{ marginRight: '10px', width: '30px', height: '10px', backgroundColor: '#6785C1', borderRadius: 0.8 }}></Grid>
                      <Typography fontWeight="bold">Tag:</Typography>
                      <TextField sx={{ ml: 1.6 }} fullWidth onChange={(e) => setRelease(e.target.value)} />
                    </Grid>
                    <Grid sx={{ mt: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Grid sx={{ marginRight: '10px', width: '30px', height: '10px', backgroundColor: '#6785C1', borderRadius: 0.8 }}></Grid>
                      <Typography fontWeight="bold">Title:</Typography>
                      <TextField sx={{ ml: 1 }} multiline fullWidth onChange={(e) => setReleaseTitle(e.target.value)} />
                    </Grid>
                    <Grid container spacing={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                      <Grid item>
                        <Button onClick={handleClose}>Close</Button>
                      </Grid>
                      <Grid item>
                        <Button onClick={createRelease}>Create</Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Modal>
              </Grid>
              <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#6486c2' }}>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', color: '#fff' }}>Release</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Status</TableCell>
                    {component?.environments.map((env: any) => (
                      env.nameSpace !== 'dev' && <TableCell key={env.nameSpace} align="center" sx={{ fontWeight: 'bold', color: '#fff' }}>{env.envPath.slice(0, 1).toUpperCase() + env.envPath.slice(1)}</TableCell>
                    ))}
                    {/* <TableCell align="center" sx={{ fontWeight: 'bold', color: '#fff' }}>Preproduccion</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#fff' }}>Produccion</TableCell> */}
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#fff' }}>Promote</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#fff' }}>Approve</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0 ? listReleases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : listReleases).map((rel: any) => (
                    <TableRow key={rel.release} sx={{ backgroundColor: '#F3F4F8' }}>
                      <TableCell component="th" scope="row">
                        {rel.tagName.split('-')[0]}
                      </TableCell>
                      <TableCell>
                        {rel.status ? rel.status.name : ''}
                      </TableCell>
                      <TableCell align="center">
                        {rel.versionPre ? rel.versionPre : '-'}
                      </TableCell>
                      <TableCell align="center">
                        {rel.versionPro ? rel.versionPro : '-'}
                      </TableCell>
                      <TableCell align="center">
                        {rel.actions.map((action: any) => {
                          if (action.id.includes('promote')) {
                            return action.enabled && !rel.versionPro ?
                              <Button key={action.id} onClick={() => promoteRelease(rel, action.id)} sx={{ 'border': '1px solid #6486c2', 'color': '#6486c2', '&:hover': { border: '1px solid #6486c2c9', color: '#6486c2c9' } }} variant="outlined" size="small">
                                {action.name}
                              </Button> : <Button key={action.id} sx={{ 'border': '1px solid #6486c2', 'color': '#6486c2', '&:hover': { border: '1px solid #6486c2c9', color: '#6486c2c9' } }} variant="outlined" size="small" disabled>
                                {action.name}
                              </Button>;
                          };
                        })}
                      </TableCell>
                      <TableCell align="center">
                        {renderApproveRelease(rel)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={1 + component?.environments.length - 1} />
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow sx={{ backgroundColor: '#F3F4F8' }}>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                      colSpan={4 + component?.environments.length - 1}
                      count={listReleases.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        inputProps: {
                          'aria-label': 'rows per page',
                        },
                        native: true,
                      }}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </Card>
          </Grid>
        </Grid>
      </Grid> : <Progressing text='LOADING' />}
    </Grid>
  );
}

