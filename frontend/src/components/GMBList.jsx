import { useState, useEffect, useMemo } from "react";
import { getGmb, deleteGmb } from "../api/gmb.js";
import { getClients } from "../api/client";
import GenericTable from "./GenericTable";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const GMBList = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientFilter, setClientFilter] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, clientRes] = await Promise.all([
          getGmb(),
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

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "client_name",
        header: "Client",
      },
      {
        accessorKey: "date",
        header: "Created",
        cell: (info) =>
          formatDate(info.getValue()),
      },
      {
        accessorKey: "last_update_date",
        header: "Updated",
        cell: (info) =>
          formatDate(info.getValue()),
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
          const handleDelete = async () => {
            if (window.confirm("Delete GMB?")) {
              try {
                await deleteGmb(row.original.id);
                toast.success("GMB deleted");
                setProjects((prev) =>
                  prev.filter((p) => p.id !== row.original.id)
                );
              } catch (err) {
                toast.error("Failed to delete");
              }
            }
          };

          return (
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/edit-gmb/${row.original.id}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          );
        },
      },
    ],
    [navigate, setProjects]
  );


  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";

    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return formatter.format(date).replace(",", "");
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

        <GenericTable
          title=""
          data={filteredData}
          columns={columns}
          filterKey="name"
        />
      </div>
      <ToastContainer />
    </>
  );
};

export default GMBList;