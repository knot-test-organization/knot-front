import { Paper, Grid, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Dialog, DialogTitle, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Collapse, IconButton, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { axiosExperience } from '../../../../axios';
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';
import { Progressing } from '../../../Progressing';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorIcon from '@mui/icons-material/Error';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateTimeField } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

export const PipelineStatus = ({ dataParentToChild }: any) => {
    const [pipelineNames, setpipelineNames] = useState(null);
    const [executionNames, setexecutionNames] = useState(null);
    const [dateTimes, setdateTimes] = useState(null);
    const [startTime, setStartTime] = React.useState<Dayjs | null>(null);
    const [endTime, setendTime] = React.useState<Dayjs | null>(null);
    const [open, setOpen] = useState(false);
    const renderedRows: string[] = [''];
    const [stepNames, setstepNames] = useState(null);
    const [pipelineRequest, setPipelineRequest] = useState({
        componentName: dataParentToChild.id,
        pipelineName: null,
        pipelineExecutionName: null,
        stepName: null,
        startTime: null,
        endTime: null,
    });
    const [pipelineStatusResponse, setpipelineStatusResponse] = useState(null);
    const rows: string[] = [];

    React.useEffect(() => {
        fetchData();
    }, []);

    const handlePipelineSelectChange = async (value: string, property: string) => {
        setPipelineRequest((prevRequest) => ({
            ...prevRequest,
            [property]: value,
        }));
        const response = await axiosExperience.get<any>(
            'components/listPipelineExecutions/' + value,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            },
        );
        setexecutionNames(JSON.parse(response.data));
    };

    const handleExecutionSelectChange = async (value: string, property: string) => {
        setPipelineRequest((prevRequest) => ({
            ...prevRequest,
            [property]: value,
        }));
        const response = await axiosExperience.get<any>(
            'components/listPipelineSteps/' + value,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            },
        );
        setstepNames(JSON.parse(response.data));
    };

    const handleSelectChange = async (value: string, property: string) => {
        setPipelineRequest((prevRequest) => ({
            ...prevRequest,
            [property]: value,
        }));
    };

    interface PipelineStatusData {
        key: string;
        value: {
            endTime: string;
            pipelineId: string;
            starTime: string;
            status: string;
            pipelineName: string;
            executioName: string;
            stepName: string;
        }
    }

    function getStatusIcon(type: String) {
        switch (type.toLowerCase()) {
            case 'running':
                return <CircularProgress size='25px' />;
            case 'completed':
                return <TaskAltIcon color="success" />;
            case 'succeeded':
                return <TaskAltIcon color="success" />;
            case 'failed':
                return <ErrorIcon sx={{ color: 'red' }} />;
        }
    }
    const handleClose = () => {
        setOpen(false);
    };

    const clearFilters = () => {
        setPipelineRequest({
            ...pipelineRequest,
            pipelineName: null,
            pipelineExecutionName: null,
            stepName: null,
            startTime: null,
            endTime: null,
        });
    };

    const checkPipelineInfo = async () => {
        setOpen(true);
        const { data } = await axiosExperience.post<any>(
            'components/getPipelineInfo',
            {
                componentName: dataParentToChild.id,
                pipelineName: pipelineRequest.pipelineName ? pipelineRequest.pipelineName : null,
                pipelineExecutionName: pipelineRequest.pipelineExecutionName ? pipelineRequest.pipelineExecutionName : null,
                stepName: pipelineRequest.stepName ? pipelineRequest.stepName : null,
                startTime: pipelineRequest.startTime ? pipelineRequest.startTime : null,
                endTime: pipelineRequest.endTime ? pipelineRequest.endTime : null,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            },
        );
        setpipelineStatusResponse(data);
        handleClose();
        return data;
    };
    async function fetchData() {
        const { data } = await axiosExperience.post<any>(
            'components/getPipelineInfo',
            {
                componentName: dataParentToChild.id,
                pipelineName: pipelineRequest.pipelineName ? pipelineRequest.pipelineName : null,
                pipelineExecutionName: pipelineRequest.pipelineExecutionName ? pipelineRequest.pipelineExecutionName : null,
                stepName: pipelineRequest.stepName ? pipelineRequest.stepName : null,
                startTime: pipelineRequest.startTime ? pipelineRequest.startTime : null,
                endTime: pipelineRequest.endTime ? pipelineRequest.endTime : null,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            },
        );

        if (data) {
            const pipelines: string[] = [];
            const dateTimes: string[] = [];
            data.map((item: { key: string; value: { end_time: string, executioName: string, pipelineName: string, stepName: string, start_time: string, pipeline_id: string, status: string } }) => {
                const keyParts = item.key.split('||')[1].split('|');
                if (!pipelines.includes(keyParts[1])) {
                    pipelines.push(keyParts[1]);
                }
                if (!dateTimes.includes(item.value.start_time) && (item.value.stepName == 'core-info')) {
                    dateTimes.push(item.value.start_time);
                }
            });
            setpipelineNames(pipelines);
            setdateTimes(dateTimes);
        }

        const response = await axiosExperience.get<any>(
            'components/getInitialTable/' + dataParentToChild.id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            },
        );

        if (response.data) {
            setpipelineStatusResponse(response.data);
        }
    }

    function ExecutionRows(props: { row: any }) {
        const { row } = props;
        const [open, setOpen] = useState(false);
        return (
            <>
                {row.value.stepName != 'core-info' ?
                    <TableRow sx={{ '& > *': { borderBottom: 'unset', bgcolor: '#FDFAF6' } }}>
                        <TableCell sx={{ width: '10px' }}>
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => setOpen(!open)}
                            >
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </TableCell>
                        <TableCell sx={{}} align='center'>{row.value.pipelineName}</TableCell>
                        <TableCell sx={{}} align='center'>{row.value.executioName}</TableCell>
                        <TableCell sx={{}} align='center'>{row.value.stepName}</TableCell>
                        <TableCell sx={{}} align='center'>{getStatusIcon(row.value.status)}</TableCell>
                        <TableCell sx={{}} align='center'>{row.value.start_time}</TableCell>
                    </TableRow> : ''}
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Table size="small" aria-label="purchases">
                                <TableBody>
                                    <Paper sx={{ p: '20px', m: '10px' }} elevation={1}>
                                        <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>JSON Response</Typography>
                                        <pre>{JSON.stringify(row.value, null, 2)}</pre>
                                    </Paper>
                                </TableBody>
                            </Table>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </>
        );
    }

    function Row(props: { row: any }) {
        const { row } = props;
        const [open, setOpen] = useState(false);

        const shouldRenderFirstRow = !renderedRows.includes(row.value.pipelineName + row.value.executioName);
        console.log(shouldRenderFirstRow);

        if (shouldRenderFirstRow) {
            // setRenderedRows([...renderedRows, row.value.pipelineName + row.value.executioName]);
            renderedRows.push(row.value.pipelineName + row.value.executioName);
        }
        console.log(renderedRows);
        return (
            <>
                {row.value.stepName == 'core-info' ?
                    <TableRow sx={{ '& > *': { justifyContent: 'flex-end' } }}>
                        <TableCell sx={{ width: '10px' }}>
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => setOpen(!open)}
                            >
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} >{row.value.pipelineName}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} >{row.value.executioName}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} ></TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} >{getStatusIcon(row.value.status)}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} >{row.value.start_time}</TableCell>
                    </TableRow> : ''}
                {/* {setFirstOne(false)} */}
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Table size="small" sx={{ margin: '0px', p: 0, width: '100%' }}>
                                <TableBody>
                                    {pipelineStatusResponse.map((pipelineStatusResponse: any) => (
                                        pipelineStatusResponse.value.pipelineName + pipelineStatusResponse.value.executioName === row.value.pipelineName + row.value.executioName &&
                                        <ExecutionRows key={pipelineStatusResponse.key} row={pipelineStatusResponse} />
                                    ))}
                                </TableBody>
                            </Table>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </>
        );
    }
    const PipelineStatusTable: React.FC<{ pipelineStatusResponse: PipelineStatusData[] }> = ({ pipelineStatusResponse }) => {
        return (
            <Grid sx={{ pl: 0, pr: 0, pb: 0 }}>
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table" size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#6486c2', color: '#fff' }}>
                                <TableCell />
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} >Pipeline</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} >Execution</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} >Step</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} >Status</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} >Time</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pipelineStatusResponse.map((pipelineStatusResponse) => {
                                return <Row key={pipelineStatusResponse.key} row={pipelineStatusResponse} />;
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        );
    };


    return (
        <Grid container spacing={2} sx={{ width: '100%', display: 'flex' }}>
            <Grid item xl={3.2} md={5.5} sm={12} xs={12}>
                <Paper sx={{ p: '20px' }} elevation={12}>
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                        <Grid item xs={12} sx={{ mb: 1, alignItems: 'center' }}>
                            <Typography sx={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Search Panel</Typography>
                        </Grid>
                        <Grid container sx={{ ml: '3px', mt: 2, display: 'grid' }}>
                            <Grid xs={12} sm={12} xl={12} md={12}>
                                <FormControl sx={{ mt: 1, width: '100%' }}>
                                    <InputLabel id="select-label" sx={{ fontSize: '15px' }}>Pipelines</InputLabel>
                                    <Select sx={{ mb: 1, fontSize: '15px' }} fullWidth labelId="select-label" label="Pipelines" onChange={(event) => handlePipelineSelectChange(event.target.value, 'pipelineName')} value={pipelineRequest.pipelineName}>
                                        {pipelineNames ? pipelineNames.map((pipelineName: string, index: number) => (
                                            <MenuItem key={index} value={pipelineName}>
                                                {pipelineName}
                                            </MenuItem>
                                        )) : <MenuItem value={''}>
                                            {''}
                                        </MenuItem>}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} xl={12} md={12}>
                                <FormControl sx={{ mt: 1, width: '100%' }}>
                                    <InputLabel id="select-label" sx={{ fontSize: '15px' }}>Executions</InputLabel>
                                    <Select sx={{ mb: 1, fontSize: '15px' }} fullWidth labelId="select-label" label="Executions" onChange={(event) => handleExecutionSelectChange(event.target.value, 'pipelineExecutionName')} value={pipelineRequest.pipelineExecutionName}>
                                        {executionNames ? executionNames.map((executionName: string, index: number) => (
                                            <MenuItem key={index} value={executionName}>
                                                {executionName}
                                            </MenuItem>
                                        )) : <MenuItem value={''}>
                                            {''}
                                        </MenuItem>}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} xl={12} md={12}>
                                <FormControl sx={{ mt: 1, width: '100%' }}>
                                    <InputLabel id="select-label" sx={{ fontSize: '15px' }}>Steps</InputLabel>
                                    <Select sx={{ mb: 1, fontSize: '15px' }} fullWidth labelId="select-label" label="Steps" onChange={(event) => handleSelectChange(event.target.value, 'stepName')} value={pipelineRequest.stepName}>
                                        {stepNames ? stepNames.map((stepName: string, index: number) => (
                                            <MenuItem key={index} value={stepName}>
                                                {stepName}
                                            </MenuItem>
                                        )) : <MenuItem value={''}>
                                            {''}
                                        </MenuItem>}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} xl={12} md={12}>
                                <FormControl sx={{ mt: 1, width: '100%' }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer
                                            components={['DateTimePicker']}
                                        >
                                            <DateTimePicker
                                                label="Start time"
                                                value={startTime}
                                                onChange={(newValue) => handleSelectChange(newValue.format('YYYY-MM-DD HH:mm:ss'), 'startTime')}
                                                viewRenderers={{
                                                    hours: null,
                                                    minutes: null,
                                                    seconds: null,
                                                }}
                                            />
                                            <DateTimePicker
                                                label="End time"
                                                value={endTime}
                                                onChange={(newValue) => handleSelectChange(newValue.format('YYYY-MM-DD HH:mm:ss'), 'endTime')}
                                                viewRenderers={{
                                                    hours: null,
                                                    minutes: null,
                                                    seconds: null,
                                                }}
                                            />

                                        </DemoContainer>
                                    </LocalizationProvider>
                                </FormControl>
                            </Grid>
                            <Grid sx={{ m: '0px', mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Button sx={{ 'fontSize': '10px', 'width': '70px', 'border': '1px solid #6486c2', 'color': '#6486c2', 'height': '40px', '&:hover': { border: '1px solid #6486c2c9', color: '#6486c2c9' } }} variant="outlined" onClick={clearFilters}>clear</Button>
                                <Button sx={{ 'fontSize': '10px', 'width': '70px', 'border': '1px solid #6486c2', 'color': '#6486c2', 'height': '40px', 'marginLeft': '160px', '&:hover': { border: '1px solid #6486c2c9', color: '#6486c2c9' } }} variant="outlined" onClick={checkPipelineInfo}>Search</Button>
                            </Grid>
                        </Grid>
                    </Grid>

                </Paper>
            </Grid>
            {/* item xl={3.2} md={5.5} sm={12} xs={12} */}
            <Grid item xl={8.8} md={6.5} sm={12} xs={12}>
                {pipelineStatusResponse && (
                    <PipelineStatusTable pipelineStatusResponse={pipelineStatusResponse} />
                )}
            </Grid>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle id='alert-dialog-title'>
                    {<Progressing text='SEARCHING' />}
                </DialogTitle>
            </Dialog>
        </Grid>
    );
};
