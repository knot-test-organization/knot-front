import { FormControlLabel, Grid, Paper, Typography, Switch, MenuItem, Box, OutlinedInput, Chip, Autocomplete, TextField, FormControl, InputLabel } from '@mui/material'; import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { axiosExperience } from '../../../../axios';
import { useConfig } from '../../../ConfigContext';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

interface CreateComponentConfigureProps {
	formContent: any;
	id: number;
};

export function CreateComponentCode({ formContent, id }: CreateComponentConfigureProps) {
	const config = useConfig();
	const [pos, setPos] = useState(0);
	const [listDevcontainers, setListDevcontainers] = useState(['']);
	const methods = useFormContext();
	const { control, register, unregister, setValue } = methods;
	const [checkedCodespaces, setCheckedCodespaces] = useState(false);
	const [devcontainer, setDevcontainer] = useState<string[]>([]);
	const [showFileUploader, setShowFileUploader] = useState(false);
	const [showFileUploaderText, setShowFileUploaderText] = useState(false);
	const [repositories, setRepositories] = useState([{ id: '', label: '' }]);
	const [technologies, setTechnologies] = useState([{ label: '', id: '', parentType: '' }]);
	const [projectData, setProjectData] = useState({
		technology: technologies[0],
		repository: repositories[0],
	});
	const [devcontainers, setDevcontainers] = useState(formContent.devcontainers);

	const handleChangeCodespaces = () => {
		setCheckedCodespaces(!checkedCodespaces);
		formContent.codespaces = !checkedCodespaces;
		unregister(`codespaces`);
		register('codespaces', { value: !checkedCodespaces });
		unregister(`devcontainers`);
	};

	const handleTechnologyChange = (selectedData: { id: string; label: string; }) => {
		setShowFileUploader(selectedData.id === 'java-restclient' || selectedData.id === 'springboot-restservice');
		setShowFileUploaderText(true);
		setValue('showClientConfig', selectedData.id === 'java-restclient');
	};

	type SelectChangeEvent<T = string> = (Event & {
		target: {
			value: T;
			name: string;
		};
	}) | React.ChangeEvent<HTMLInputElement>

	const changeDevcontainers = (event: SelectChangeEvent<typeof devcontainer>) => {
		const { target: { value } } = event;
		setDevcontainer(
			// On autofill we get a stringified value.
			typeof value === 'string' ? value.split(',') : value,
		);
		setDevcontainers(
			// On autofill we get a stringified value.
			typeof value === 'string' ? value.split(',') : value,
		);
		unregister(`devcontainers`);
		register('devcontainers', { value: typeof value === 'string' ? value.split(',') : value });
	};

	function handleFileUpload(file: File | null) {
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const fileData = event.target.result;
				if (typeof fileData === 'string') {
					setValue('openapifile', fileData);
				};
			};
			reader.readAsText(file);
		} else {
			setValue('openapifile', '');
		}
	}

	function handleFileDownload() {
		axiosExperience.get('components/downloadOpenapiyaml').then((response) => {
			const content = response.data;
			const blob = new Blob([content], { type: 'application/yaml' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'openapiyaml.yml';
			a.click();
			URL.revokeObjectURL(url);
		});
	}

	useEffect(() => {
		for (let i = 0; i < config.newComponent.length; i++) {
			if (id == config.newComponent[i].id) {
				setPos(i);
			}
		};
		if (formContent.showClientConfig) {
			setShowFileUploader(true);
			setShowFileUploaderText(true);
		};
		if (formContent.technology) {
			setProjectData({
				technology: formContent.technology,
				repository: formContent.repository,
			});
		};
		setDevcontainers(formContent.devcontainers);
		axiosExperience.get('components/listConfig/' + formContent.organization + '/' + formContent.area + '/' + formContent.blueprint).then((response) => {
				setTechnologies(response.data.code.technology);
				setRepositories(response.data.code.repository);
				setListDevcontainers(response.data.code.devcontainers);
			});
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
								<Grid item sx={{ mt: 2, ml: 8, mb: 3, width: '25%' }}>
									<Controller
										control={control}
										name='technology'
										render={({ field: { ref, onChange, ...field } }) => (
											<Autocomplete
												options={technologies}
												onChange={(_, data: { id: string; label: string; }) => {
													handleTechnologyChange(data);
													onChange(data);
												}}
												defaultValue={formContent.technology ? formContent.technology : ''}
												renderInput={(params) => (!formContent.technologyCheck ? (
													<TextField
														{...params}
														{...field}
														fullWidth
														inputRef={ref}
														label={config.newComponent[pos].category[0].subcategory[0].name}
													/>) : (
													<TextField
														{...params}
														{...field}
														fullWidth
														error
														inputRef={ref}
														label={config.newComponent[pos].category[0].subcategory[0].name}
													/>)
												)}
											/>
										)}
									/>
									<Grid item sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
										{showFileUploader && (
											<input
												type='file'
												accept='.yml,.json'
												onChange={(event) => handleFileUpload(event.target.files[0])}
												style={{
													width: '60%',
													marginTop: '10px',
													padding: '8px',
													border: '1px solid #ccc',
													borderRadius: '4px',
													background: 'white',
													boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
													outline: 'none',
													cursor: 'pointer',
												}}
											/>
										)}
										{showFileUploader && showFileUploaderText && (
											<span
												style={{
													color: 'gray',
													fontSize: '15px',
													marginTop: '10px',
													cursor: 'pointer',
												}}
												onClick={() => handleFileDownload()}
											>
												Upload your swagger! or <b>click here</b> if you want to download an example!
											</span>
										)}
									</Grid>
								</Grid>
							</> : ''}
							{config.newComponent[pos].category[0].subcategory[1].enabled ? <>
								<Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', ml: 3 }}>
									<Grid sx={{ marginRight: '10px', width: '30px', height: '10px', backgroundColor: '#6785C1', borderRadius: 0.8 }}></Grid>
									<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{config.newComponent[pos].category[0].subcategory[1].name}</Typography>
								</Grid>
								<Grid item sx={{ mt: 2, ml: 8, mb: 3, width: '25%' }}>
									<Controller
										control={control}
										defaultValue={
											repositories[0] ? repositories[0] : '-'
										}
										name='repository'
										render={({ field: { ref, onChange, ...field } }) => (
											<Autocomplete
												options={repositories}
												onChange={(_, data: { id: number; label: string; }) => {
													onChange(data);
												}}
												defaultValue={formContent.repository ? formContent.repository : projectData.repository}
												renderInput={(params) => (
													<TextField
														{...params}
														{...field}
														fullWidth
														inputRef={ref}
														label={config.newComponent[pos].category[0].subcategory[1].name}
													/>
												)}
											/>
										)}
									/>
								</Grid>
							</> : ''}
							{config.newComponent[pos].category[0].subcategory[2].enabled ? <>
								<Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', ml: 3 }}>
									<Grid sx={{ marginRight: '10px', width: '30px', height: '10px', backgroundColor: '#6785C1', borderRadius: 0.8 }}></Grid>
									<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{config.newComponent[pos].category[0].subcategory[2].name}</Typography>
								</Grid>
								<Grid sx={{ mt: '10px', ml: 3 }}>
									<FormControlLabel
										control={<Switch />}
										label="Active" checked={formContent.codespaces ? formContent.codespaces : checkedCodespaces}
										onClick={handleChangeCodespaces} {...register('codespaces', { required: true })}
									/>
								</Grid>
								{formContent.codespaces ? <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', mt: 1, ml: 7, mb: 2 }}>
									{config.newComponent[pos].category[0].subcategory[2].items[0].enabled ? <>
										<Typography sx={{ mr: 2 }}>{config.newComponent[pos].category[0].subcategory[2].items[0].name}</Typography>
										<FormControl sx={{ m: 1, width: 300 }}>
											<InputLabel id="demo-multiple-chip-label">{config.newComponent[pos].category[0].subcategory[2].items[0].name}</InputLabel>
											{formContent.devcontainersCheck ? <Select
												labelId="demo-multiple-chip-label"
												id="demo-multiple-chip"
												multiple
												error
												value={devcontainer}
												onChange={changeDevcontainers}
												input={<OutlinedInput id="select-multiple-chip" label="Devcontainers" />}
												renderValue={() => (
													<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
														{devcontainers.map((value: any) => (
															<Chip key={value} label={value.replace('cpp', 'c++').replace('-', ' ').replace('-', ' ').replace('-', ' ')} />
														))}
													</Box>
												)}
												sx={{ width: 450 }}
												MenuProps={MenuProps}
											>
												{listDevcontainers.map((devcontainer) => (
													<MenuItem
														key={devcontainer}
														value={devcontainer}
													>
														{devcontainer.replace('cpp', 'c++').replace('-', ' ').replace('-', ' ').replace('-', ' ')}
													</MenuItem>
												))}
											</Select> : <Select
												labelId="demo-multiple-chip-label"
												id="demo-multiple-chip"
												multiple
												value={devcontainer}
												onChange={changeDevcontainers}
												input={<OutlinedInput id="select-multiple-chip" label="Devcontainers" />}
												renderValue={() => (
													<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
														{devcontainers.map((value: any) => (
															<Chip key={value} label={value.replace('cpp', 'c++').replace('-', ' ').replace('-', ' ').replace('-', ' ')} />
														))}
													</Box>
												)}
												sx={{ width: 450 }}
												MenuProps={MenuProps}
											>
												{listDevcontainers.map((devcontainer) => (
													<MenuItem
														key={devcontainer}
														value={devcontainer}
													>
														{devcontainer.replace('cpp', 'c++').replace('-', ' ').replace('-', ' ').replace('-', ' ')}
													</MenuItem>
												))}
											</Select>}
										</FormControl>
									</> : ''}
								</Grid> : ''}
							</> : ''}
						</Paper> : ''}
					</> : ''}
				</div>
			</form>
		</>
	);
}
