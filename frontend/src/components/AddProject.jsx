import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { createProject } from "../api/project.js";
import { getClients } from "../api/client.js";
import { useEffect, useState } from "react";
import uniqid from "uniqid";

const AddProject = () => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const response = await getClients();
        const clientData = response.data;

        if (Array.isArray(clientData)) {
          setClients(clientData);
        } else {
          toast.error("Unexpected client data format: Response 'data' is not an array");
        }
      } catch (err) {
        toast.error("Failed to load clients");
        console.error("Error fetching clients:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, []);

  const onSubmit = async (data) => {
    try {
      const now = new Date().toISOString();
      const payload = {
        ...data,
        date: now,
        last_update_date: now,
        status: "draft",
      };

      await createProject(payload);
      toast.success("Project saved!");
      reset();
    } catch (err) {
      if (err.response?.data?.detail) {
        const errorDetails = err.response.data.detail;

        errorDetails.forEach((error) => {
          const fieldName = error.loc[error.loc.length - 1];
          const errorMessage = error.msg;

          if (["date", "last_update_date", "status"].includes(fieldName)) {
            toast.error(`Server error: ${errorMessage}`);
          } else {
            setError(fieldName, {
              type: "server",
              message: errorMessage,
            });
          }
        });

        toast.error("Validation errors occurred. Check the highlighted fields.");
      } else {
        toast.error("Failed to save project");
        console.error("Error saving project:", err);
      }
    }
  };

  const visibleFields = [
    { name: "name", label: "Name", required: true, type: "text" },
    {
      name: "client_id",
      label: "Client",
      required: true,
      type: "select",
      options: [
        { value: "none", label: "Select a client", disabled: true },
        ...(isLoading
          ? [{ value: "none", label: "Loading...", disabled: true }]
          : clients.length > 0
          ? clients.map((client) => ({
              value: client.id,
              label: client.name || "Unnamed Client",
            }))
          : [{ value: "none", label: "No clients available", disabled: true }]),
      ],
    },
    {
      name: "project_type",
      label: "Project Type",
      required: true,
      type: "select",
      options: [
        { value: "none", label: "Select a project type", disabled: true },
        { value: "Blog", label: "Blog" },
        { value: "Service", label: "Service" },
      ],
    },
  ];

  const hiddenFields = [
    { name: "date" },
    { name: "last_update_date" },
    { name: "status" },
  ];

  return (
    <>
      <div>
        <h1 className="text-4xl font-bold mb-6">Add Project</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {visibleFields.map(({ name, label, required, type, options }) => (
            <div key={name}>
              <label className="block font-medium mb-1" htmlFor={name}>
                {label}
              </label>
              {type === "select" ? (
                <select
                  id={name}
                  disabled={isLoading && name === "client_id"}
                  {...register(name, {
                    required: required ? "This field is required" : false,
                    validate: (value) =>
                      value !== "none" || "Please select an option",
                  })}
                  className={`w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    errors[name] ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {options.map((option) => (
                    <option
                      key={uniqid()}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={name}
                  type="text"
                  {...register(name, {
                    required: required ? "This field is required" : false,
                  })}
                  className={`w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    errors[name] ? "border-red-500" : "border-gray-300"
                  }`}
                />
              )}
              {errors[name] && (
                <p className="text-sm text-red-600 mt-1">
                  {errors[name].message}
                </p>
              )}
            </div>
          ))}

          {hiddenFields.map(({ name }) => (
            <input
              key={name}
              type="hidden"
              {...register(name, { required: false })}
            />
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded disabled:opacity-50 w-full font-bold"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </>
  );
};

export default AddProject;
