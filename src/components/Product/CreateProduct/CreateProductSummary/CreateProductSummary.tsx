import { Grid, Card, SvgIcon, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { ReactComponent as ProductIcon } from '../../../../assets/icons/product.svg';
import { useConfig } from '../../../ConfigContext';

export function CreateProductSummary({ formContent }: any) {
	const config = useConfig();
	const [date, setDate] = useState(new Date());


	useEffect(() => {
		setDate(new Date());
	}, []);

	return (
		<>
			<div className='margin-container'>
				<Grid sx={{ display: 'grid', alignItems: 'center', justifyContent: 'center' }}>
					<Card sx={{ display: 'grid', ml: 1, mr: 0.5, mb: 3, mt: 3 }}>
						<Grid sx={{ backgroundColor: '#6486c2', height: '5px' }}></Grid>
						<Grid container spacing={1} sx={{ p: 3 }}>
							<Grid item xs={12} sx={{ display: 'flex' }}>
								<SvgIcon sx={{ fontSize: 50 }} component={ProductIcon} inheritViewBox />
								<Typography sx={{ ml: 1.5, color: '#6486c2', fontSize: 30 }}>
									{formContent.name.toUpperCase()}
								</Typography>
							</Grid>
							<Grid container sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', mt: 3, ml: 1 }}>
								<Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
									<Grid container>
										<Typography color="#6486c2" sx={{ ml: 1 }}>Organization: </Typography>
										<Typography sx={{ ml: 1 }}>{formContent.organization}</Typography>
									</Grid>
								</Grid>
								<Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
									<Grid container>
										<Typography color="#6486c2" sx={{ ml: 1 }}>Area: </Typography>
										<Typography sx={{ ml: 1 }}>{formContent.area}</Typography>
									</Grid>
								</Grid>
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
				</Grid>
			</div>
		</>
	);
}
