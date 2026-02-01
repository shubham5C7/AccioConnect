import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getInitialState, handleFeildChange } from "../constants";

const DynamicForm = ({ schema, onSubmit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = useSelector((state) => state.theme.isDark);

  const [formData, setFormData] = useState(() => getInitialState(schema));
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  // Helper function to check if field should be shown
  const shouldShowField = (field) => {
    if (!field.showWhen) return true;
    const { field: dependentField, value: expectedValue } = field.showWhen;
    return formData[dependentField] === expectedValue;
  };

  // Handle change
  const handleChange = (e, field) => {
    handleFeildChange(e, field, formData, setFormData, setFileName);
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Required validation
    for (let field of schema.fields) {
      if (field.required && shouldShowField(field) && !formData[field.name]) {
        setError(`${field.label} is required`);
        return;
      }
    }
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    const formDataToSend = new FormData();
    schema.fields.forEach((field) => {
      if (!field.uiOnly && shouldShowField(field)) {
        formDataToSend.append(field.name, formData[field.name]);
      }
    });
    onSubmit(formDataToSend);
  };

  return (
    <div className="flex justify-center w-full">
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-xl h-[90vh] rounded-2xl p-4 flex flex-col ${isDark ? "bg-gray-800 text-white ring-1 ring-gray-700 shadow-[0_20px_50px_rgba(0,0,0,0.7)]" : "bg-white text-gray-900 ring-1 ring-gray-200 shadow-[0_20px_40px_rgba(0,0,0,0.15)]"}`}
      >
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center mb-4 flex-shrink-0">
          {" "}
          Create Account{" "}
        </h2>
        {/* Scrollable Grid for fields */}
        <div
          className="flex-1 overflow-y-auto pr-2 mb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {schema.fields.map((field) => {
              // Check if field should be shown
              if (!shouldShowField(field)) return null;
              return (
                <div
                  key={field.name}
                  className={`flex flex-col gap-1 ${
                    field.type === "file" ? "md:col-span-2" : ""
                  }`}
                >
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    {field.label}{" "}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>

                  {/* INPUT */}
                  {field.type !== "select" &&
                    field.type !== "file" &&
                    field.type !== "checkbox" && (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleChange(e, field)}
                        className={`w-full border border-gray-300 rounded-lg px-6 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark
                            ? "bg-gray-700 text-white"
                            : "bg-white text-gray-900"
                        }`}
                      />
                    )}

                  {/* SELECT */}
                  {field.type === "select" && (
                    <select
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleChange(e, field)}
                      className={`w-full border border-gray-300 rounded-lg px-6 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark
                          ? "bg-gray-700 text-white"
                          : "bg-white text-gray-900"
                      }`}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((opt) =>
                        typeof opt === "string" ? (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ) : (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ),
                      )}
                    </select>
                  )}

                  {/* FILE */}
                  {field.type === "file" && (
                    <div className="space-y-2">
                      <input
                        type="file"
                        name={field.name}
                        accept="image/*"
                        onChange={(e) => handleChange(e, field)}
                        className={`w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:cursor-pointer ${
                          isDark? "file:bg-blue-600 file:text-white hover:file:bg-blue-700"  : "file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"}`}/>
                        {fileName && (
                        <p className="text-xs text-gray-500 mt-1">
                          Selected: {fileName}
                        </p>
                      )}
                    </div>
                  )}

                  {/* CHECKBOX / TOGGLE */}
                  {field.type === "checkbox" && (
                    <div className="flex items-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name={field.name}
                          checked={formData[field.name] || false}
                          onChange={(e) => handleChange(e, field)}
                          className="sr-only"
                        />
                        <div
                          className={`w-12 h-6 rounded-full transition-colors duration-300 ${formData[field.name] ? "bg-blue-600" : "bg-gray-300"}`}
                        />
                        <span
                          className={`absolute left-1 top-1 w-5 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${formData[field.name] ? "translate-x-6" : "translate-x-0"}`}
                        />
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Fixed Bottom Section */}
        <div className="flex-shrink-0">
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm mb-3">
              {error}
            </div>
          )}
          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition mb-3">
            Submit
          </button>

          {/* Toggle route */}
          {schema.toggleRoute && schema.toggleLinkText && (
            <p className="text-center text-sm">
              {schema.toggleText || "Already have an account?"}{" "}
              <span
                className={`hover:text-blue-500 cursor-pointer font-medium ${isDark ? "text-white" : "text-blue-600"}`}
                onClick={() => navigate(schema.toggleRoute)}>
                {schema.toggleLinkText}
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
export default DynamicForm;
