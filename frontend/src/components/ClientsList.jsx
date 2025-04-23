import { getClients, deleteClient} from "../api/client";
import { getProjects } from "../api/project.js";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import {formatDate, cleanHtmlMarkers} from "../utils/index.js";

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [projectCounts, setProjectCounts] = useState({});
  const [activeClientId, setActiveClientId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, projectsRes] = await Promise.all([
          getClients(),
          getProjects(),
        ]);


        const counts = (projectsRes.data || []).reduce((acc, project) => {
          const clientId = project.client_id;
          acc[clientId] = (acc[clientId] || 0) + 1;
          return acc;
        }, {});

        setClients(clientsRes.data || []);
        setProjectCounts(counts);
      } catch (err) {
        toast.error("Failed to load data");
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const toggleClientDetails = (clientId) => {
    setActiveClientId(activeClientId === clientId ? null : clientId);
  };

  const handleDelete = async (clientId) => {
    if (window.confirm("Delete client?")) {
      try {
        await deleteClient(clientId);
        toast.success("Client deleted");
        setClients((prev) => prev.filter((c) => c.id !== clientId));
      } catch (err) {
        toast.error("Failed to delete client");
      }
    }
  };

  return (
    <>
      <div>
        <h1 className="text-4xl font-bold mb-4">Clients</h1>
        <ul className="space-y-4">
          {clients.map((client) => (
            <li
              key={client.id}
              className="border rounded-lg shadow-sm p-4 bg-white"
            >

              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleClientDetails(client.id)}
              >
                <div>
                  <h2 className="text-lg font-semibold">{client.name}</h2>
                  <a
                    href={client.link}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {client.link}
                  </a>
                  <div className="text-sm text-gray-500">
                    <span>Created: {formatDate(client.date)}</span> |{" "}
                    <span>Updated: {formatDate(client.last_update_date)}</span>
                  </div>
                </div>
                <button className="text-gray-500">
                  {activeClientId === client.id ? "▲" : "▼"}
                </button>
              </div>


              {activeClientId === client.id && (
                <div className="mt-4 border-t pt-4">
                  <p>
                    <strong>Projects:</strong>{" "}
                    <Link
                      to={`/?clientId=${client.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {projectCounts[client.id] || 0} project(s)
                    </Link>
                  </p>
                  <p>
                    <strong>About Descriptions:</strong>{" "}
                    {client.about_descriptions || "N/A"}
                  </p>
                  <p>
                    <strong>Services:</strong> {client.services || "N/A"}
                  </p>
                  <p>
                    <strong>GMB ID:</strong>{" "}
                    {client.google_my_business_ids || "N/A"}
                  </p>
                  <p>
                    <strong>Client Related Information:</strong>{" "}
                    {client.client_related_information || "N/A"}
                  </p>
                  <p>
                    <strong>Tone for Blogs:</strong>{" "}
                    {client.tone_for_blogs || "N/A"}
                  </p>
                  <p>
                    <strong>Tone for Articles:</strong>{" "}
                    {client.tone_for_articles || "N/A"}
                  </p>
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => navigate(`/edit-client/${client.id}`)}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
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

export default ClientsList;