import React, { RefObject, useEffect, useContext } from "react";
// import { MobDataContext } from "./Mobs/MobDataContext";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Form } from "./Mobs/Form";
import { List } from "./Mobs/List";
import reportWebVitals from "./reportWebVitals";
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import { ErrorPage } from "./errorPage";
import { defineMobsData as MobLoader} from "./data/Mobs";
import MobTypeData, { MobTemplate, LootItems } from "./data/MobTypes";
import {loaderMobs} from "./Mobs/Form"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage/>,
    loader: MobLoader satisfies ()=>Array<MobTemplate | undefined>,
    children: [      
      {
        path: "mobs",
        element: <List />,
      },
      {
        path: "mobs/form/:mobId",
        element: <Form />,
        loader: loaderMobs satisfies ({ params }: { params: any; }) => Promise<MobTemplate | undefined>
      },
      {
        path: "mobs/form",
        element: <Form />,
       }
    ]
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
