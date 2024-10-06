import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root, { loader as contactsLoader } from "./routes/root";
import ErrorPage from "./error-page";
import Contact, {
  loader as contactLoader,
  deleteContactAction,
} from "./routes/contact";
import EditContact, { action as updateContactAction } from "./routes/edit";
import NewContact, { action as createContactAction } from "./routes/new";
import Index from "./routes";

const router = createBrowserRouter([
  {
    path: "/",
    loader: contactsLoader,
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "contacts/:contactId",
        element: <Contact />,
        loader: contactLoader,
      },
      {
        path: "contacts/:contactId/edit",
        element: <EditContact />,
        loader: contactLoader,
        action: updateContactAction,
      },
      {
        path: "contacts/:contactId/destroy",
        action: deleteContactAction,
      },
      {
        path: "contacts/new",
        element: <NewContact />,
        action: createContactAction,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
