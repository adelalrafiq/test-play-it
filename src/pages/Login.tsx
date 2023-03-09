import {
	Box,
	Fab,
	FormControl,
	Grid,
	Input,
	InputLabel,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/helpers";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const handleLogin = async () => {
		let response = await login(email, password);
		response = await response.json();
		console.log({ response });
		document.cookie = `myCookie=${JSON.stringify(response)}; path=/;`;
		localStorage.setItem("userDetails", JSON.stringify(response));
		navigate("/courses");
	};
	return (
		<>
			<Box
				component="form"
				sx={{
					"& > :not(style)": { m: 1 },
				}}
				noValidate
				autoComplete="off"
			>
				<Grid
					container
					spacing={0}
					direction="column"
					alignItems="center"
					justifyContent="center"
					style={{ minHeight: "100vh" }}
				>
					<Grid item xs={12}>
						<Typography
							sx={{ mb: "5rem" }}
							gutterBottom
							variant="h4"
							component="h4"
						>
							The number 1 game-based learning platform
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<FormControl fullWidth variant="standard">
							<InputLabel htmlFor="email">Email address</InputLabel>
							<Input
								id="email"
								type="email"
								onChange={(e) => setEmail(e.target.value)}
							/>
						</FormControl>
						<FormControl margin="normal" fullWidth variant="standard">
							<InputLabel htmlFor="password">Password</InputLabel>
							<Input
								id="password"
								type="password"
								onChange={(e) => setPassword(e.target.value)}
							/>
						</FormControl>
						<Fab
							size="medium"
							color="warning"
							onClick={handleLogin}
							variant="extended"
							sx={{ width: "100%" }}
						>
							Login
						</Fab>					
					</Grid>
				</Grid>
			</Box>
		</>
	);
}
