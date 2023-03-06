import {
	Box,
	Button,
	Chip,
	FormControl,
	Grid,
	Input,
	InputLabel,
	Typography,
} from "@mui/material";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const URL_AUTH = process.env.REACT_APP_URL_AUTH;
export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();	
	const handleLogin = async () => {       
		let user = { email, password };
		let result = await fetch(`${URL_AUTH}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "*/*",
			},
			body: JSON.stringify(user),
		});
		result = await result.json();
		localStorage.setItem("userInfo", JSON.stringify(result));
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
							<Input id="email" type="email" onChange={(e) => setEmail(e.target.value)} />
						</FormControl>
						<FormControl margin="normal" fullWidth variant="standard">
							<InputLabel htmlFor="password">Password</InputLabel>
							<Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
						</FormControl>
                      <Button fullWidth  onClick={handleLogin}>                       
						<Chip
							sx={{width: "100%"}}
							color="warning"
							label="LOGIN"                           
						/>
                       </Button>
					</Grid>
				</Grid>
			</Box>
		</>
	);
}