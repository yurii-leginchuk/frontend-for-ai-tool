import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createClient } from "../api/client.js";
import {validatePrompt, validateKeywords} from "../utils/index.js";


const AddClient = () => {
    const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const now = new Date().toISOString();

      const keywordsList = data.keywords
        .split(",")
        .map((kw) => kw.trim())
        .filter((kw) => kw.length > 0);

      const payload = {
        ...data,
          keywords: keywordsList,
        date: now,
        last_update_date: now,
        status: "draft",
      };

      await createClient(payload);
      toast.success("Client saved!");
      reset();
    } catch (err) {
      if (err.response?.data?.detail) {
        const errorDetails = err.response.data.detail;

        errorDetails.forEach((error) => {
          const fieldName = error.loc[error.loc.length - 1];
          const errorMessage = error.msg;

          // Handle errors for hidden fields via toast
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
          } else {
            setError(fieldName, {
              type: "server",
              message: errorMessage,
            });
          }
        });

        toast.error("Validation errors occurred. Check the highlighted fields.");
      } else {
        toast.error("Failure to save");
        console.error(err);
      }
    }
  };

  // Visible fields
  const visibleFields = [
    { name: "name", label: "Name", required: true, textarea: false },
    { name: "link", label: "Link", required: true, textarea: false },
    { name: "about_descriptions", label: "About Descriptions", required: true, textarea: true },
    { name: "services", label: "Services", required: true, textarea: true },
    { name: "google_my_business_ids", label: "Google Business IDs", required: true, textarea: true },
    { name: "client_related_information", label: "Client Related Information", required: true, textarea: true },
    { name: "tone_for_blogs", label: "Tone For Blogs", required: true, textarea: true },
    { name: "tone_for_articles", label: "Tone For Articles", required: true, textarea: true },
    { name: "chatgpt_prompt", label: "Chat GPT Prompt", required: true, textarea: true },
    { name: "deepseek_prompt", label: "Deepseek Prompt", required: true, textarea: true },
    { name: "keywords", label: "Keywords (separate keywords with an ex comma: kw1,kw2,kw3)", required: true, textarea: false },
  ];

  // Hidden fields (non-required)
  const hiddenFields = [
    { name: "amazon_about_id" },
    { name: "amazon_services_id" },
    { name: "amazon_google_my_business_descriptions" },
    { name: "amazon_google_my_business_id" },
    { name: "amazon_tone_for_blogs" },
    { name: "amazon_tone_for_articles" },
    { name: "amazon_project_id" },
    { name: "errors" }
  ];

  return (
    <>
      <div

      >
        <h1 className="text-4xl font-bold mb-6">Add Client</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Visible fields */}
          {visibleFields.map(({ name, label, required, textarea }) => (
            <div key={name}>
              <label className="block font-medium mb-1" htmlFor={name}>
                {label}
              </label>
              {textarea ? (
                <textarea
                  id={name}
                  rows={4}
                  {...register(name, {
                    required: required ? "This field is required" : false,
                    validate:
                      name === "chatgpt_prompt" || name === "deepseek_prompt"
                        ? validatePrompt
                        : undefined,
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
                    validate: name === "keywords" ? validateKeywords : undefined,
                  })}
                  className={`w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    errors[name] ? "border-red-500" : "border-gray-300"
                  }`}
                />
              )}
              {errors[name] && (
                <p className="text-sm text-red-600 mt-1">
                  {errors[name].message || "This field is required"}
                </p>
              )}
            </div>
          ))}

          {/* Hidden fields */}
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

export default AddClient;