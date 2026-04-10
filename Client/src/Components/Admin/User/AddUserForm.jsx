import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { X, ArrowRight, ArrowLeft } from "lucide-react";

const steps = ["Basic", "Work", "Leaves", "Other"];

const AddUserForm = ({
  isOpen,
  onClose,
  onSave,
  departments,
  designations,
}) => {
  const [step, setStep] = useState(0);
  const modalRef = useRef();

  // Close outside
  useEffect(() => {
    const handleClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  if (!isOpen) return null;

  // Validation per step
  const validationSchemas = [
    Yup.object({
      name: Yup.string().min(2).required("Required"),
      email: Yup.string().email().required("Required"),
      password: Yup.string().min(3).required("Required"),
      mobileNo: Yup.string().min(10).required("Required"),
    }),

    Yup.object({
      dept: Yup.string().required("Required"),
      designation: Yup.string().required("Required"),
    }),

    Yup.object({
      CL: Yup.number().min(0).max(30),
      SL: Yup.number().min(0).max(30),
      PL: Yup.number().min(0).max(30),
      LOP: Yup.number().min(0).max(30),
    }),

    Yup.object({
      gender: Yup.string().required("Required"),
      salary: Yup.number().min(0),
      accNo: Yup.string().required("Required"),
    }),
  ];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-3xl rounded-2xl shadow-lg p-6"
      >
        {/* Header */}
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold text-lg">Add User</h2>
          <X onClick={onClose} className="cursor-pointer" />
        </div>

        {/* Step Indicator */}
        <div className="flex gap-2 mb-4">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`flex-1 text-center py-1 rounded-lg text-sm ${
                i === step
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            mobileNo: "",
            address: "",
            profilePic: "",
            dept: "",
            designation: "",
            CL: 10,
            SL: 8,
            PL: 15,
            LOP: 0,
            gender: "",
            salary: "",
            accNo: "",
            ifsc: "",
            activeStatus: true,
          }}
          validationSchema={validationSchemas[step]}
          onSubmit={(values) => {
            const payload = {
              ...values,
              bank: { accNo: values.accNo, ifsc: values.ifsc },
              leaves: {
                CL: { total: values.CL },
                SL: { total: values.SL },
                PL: { total: values.PL },
                LOP: { total: values.LOP },
              },
            };
            onSave(payload);
          }}
        >
          {({ values }) => (
<Form className="space-y-6">

  {/* STEP 1 - BASIC */}
  {step === 0 && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <Input name="name" placeholder="Full Name" icon="👤" />
      <Input name="email" placeholder="Email Address" icon="📧" />
      <Input name="password" placeholder="Password" icon="🔒" />
      <Input name="mobileNo" placeholder="Mobile Number" icon="📱" />

      {/* Address */}
      <div className="md:col-span-2">
        <Field
          as="textarea"
          name="address"
          placeholder="Full Address"
          className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 
          focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
        />
        <ErrorMessage name="address" component="div" className="text-red-500 text-xs" />
      </div>

      {/* Profile Upload */}
      <div className="md:col-span-2">
        <label className="text-sm font-medium text-gray-600 mb-1 block">
          Profile Picture
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFieldValue("profilePic", e.target.files[0])
          }
          className="text-sm border border-gray-200 rounded-xl p-2 w-full bg-gray-50"
        />
      </div>

    </div>
  )}

  {/* STEP 2 - WORK */}
  {step === 1 && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <Select name="dept">
        <option value="">Select Department</option>
        {departments.map((d) => (
          <option key={d._id} value={d._id}>{d.deptName}</option>
        ))}
      </Select>

      <Select name="designation">
        <option value="">Select Designation</option>
        {designations.map((d) => (
          <option key={d._id} value={d._id}>{d.desigName}</option>
        ))}
      </Select>

    </div>
  )}

  {/* STEP 3 - LEAVES */}
  {step === 2 && (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {["CL", "SL", "PL", "LOP"].map((l) => (
        <Select key={l} name={l}>
          {[...Array(31).keys()].map((n) => (
            <option key={n} value={n}>{l} - {n}</option>
          ))}
        </Select>
      ))}
    </div>
  )}

  {/* STEP 4 - OTHER */}
  {step === 3 && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <Select name="gender">
        <option value="">Gender</option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
        <option value="OTHER">Other</option>
      </Select>

      <Input name="salary" placeholder="Salary" icon="💰" />

      <Input name="accNo" placeholder="Account Number" icon="🏦" />
      <Input name="ifsc" placeholder="IFSC Code" />

      {/* Active Toggle */}
      <div className="flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2">
        <span className="text-sm text-gray-600">Active Status</span>

        <Field name="activeStatus">
          {({ field, form }) => (
            <button
              type="button"
              onClick={() => form.setFieldValue("activeStatus", !field.value)}
              className={`w-10 h-5 flex items-center rounded-full p-1 transition ${
                field.value ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
                  field.value ? "translate-x-5" : ""
                }`}
              />
            </button>
          )}
        </Field>
      </div>

    </div>
  )}

  {/* Buttons */}
  <div className="flex justify-between pt-4 border-t border-gray-100">

    {step > 0 && (
      <button
        type="button"
        onClick={() => setStep(step - 1)}
        className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-100 transition"
      >
        Back
      </button>
    )}

    {step < steps.length - 1 ? (
      <button
        type="button"
        onClick={() => setStep(step + 1)}
        className="ml-auto px-5 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Next
      </button>
    ) : (
      <button
        type="submit"
        className="ml-auto px-5 py-2 text-sm rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
      >
        Save User
      </button>
    )}
  </div>

</Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

// Input
const Input = ({ name, icon, ...props }) => (
  <div className="relative">
    {icon && (
      <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
        {icon}
      </span>
    )}
    <Field
      name={name}
      {...props}
      className={`w-full ${icon ? "pl-9" : "pl-3"} pr-3 py-2 text-sm 
      border border-gray-200 rounded-xl bg-gray-50 
      focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none`}
    />
    <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
  </div>
);

// Select
const Select = ({ name, children }) => (
  <div>
    <Field as="select" name={name} className="w-full px-3 py-2 border rounded-xl">
      {children}
    </Field>
    <ErrorMessage name={name} component="div" className="text-red-500 text-xs" />
  </div>
);

export default AddUserForm;