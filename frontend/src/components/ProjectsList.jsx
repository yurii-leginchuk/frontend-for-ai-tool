import { useState, useEffect, useMemo } from "react";
import { getProjects, deleteProject } from "../api/project";
import { getClients } from "../api/client";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {formatDate, cleanHtmlMarkers} from "../utils/index.js";

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientFilter, setClientFilter] = useState("");
  const [activeProjectId, setActiveProjectId] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, clientRes] = await Promise.all([
          getProjects(),
          getClients(),
        ]);

        const clientMap = new Map(
          (clientRes.data || []).map((c) => [c.id, c.name])
        );

        const enriched = (projectRes.data || []).map((p) => ({
          ...p,
          client_name: clientMap.get(p.client_id) || "Unknown Client",
        }));

        setProjects(enriched);
        setClients(clientRes.data || []);

        const clientIdFromUrl = searchParams.get("clientId");
        if (clientIdFromUrl) {
          setClientFilter(clientIdFromUrl);
        }
      } catch (err) {
        toast.error("Failed to load data");
        console.error(err);
      }
    };
    fetchData();
  }, [searchParams]);

  const filteredData = useMemo(() => {
    if (!clientFilter) return projects;
    return projects.filter((p) => p.client_id === clientFilter);
  }, [projects, clientFilter]);

  const toggleProjectDetails = (projectId) => {
    setActiveProjectId(activeProjectId === projectId ? null : projectId);
  };

  const handleDelete = async (projectId) => {
    if (window.confirm("Delete project?")) {
      try {
        await deleteProject(projectId);
        toast.success("Project deleted");
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
      } catch (err) {
        toast.error("Failed to delete");
      }
    }
  };

  return (
    <>
      <div>
        <h1 className="text-4xl font-bold mb-6">Projects</h1>

        {/* Client filter */}
        <div className="mb-4">
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="w-full sm:w-1/3 p-2.5 bg-white border border-gray-300 text-gray-800 text-sm rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D6B9FC] transition-all duration-200 ease-in-out hover:border-[#D6B9FC]"
          >
            <option value="">All Clients</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <ul className="space-y-4">
          {filteredData.map((project) => (
            <li
              key={project.id}
              className="border rounded-lg shadow-sm p-4 bg-white"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleProjectDetails(project.id)}
              >
                <div>
                  <h2 className="text-lg font-semibold">{project.name}</h2>
                  <div className="text-sm text-gray-500">
                    <span>Client: {project.client_name}</span> |{" "}
                    <span>Type: {project.project_type}</span> |{" "}
                    <span>Status: {project.status}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span>Created: {formatDate(project.date)}</span> |{" "}
                    <span>Updated: {formatDate(project.last_update_date)}</span>
                  </div>
                </div>
                <button className="text-gray-500">
                  {activeProjectId === project.id ? "▲" : "▼"}
                </button>
              </div>

              {activeProjectId === project.id && (
                <div className="mt-4 border-t pt-4">
                  <p>
                    <strong>Project Name:</strong> {project.name}
                  </p>
                  <p>
                    <strong>Client:</strong> {project.client_name}
                  </p>
                  <p>
                    <strong>Type:</strong> {project.project_type}
                  </p>
                  <p>
                    <strong>Status:</strong> {project.status}
                  </p>
                  <p>
                    <strong>Created:</strong> {formatDate(project.date)}
                  </p>
                  <p>
                    <strong>Updated:</strong> {formatDate(project.last_update_date)}
                  </p>


                    {project.status === "finished" && (
                    <p>
                      <strong>Article:</strong> <code
                        className="block w-full max-h-[400px] overflow-y-auto bg-gray-900 text-white p-4 rounded font-mono text-sm whitespace-pre-wrap"
                    >
                      { cleanHtmlMarkers(project.article) }
                    </code>
                    </p>
                  )}

                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => navigate(`/edit-project/${project.id}`)}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <ToastContainer />
    </>
  );
};

export default ProjectsList;