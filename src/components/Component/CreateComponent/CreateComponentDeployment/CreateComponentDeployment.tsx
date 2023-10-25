import { FormControlLabel, Grid, Paper, Typography, Switch, Grow, Card, Button, CardContent, CardActions, Divider, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import StorageIcon from '@mui/icons-material/Storage';
import MemoryIcon from '@mui/icons-material/Memory';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useFormContext } from 'react-hook-form';
import { useConfig } from '../../../ConfigContext';
import { axiosExperience } from '../../../../axios';

interface CreateComponentConfigureProps {
	formContent: any;
	id: number;
};

export function CreateComponentDeployment({ formContent, id }: CreateComponentConfigureProps) {
	const config = useConfig();
	const [pos, setPos] = useState(0);
	const methods = useFormContext();
	const { register, setValue } = methods;
	const [listAppTypologies, setListAppTypologies] = useState(null);
	const [selectedAppTypology, setSelectedAppTypology] = useState(listAppTypologies ? listAppTypologies[0] : null);
	const [checkedHA, setCheckedHA] = useState(false);

	const handleChangeHA = () => {
		setCheckedHA(!checkedHA);
		formContent.ha = !checkedHA;
		if (!formContent.ha) {
			setValue('appTypology', null);
			setSelectedAppTypology(null);
		}
	};

	const chooseAppTypology = (appTypology: any) => {
		if (selectedAppTypology === appTypology) {
			setSelectedAppTypology(null);
			setValue('appTypology', null);
		} else {
			setSelectedAppTypology(appTypology);
			setValue('appTypology', appTypology);
		};
	};

	const appTypology = (appTypology: any) => {
		let border = '';
		let backgroundColor = '#000000';
		let color = '#000000';
		let bcolor = '#2790d4';
		let boxColor= '#000000';
		switch (appTypology.id) {
			case 'bronze':
				backgroundColor = '#f1f8fcc9';
				color = '#000000';
				bcolor = '#2790d4';
				boxColor='#cd7f32c9';
				break;
			case 'silver':
				backgroundColor = '#f1f8fcc9';
				boxColor='#c0c0c0c9';
				break;
			case 'gold':
				backgroundColor = '#f1f8fcc9';
				boxColor='#d4af37c9';
				break;
		};
		if (selectedAppTypology && appTypology.id == selectedAppTypology.id) {
			border = '3px solid #000000';
		};
		return (
			<Card sx={{ m: 1, p: 1, width: '100%', height: 389, border: border, borderRadius: '10px', backgroundColor: backgroundColor }}>
				<Grid
					container
					direction="column"
					justifyContent="space-between"
					sx={{ width: '100%', height: '100%', margin: '0', padding: '0' }}
				>

					<CardContent>
						<Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<Box
								sx={{
									width: 14,
									height: 14,
									backgroundColor: boxColor,
								}}
							/>
							<Typography gutterBottom variant="h6" component="div" sx={{ marginLeft: '8px', color: color, display: 'flex', justifyContent: 'center', marginY: '0', padding: '0' }}>{appTypology.name}</Typography>
						</Grid>
						<Divider sx={{ mb: 1, backgroundColor: color }} />
						<Typography variant="body2" sx={{ fontSize: '14px', color: color, textAlign: 'center' }}>{appTypology.description}</Typography>
						<Divider sx={{ mt: 1, mb: 1, backgroundColor: color }} />
						<Table style={{ padding: '0px', lineHeight: '1', border: 'none', marginBottom: 0 }}>
							<TableHead>
								<TableRow sx={{ '&:last-child td, &:last-child th': { fontWeight: 'bold', fontSize: '12px', margin: '0', padding: '0', border: 'none' } }}>
									<TableCell ></TableCell>
									<TableCell align="center">DEV</TableCell>
									<TableCell align="center">PRE</TableCell>
									<TableCell align="center">PROD</TableCell>
								</TableRow>
							</TableHead>
							<TableBody style={{ padding: '0px', lineHeight: '1' }}>
								<TableRow sx={{ '&:last-child td, &:last-child th': { border: 'none' } }}>
									<TableCell
										component="th"
										scope="row"
										sx={{ fontWeight: 'bold', fontSize: '12px', margin: '0', padding: '0' }}>REP
									</TableCell>
									<TableCell align="center" sx={{ fontSize: '12px', margin: '0' }}>
										{appTypology.minReplicas}-{appTypology.maxReplicas}
									</TableCell>
									<TableCell align="center" style={{ fontSize: '12px', margin: '0' }}>
										{appTypology.minReplicas}-{appTypology.maxReplicas}
									</TableCell>
									<TableCell align="center" style={{ fontSize: '12px', margin: '0' }}>
										{appTypology.minReplicas}-{appTypology.maxReplicas}
									</TableCell>
								</TableRow>
								{appTypology.cpu ? <>
									<TableRow
										sx={{ '&:last-child td, &:last-child th': { border: 0, fontSize: '12px', margin: '0', paddingRight: '0', paddingLeft: '0' } }}
										style={{ padding: '1px', lineHeight: '1' }}>
										<TableCell
											component="th"
											scope="row"
											sx={{ fontWeight: 'bold', fontSize: '12px', margin: '0', paddingRight: '0', paddingLeft: '0' }}
										>CPU
										</TableCell>
										<TableCell align="center" style={{ fontSize: '12px', margin: '0', paddingRight: '0', paddingLeft: '0' }}>
											{appTypology.cpu}%
										</TableCell>
										<TableCell align="center" style={{ fontSize: '12px', margin: '0', paddingRight: '0', paddingLeft: '0' }}>
											{appTypology.cpu}%
										</TableCell>
										<TableCell align="center" style={{ fontSize: '12px', margin: '0', paddingRight: '0', paddingLeft: '0' }}>
											{appTypology.cpu}%
										</TableCell>
									</TableRow>
								</> : ''}
								{appTypology.memory ? <>
									<TableRow
										sx={{ '&:last-child td, &:last-child th': { border: 0, fontSize: '12px', margin: '0', paddingRight: '0', paddingLeft: '0' } }}
										style={{ padding: '1px', lineHeight: '1' }}>
										<TableCell
											component="th"
											scope="row"
											sx={{ fontWeight: 'bold', fontSize: '14px', margin: '0', padding: '0' }}>MEM
										</TableCell>
										<TableCell align="center" style={{ fontSize: '12px', margin: '0', paddingRight: '0', paddingLeft: '0' }}>
											{appTypology.memory} Mi
										</TableCell>
										<TableCell align="center" style={{ fontSize: '12px', margin: '0', paddingRight: '0', paddingLeft: '0' }}>
											{appTypology.memory} Mi
										</TableCell>
										<TableCell align="center" style={{ fontSize: '12px', margin: '0', paddingRight: '0', paddingLeft: '0' }}>
											{appTypology.memory} Mi
										</TableCell>
									</TableRow>
								</> : ''}
							</TableBody>
						</Table>
					</CardContent>
					<CardActions sx={{ 'margin': '0', 'padding': '0', 'alignItems': 'center', 'justifyContent': 'center' }}>
						<Button sx={{ 'margin': '0', 'height': '30px', 'width': '70%', 'backgroundColor': bcolor, 'borderRadius': '10px', 'color': '#fff', '&:hover': { backgroundColor: bcolor + 'c9' } }} onClick={() => chooseAppTypology(appTypology)}>Choose</Button>
					</CardActions>
				</Grid>
			</Card>
		);
	};

	useEffect(() => {
		axiosExperience.get('components/listConfig/' + formContent.organization + '/' + formContent.area + '/' + formContent.blueprint).then((response) => {
			if (response.data.deployment) {
				setListAppTypologies(response.data.deployment.hpa.tool);
			}
		});
		// setListAppTypologies([
		// 	{
		// 		id: 'bronze',
		// 		name: 'BRONZE',
		// 		description: 'The entry-level deployment typology designed for users who require basic functionality and features for your component.',
		// 		minReplicas: 1,
		// 		maxReplicas: 1,
		// 		cpu: null,
		// 		memory: null,
		// 	},
		// 	{
		// 		id: 'silver',
		// 		name: 'SILVER',
		// 		description: 'The intermediate-level deployment typology, offering a balance between advanced features and ease of use.',
		// 		minReplicas: 1,
		// 		maxReplicas: 2,
		// 		cpu: 70,
		// 		memory: null,
		// 	},
		// 	{
		// 		id: 'gold',
		// 		name: 'GOLD',
		// 		description: 'The top-tier deployment typology, tailored for enterprise-level applications and organizations with demanding requirements.',
		// 		minReplicas: 2,
		// 		maxReplicas: 4,
		// 		cpu: 60,
		// 		memory: 550,
		// 	},
		// ]);
		for (let i = 0; i < config.newComponent.length; i++) {
			if (id == config.newComponent[i].id) {
				setPos(i);
			}
		};
		if (formContent.appTypology) {
			setSelectedAppTypology(formContent.appTypology);
		};
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
								<Grid sx={{ mt: '10px', ml: 3 }}>
									<FormControlLabel
										control={<Switch />}
										label="Active" checked={formContent.ha ? formContent.ha : checkedHA}
										onClick={handleChangeHA} {...register('ha', { required: true })}
									/>
								</Grid>
								<Grid sx={{ mr: 4 }}>
									{formContent.ha && listAppTypologies ? <Grid container spacing={10}>
										{Array.from(Array(listAppTypologies.length)).map((_, index) => (
											index === 0 ? (
												<Grid key={index} item xs>
													<Grow in={formContent.ha}>
														{appTypology(listAppTypologies[index])}
													</Grow>
												</Grid>) : (
												<Grid key={index} item xs>
													<Grow
														in={formContent.ha}
														style={{ transformOrigin: '0 0 0' }}
														{...(formContent.ha ? { timeout: index * 1000 } : {})}
													>
														{appTypology(listAppTypologies[index])}
													</Grow>
												</Grid>
											)))}
									</Grid> : ''}
								</Grid>
							</> : ''}
						</Paper> : ''}
					</> : ''}
				</div>
			</form>
		</>
	);
}
