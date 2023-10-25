import { Autocomplete, FormControlLabel, Grid, Paper, TextField, Typography, Switch, FormControl, MenuItem } from '@mui/material'; import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from '@mui/material/Select';
import { axiosExperience } from '../../../../axios';
import { useConfig } from '../../../ConfigContext';

interface CreateComponentConfigureProps {
	formContent: any;
	id: number;
};

export function CreateComponentALM({ formContent, id }: CreateComponentConfigureProps) {
	const config = useConfig();
	const [pos, setPos] = useState(0);
	const [listOrchestratorTool, setListOrchestratorTool] = useState([{ id: '', name: '', pipelineTemplates: [{ id: '', name: '' }] }]);
	const [listOrchestratorToolPipeline, setListOrchestratorToolPipeline] = useState([{ id: '', name: '' }]);
	const [listOrchestratorGitBranching, setListOrchestratorGitBranching] = useState([{ id: '', name: '' }]);
	const [listImageRegistryTool, setListImageRegistryTool] = useState([{ id: '', name: '' }]);
	const methods = useFormContext();
	const { control, register, unregister } = methods;
	const [projectData, updateProjectData] = useState({
		automationTool: listOrchestratorTool[0],
		automationToolPipeline: listOrchestratorTool[0].pipelineTemplates[0],
		gitBranching: listOrchestratorGitBranching[0],
		containerRegistry: listImageRegistryTool[0],
		sonarqubeScan: false,
	});
	const [checkedSonarqube, setCheckedSonarqube] = useState(false);

	const handleChangeSonarqube = () => {
		setCheckedSonarqube(!checkedSonarqube);
		formContent.sonarqubeScan = !checkedSonarqube;
	};

	const handleChangeAutomationTool = (pipelineTemplates: any[]) => {
		setListOrchestratorToolPipeline(pipelineTemplates);
	};

	useEffect(() => {
		axiosExperience.get('components/listConfig/' + formContent.organization + '/' + formContent.area + '/' + formContent.blueprint).then((response) => {
			setListOrchestratorTool(response.data.alm.orchestrator.tool);
			setListOrchestratorGitBranching(response.data.alm.orchestrator.gitBranching);
			setListImageRegistryTool(response.data.alm.containerRegistry.tool);
		});
		for (let i = 0; i < config.newComponent.length; i++) {
			if (id == config.newComponent[i].id) {
				setPos(i);
			}
		};
		if (formContent.automationTool) {
			updateProjectData({
				automationTool: formContent.automationTool,
				automationToolPipeline: formContent.automationToolPipeline,
				gitBranching: formContent.gitBranching,
				containerRegistry: formContent.containerRegistry,
				sonarqubeScan: formContent.sonarqubeScan,
			});
			setListOrchestratorToolPipeline(formContent.automationTool.pipelineTemplates);
			unregister('containerRegistryCheck');
		}
	}, []);
	return (
		<>
			<form>
				<div className='margin-container'>
					{pos != 0 ? <>
						{config.newComponent[pos].category[0].enabled ? <Paper sx={{ p: '20px', m: '10px' }} elevation={1}>
							<Grid item sx={{ mb: 3 }}>
								<Typography sx={{ fontSize: 25, fontWeight: 'bold' }}>{config.newComponent[pos].category[0].name}</Typography>
							</Grid>
							{config.newComponent[pos].category[0].subcategory[0].enabled ? <>
								<Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', ml: 3 }}>
									<Grid sx={{ marginRight: '10px', width: '30px', height: '10px', backgroundColor: '#6785C1', borderRadius: 0.8 }}></Grid>
									<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{config.newComponent[pos].category[0].subcategory[0].name}</Typography>
								</Grid>
								<Grid sx={{ display: 'flex' }}>
									{config.newComponent[pos].category[0].subcategory[0].items[0].enabled ?
										<Grid sx={{ mt: 2, ml: 8, width: 230 }}>
											<Controller
												control={control}
												// defaultValue={formContent.type ? formContent.type : projectData.technology}
												defaultValue={
													projectData.automationTool
												}
												name='automationTool'
												render={({ field: { ref, onChange, ...field } }) => (
													<Autocomplete
														options={listOrchestratorTool}
														onChange={(_, data: { name: string; id: string, pipelineTemplates: any[] }) => {
															onChange(data);
															handleChangeAutomationTool(data.pipelineTemplates);
														}}
														getOptionLabel={(option) => option.name || ''}
														defaultValue={formContent.automationTool ? formContent.automationTool : projectData.automationTool}
														renderInput={(params) => (
															<TextField
																sx={{ width: '180%' }}
																{...params}
																{...field}
																inputRef={ref}
																label={config.newComponent[pos].category[0].subcategory[0].items[0].name}
															/>
														)}
													/>
												)}
											/>
										</Grid> : ''}
									{config.newComponent[pos].category[0].subcategory[0].items[1].enabled ?
										<Grid sx={{ mt: 2, ml: 28, mb: 3, width: 230 }}>
											<Controller
												control={control}
												// defaultValue={formContent.type ? formContent.type : projectData.technology}
												defaultValue={
													projectData.automationToolPipeline
												}
												name='automationToolPipeline'
												render={({ field: { ref, onChange, ...field } }) => (
													<Autocomplete
														options={listOrchestratorToolPipeline}
														onChange={(_, data: { name: string; id: string }) =>
															onChange(data)
														}
														getOptionLabel={(option) => option.name || ''}
														defaultValue={formContent.automationToolPipeline ? formContent.automationToolPipeline : projectData.automationToolPipeline}
														renderInput={(params) => (
															<TextField
																sx={{ width: '180%' }}
																{...params}
																{...field}
																inputRef={ref}
																label={config.newComponent[pos].category[0].subcategory[0].items[1].name}
															/>
														)}
													/>
												)}
											/>
										</Grid> : ''}
								</Grid>
								{config.newComponent[pos].category[0].subcategory[0].items[2].enabled ?
									<Grid item sx={{ mt: 2, ml: 8, mb: 3, width: 230 }}>
										<Controller
											control={control}
											// defaultValue={formContent.type ? formContent.type : projectData.technology}
											defaultValue={
												projectData.gitBranching
											}
											name='gitBranching'
											render={({ field: { ref, onChange, ...field } }) => (
												<Autocomplete
													options={listOrchestratorGitBranching}
													onChange={(_, data: { name: string; id: string }) =>
														onChange(data)
													}
													getOptionLabel={(option) => option.name || ''}
													defaultValue={formContent.gitBranching ? formContent.gitBranching : projectData.gitBranching}
													renderInput={(params) => (
														<TextField
															sx={{ width: '180%' }}
															{...params}
															{...field}
															inputRef={ref}
															label={config.newComponent[pos].category[0].subcategory[0].items[2].name}
														/>
													)}
												/>
											)}
										/>
									</Grid> : ''}
							</> : ''}
							{config.newComponent[pos].category[0].subcategory[1].enabled ? <>
								<Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', marginTop: '25px', ml: 3 }}>
									<Grid sx={{ marginRight: '10px', width: '30px', height: '10px', backgroundColor: '#6785C1', borderRadius: 0.8 }}></Grid>
									<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{config.newComponent[pos].category[0].subcategory[1].name}</Typography>
								</Grid>
								{config.newComponent[pos].category[0].subcategory[1].items[0].enabled ?
									<Grid item sx={{ mt: 2, ml: 8, mb: 3, width: 230 }}>
										<Controller
											control={control}
											// defaultValue={formContent.type ? formContent.type : projectData.technology}
											defaultValue={
												projectData.containerRegistry
											}
											name='containerRegistry'
											render={({ field: { ref, onChange, ...field } }) => (
												<Autocomplete
													options={listImageRegistryTool}
													onChange={(_, data: { name: string; id: string }) =>
														onChange(data)
													}
													getOptionLabel={(option) => option.name || ''}
													defaultValue={formContent.containerRegistry ? formContent.containerRegistry : projectData.containerRegistry}
													renderInput={(params) => (
														<TextField
															sx={{ width: '180%' }}
															{...params}
															{...field}
															inputRef={ref}
															label={config.newComponent[pos].category[0].subcategory[1].items[0].name}
														/>
													)}
												/>
											)}
										/>
									</Grid> : ''}
							</> : ''}
							{config.newComponent[pos].category[0].subcategory[2].enabled ? <>
								<Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', marginTop: '25px', ml: 3 }}>
									<Grid sx={{ marginRight: '10px', width: '30px', height: '10px', backgroundColor: '#6785C1', borderRadius: 0.8 }}></Grid>
									<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{config.newComponent[pos].category[0].subcategory[2].name}</Typography>
								</Grid>
								{config.newComponent[pos].category[0].subcategory[2].items[0].enabled ? <>
									<Grid sx={{ mt: '10px', ml: 3 }}>
										<FormControlLabel
											control={<Switch />}
											label="Active" checked={formContent.sonarqubeScan ? formContent.sonarqubeScan : checkedSonarqube}
											onClick={handleChangeSonarqube} {...register('sonarqubeScan', { required: true })}
										/>
									</Grid>
									{formContent.sonarqubeScan ? <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', mt: 1, ml: 10, mb: 2 }}>
										<Typography sx={{ mr: 2 }}>{config.newComponent[pos].category[0].subcategory[2].items[0].name}</Typography>
										<FormControl sx={{ width: '20%' }}>
											<Select defaultValue="SonarQube">
												<MenuItem value='SonarQube'>SonarQube</MenuItem>
											</Select>
										</FormControl>
									</Grid> : ''}
								</> : ''}
							</> : ''}
						</Paper> : ''}
					</> : ''}
				</div>
			</form>
		</>
	);
}
