import {
    Stepper,
    Step,
    StepLabel,
    Typography,
    Button,
    Paper,
    Dialog,
    DialogActions,
    DialogTitle,
} from '@mui/material';
import React from 'react';
import { CreateProductConfigure } from './CreateProductConfigure/CreateProductConfigure';
import { CreateProductSummary } from './CreateProductSummary/CreateProductSummary';
import { useForm, FormProvider } from 'react-hook-form';
import './CreateProduct.css';
import { grey } from '@mui/material/colors';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosExperience } from '../../../axios';
import { useConfig } from '../../ConfigContext';
import { Progressing } from '../../Progressing';
import { from } from 'form-data';
import Cookies from 'js-cookie';

export const CreateProduct = () => {
    const config = useConfig();
    const methods = useForm();
    const [activeStep, setActiveStep] = React.useState(0);
    const [compiledForm, setCompiledForm] = React.useState({});
    const [open, setOpen] = React.useState(false);
    const [idCheck, setidCheck] = React.useState(false);

    const [dialogData, setDialogData] = React.useState('');
    const [error, setError] = React.useState<string | null>(null);
    const [creatingProject, setCreatingProject] = React.useState(false);
    const listSteps: any[] = [];


    function getSteps() {
        let step = 0;
        for (let i = 0; i < config.newProduct.length; i++) {
            if (config.newProduct[i].enabled) {
                listSteps.push({ id: config.newProduct[i].id, name: config.newProduct[i].name, step: step });
                step++;
            };
        }
        return listSteps;
    };

    function getStepContent(step: any, formContent: any) {
        for (let i = 0; i < listSteps.length; i++) {
            if (step == listSteps[i].step) {
                switch (listSteps[i].id) {
                    case 1:
                        return <CreateProductConfigure formContent={formContent} id={listSteps[i].id} />;
                    case 2:
                        return <CreateProductSummary formContent={formContent} id={listSteps[i].id} />;
                    default:
                        return 'Unknown step';
                }
            }
        }
    }
    const steps = getSteps();
    const navigate = useNavigate();
    const handleNext = () => {
        let canContinue = true;
        for (let i = 0; i < listSteps.length; i++) {
            if (activeStep == listSteps[i].step) {
                let pos;
                for (let j = 0; j < config.newProduct.length; j++) {
                    if (listSteps[i].id == config.newProduct[j].id) {
                        pos = j;
                    }
                }
                switch (listSteps[i].id) {
                    case 1:
                        canContinue = true;
                        if (config.newProduct[pos].category[0].enabled) {
                            if (methods.getValues().name == '') {
                                canContinue = false;
                                setidCheck(true);
                                methods.setValue('idCheck', true);
                            } else if (!validateName(methods.getValues().id)) {
                                canContinue = false;
                                setidCheck(true);
                                methods.setValue('idCheck', true);
                            } else {
                                canContinue = true;
                                setidCheck(false);
                                methods.setValue('idCheck', false);
                            };
                        };
                        setCompiledForm({
                            ...compiledForm,
                            id: methods.getValues().id,
                            name: methods.getValues().name,
                            description: methods.getValues().description,
                            organization: methods.getValues().organization,
                            area: methods.getValues().area,
                            idCheck: methods.getValues().idCheck,
                        });
                        break;
                    case 2:
                        setCompiledForm({
                            ...compiledForm,
                            id: methods.getValues().id,
                            name: methods.getValues().name,
                            description: methods.getValues().description,
                            organization: methods.getValues().organization,
                            area: methods.getValues().area,
                            idCheck: methods.getValues().idCheck,
                        });
                        break;
                }
            }
        }
        if (canContinue && activeStep < steps.length - 1) {
            setActiveStep(activeStep + 1);
        } else if (activeStep === steps.length - 1) {
            handleSubmit(compiledForm);
        }
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep(activeStep - 1);
            setCompiledForm({
                ...compiledForm,
                id: methods.getValues().id,
                name: methods.getValues().name,
                description: methods.getValues().description,
                organization: methods.getValues().organization,
                area: methods.getValues().area,

            });
        }
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompiledForm({});
    };

    const handleSubmit = async (form: any) => {
        const user = Cookies.get('user');
        if (user) {
            try {
                const userParse = JSON.parse(user);
                setOpen(true);
                setCreatingProject(true);
                const { data } = await axiosExperience.post<any>(
                    'products',
                    {
                        id: form.id,
                        name: form.name,
                        description: form.description,
                        organization: form.organization,
                        area: form.area,
                        po: userParse.login,
                        teams: [form.id + '-leads', form.id + '-developers'],
                        version: '1.0.0',
                        environments: [
                            {
                                enabled: true,
                                envPath: 'development',
                                nameSpace: 'dev',
                                version: '0.0.0',
                            },
                            {
                                enabled: false,
                                envPath: 'stage',
                                nameSpace: 'pre',
                                version: '',
                            },
                            {
                                enabled: false,
                                envPath: 'production',
                                nameSpace: 'pro',
                                version: '',
                            },
                        ],
                        components: [],

                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                    },
                );
                console.log('response', data);
                setDialogData('Product created successfully');
                setError(null);
                setCreatingProject(false);
            } catch (error) {
                console.log(error);
                setDialogData(JSON.stringify(error));
                setError(error.message || error);
                setCreatingProject(false);
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
        if (!error) {
            navigate('/');
        }
    };

    const handleCloseIdNull = () => {
        setidCheck(false);
        if (!error) {
            navigate('/newproduct');
        }
    };

    const validateName = (input: string) => {
        const nameRegex = /^[a-z0-9]+$/g;
        return nameRegex.test(input);
    };

    const goBack = () => {
        const url = window.location.href;
        const parts = url.split('/newproduct');
        const newUrl = parts[0];
        window.location.href = newUrl;
    };

    return (
        <div className='margin-container'>
            <Paper sx={{ bgcolor: grey[100], p: '20px' }} elevation={1}>
                <Stepper activeStep={activeStep}>
                    {steps.map((step, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        return (
                            <Step key={step.id} {...stepProps}>
                                <StepLabel {...labelProps}>{step.name}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                <div>
                    {activeStep === steps.length ? (
                        <div>
                            <>
                                <Typography>Completed</Typography>
                                <Button sx={{ 'backgroundColor': '#6486c2' }} onClick={handleReset}>Close</Button>
                            </>
                        </div>
                    ) : (
                        <div>
                            <FormProvider {...methods}>
                                {getStepContent(activeStep, compiledForm)}
                            </FormProvider>
                            <div className='stepper-buttons'>
                                <Button onClick={activeStep === 0 ? goBack : handleBack}>
                                    {activeStep === 0 ? 'Cancel' : 'Back'}
                                </Button>
                                <Button onClick={handleNext}>
                                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Paper>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle id='alert-dialog-title'>
                    {creatingProject ? <Progressing text='CREATING' /> : dialogData}
                </DialogTitle>
                {creatingProject ? '' : <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        OK
                    </Button>
                </DialogActions>}
            </Dialog>

            <Dialog
                open={idCheck}
                onClose={handleCloseIdNull}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle id='alert-dialog-title'>
                    {'You need to introduce a valid id'}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseIdNull} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
