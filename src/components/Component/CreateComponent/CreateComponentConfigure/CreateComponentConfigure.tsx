import { Paper, Grid, TextField, Typography, FormControl, InputLabel, Select, MenuItem, OutlinedInput } from '@mui/material';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { axiosExperience } from '../../../../axios';
import { useConfig } from '../../../ConfigContext';
import { blue } from '@mui/material/colors';

interface Blueprint {
	id: string;
	name: string;
	type: string;
	creationDate: string;
};

interface CreateComponentConfigureProps {
	formContent: any;
	id: number;
	product: any;
};

export function CreateComponentConfigure({ formContent, id, product }: CreateComponentConfigureProps) {
	const config = useConfig();
	const [pos, setPos] = useState(0);
	const [blueprints, setBlueprints] = useState([]);
	const [organization, setOrganization] = useState('');
	const [area, setArea] = useState('');
	const [selectedBlueprint, setSelectedBlueprint] = useState('');

	const methods = useFormContext();
	const { register, unregister, setValue } = methods;
	const [projectData, updateProjectData] = useState({
		id: '',
		name: '',
		description: '',
		organization: '',
		area: '',
		blueprint: '',
		openapifile: '',
	});

	const changeBlueprint = (blueprint: any) => {
		unregister(`blueprint`);
		unregister(`type`);
		register('blueprint', { value: blueprint });
		setSelectedBlueprint(blueprint);
		blueprints.map((element: any) => {
			if (element.id === blueprint) {
				register('type', { value: element.type });
			}
		});
	};

	useEffect(() => {
		if (product) {
			setOrganization(product.organization);
			setArea(product.area);
			setValue('organization', product.organization);
			setValue('area', product.area);
			axiosExperience.get('administration/blueprint/' + product.organization + '/' + product.area).then((response) => {
				setBlueprints(response.data);
				unregister(`blueprint`);
				unregister(`type`);
				register('blueprint', { value: response.data[0].id });
				setSelectedBlueprint(response.data[0].id);
			});
		};
		if (formContent.name) {
			updateProjectData({
				id: formContent.id,
				name: formContent.name,
				description: formContent.description,
				organization: formContent.organization,
				area: formContent.area,
				blueprint: formContent.blueprint,
				openapifile: formContent.openapifile,
			});
			unregister('nameCheck');
		};
		for (let i = 0; i < config.newComponent.length; i++) {
			if (id == config.newComponent[i].id) {
				setPos(i);
			}
		}
	}, [product]);

	return (
		<>
			<form>
				<div className='margin-container'>
					{config.newComponent[pos].category[0].enabled ? <Paper sx={{ p: '20px', m: '10px' }} elevation={1}>
						<Grid container spacing={2} sx={{ mb: 2 }}>
							<Grid item xs={12} sx={{ mb: 1 }}>
								<Typography sx={{ fontSize: 25, fontWeight: 'bold' }}>{config.newComponent[pos].category[0].name}</Typography>
							</Grid>
							{config.newComponent[pos].category[0].subcategory[0].enabled ?
								<Grid item xs={12} sm={6} md={4}>
									{!formContent.idCheck ? (
										<TextField
											id='id'
											label={config.newComponent[pos].category[0].subcategory[0].name}
											variant='outlined'
											name='id'
											fullWidth
											defaultValue={projectData.id}
											{...register('id', { required: true, maxLength: 20 })}
										/>) :
										<TextField
											error
											id='id-error'
											label='Error'
											fullWidth
											defaultValue={projectData.id}
											{...register('id', { required: true, maxLength: 20 })}
											helperText='Incorrect entry.'
										/>
									}
								</Grid> : ''}
							{config.newComponent[pos].category[0].subcategory[1].enabled ?
								<Grid item xs={12} sm={6} md={4}>
									<TextField
										id='name'
										label={config.newComponent[pos].category[0].subcategory[1].name}
										variant='outlined'
										name='name'
										fullWidth
										defaultValue={projectData.name}
										{...register('name', { required: true, maxLength: 20 })}
									/>
								</Grid> : ''}
							{config.newComponent[pos].category[0].subcategory[2].enabled ?
								<Grid item xs={12} sm={12} md={4}>
									<FormControl fullWidth>
										<InputLabel id="demo-multiple-chip-label">{config.newComponent[pos].category[0].subcategory[2].name}</InputLabel>
										<Select
											id="demo-select"
											value={selectedBlueprint}
											input={<OutlinedInput id="select-multiple-chip" label={config.newComponent[pos].category[0].subcategory[2].name} />}
											onChange={(e) => changeBlueprint(e.target.value)}
										>
											{blueprints.map((blueprint) => (
												<MenuItem
													key={blueprint.id}
													value={blueprint.id}
												>
													{blueprint.name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid> : ''}
							{config.newComponent[pos].category[0].subcategory[3].enabled ?
								<Grid item xs={12}>
									<TextField
										id='outlined-basic'
										label={config.newComponent[pos].category[0].subcategory[3].name}
										variant='outlined'
										name='description'
										defaultValue={projectData.description}
										fullWidth
										multiline
										{...register('description', {
											required: true,
											maxLength: 20,
										})}
									/>
								</Grid> : ''}
						</Grid>
					</Paper> : ''}
				</div>
			</form>
		</>
	);
}
