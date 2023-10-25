import { Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

interface TableData {
	header: string[];
	data: string[][];
}

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

export function TableComponent(props: { tableData: TableData }) {
	const methods = useFormContext();
	const { setValue } = methods;
	const [tableData, updateTableData] = useState({ header: [], data: [] });
	const [actions, updateActions] = useState(false);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	useEffect(() => {
		if (props && props.tableData) {
			if (
				props.tableData.header.find((str) => {
					return str == 'Actions';
				})
			) {
				updateActions(true);
			}
			updateTableData(props.tableData);
		}
	});

	function deleteData(pos: number) {
		const newData = {
			header: tableData.header,
			data: tableData.data,
		};
		newData.data.splice(pos, 1);
		updateTableData(newData);
		setValue('team', newData.data);
	}

	// Avoid a layout jump when reaching the last page with empty rows.
	/* const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableData.data.length) : 0; */

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

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 500 }} aria-label='demo table'>
				<TableHead>
					<TableRow>
						{tableData.header ? tableData.header.map((headerTitle: string, pos: number) => {
							return (
								<TableCell key={pos + '_' + headerTitle}>
									{headerTitle}
								</TableCell>
							);
						}): ''}
					</TableRow>
				</TableHead>
				<TableBody>
  {tableData.data ? tableData.data
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((row: string[], pos: number) => {
          return (
            <TableRow key={pos + '-' + row}>
              {row.map((col: string, pos: number) => {
                return pos !== 4 ? (
                  <TableCell key={pos + '/' + col}>{col}</TableCell>
                ) : (
                  ''
                );
              })}
              {actions && (
                <TableCell key={pos + 'button'}>
                  <Button
                    sx={{ backgroundColor: '#6486c2' }}
                    onClick={() => {
                      deleteData(pos + page * rowsPerPage);
                    }}
                    variant='contained'
                    color='primary'
                  >
                    Delete
                  </Button>
                </TableCell>
              )}
            </TableRow>
          );
        }) : ''}
	</TableBody>
				<TableFooter>
					<TableRow>
						<TablePagination
							rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
							colSpan={tableData.header.length + (actions ? 1 : 0)}
							count={tableData.data.length}
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
	);
}

