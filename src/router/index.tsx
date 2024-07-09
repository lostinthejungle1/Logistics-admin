import { createHashRouter, Navigate } from "react-router-dom";
import Welcome from "@/views/Welcome";
import Login from "@/views/Login";
import NotFound from "@/views/404";
import Forbidden from "@/views/403";

const router = createHashRouter([
	{
		path: "/",
		element: <Welcome />,
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "*",
		element: <Navigate to="/404" />,
	},
	{
		path: "/404",
		element: <NotFound />,
	},
	{
		path: "/403",
		element: <Forbidden />,
	},
]);
export default router;
