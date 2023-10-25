import { Paper, Grid, TextField, Autocomplete, Button, FormControl, Typography, Modal, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TableComponent } from '../../../Table';
import CloseIcon from '@mui/icons-material/Close';
import { axiosExperience, axiosMicrosoft } from '../../../../axios';
import { useConfig } from '../../../ConfigContext';

interface AzureADUser {
	businessPhones: string[];
	displayName: string;
	givenName: string;
	jobTitle: string;
	mail: string;
	mobilePhone: string;
	officeLocation: string;
	preferredLanguage: string;
	surname: string;
	userPrincipalName: string;
	id: string;
};

interface CreateComponentConfigureProps {
	formContent: any;
	id: number;
};

export function CreateComponentTeam({ formContent, id }: CreateComponentConfigureProps) {
	const config = useConfig();
	const [pos, setPos] = useState(0);
	const [users, setUsers] = useState([
		{ label: '', id: '0', username: '' },
		{ label: 'ccrespca', id: '1', username: 'ccrespca' },
		{ label: 'bchemsed', id: '2', username: 'bchemsed' },
		{ label: 'ablancoh', id: '3', username: 'ablancoh' },
		{ label: 'fborjab', id: '4', username: 'fborjab' },
		{ label: 'epradocl', id: '5', username: 'epradocl' },
		{ label: 'jcasao', id: '6', username: 'jcasao' },
	]);

	const [projectRoles, setProjectRoles] = useState([
		// { label: 'Product Owner', id: 'po' },
		{ label: 'Project Leader', id: 'pl', github_role: 'maintainer' },
		// { label: 'Technical Leader', id: 'tl' },
		{ label: 'Developer', id: 'dev', github_role: 'member' },
		{ label: 'Manager', id: 'man', github_role: 'maintainer' },
	]);

	const [azureADUsers, setAzureADUsers] = useState<AzureADUser[]>([
		{
			businessPhones: [],
			displayName: '',
			givenName: '',
			jobTitle: '',
			mail: '',
			mobilePhone: null,
			officeLocation: '',
			preferredLanguage: '',
			surname: '',
			userPrincipalName: '',
			id: '',
		},
	]);

	const methods = useFormContext();
	const { control, getValues, setValue } = methods;
	const [usersData, updateUsersData] = useState({
		header: ['Id', 'Github User', 'Role', 'Azure AD User', 'Actions'],
		data: [],
	});
	const [usersSearchData, updateUsersSearchData] = useState(users);
	const [open, setOpen] = useState(false);
	const [showErrorMessage, setShowErrorMessage] = useState(false);

	const handleOpen = () => {
		axiosMicrosoft.get('users/' + getValues('userName') + '@emeal.nttdata.com',
			{
				headers: {
					Accept: 'application/json',
				},
			},
		).then((response) => {
			if (response) {
				setValue('azureADUser', getValues('userName') + '@emeal.nttdata.com');
				addUser();
			}
		}).catch(() => {
			setShowErrorMessage(true);
			setOpen(true);
		});
	};

	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		if (formContent.team) {
			updateUsersData({
				header: ['Id', 'Github User', 'Role', 'Azure AD User', 'Actions'],
				data: formContent.team,
			});
			setValue('team', formContent.team);
		};
		axiosExperience.get('users').then((response) => {
			setUsers(response.data);
			updateUsersSearchData(response.data);
		});
		for (let i = 0; i < config.newComponent.length; i++) {
			if (id == config.newComponent[i].id) {
				setPos(i);
			}
		}
		setProjectRoles([{ label: 'Project Leader', id: 'pl', github_role: 'maintainer' }, { label: 'Developer', id: 'dev', github_role: 'member' }, { label: 'Manager', id: 'man', github_role: 'maintainer' }]);
		// axios.get(baseUrlApplications + '/listConfig/configure/projectroles').then((response) => {
		// 	setProjectRoles(response.data);
		// });
		axiosMicrosoft.get(`users?$filter=startswith(userPrincipalName,'aa')`).then((response) => {
			setAzureADUsers(response.data.value);
		});
	}, []);

	function addUser() {
		let repeatUser = false;
		if (getValues('idUser') == null || getValues('idUser') == undefined || getValues('azureADUser') == null || getValues('azureADUser') == undefined) {
			repeatUser = true;
		}
		if (getValues('github_role') == null || getValues('github_role') == undefined) {
			setValue('github_role', 'maintainer');
		}
		const newUser = [
			getValues('idUser') != null ? getValues('idUser') : usersSearchData[0].id,
			getValues('userName'),
			getValues('rol'),
			getValues('azureADUser'),
			getValues('github_role'),
		];
		const newUserList = {
			header: usersData.header,
			data: usersData.data,
		};
		for (let i = 0; i < usersData.data.length; i++) {
			if (newUser[0] == usersData.data[i][0]) {
				repeatUser = true;
			}
		};
		if (!repeatUser) {
			newUserList.data.push(newUser);
			setValue('team', newUserList.data);
			updateUsersData(newUserList);
			handleClose();
		};
		setShowErrorMessage(false);
		handleClose();
	};

	const filterAzureADUsers = async (user: string) => {
		axiosMicrosoft.get(`users?$filter=startswith(userPrincipalName,'${user}')`).then((response) => {
			setAzureADUsers(response.data.value);
		});
	};

	const getOptionLabel = (option: AzureADUser) => option.userPrincipalName;

	return (
		<>
			<form>
				<div className='margin-container'>
					{config.newComponent[pos].category[0].enabled ? <Paper sx={{ p: '20px', m: '10px' }} elevation={1}>
						<Grid container spacing={2}>
							<Grid item xs={12} sx={{ mb: 1 }}>
								<Typography sx={{ fontSize: 25, fontWeight: 'bold' }}>{config.newComponent[pos].category[0].name}</Typography>
							</Grid>
							<Grid item xs={6}>
								<Controller
									control={control}
									defaultValue={
										usersSearchData[0]?.username ? usersSearchData[0].username : '-'
									}
									name='userName'
									render={({ field: { ref, onChange, ...field } }) => (
										<Autocomplete
											options={usersSearchData}
											onChange={(_, data: { label: string; id: string, username: string }) => {
												onChange(data.label);
												setValue('idUser', data.id);
											}}
											defaultValue={usersSearchData[0]}
											renderInput={(params) => (
												<TextField
													{...params}
													{...field}
													fullWidth
													inputRef={ref}
													label='User Github'
												/>
											)}
										/>
									)}
								/>
							</Grid>
							{config.newComponent[pos].category[0].subcategory[0].enabled ?
							<Grid item xs={4}>
								<Controller
									control={control}
									defaultValue={projectRoles[0].label}
									name='rol'
									render={({ field: { ref, onChange, ...field } }) => (
										<Autocomplete
											options={projectRoles}
											onChange={(_, data: { id: string, label: string, github_role: string, }) => {
												onChange(data.label);
												setValue('github_role', data.github_role);
											}}
											defaultValue={projectRoles[0]}
											renderInput={(params) => (
												<TextField
													{...params}
													{...field}
													fullWidth
													inputRef={ref}
													label={config.newComponent[pos].category[0].subcategory[0].name}
												/>
											)}
										/>
									)}
								/>
							</Grid> : ''}
							<Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
								<Button sx={{ 'backgroundColor': '#6486c2' }} onClick={handleOpen} variant='contained' color='primary'>
									Add user
								</Button>
							</Grid>
							<Grid item xs={12} sx={{ mt: 3 }}>
								<TableComponent
									key='uniquevalue'
									tableData={usersData}
								/>
							</Grid>
						</Grid>
						<Modal
							open={open}
							onClose={handleClose}
							aria-labelledby="modal-modal-title"
							aria-describedby="modal-modal-description"
						>
							<Box sx={{ position: 'absolute' as 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
								<Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
									<Typography id="modal-modal-title" variant="h6" component="h2">
										Choose an Azure AD User
									</Typography>
									<CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
								</Grid>
								{showErrorMessage && (<span style={{ color: 'red', fontSize: '15px' }}>There is no match in Azure AD with your Github username!<br />Please find your match!</span>)}
								<FormControl sx={{ mt: 3, width: '100%' }}>
									<FormControl fullWidth>
										<TextField id="azureADUsers" label="Search Azure AD Users" defaultValue='' onChange={(e) => filterAzureADUsers(e.target.value)} />
									</FormControl>
								</FormControl>
								<Grid sx={{ width: '100%', mt: 3 }}>
									<Controller
										control={control}
										defaultValue={azureADUsers.length !== 0 ? azureADUsers[0].userPrincipalName : ''}
										name='azureADUser'
										render={({ field: { ref, onChange, ...field } }) => (
											<Autocomplete
												options={azureADUsers}
												onChange={(_, data: AzureADUser) => {
													onChange(data.userPrincipalName);
												}}
												getOptionLabel={getOptionLabel}
												defaultValue={azureADUsers.length !== 0 ? azureADUsers[0] : ''}
												renderInput={(params) => (
													<TextField
														{...params}
														{...field}
														fullWidth
														inputRef={ref}
														label='User Azure'
													/>
												)}
											/>
										)}
									/>
								</Grid>
								<Grid sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
									<Button sx={{ mr: 1, paddingLeft: 4, paddingRight: 4 }} variant="outlined" color="inherit" onClick={handleClose}>Cancel</Button>
									<Button sx={{ paddingLeft: 4, paddingRight: 4 }} variant="outlined" color="inherit" onClick={addUser}>Confirm</Button>
								</Grid>
							</Box>
						</Modal>
					</Paper> : ''}
				</div>
			</form>
		</>
	);
}
