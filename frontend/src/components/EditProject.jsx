import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { getClients } from "../api/client";
import { getProjectById, updateProject } from "../api/project";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientRes, projectRes] = await Promise.all([
          getClients(),
          getProjectById(id),
        ]);

        const clientList = clientRes.data || [];
        const projectData = projectRes.data;

        setClients(clientList);

        const fieldsToSet = ["name", "client_id", "project_type", "status"];
        fieldsToSet.forEach((field) => {
          if (projectData[field]) {
            setValue(field, projectData[field]);
          }
        });

        setValue("date", projectData.date);
        setValue("last_update_date", new Date().toISOString());
      } catch (err) {
        toast.error("Failed to load project or clients");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        last_update_date: new Date().toISOString(),
      };

      await updateProject(id, payload);
      toast.success("Project updated!");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      if (err.response?.data?.detail) {
        const errorDetails = err.response.data.detail;
        errorDetails.forEach((error) => {
          const fieldName = error.loc[error.loc.length - 1];
          setError(fieldName, { type: "server", message: error.msg });
        });
        toast.error("Validation errors occurred.");
      } else {
        toast.error("Failed to update project");
        console.error("Update error:", err);
      }
    }
  };

  const fields = [
    {
      name: "name",
      label: "Name",
      required: true,
      type: "text",
    },
    {
      name: "client_id",
      label: "Client",
      required: true,
      type: "select",
      options: [
        { value: "", label: "Select a client", disabled: true },
        ...(clients.length > 0
          ? clients.map((client) => ({
              value: client.id,
              label: client.name || "Unnamed Client",
            }))
          : [{ value: "", label: "No clients available", disabled: true }]),
      ],
    },
    {
      name: "project_type",
      label: "Project Type",
      required: true,
      type: "select",
      options: [
        { value: "", label: "Select a type", disabled: true },
        { value: "Blog", label: "Blog" },
        { value: "Service", label: "Service" },
      ],
    },
  ];

  return (
    <>
      <div >
        <h1 className="text-4xl font-bold mb-6">Edit Project</h1>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {fields.map(({ name, label, required, type, options }) => (
              <div key={name}>
                <label className="block font-medium mb-1" htmlFor={name}>
                  {label}
                </label>
                {type === "select" ? (
                  <select
                    id={name}
                    {...register(name, {
                      required: required ? "This field is required" : false,
                      validate: (val) =>
                        val !== "" || "Please select an option",
                    })}
                    className={`w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      errors[name] ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    {options.map((option) => (
                      <option
                        key={option.value}
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

            <input type="hidden" {...register("date")} />
            <input type="hidden" {...register("last_update_date")} />
            <input type="hidden" {...register("status")} />

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded w-full font-bold disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
};

export default EditProject;
