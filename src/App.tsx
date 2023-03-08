import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoutes from "./routes/PrivateRoutes";
import Login from "./pages/Login";
import CoursesList from "./pages/CoursesList";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>					
					<Route path="/" element={<Login />} />
					<Route element={<PrivateRoutes />} >
						<Route path="/courses" element={<CoursesList />}  />
					</Route>
				</Routes>
				</BrowserRouter>
		</div>
	);
}
export default App;
