import { Grid, CardContent, Card, Chip, SvgIcon, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { TableComponent } from '../../../Table';
import { ReactComponent as PythonIcon } from '../../../../assets/icons/python.svg';
import { ReactComponent as SpringIcon } from '../../../../assets/icons/spring.svg';
import { ReactComponent as JavaIcon } from '../../../../assets/icons/java.svg';
import { ReactComponent as NetIcon } from '../../../../assets/icons/net.svg';
import { ReactComponent as AngularIcon } from '../../../../assets/icons/angular.svg';
// import Grid3x3Icon from '@mui/icons-material/Grid3x3';
// import DescriptionIcon from '@mui/icons-material/Description';
import ConstructionIcon from '@mui/icons-material/Construction';
import HardwareIcon from '@mui/icons-material/Hardware';
import SensorsIcon from '@mui/icons-material/Sensors';
import CodeIcon from '@mui/icons-material/Code';
import Divider from '@mui/material/Divider';
import GroupIcon from '@mui/icons-material/Group';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
// import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import StorageIcon from '@mui/icons-material/Storage';
import MemoryIcon from '@mui/icons-material/Memory';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import ContactlessIcon from '@mui/icons-material/Contactless';
import { useConfig } from '../../../ConfigContext';

export function CreateComponentSummary({ formContent }: any) {
	const config = useConfig();
	const tableUserData = {
		header: ['Id', 'Github User', 'Role', 'Azure AD User'],
		data: formContent.team,
	};
	const [usersData] = useState(tableUserData);
	const [date, setDate] = useState(new Date());

	function getTechnologyIcon(type: String) {
		switch (type) {
			case 'python':
				return PythonIcon;
			case 'java':
				return JavaIcon;
			case 'springboot-restservice':
				return SpringIcon;
			case 'java-restclient':
				return JavaIcon;
			case 'netcore':
				return NetIcon;
			case 'angular':
				return AngularIcon;
		}
	};

	useEffect(() => {
		setDate(new Date());
	}, []);

	return (
		<>
			{/* <div>{JSON.stringify(formContent)}</div> */}
			{/* {console.log(formContent)} */}
			<div className='margin-container'>
				<Grid sx={{ p: '10px', display: 'grid', alignItems: 'center', justifyContent: 'center' }}>
					<Card sx={{ display: 'grid', ml: 1, mr: 0.5, mb: 3, mt: 3 }}>
						<Grid sx={{ backgroundColor: '#6486c2', height: '5px' }}></Grid>
						<Grid container spacing={1} sx={{ p: 3 }}>
							<Grid item xs={12} sx={{ display: 'flex' }}>
								<SvgIcon sx={{ fontSize: 50 }} component={getTechnologyIcon(formContent.technology.id.toString())} inheritViewBox />
								<Typography sx={{ ml: 1.5, color: '#6486c2', fontSize: 30 }}>
									{formContent.name.toUpperCase()}
								</Typography>
							</Grid>
							<Grid container sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', mt: 3, ml: 1 }}>
								<Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
									<Grid container>
										<Typography color="#6486c2" sx={{ ml: 1 }}>Organization: </Typography>
										<Typography sx={{ ml: 1 }}>NTT Data</Typography>
									</Grid>
								</Grid>
								<Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
									<Grid container>
										<Typography color="#6486c2" sx={{ ml: 1 }}>Area: </Typography>
										<Typography sx={{ ml: 1 }}>Architecture</Typography>
									</Grid>
								</Grid>
								{/* {config.newComponent[0].category[0].subcategory[0].enabled ? <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
									<Grid container>
										<Typography color="#6486c2" sx={{ ml: 1 }}>Type: </Typography>
										<Typography sx={{ ml: 1 }}>{formContent.type.label}</Typography>
									</Grid>
								</Grid>} */}
								<Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
									<Grid container>
										<Typography color="#6486c2" sx={{ ml: 1 }}>Creation Date: </Typography>
										<Typography sx={{ ml: 1 }}>{date.getDate().toString().padStart(2, '0')}/{(date.getMonth() + 1).toString().padStart(2, '0')}/{date.getFullYear()}</Typography>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} sx={{ display: 'flex', mt: 1 }}>
								<Grid container>
									<Typography color="#6486c2" sx={{ ml: 1 }}>Description: </Typography>
									<Typography sx={{ ml: 1 }}>{formContent.description}</Typography>
								</Grid>
							</Grid>
						</Grid>
					</Card>
					<Grid sx={{ display: 'flex', width: '100%', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
						{config.newComponent[1].enabled && <Grid sx={{ display: 'flex', alingItems: 'center', justifyContent: 'center' }}>
							<Card sx={{ width: 550, m: '10px' }}>
								<Grid sx={{ backgroundColor: '#6486c2', height: '5px' }}></Grid>
								<CardContent sx={{ overflow: 'visible' }}>
									<Typography gutterBottom variant="h5" component="div" sx={{ display: 'flex', justifyContent: 'center' }}>
										Team
									</Typography>
									{config.newComponent[1].category[0].enabled && <Grid>
										<Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
											<GroupIcon />
											<Typography sx={{ ml: 1.5, color: '#6486c2' }}>
												Team Details
											</Typography>
										</Grid>
										<Divider sx={{ 'mt': 2, 'ml': 0.5, 'mr': 0, 'mb': 1, 'border-width': '0.4px', 'border-color': 'rgba(103,135,193,1)' }} orientation="horizontal" variant="middle" light flexItem />
										<TableComponent
											key='uniquevalue'
											tableData={usersData}
										></TableComponent>
									</Grid>}
								</CardContent>
							</Card>
						</Grid>}
						{config.newComponent[2].enabled && <Grid sx={{ display: 'flex', alingItems: 'center', justifyContent: 'center' }}>
							<Card sx={{ width: 550, m: '10px' }}>
								<Grid sx={{ backgroundColor: '#6486c2', height: '5px' }}></Grid>
								<CardContent>
									<Typography gutterBottom variant="h5" component="div" sx={{ display: 'flex', justifyContent: 'center' }}>
										Code
									</Typography>
									{config.newComponent[2].category[0].enabled && <Grid sx={{ mt: 1, mb: 3 }}>
										<Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
											<CodeIcon />
											<Typography sx={{ ml: 1.5, color: '#6486c2' }}>
												Configure Code
											</Typography>
										</Grid>
										<Divider sx={{ 'mt': 2, 'ml': 0.5, 'mr': 0, 'mb': 1, 'border-width': '0.4px', 'border-color': 'rgba(103,135,193,1)' }} orientation="horizontal" variant="middle" light flexItem />
										{config.newComponent[2].category[0].subcategory[0].enabled && <Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
											<Typography color="#6486c2" sx={{ ml: 1.5 }}>Repository: </Typography>
											<Typography sx={{ ml: 1.5, mr: 1.5 }}>{formContent.repository.label}</Typography>
										</Grid>}
										{config.newComponent[2].category[0].subcategory[1].enabled && <Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
											<Typography color="#6486c2" sx={{ ml: 1.5 }}>Technology: </Typography>
											<Typography sx={{ ml: 1.5, mr: 1.5 }}>{formContent.technology.label}</Typography>
										</Grid>}
									</Grid>}
									{config.newComponent[2].category[0].subcategory[2].enabled && <Grid>
										{formContent.codespaces && <>
											<Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
												<CalendarViewMonthIcon />
												<Typography sx={{ ml: 1.5, color: '#6486c2' }}>
													Devcontainers
												</Typography>
											</Grid>
											<Divider sx={{ 'mt': 2, 'ml': 0.5, 'mr': 0, 'mb': 1, 'border-width': '0.4px', 'border-color': 'rgba(103,135,193,1)' }} orientation="horizontal" variant="middle" light flexItem />
											{formContent.codespaces && Array.from(Array(formContent.devcontainers.length)).map((_, index) => (
												<Chip key={index} sx={{ m: 1 }} label={formContent.devcontainers[index]} />
											))}
										</>}
									</Grid>}
								</CardContent>
							</Card>
						</Grid>}
						{config.newComponent[3].enabled && <Grid sx={{ display: 'flex', alingItems: 'center', justifyContent: 'center' }}>
							<Card sx={{ width: 550, m: '10px' }}>
								<Grid sx={{ backgroundColor: '#6486c2', height: '5px' }}></Grid>
								<CardContent>
									<Typography gutterBottom variant="h5" component="div" sx={{ display: 'flex', justifyContent: 'center' }}>
										ALM
									</Typography>
									{config.newComponent[3].category[0].enabled && <Grid sx={{ mt: 1, mb: 3 }}>
										{config.newComponent[3].category[0].subcategory[0].enabled && <>
											<Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
												<ConstructionIcon />
												<Typography sx={{ ml: 1.5, color: '#6486c2' }}>
													{config.newComponent[3].category[0].subcategory[0].name}
												</Typography>
											</Grid>
											<Divider sx={{ 'mt': 2, 'ml': 0.5, 'mr': 0, 'mb': 1, 'border-width': '0.4px', 'border-color': 'rgba(103,135,193,1)' }} orientation="horizontal" variant="middle" light flexItem />
											{config.newComponent[3].category[0].subcategory[0].items[0].enabled && <Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
												<Typography color="#6486c2" sx={{ ml: 1.5 }}>{config.newComponent[3].category[0].subcategory[0].items[0].name}: </Typography>
												<Typography sx={{ ml: 1.5, mr: 1.5 }}>{formContent.automationTool.name}</Typography>
											</Grid>}
											{config.newComponent[3].category[0].subcategory[0].items[1].enabled && <Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
												<Typography color="#6486c2" sx={{ ml: 1.5 }}>{config.newComponent[3].category[0].subcategory[0].items[1].name}: </Typography>
												<Typography sx={{ ml: 1.5, mr: 1.5 }}>{formContent.automationToolPipeline.name}</Typography>
											</Grid>}
											{config.newComponent[3].category[0].subcategory[0].items[2].enabled && <Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
												<Typography color="#6486c2" sx={{ ml: 1.5 }}>{config.newComponent[3].category[0].subcategory[0].items[2].name}: </Typography>
												<Typography sx={{ ml: 1.5, mr: 1.5 }}>{formContent.gitBranching.name}</Typography>
											</Grid>}
										</>}
										{config.newComponent[3].category[0].subcategory[1].enabled && <>
											<Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
												<MemoryIcon />
												<Typography sx={{ ml: 1.5, color: '#6486c2' }}>
													{config.newComponent[3].category[0].subcategory[1].name}
												</Typography>
											</Grid>
											<Divider sx={{ 'mt': 2, 'ml': 0.5, 'mr': 0, 'mb': 1, 'border-width': '0.4px', 'border-color': 'rgba(103,135,193,1)' }} orientation="horizontal" variant="middle" light flexItem />
											{config.newComponent[3].category[0].subcategory[1].enabled && <Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
												<Typography color="#6486c2" sx={{ ml: 1.5 }}>{config.newComponent[3].category[0].subcategory[1].items[0].name}: </Typography>
												<Typography sx={{ ml: 1.5, mr: 1.5 }}>{formContent.containerRegistry.name}</Typography>
											</Grid>}
										</>}
										{config.newComponent[3].category[0].subcategory[2].enabled && formContent.sonarqubeScan && <>
											<Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
												<SensorsIcon />
												<Typography sx={{ ml: 1.5, color: '#6486c2' }}>
													{config.newComponent[3].category[0].subcategory[2].name}
												</Typography>
											</Grid>
											<Divider sx={{ 'mt': 2, 'ml': 0.5, 'mr': 0, 'mb': 1, 'border-width': '0.4px', 'border-color': 'rgba(103,135,193,1)' }} orientation="horizontal" variant="middle" light flexItem />
											<Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
												<Typography color="#6486c2" sx={{ ml: 1.5 }}>{config.newComponent[3].category[0].subcategory[2].items[0].name}: </Typography>
												<Typography sx={{ ml: 1.5, mr: 1.5 }}>Sonarqube</Typography>
											</Grid>
										</>}
									</Grid>}
								</CardContent>
							</Card>
						</Grid>}
						{config.newComponent[4].enabled && (formContent.BBDD || formContent.serverless.createFunctionApp) && <Grid sx={{ display: 'flex', alingItems: 'center', justifyContent: 'center' }}>
							<Card sx={{ width: 550, m: '10px' }}>
								<Grid sx={{ backgroundColor: '#6486c2', height: '5px' }}></Grid>
								<CardContent>
									<Typography gutterBottom variant="h5" component="div" sx={{ display: 'flex', justifyContent: 'center' }}>
										IaC
									</Typography>
									{config.newComponent[4].category[0].enabled && config.newComponent[4].category[0].subcategory[0].enabled &&
										<Grid sx={{ mt: 1, mb: 3 }}>
											{formContent.BBDD &&
												<>
													<Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
														<StorageIcon />
														<Typography sx={{ ml: 1.5, color: '#6486c2' }}>
															Database
														</Typography>
													</Grid>
													<Divider sx={{ 'mt': 2, 'ml': 0.5, 'mr': 0, 'mb': 1, 'border-width': '0.4px', 'border-color': 'rgba(103,135,193,1)' }} orientation="horizontal" variant="middle" light flexItem />
													<Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
														<Typography color="#6486c2" sx={{ ml: 1.5 }}>Name: </Typography>
														<Typography sx={{ ml: 1.5, mr: 1.5 }}>{formContent.BBDDName}</Typography>
													</Grid>
													<Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
														<Typography color="#6486c2" sx={{ ml: 1.5 }}>Admin: </Typography>
														<Typography sx={{ ml: 1.5, mr: 1.5 }}>{formContent.BBDDAdmin}</Typography>
													</Grid>
													<Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
														<Typography color="#6486c2" sx={{ ml: 1.5 }}>AdminPassword: </Typography>
														<Typography sx={{ ml: 1.5, mr: 1.5 }}>{formContent.BBDDAdminPass}</Typography>
													</Grid>
													{config.newComponent[4].category[0].subcategory[0].items[0].enabled && formContent.BBDDType && <Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
														<Typography color="#6486c2" sx={{ ml: 1.5 }}>Type: </Typography>
														<Typography sx={{ ml: 1.5, mr: 1.5 }}>{formContent.BBDDType}</Typography>
													</Grid>}
													{config.newComponent[4].category[0].subcategory[0].items[1].enabled && formContent.BBDDTier && <Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
														<Typography color="#6486c2" sx={{ ml: 1.5 }}>Tier: </Typography>
														<Typography sx={{ ml: 1.5, mr: 1.5 }}>{formContent.BBDDTier}</Typography>
													</Grid>}
													{config.newComponent[4].category[0].subcategory[0].items[2].enabled && formContent.BBDDVersion && <Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
														<Typography color="#6486c2" sx={{ ml: 1.5 }}>Version: </Typography>
														<Typography sx={{ ml: 1.5, mr: 1.5 }}>{formContent.BBDDVersion}</Typography>
													</Grid>}
												</>
											}
											{formContent.serverless.createFunctionApp &&
												<>
													<Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
														<StorageIcon />
														<Typography sx={{ ml: 1.5, color: '#6486c2' }}>
															Serverless
														</Typography>
													</Grid>
													<Divider sx={{ 'mt': 2, 'ml': 0.5, 'mr': 0, 'mb': 1, 'border-width': '0.4px', 'border-color': 'rgba(103,135,193,1)' }} orientation="horizontal" variant="middle" light flexItem />
													<Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
														<Typography color="#6486c2" sx={{ ml: 1.5 }}>Status: </Typography>
														<Typography sx={{ ml: 1.5, mr: 1.5 }}>{formContent?.serverless?.createFunctionApp ? 'Active' : 'Inactive'}</Typography>
													</Grid>
												</>
											}
										</Grid>}
								</CardContent>
							</Card>
						</Grid>}
						{config.newComponent[5].enabled && formContent.connectivity && <Grid sx={{ display: 'flex', alingItems: 'center', justifyContent: 'center' }}>
							<Card sx={{ width: 550, m: '10px' }}>
								<Grid sx={{ backgroundColor: '#6486c2', height: '5px' }}></Grid>
								<CardContent>
									<Typography gutterBottom variant="h5" component="div" sx={{ display: 'flex', justifyContent: 'center' }}>
										Collaboration
									</Typography>
									{config.newComponent[5].category[0].enabled && <Grid sx={{ mt: 1, mb: 3 }}>
										<Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
											<ContactlessIcon />
											<Typography sx={{ ml: 1.5, color: '#6486c2' }}>
												Configure Collaboration
											</Typography>
										</Grid>
										<Divider sx={{ 'mt': 2, 'ml': 0.5, 'mr': 0, 'mb': 1, 'border-width': '0.4px', 'border-color': 'rgba(103,135,193,1)' }} orientation="horizontal" variant="middle" light flexItem />
										{formContent.connectivity && <Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
											<Typography color="#6486c2" sx={{ ml: 1.5 }}>Connectivity Tool: </Typography>
											<Typography sx={{ ml: 1.5, mr: 1.5 }}>Microsoft Teams</Typography>
										</Grid>}
									</Grid>}
								</CardContent>
							</Card>
						</Grid>}
						{config.newComponent[6].enabled && formContent.ha && <Grid sx={{ display: 'flex', alingItems: 'center', justifyContent: 'center' }}>
							<Card sx={{ width: 550, m: '10px' }}>
								<Grid sx={{ backgroundColor: '#6486c2', height: '5px' }}></Grid>
								<CardContent>
									<Typography gutterBottom variant="h5" component="div" sx={{ display: 'flex', justifyContent: 'center' }}>
										Deployment
									</Typography>
									{config.newComponent[6].category[0].enabled && config.newComponent[6].category[0].subcategory[0].enabled && formContent.ha && <Grid sx={{ mt: 1, mb: 3 }}>
										<Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
											<HardwareIcon />
											<Typography sx={{ ml: 1.5, color: '#6486c2' }}>
												{config.newComponent[6].category[0].subcategory[0].name}
											</Typography>
										</Grid>
										<Divider sx={{ 'mt': 2, 'ml': 0.5, 'mr': 0, 'mb': 1, 'border-width': '0.4px', 'border-color': 'rgba(103,135,193,1)' }} orientation="horizontal" variant="middle" light flexItem />
										{formContent.appTypology.name && <Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
											<Typography color="#6486c2" sx={{ ml: 1.5 }}>Application Typology for Deployment: </Typography>
											<Typography sx={{ ml: 1.5, mr: 1.5 }}>{formContent.appTypology.name}</Typography>
										</Grid>}
										{formContent.appTypology.minReplicas && <Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
											<Typography color="#6486c2" sx={{ ml: 1.5 }}>MinReplicas: </Typography>
											<Typography sx={{ ml: 1.5, mr: 1.5 }}>{formContent.appTypology.minReplicas}</Typography>
										</Grid>}
										{formContent.appTypology.maxReplicas && <Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
											<Typography color="#6486c2" sx={{ ml: 1.5 }}>MaxReplicas: </Typography>
											<Typography sx={{ ml: 1.5, mr: 1.5 }}>{formContent.appTypology.maxReplicas}</Typography>
										</Grid>}
										{formContent.appTypology.cpu && <Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
											<Typography color="#6486c2" sx={{ ml: 1.5 }}>CPU: </Typography>
											<Typography sx={{ ml: 1.5, mr: 1.5 }}>{formContent.appTypology.cpu} %</Typography>
										</Grid>}
										{formContent.appTypology.memory && <Grid container spacing={1} sx={{ m: 0.5, mt: 2 }}>
											<Typography color="#6486c2" sx={{ ml: 1.5 }}>Memory: </Typography>
											<Typography sx={{ ml: 1.5, mr: 1.5 }}>{formContent.appTypology.memory} Mi</Typography>
										</Grid>}
									</Grid>}
								</CardContent>
							</Card>
						</Grid>}
					</Grid>
				</Grid>
			</div>
		</>
	);
}
