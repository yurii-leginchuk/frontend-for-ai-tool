import { useEffect, useState } from "react";
import { getWebsites, createWebsite, updateWebsite, getWebsiteById, deleteWebsite } from "../api/websites";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "react-data-table-component";
import { useForm } from "react-hook-form";
import { validateDomain, formatDate } from "../utils/index.js";

const WebsiteList = () => {
  const [websites, setWebsites] = useState([]);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const res = await getWebsites();
        setWebsites(res.data);
      } catch (err) {
        toast.error("Failed to load websites");
        console.error(err);
      }
    };
    fetchWebsites();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const existing = await getWebsiteById(id);
      const updatePayload = {
        domain: existing.data.domain,
        status: status,
        date: existing.data.date || new Date().toISOString(),
        last_update_date: new Date().toISOString(),
      };

      await updateWebsite(id, updatePayload);

      setWebsites((prev) =>
        prev.map((w) => (w.id === id ? { ...w, status } : w))
      );
      toast.success(`Website ${status === "banned" ? "banned" : "restored"}`);
    } catch (err) {
      toast.error("Failed to update website status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this website?")) return;
    try {
      await deleteWebsite(id);
      setWebsites((prev) => prev.filter((w) => w.id !== id));
      toast.success("Website deleted");
    } catch (err) {
      toast.error("Failed to delete website");
    }
  };

  const onSubmit = async (data) => {
    const isBanned = websites.some(
      (w) => w.domain === data.domain && w.status === "banned"
    );

    if (isBanned) {
      toast.error("This website is banned and cannot be added");
      return;
    }

    try {
      const now = new Date().toISOString();
      const res = await createWebsite({
        domain: data.domain,
        status: "active",
        date: now,
        last_update_date: now,
      });

      setWebsites((prev) => [...prev, res.data]);
      reset();
      toast.success("Website added");
    } catch (err) {
      toast.error("Failed to add website");
    }
  };

  const columns = [
    {
      name: "Domain",
      selector: (row) => row.domain,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status || "unknown",
      sortable: true,
    },
    {
      name: "Created",
      selector: (row) => formatDate(row.date) || "-",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className={`${
              row.status === "banned" ? "bg-green-600" : "bg-red-600"
            } text-white px-3 py-1 rounded`}
            onClick={() =>
              updateStatus(row.id, row.status === "banned" ? "active" : "banned")
            }
          >
            {row.status === "banned" ? "Restore" : "Ban"}
          </button>
          <button
            className="bg-gray-600 text-white px-3 py-1 rounded"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Websites</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter website domain"
          {...register("domain", {
            required: "Domain is required",
            validate: validateDomain,
          })}
          className={`border rounded p-2 w-full ${
            errors.domain ? "border-red-500" : "border-gray-300"
          }`}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded whitespace-nowrap"
        >
          Add Website
        </button>
      </form>
      {errors.domain && (
        <p className="text-sm text-red-600 mb-4">{errors.domain.message}</p>
      )}

      <DataTable
        columns={columns}
        data={websites}
        pagination
        highlightOnHover
        striped
      />

      <ToastContainer />
    </div>
  );
};

export default WebsiteList;