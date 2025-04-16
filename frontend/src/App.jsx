import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProjectsList from "./components/ProjectsList.jsx";
import AddClient from "./components/AddClient";
import AddProject from "./components/AddProject";
import EditClient from "./components/EditClient";
import EditProject from "./components/EditProject";
import ClientsList from "./components/ClientsList.jsx";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ProjectsList />} />
          <Route path="/clients" element={<ClientsList />} />
          <Route path="/add-client" element={<AddClient />} />
          <Route path="/add-project" element={<AddProject />} />
          <Route path="/edit-client/:id" element={<EditClient />} />
          <Route path="/edit-project/:id" element={<EditProject />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;