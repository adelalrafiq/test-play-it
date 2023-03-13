import React, { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Collapse,
	Checkbox,
	IconButton,
	Switch,
	Typography,
	Toolbar,
	Grid,
	Dialog,
	DialogTitle,
	Box,
	AppBar,
	Tabs,
	Tab,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import axios from "axios";

const URL = process.env.REACT_APP_URL_DATA;

interface Courses {
	id: number;
	name: string;
	level: number;
}

interface Categories {
	id: number;
	name: string;
	courses: Courses[];
}

const CoursesList = () => {
	const [checked, setChecked] = useState<number[]>([]);
	const [open, setOpen] = useState<number[]>([]);
	const [categories, setCategories] = useState<Categories[]>([]);
	const [loading, setLoading] = useState(true);
	const [openDialog, setOpenDialog] = React.useState(false);

	const handleClickOpenDialog = () => {
		setOpenDialog(true);
	};
	const handleClose = () => {
		setOpenDialog(false);
	};

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				let user = JSON.parse(localStorage.getItem("userDetails") as string);
				const token = user.jwt.token;
				const organizationsId = user.organizationIDs[0];
				const api = `${URL}/${organizationsId}/categories?expand=courses&language=en`;
				const categoriesResponse = await axios.get(api, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setCategories(categoriesResponse.data);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		fetchCourses();
	}, []);

	const handleCheckAll = (
		event: React.ChangeEvent<HTMLInputElement>,
		categoryId: number,
	) => {
		const categoryItem = categories.find(
			(category) => category.id === categoryId,
		);

		if (categoryItem) {
			const subCourseIds = categoryItem.courses.map((course) => course.id);
			const newChecked = event.target.checked
				? Array.from(new Set([...checked, ...subCourseIds]))
				: checked.filter((id) => !subCourseIds.includes(id));
			setChecked(newChecked);
		}
	};

	const handleCheck = (
		event: React.ChangeEvent<HTMLInputElement>,
		id: number,
	) => {
		const newChecked = event.target.checked
			? [...checked, id]
			: checked.filter((item) => item !== id);
		setChecked(newChecked);
	};

	const handleCollapse = (id: number) => {
		setOpen((prevOpen) =>
			prevOpen.includes(id)
				? prevOpen.filter((item) => item !== id)
				: [...prevOpen, id],
		);
	};

	return (
		<>
			<Grid
				container
				spacing={0}
				direction="column"
				alignItems="center"
				justifyContent="center"
				style={{ width: "50%", margin: "auto" }}
			>
				<Grid item xs={12}>
					<Toolbar>
						<Typography variant="h6" id="tableTitle">
							Courses
						</Typography>
					</Toolbar>
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell padding="none" />
									<TableCell padding="none" />
									<TableCell padding="none" />
									<TableCell align="right" padding="none" variant="head">
										Off/On
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{categories
									.sort((a, b) => (a.name > b.name ? 1 : -1))
									.map((category) => (
										<React.Fragment key={category.id}>
											<TableRow>
												<TableCell sx={{ p: 0 }}>
													<IconButton
														sx={{ pl: 2, pr: 1 }}
														aria-label="expand row"
														size="small"
														onClick={() => handleCollapse(category.id)}
													>
														{open.includes(category.id) ? (
															<KeyboardArrowUp />
														) : (
															<KeyboardArrowDown />
														)}
													</IconButton>
												</TableCell>
												<TableCell sx={{ pr: 0 }}>
													<Checkbox
														sx={{ pr: 6 }}
														color="warning"
														checked={category.courses.every((course) =>
															checked.includes(course.id),
														)}
														indeterminate={
															category.courses.some((course) =>
																checked.includes(course.id),
															) &&
															!category.courses.every((course) =>
																checked.includes(course.id),
															)
														}
														onChange={(event) =>
															handleCheckAll(event, category.id)
														}
													/>
												</TableCell>
												<TableCell
													sx={{ pr: 20, "&:hover": { cursor: "pointer" } }}
												>
													<Typography sx={{ width: 300 }} variant="h6">
														{category.name}
													</Typography>
												</TableCell>
												<TableCell padding="none" align="right">
													<Switch color="warning" />
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell padding="none" colSpan={4}>
													<Collapse
														in={open.includes(category.id)}
														timeout="auto"
														unmountOnExit
													>
														<Table size="small">
															<TableBody>
																{category.courses
																	.sort((a, b) => (a.name > b.name ? 1 : -1))
																	.map((course) => (
																		<TableRow key={course.id}>
																			<TableCell padding="none" />
																			<TableCell sx={{ pl: 8 }}>
																				<Checkbox
																					sx={{ pr: 0 }}
																					color="warning"
																					checked={checked.includes(course.id)}
																					onChange={(event) =>
																						handleCheck(event, course.id)
																					}
																				/>
																			</TableCell>
																			<TableCell
																				sx={{ pr: 12 }}
																				key={course.id}
																			>
																				<Typography
																					variant="h6"
																					sx={{
																						width: 300,
																						p: 2,
																						"&:hover": {
																							color: "orange",
																							textDecoration: "underline",
																							cursor: "pointer",
																						},
																					}}
																					onClick={handleClickOpenDialog}
																				>
																					{course.level}. {course.name}
																				</Typography>
																			</TableCell>
																			<TableCell padding="none" align="right">
																				<Switch color="warning" />
																			</TableCell>
																		</TableRow>
																	))}
															</TableBody>
														</Table>
													</Collapse>
												</TableCell>
											</TableRow>
										</React.Fragment>
									))}
							</TableBody>
						</Table>
					</TableContainer>
				</Grid>
			</Grid>
			{openDialog && (
				<Dialog
					data-test-id="dialog"
					open={true}
					onClose={handleClose}
					maxWidth="md"
					fullWidth
					scroll="paper"
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle
						data-test-id="dialog-title"
						sx={{ backgroundColor: "#E0E0E0", color: "primary" }}
						id="form-dialog-title"
					>
						Basic Reanimation:
					</DialogTitle>
					<Box>
						<AppBar position="static">
							<Tabs
								orientation="horizontal"
								value={""}
								//onChange={''}
								indicatorColor="primary"
								textColor="inherit"
								aria-label="full width tabs example"
							>
								<Tab label={"item"} />;
							</Tabs>
						</AppBar>
					</Box>
				</Dialog>
			)}
		</>
	);
};

export default CoursesList;
