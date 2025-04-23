import { useState, useEffect, useMemo } from "react";
import { getGmb, deleteGmb } from "../api/gmb.js";
import { getClients } from "../api/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {formatDate, cleanHtmlMarkers} from "../utils/index.js";

const GMBList = () => {
  const [gmbs, setGmbs] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientFilter, setClientFilter] = useState("");
  const [activeGmbId, setActiveGmbId] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gmbRes, clientRes] = await Promise.all([
          getGmb(),
          getClients(),
        ]);

        const clientMap = new Map(
          (clientRes.data || []).map((c) => [c.id, c.name])
        );

        const enriched = (gmbRes.data || []).map((g) => ({
          ...g,
          client_name: clientMap.get(g.client_id) || "Unknown Client",
        }));

        setGmbs(enriched);
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
    if (!clientFilter) return gmbs;
    return gmbs.filter((g) => g.client_id === clientFilter);
  }, [gmbs, clientFilter]);

  const toggleGmbDetails = (gmbId) => {
    setActiveGmbId(activeGmbId === gmbId ? null : gmbId);
  };

  const handleDelete = async (gmbId) => {
    if (window.confirm("Delete GMB?")) {
      try {
        await deleteGmb(gmbId);
        toast.success("GMB deleted");
        setGmbs((prev) => prev.filter((g) => g.id !== gmbId));
      } catch (err) {
        toast.error("Failed to delete");
      }
    }
  };

  return (
    <>
      <div>
        <h1 className="text-4xl font-bold mb-6">GMB</h1>

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
          {filteredData.map((gmb) => (
            <li
              key={gmb.id}
              className="border rounded-lg shadow-sm p-4 bg-white"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleGmbDetails(gmb.id)}
              >
                <div>
                  <h2 className="text-lg font-semibold">{gmb.name}</h2>
                  <div className="text-sm text-gray-500">
                    <span>Client: {gmb.client_name}</span> |{" "}
                    <span>Status: {gmb.status}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span>Created: {formatDate(gmb.date)}</span> |{" "}
                    <span>Updated: {formatDate(gmb.last_update_date)}</span>
                  </div>
                </div>
                <button className="text-gray-500">
                  {activeGmbId === gmb.id ? "▲" : "▼"}
                </button>
              </div>

              {activeGmbId === gmb.id && (
                <div className="mt-4 border-t pt-4">
                  <p>
                    <strong>Name:</strong> {gmb.name}
                  </p>
                  <p>
                    <strong>Client:</strong> {gmb.client_name}
                  </p>
                  <p>
                    <strong>Status:</strong> {gmb.status}
                  </p>
                  <p>
                    <strong>Created:</strong> {formatDate(gmb.date)}
                  </p>
                  <p>
                    <strong>Updated:</strong> {formatDate(gmb.last_update_date)}
                  </p>

                  {gmb.status === "finished" && (
                    <p>
                      <strong>Article:</strong> <code
                        className="block w-full max-h-[400px] overflow-y-auto bg-gray-900 text-white p-4 rounded font-mono text-sm whitespace-pre-wrap"
                    >
                      { cleanHtmlMarkers(gmb.article) }
                    </code>
                    </p>
                  )}

                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => navigate(`/edit-gmb/${gmb.id}`)}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(gmb.id)}
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

export default GMBList;