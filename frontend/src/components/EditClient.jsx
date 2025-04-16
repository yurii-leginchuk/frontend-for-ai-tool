import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getClientById, updateClient } from "../api/client.js";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditClient = () => {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();
  const { id } = useParams();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
       console.log(id);
    const fetchClient = async () => {
      try {
        console.log("Fetching client with ID:", id); // Debug log
        const response = await getClientById(id);
        const clientData = response.data;
        console.log("Client data:", clientData); // Debug log

        // Set form values
        const fieldsToSet = [
          "name",
          "link",
          "about_descriptions",
          "services",
          "google_my_business_ids",
          "client_related_information",
          "tone_for_blogs",
          "tone_for_articles",
          "amazon_about_id",
          "amazon_services_id",
          "amazon_google_my_business_descriptions",
          "amazon_google_my_business_id",
          "amazon_tone_for_blogs",
          "amazon_tone_for_articles",
          "amazon_project_id",
          "errors",
          "status",
        ];
        fieldsToSet.forEach((field) => {
          if (clientData[field] !== undefined) {
            setValue(field, clientData[field]);
          }
        });

        setValue("date", clientData.date);
        setValue("last_update_date", new Date().toISOString());
      } catch (err) {
        console.error("Fetch error:", err); // Debug log
        if (err.response?.status === 400) {
          toast.error("Invalid client ID format");
        } else if (err.response?.status === 404) {
          toast.error("Client not found");
        } else {
          toast.error("Failed to load client data");
        }

      } finally {
        setIsLoading(false);
      }
    };
    fetchClient();
  }, [id, setValue, navigate]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        last_update_date: new Date().toISOString(),
      };

      await updateClient(id, payload);
      toast.success("Client updated!");
      setTimeout(() => navigate("/clients"), 1000);
    } catch (err) {
      if (err.response?.data?.detail) {
        const errorDetails = Array.isArray(err.response.data.detail)
          ? err.response.data.detail
          : [{ loc: ["unknown"], msg: err.response.data.detail }];

        errorDetails.forEach((error) => {
          const fieldName =
            error.loc && error.loc.length > 0
              ? error.loc[error.loc.length - 1]
              : "unknown";
          const errorMessage = error.msg || "Unknown error";

          if (
            [
              "amazon_about_id",
              "amazon_services_id",
              "amazon_google_my_business_descriptions",
              "amazon_google_my_business_id",
              "amazon_tone_for_blogs",
              "amazon_tone_for_articles",
              "amazon_project_id",
              "errors",
              "date",
              "last_update_date",
              "status",
            ].includes(fieldName)
          ) {
            toast.error(`Server error: ${errorMessage}`);
          } else if (fieldName === "unknown") {
            toast.error(` ${errorMessage}`);
          } else {
            setError(fieldName, {
              type: "server",
              message: errorMessage,
            });
          }
        });

        toast.error("Validation errors occurred. Check the highlighted fields.");
      } else {
        toast.error("Failed to update client");
        console.error("Update error:", err);
      }
    }
  };

  const visibleFields = [
    { name: "name", label: "Name", required: true, type: "text" },
    { name: "link", label: "Link", required: true, type: "text" },
    {
      name: "about_descriptions",
      label: "About Descriptions",
      required: true,
      type: "textarea",
    },
    { name: "services", label: "Services", required: true, type: "textarea" },
    {
      name: "google_my_business_ids",
      label: "Google Business IDs",
      required: true,
      type: "textarea",
    },
    {
      name: "client_related_information",
      label: "Client Related Information",
      required: true,
      type: "textarea",
    },
    {
      name: "tone_for_blogs",
      label: "Tone For Blogs",
      required: true,
      type: "textarea",
    },
    {
      name: "tone_for_articles",
      label: "Tone For Articles",
      required: true,
      type: "textarea",
    },
  ];

  const hiddenFields = [
    "amazon_about_id",
    "amazon_services_id",
    "amazon_google_my_business_descriptions",
    "amazon_google_my_business_id",
    "amazon_tone_for_blogs",
    "amazon_tone_for_articles",
    "amazon_project_id",
    "errors",
    "date",
    "last_update_date",
    "status",
  ];

  return (
    <>
      <div >
        <h1 className="text-4xl font-bold mb-6">Edit Client</h1>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {visibleFields.map(({ name, label, required, type }) => (
              <div key={name}>
                <label className="block font-medium mb-1" htmlFor={name}>
                  {label}
                </label>
                {type === "textarea" ? (
                  <textarea
                    id={name}
                    rows={4}
                    {...register(name, {
                      required: required ? "This field is required" : false,
                    })}
                    className={`w-full border rounded p-2 resize-y focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      errors[name] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
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

            {hiddenFields.map((name) => (
              <input
                key={name}
                type="hidden"
                {...register(name, { required: false })}
              />
            ))}

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded w-full font-bold disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/clients")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded w-full font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
};

export default EditClient;