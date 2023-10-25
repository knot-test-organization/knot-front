import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Grid, TextField, Autocomplete, Button, Modal, Box, FormControl, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import { axiosExperience, axiosMicrosoft } from '../../../../axios';
import CloseIcon from '@mui/icons-material/Close';
import { useFormContext } from 'react-hook-form';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#eff2f7',
    borderColor: '#cdd6e2',
    color: '#6486c2',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderColor: '#cdd6e2',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: '#f9fafc',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

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

	const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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
  }

export function TeamDetails(prop: { dataParentToChild: any, org: any, area: any, product: any }) {
  const { dataParentToChild, org, area, product } = prop;
  const [array, setArray] = useState(dataParentToChild?.users.map((obj: any) => Object.values(obj)));
  const methods = useForm();
  const { control, getValues, setValue } = methods;
	const [tableData, updateTableData] = useState({ header: ['Id', 'Github User', 'Role', 'Azure AD User', 'Actions'], data: {array} });
	const [actions, updateActions] = useState(false);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const tableDataProps = { tableData };

  useEffect(() => {
		if (tableDataProps && tableDataProps.tableData) {
			if (
				tableDataProps.tableData.header.find((str: any) => {
					return str == 'Actions';
				})
			) {
				updateActions(true);
			}
			updateTableData(tableDataProps.tableData);
      console.log('tableData:', tableData);
      console.log('array:', array);
      console.log('Rowsperpage:', rowsPerPage);
		}
	});

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

  const [users, setUsers] = useState([
    //  { label: '', id: '0', username: '' },
    //  { label: 'bchemsed', id: '1', username: 'bchemsed' },
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

  const [open, setOpen] = useState(false);

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
			setOpen(true);
		});
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    axiosExperience.get('users').then((response) => {
      setUsers(response.data);
    });
    setProjectRoles([
      { label: 'Project Leader', id: 'pl', github_role: 'maintainer' },
      { label: 'Developer', id: 'dev', github_role: 'member' },
      { label: 'Manager', id: 'man', github_role: 'maintainer' },
    ]);
    // axios.get(url + '/listConfig/configure/projectroles').then((response) => {
    //   setProjectRoles(response.data);
    // });
    axiosMicrosoft.get(`users?$filter=startswith(userPrincipalName,'aa')`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    ).then((response) => {
      setAzureADUsers(response.data.value);
    });
  }, []);

  const filterAzureADUsers = async (user: string) => {
		axiosMicrosoft.get(`users?$filter=startswith(userPrincipalName,'${user}')`,
			{
				headers: {
					Accept: 'application/json',
				},
			},
		).then((response) => {
			setAzureADUsers(response.data.value);
		});
	};

	const getOptionLabel = (option: AzureADUser) => option.userPrincipalName;

  const addUser = async () => {
    try {
      let repeatUser = false;
      if (getValues('id') == null || getValues('id') == undefined || getValues('azureADUser') == null || getValues('azureADUser') == undefined) {
        repeatUser = true;
      }
      if (getValues('github_role') == null || getValues('github_role') == undefined) {
        setValue('github_role', 'maintainer');
      }
      const newUser = [
        getValues('id') != null ? getValues('id') : users[0].id,
        getValues('userName'),
        getValues('rol'),
        getValues('azureADUser'),
        getValues('github_role'),
      ];
      for (let i = 0; i < array.length; i++) {
        if (newUser[0] == array[i][0]) {
          repeatUser = true;
        }
      }
      if (!repeatUser) {
        dataParentToChild?.users.push({
          id: newUser[0].toString(),
          name: newUser[1],
          role: newUser[2],
          azureADUser: newUser[3],
          githubRole: newUser[4],
          externalSecretName: null,
        });
        setArray(dataParentToChild?.users.map((obj: any) => Object.values(obj)));
        handleClose();
        dataParentToChild?.microsoftTeams.usersList.push({
          id: newUser[0].toString(),
          name: newUser[1],
          role: newUser[2],
          azureADUser: newUser[3],
          githubRole: newUser[4],
          externalSecretName: null,
        });
        setArray(dataParentToChild?.microsoftTeams.usersList.map((obj: any) => Object.values(obj)));
        const { data } = await axiosExperience.put<any>(
          // 'http://knot.westeurope.cloudapp.azure.com/api/Applications',
          `components/${org}/${area}/${product}/users/${dataParentToChild.id}`, dataParentToChild.users,
          {
            headers: {
              Accept: 'application/json',
            },
          },
        );
        console.log('response', data);
      }
    } catch (error) {
      console.log('error', JSON.stringify(error));
    }
  };

  const deleteData = async (pos: number) => {
    try {
      dataParentToChild.users.splice(pos, 1);
      setArray(dataParentToChild?.users.map((obj: any) => Object.values(obj)));
      dataParentToChild.microsoftTeams.usersList.splice(pos, 1);
      setArray(dataParentToChild?.microsoftTeams.usersList.map((obj: any) => Object.values(obj)));
      const { data } = await axiosExperience.put<any>(
        // 'http://knot.westeurope.cloudapp.azure.com/api/Applications',
        `components/${org}/${area}/${product}/users/${dataParentToChild.id}`, dataParentToChild.users,
        {
          headers: {
            Accept: 'application/json',
          },
        },
      );
      console.log('response', data);
    } catch (error) {
      console.log('error', JSON.stringify(error));
    }
  };

  function renderComponent(col: string, pos: number, index: number) {
    if (pos !== 4 && pos !== 5) {
      return <StyledTableCell align='center' key={pos + '/' + col}>{col}</StyledTableCell>;
    };
    if (pos === 4) {
      return '';
    };
  };

  return (
    <Paper square elevation={1} variant="outlined" sx={{ width: '100%', borderColor: '#cdd6e2', borderWidth: '1.5px', overflow: 'hidden' }}>
      <Grid container spacing={2} sx={{ p: '20px', justifyContent: 'center', alignItems: 'center' }}>
        <Grid item xs={6}>
          <Controller
            control={control}
            defaultValue={
              users[0]?.username ? users[0].username : '-'
            }
            name='userName'
            render={({ field: { ref, onChange, ...field } }) => (
              <Autocomplete
                options={users}
                onChange={(_, data: { label: string; id: string, username: string }) => {
                  onChange(data.label);
                  setValue('id', data.id);
                }}
                defaultValue={users[0]}
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
        <Grid item xs={4}>
          <Controller
            control={control}
            defaultValue={projectRoles[0].label}
            name='rol'
            render={({ field: { ref, onChange, ...field } }) => (
              <Autocomplete
                options={projectRoles}
                onChange={(_, data: { label: string; id: string, github_role: string }) => {
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
                    label='Project Role'
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={2}>
          <Button sx={{ 'backgroundColor': '#6486c2' }} onClick={handleOpen} variant='contained' color='primary'>
            Add user
          </Button>
        </Grid>
      </Grid>
      <TableContainer sx={{ '&::-webkit-scrollbar': { width: '0.4em' }, '&::-webkit-scrollbar-thumb': { background: '#d6d6d6', borderRadius: '100px' }, '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#e0e0e0' } }}>
        <Table stickyHeader sx={{ borderCollapse: 'separate' }}>
          <TableHead>
            <TableRow>
              {tableData.header.map((headerTitle: string, pos: number) => {
                return (
                  <StyledTableCell align='center' key={pos + '_' + headerTitle}>
                    {headerTitle}
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
          {array ? array
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row: string[], index: number) => {
              let lastPos;
              let lastCol;
              return (
                <StyledTableRow key={index + '-' + row}>
                  {row.map((col: string, pos: number) => {
                    lastPos = pos;
                    lastCol = col;
                    return pos !== 4 ? (
                      renderComponent(col, pos, index)
                    ) : (
                      ''
                    );
                  })}
                  {actions && (
                    <StyledTableCell align='center' key={lastPos + '/' + lastCol}><Button sx={{ 'backgroundColor': '#6486c2' }} onClick={() => deleteData(index)} variant='contained' color='primary'>Delete</Button></StyledTableCell>
                  )}
                </StyledTableRow>
              );
            }) : ''}
          </TableBody>
          <TableFooter>
					<TableRow>
						<TablePagination
							rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
							colSpan={3}
							count={array.length}
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
      </TableContainer>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ position: 'absolute' as 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <Grid sx={{ display: 'flex' }}>
            <Typography sx={{ mr: '35%' }} id="modal-modal-title" variant="h6" component="h2">
              Choose a Azure AD User
            </Typography>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
          </Grid>
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
    </Paper>
  );
}

