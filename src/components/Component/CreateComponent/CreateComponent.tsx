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
	Grid,
	Card,
	SvgIcon,
} from '@mui/material';
import React from 'react';
import { ReactComponent as ProductIcon } from '../../../assets/icons/product.svg';
import { CreateComponentConfigure } from './CreateComponentConfigure/CreateComponentConfigure';
import { CreateComponentTeam } from './CreateComponentTeam/CreateComponentTeam';
import { CreateComponentALM } from './CreateComponentALM/CreateComponentALM';
import { CreateComponentCode } from './CreateComponentCode/CreateComponentCode';
import { CreateComponentIaC } from './CreateComponentIaC/CreateComponentIaC';
import { CreateComponentDeployment } from './CreateComponentDeployment/CreateComponentDeployment';
import { CreateComponentCollaboration } from './CreateComponentCollaboration/CreateComponentCollaboration';
import { useForm, FormProvider } from 'react-hook-form';
import { CreateComponentSummary } from './CreateComponentSummary/CreateComponentSummary';
import './CreateComponent.css';
import { grey } from '@mui/material/colors';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosExperience } from '../../../axios';
import { useConfig } from '../../ConfigContext';
import { Progressing } from '../../Progressing';

export const CreateComponent = () => {
	const { org, area, id } = useParams();
	const config = useConfig();
	const methods = useForm();
	const [activeStep, setActiveStep] = React.useState(0);
	const [compiledForm, setCompiledForm] = React.useState({});
	const [open, setOpen] = React.useState(false);
	const [idCheck, setidCheck] = React.useState(false);
	const [technologyCheck, setTechnologyCheck] = React.useState(false);
	// const [containerRegistryCheck, setContainerRegistryCheck] = React.useState(false);
	const [usersCheck, setusersCheck] = React.useState(false);
	const [devcontainersCheck, setDevcontainersCheck] = React.useState(false);
	const [appTypologyCheck, setAppTypologyCheck] = React.useState(false);
	const [dialogData, setDialogData] = React.useState('');
	const [error, setError] = React.useState<string | null>(null);
	const [creatingProject, setCreatingProject] = React.useState(false);
	const listSteps: any[] = [];
	const [product, setProduct] = React.useState(null);

	function getSteps() {
		let step = 0;
		for (let i = 0; i < config.newComponent.length; i++) {
			if (config.newComponent[i].enabled) {
				listSteps.push({ id: config.newComponent[i].id, name: config.newComponent[i].name, step: step });
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
						return <CreateComponentConfigure formContent={formContent} id={listSteps[i].id} product={product} />;
					case 2:
						return <CreateComponentTeam formContent={formContent} id={listSteps[i].id} />;
					case 3:
						return <CreateComponentCode formContent={formContent} id={listSteps[i].id} />;
					case 4:
						return <CreateComponentALM formContent={formContent} id={listSteps[i].id} />;
					case 5:
						return <CreateComponentIaC formContent={formContent} id={listSteps[i].id} />;
					case 6:
						return <CreateComponentCollaboration formContent={formContent} id={listSteps[i].id} />;
					case 7:
						return <CreateComponentDeployment formContent={formContent} id={listSteps[i].id} />;
					case 8:
						return <CreateComponentSummary formContent={formContent} id={listSteps[i].id} />;
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
				for (let j = 0; j < config.newComponent.length; j++) {
					if (listSteps[i].id == config.newComponent[j].id) {
						pos = j;
					}
				}
				switch (listSteps[i].id) {
					case 1:
						canContinue = true;
						if (config.newComponent[pos].category[0].enabled) {
							if (methods.getValues().id == '') {
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
							blueprint: methods.getValues().blueprint,
							type: methods.getValues().type,
							idCheck: methods.getValues().idCheck,
							openapifile: methods.getValues().openapifile,
							showClientConfig: methods.getValues().showClientConfig,
						});
						break;
					case 2:
						canContinue = true;
						if (config.newComponent[pos].category[0].enabled) {
							if (!methods.getValues().team) {
								canContinue = false;
								methods.setValue('usersCheck', true);
								setusersCheck(true);
							};
							if (methods.getValues().openapifile == undefined || methods.getValues().openapifile == null || methods.getValues().openapifile == '') {
								methods.setValue('openapifile', '');
							}
						}
						setCompiledForm({
							...compiledForm,
							id: methods.getValues().id,
							name: methods.getValues().name,
							description: methods.getValues().description,
							organization: methods.getValues().organization,
							area: methods.getValues().area,
							blueprint: methods.getValues().blueprint,
							type: methods.getValues().type,
							idCheck: methods.getValues().idCheck,
							openapifile: methods.getValues().openapifile,
							showClientConfig: methods.getValues().showClientConfig,
							team: methods.getValues().team,
						});
						break;
					case 3:
						if (config.newComponent[pos].category[0].enabled) {
							if (config.newComponent[pos].category[0].subcategory[1].enabled) {
								if (methods.getValues().technology) {
									canContinue = true;
									setTechnologyCheck(false);
									methods.setValue('technologyCheck', false);
									if (methods.getValues().technology.id == 'java-restclient') {
										methods.setValue('containerRegistry', '');
										methods.setValue('artifactRegistry', 'Github Package');
									};
								} else {
									canContinue = false;
									setTechnologyCheck(true);
									methods.setValue('technologyCheck', true);
								};
							};
							if (config.newComponent[pos].category[0].subcategory[2].enabled) {
								if (methods.getValues().codespaces) {
									if (config.newComponent[pos].category[0].subcategory[2].items[0].enabled) {
										if (methods.getValues().devcontainers) {
											if (methods.getValues().devcontainers.length == 0) {
												setDevcontainersCheck(true);
												canContinue = false;
												methods.setValue('devcontainersCheck', true);
											} else {
												setDevcontainersCheck(false);
												canContinue = true;
												methods.setValue('devcontainersCheck', false);
											};
										} else {
											setDevcontainersCheck(true);
											canContinue = false;
											methods.setValue('devcontainersCheck', true);
										};
									}
								};
							};
						}
						setCompiledForm({
							...compiledForm,
							id: methods.getValues().id,
							name: methods.getValues().name,
							description: methods.getValues().description,
							organization: methods.getValues().organization,
							area: methods.getValues().area,
							blueprint: methods.getValues().blueprint,
							type: methods.getValues().type,
							openapifile: methods.getValues().openapifile,
							idCheck: methods.getValues().idCheck,
							usersCheck: methods.getValues().usersCheck,
							devcontainersCheck: methods.getValues().devcontainersCheck,
							showClientConfig: methods.getValues().showClientConfig,
							team: methods.getValues().team,
							repository: methods.getValues().repository,
							technology: methods.getValues().technology,
							technologyCheck: methods.getValues().technologyCheck,
							devcontainers: methods.getValues().devcontainers,
						});
						break;
					case 4:
						setCompiledForm({
							...compiledForm,
							id: methods.getValues().id,
							name: methods.getValues().name,
							description: methods.getValues().description,
							organization: methods.getValues().organization,
							area: methods.getValues().area,
							blueprint: methods.getValues().blueprint,
							type: methods.getValues().type,
							openapifile: methods.getValues().openapifile,
							idCheck: methods.getValues().idCheck,
							usersCheck: methods.getValues().usersCheck,
							showClientConfig: methods.getValues().showClientConfig,
							team: methods.getValues().team,
							repository: methods.getValues().repository,
							technology: methods.getValues().technology,
							devcontainers: methods.getValues().devcontainers,
							automationTool: methods.getValues().automationTool,
							automationToolPipeline: methods.getValues().automationToolPipeline,
							gitBranching: methods.getValues().gitBranching,
							containerRegistry: methods.getValues().containerRegistry,
							artifactRegistry: methods.getValues().artifactRegistry,
							sonarqubeScan: methods.getValues().sonarqubeScan,
						});
						break;
					case 5:
						setCompiledForm({
							...compiledForm,
							id: methods.getValues().id,
							name: methods.getValues().name,
							description: methods.getValues().description,
							organization: methods.getValues().organization,
							area: methods.getValues().area,
							blueprint: methods.getValues().blueprint,
							type: methods.getValues().type,
							openapifile: methods.getValues().openapifile,
							idCheck: methods.getValues().idCheck,
							usersCheck: methods.getValues().usersCheck,
							showClientConfig: methods.getValues().showClientConfig,
							team: methods.getValues().team,
							repository: methods.getValues().repository,
							technology: methods.getValues().technology,
							devcontainers: methods.getValues().devcontainers,
							automationTool: methods.getValues().automationTool,
							automationToolPipeline: methods.getValues().automationToolPipeline,
							gitBranching: methods.getValues().gitBranching,
							containerRegistry: methods.getValues().containerRegistry,
							artifactRegistry: methods.getValues().artifactRegistry,
							sonarqubeScan: methods.getValues().sonarqubeScan,
							serverless: methods.getValues().serverless,
							BBDD: methods.getValues().BBDD,
							BBDDType: methods.getValues().BBDDType,
							BBDDName: methods.getValues().BBDDName,
							BBDDAdmin: methods.getValues().BBDDAdmin,
							BBDDAdminPass: methods.getValues().BBDDAdminPass,
							BBDDTier: methods.getValues().BBDDTier,
							BBDDVersion: methods.getValues().BBDDVersion,
						});
						break;
					case 6:
						setCompiledForm({
							...compiledForm,
							id: methods.getValues().id,
							name: methods.getValues().name,
							description: methods.getValues().description,
							organization: methods.getValues().organization,
							area: methods.getValues().area,
							blueprint: methods.getValues().blueprint,
							type: methods.getValues().type,
							openapifile: methods.getValues().openapifile,
							idCheck: methods.getValues().idCheck,
							usersCheck: methods.getValues().usersCheck,
							showClientConfig: methods.getValues().showClientConfig,
							team: methods.getValues().team,
							repository: methods.getValues().repository,
							technology: methods.getValues().technology,
							devcontainers: methods.getValues().devcontainers,
							automationTool: methods.getValues().automationTool,
							automationToolPipeline: methods.getValues().automationToolPipeline,
							gitBranching: methods.getValues().gitBranching,
							containerRegistry: methods.getValues().containerRegistry,
							artifactRegistry: methods.getValues().artifactRegistry,
							sonarqubeScan: methods.getValues().sonarqubeScan,
							BBDD: methods.getValues().BBDD,
							BBDDType: methods.getValues().BBDDType,
							BBDDName: methods.getValues().BBDDName,
							BBDDAdmin: methods.getValues().BBDDAdmin,
							BBDDAdminPass: methods.getValues().BBDDAdminPass,
							BBDDTier: methods.getValues().BBDDTier,
							BBDDVersion: methods.getValues().BBDDVersion,
							connectivity: methods.getValues().connectivity,
						});
						break;
					case 7:
						if (methods.getValues().ha && !methods.getValues().appTypology) {
							canContinue = false;
							setAppTypologyCheck(true);
						} else {
							canContinue = true;
							setAppTypologyCheck(false);
						}
						setCompiledForm({
							...compiledForm,
							id: methods.getValues().id,
							name: methods.getValues().name,
							description: methods.getValues().description,
							organization: methods.getValues().organization,
							area: methods.getValues().area,
							blueprint: methods.getValues().blueprint,
							type: methods.getValues().type,
							openapifile: methods.getValues().openapifile,
							nameCheck: methods.getValues().nameCheck,
							usersCheck: methods.getValues().usersCheck,
							showClientConfig: methods.getValues().showClientConfig,
							team: methods.getValues().team,
							repository: methods.getValues().repository,
							technology: methods.getValues().technology,
							devcontainers: methods.getValues().devcontainers,
							automationTool: methods.getValues().automationTool,
							automationToolPipeline: methods.getValues().automationToolPipeline,
							gitBranching: methods.getValues().gitBranching,
							containerRegistry: methods.getValues().containerRegistry,
							artifactRegistry: methods.getValues().artifactRegistry,
							sonarqubeScan: methods.getValues().sonarqubeScan,
							BBDD: methods.getValues().BBDD,
							BBDDType: methods.getValues().BBDDType,
							BBDDName: methods.getValues().BBDDName,
							BBDDAdmin: methods.getValues().BBDDAdmin,
							BBDDAdminPass: methods.getValues().BBDDAdminPass,
							BBDDTier: methods.getValues().BBDDTier,
							BBDDVersion: methods.getValues().BBDDVersion,
							connectivity: methods.getValues().connectivity,
							ha: methods.getValues().ha,
							appTypology: methods.getValues().appTypology,
						});
						break;
					case 8:
						setCompiledForm({
							...compiledForm,
							id: methods.getValues().id,
							name: methods.getValues().name,
							description: methods.getValues().description,
							organization: methods.getValues().organization,
							area: methods.getValues().area,
							blueprint: methods.getValues().blueprint,
							type: methods.getValues().type,
							openapifile: methods.getValues().openapifile,
							idCheck: methods.getValues().idCheck,
							usersCheck: methods.getValues().usersCheck,
							showClientConfig: methods.getValues().showClientConfig,
							team: methods.getValues().team,
							repository: methods.getValues().repository,
							technology: methods.getValues().technology,
							devcontainers: methods.getValues().devcontainers,
							automationTool: methods.getValues().automationTool,
							automationToolPipeline: methods.getValues().automationToolPipeline,
							gitBranching: methods.getValues().gitBranching,
							containerRegistry: methods.getValues().containerRegistry,
							artifactRegistry: methods.getValues().artifactRegistry,
							sonarqubeScan: methods.getValues().sonarqubeScan,
							BBDD: methods.getValues().BBDD,
							BBDDType: methods.getValues().BBDDType,
							BBDDName: methods.getValues().BBDDName,
							BBDDAdmin: methods.getValues().BBDDAdmin,
							BBDDAdminPass: methods.getValues().BBDDAdminPass,
							BBDDTier: methods.getValues().BBDDTier,
							BBDDVersion: methods.getValues().BBDDVersion,
							connectivity: methods.getValues().connectivity,
							ha: methods.getValues().ha,
							appTypology: methods.getValues().appTypology,
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
				blueprint: methods.getValues().blueprint,
				type: methods.getValues().type,
				openapifile: methods.getValues().openapifile,
				idCheck: methods.getValues().idCheck,
				usersCheck: methods.getValues().usersCheck,
				showClientConfig: methods.getValues().showClientConfig,
				team: methods.getValues().team,
				repository: methods.getValues().repository,
				technology: methods.getValues().technology,
				devcontainers: methods.getValues().devcontainers,
				automationTool: methods.getValues().automationTool,
				automationToolPipeline: methods.getValues().automationToolPipeline,
				gitBranching: methods.getValues().gitBranching,
				containerRegistry: methods.getValues().containerRegistry,
				artifactRegistry: methods.getValues().artifactRegistry,
				sonarqubeScan: methods.getValues().sonarqubeScan,
				serverless: methods.getValues().serverless,
				BBDD: methods.getValues().BBDD,
				BBDDType: methods.getValues().BBDDType,
				BBDDName: methods.getValues().BBDDName,
				BBDDAdmin: methods.getValues().BBDDAdmin,
				BBDDAdminPass: methods.getValues().BBDDAdminPass,
				BBDDTier: methods.getValues().BBDDTier,
				BBDDVersion: methods.getValues().BBDDVersion,
				connectivity: methods.getValues().connectivity,
				ha: methods.getValues().ha,
				appTypology: methods.getValues().appTypology,
			});
		}
	};

	const handleReset = () => {
		setActiveStep(0);
		setCompiledForm({});
	};

	const handleSubmit = async (form: any) => {
		try {
			const users = [];
			if (form.team) {
				for (let i = 0; i < form.team.length; i++) {
					users.push({
						id: form.team[i][0].toString(),
						name: form.team[i][1],
						role: form.team[i][2],
						azureADUser: form.team[i][3],
						githubRole: form.team[i][4],
					});
				}
			}
			setOpen(true);
			setCreatingProject(true);
			const { data } = await axiosExperience.post<any>(
				'components/' + org + '/' + area + '/' + id,
				{
					component: {
						id: form.id,
						name: form.name,
						description: form.description,
						type: form.type,
						technology: form.technology ? form.technology.id : '',
						repository: form.repository ? form.repository.id : '',
						ha: form.ha,
						devcontainers: form.devcontainers,
						bbdd: {
							enabled: form.BBDD,
							name: form.BBDDName,
							type: form.BBDDType,
							admin: form.BBDDAdmin,
							adminPass: form.BBDDAdminPass,
							version: form.BBDDVersion,
							tier: form.BBDDTier,
						},
						serverless: {
							createFunctionApp: form.serverless.createFunctionApp,
						},
						automationTool: form.automationTool ? form.automationTool.id : '',
						pipelineTemplate: form.automationToolPipeline ? form.automationToolPipeline.id : '',
						gitBranching: form.gitBranching ? form.gitBranching.id : '',
						containerRegistry: form.containerRegistry ? form.containerRegistry.id : '',
						artifactRegistry: form.artifactRegistry,
						sonarqubeScan: form.sonarqubeScan,
						minReplicas: form.appTypology ? form.appTypology.minReplicas : '1',
						maxReplicas: form.appTypology ? form.appTypology.maxReplicas : '1',
						targetAverageUtilization: form.appTypology ? form.appTypology.cpu : null,
						targetMemoryAverageUtilization: form.appTypology ? form.appTypology.memory : null,
						edge: true,
						dockerImage: true,
						organizationName: 'NTTData-HybridCloud',
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
						users: users,
						codespaces: [],
						microsoftTeams: {
							enabled: form.connectivity,
							name: form.name,
							description: form.description,
							usersList: users,
						},
						productDetails: {
							id: id,
							organization: org,
							area: area,
						},
						codeEnabled: config.newComponent[2].enabled,
						almEnabled: config.newComponent[3].enabled,
						iacEnabled: config.newComponent[4].enabled,
						collaborationEnabled: config.newComponent[5].enabled,
						deployEnabled: config.newComponent[6].enabled,
					},
					openapifile: form.openapifile,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
					},
				},
			);
			console.log('response', data);
			setDialogData('Project created successfully');
			setError(null);
			setCreatingProject(false);
		} catch (error) {
			console.log(error);
			setDialogData(JSON.stringify(error));
			setError(error.message || error);
			setCreatingProject(false);
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
	};

	const handleCloseTechnology = () => {
		setTechnologyCheck(false);
	};

	const handleCloseUsersCheck = () => {
		setusersCheck(false);
	};

	const handleCloseDevcontainersCheck = () => {
		setDevcontainersCheck(false);
	};

	const handleCloseAppTypologyCheck = () => {
		setAppTypologyCheck(false);
	};

	const validateName = (input: string) => {
		const nameRegex = /^[a-z0-9]+$/g;
		return nameRegex.test(input);
	};

	const goBack = () => {
		const url = window.location.href;
		const parts = url.split('/newcomponent');
		const newUrl = parts[0];
		window.location.href = newUrl;
	};

	React.useEffect(() => {
		axiosExperience.get('products/' + org + '/' + area + '/' + id).then((response) => {
			setProduct(response.data);
		});
	}, []);

	return (
		<div className='margin-container'>
			{product ? <Grid>
				<Card sx={{ pt: 2, pb: 2, pl: 1, pr: 1, mb: 2 }}>
					<Grid container>
						<Grid item md={1} xs={12} sm={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
								spacing={1}
							>
								<Grid item xl={12} md={12} sm={12} xs={12}>
									<Typography sx={{ mt: 0.5, fontSize: 14, whiteSpace: 'pre-line', minHeight: '3em', maxHeight: '3em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
										<b>Description: </b>{product.description}
									</Typography>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Card>
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

				<Dialog
					open={technologyCheck}
					onClose={handleCloseTechnology}
					aria-labelledby='alert-dialog-title'
					aria-describedby='alert-dialog-description'
				>
					<DialogTitle id='alert-dialog-title'>
						{'You need to introduce a valid technology'}
					</DialogTitle>
					<DialogActions>
						<Button onClick={handleCloseTechnology} autoFocus>
							OK
						</Button>
					</DialogActions>
				</Dialog>

				<Dialog
					open={usersCheck}
					onClose={handleCloseUsersCheck}
					aria-labelledby='alert-dialog-title'
					aria-describedby='alert-dialog-description'
				>
					<DialogTitle id='alert-dialog-title'>
						{'You must add at least one member to your team'}
					</DialogTitle>
					<DialogActions>
						<Button onClick={handleCloseUsersCheck} autoFocus>
							OK
						</Button>
					</DialogActions>
				</Dialog>

				<Dialog
					open={devcontainersCheck}
					onClose={handleCloseDevcontainersCheck}
					aria-labelledby='alert-dialog-title'
					aria-describedby='alert-dialog-description'
				>
					<DialogTitle id='alert-dialog-title'>
						{'You must add at least one devcontainer'}
					</DialogTitle>
					<DialogActions>
						<Button onClick={handleCloseDevcontainersCheck} autoFocus>
							OK
						</Button>
					</DialogActions>
				</Dialog>

				<Dialog
					open={appTypologyCheck}
					onClose={handleCloseAppTypologyCheck}
					aria-labelledby='alert-dialog-title'
					aria-describedby='alert-dialog-description'
				>
					<DialogTitle id='alert-dialog-title'>
						{'You must choose an application typology for deployment'}
					</DialogTitle>
					<DialogActions>
						<Button onClick={handleCloseAppTypologyCheck} autoFocus>
							OK
						</Button>
					</DialogActions>
				</Dialog>
			</Grid> : <Progressing text='LOADING' />}
		</div>
	);
};
