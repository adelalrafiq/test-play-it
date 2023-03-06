import "./App.css";
import Login from "./Login";
import CoursesList from "./CoursesList";
import { Route, Routes } from "react-router-dom";

function App() {
	return (
		<div className="App">
      
			<Routes>
				<Route path="/" element={<Login />} />				
				<Route path="/courses" element={<CoursesList  />} />
			</Routes>
		</div>
	);
}

export default App;
