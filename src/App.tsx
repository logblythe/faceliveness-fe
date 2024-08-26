import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import FaceSearch from "./FaceSearch";
import FaceIndex from "./FaceIndex";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

Amplify.configure(outputs);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index element={<FaceIndex />} />
      <Route path="face-search" element={<FaceSearch />} />
    </>
  )
);

function App() {
  return (
    <main>
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
