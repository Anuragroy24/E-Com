import { createBrowserRouter } from "react-router";
import Layout from "./Layout";
import Register from "../modules/auth/pages/Register";
import Login from "../modules/auth/pages/Login";
import Profile from "../modules/auth/pages/Profile";
import ProtectedRoute from "../modules/auth/components/ProtectedRoute";
import ProductList from "../modules/products/pages/ProductList";
import ProductDetail from "../modules/products/pages/ProductDetail";
import ProductForm from "../modules/products/pages/ProductForm";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <ProductList /> },
            { path: "register", element: <Register /> },
            { path: "login", element: <Login /> },
            {
                path: "profile",
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                )
            },
            { path: "products/:id", element: <ProductDetail /> },
            {
                path: "products/new",
                element: (
                    <ProtectedRoute>
                        <ProductForm mode="create" />
                    </ProtectedRoute>
                )
            },
            {
                path: "products/:id/edit",
                element: (
                    <ProtectedRoute>
                        <ProductForm mode="edit" />
                    </ProtectedRoute>
                )
            }
        ]
    }
]);

export default router;
