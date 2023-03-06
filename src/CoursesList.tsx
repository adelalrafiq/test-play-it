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
	Link,
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
	const [hovered, setHovered] = useState(false);
	const [openDialog, setOpenDialog] = React.useState(false);

	const handleMouseOver = () => {
		setHovered(true);
	};
	const handleMouseOut = () => {
		setHovered(false);
	};
	const linkStyle = {
		color: hovered ? "#fc9900" : "#000",
	};
	const handleClickOpenDialog = () => {
		setOpenDialog(true);
	};
	const handleClose = () => {
		setOpenDialog(false);
	};

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				let user = JSON.parse(localStorage.getItem("userInfo") as string);
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
				direction="row"
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
												<TableCell padding="none">
													<IconButton
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
												<TableCell padding="none">
													<Checkbox
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
												<TableCell padding="none">{category.name}</TableCell>
												<TableCell align="right" padding="none">
													<Switch color="warning" />
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell
													padding="none"
													style={{ paddingBottom: 0, paddingTop: 0 }}
													colSpan={4}
												>
													<Collapse
														style={{ margin: 0, padding: 0 }}
														in={open.includes(category.id)}
														timeout="auto"
														unmountOnExit
													>
														<Table aria-label="purchases">
															<TableBody>
																{category.courses
																	.sort((a, b) => (a.name > b.name ? 1 : -1))
																	.map((course) => (
																		<TableRow key={course.id}>
																			<TableCell />
																			<TableCell>
																				<Checkbox
																					color="warning"
																					checked={checked.includes(course.id)}
																					onChange={(event) =>
																						handleCheck(event, course.id)
																					}
																				/>
																			</TableCell>
																			<TableCell key={course.id}>
																				<Link
																					style={linkStyle}
																					onMouseOver={handleMouseOver}
																					onMouseOut={handleMouseOut}
																					underline="hover"
																					component="button"
																					variant="body2"
																					onClick={handleClickOpenDialog}
																				>
																					{course.level}. {course.name}
																				</Link>
																			</TableCell>
																			<TableCell align="right">
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
		</>
	);
};

export default CoursesList;
