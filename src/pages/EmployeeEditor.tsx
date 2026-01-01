import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, UserPlus } from "lucide-react";
import { useEmployeesContext } from "@/context/EmployeeContext";
import { EmployeeStatus, Employee } from "@/types/employee";

interface EditorFormState {
  name: string;
  email: string;
  location: string;
  department: string;
  status: EmployeeStatus;
  salary: number;
  projects: number;
  roleId?: string;
}

const EmployeeEditor = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const { addEmployee, updateEmployee, departments, roles, employeeMap } = useEmployeesContext();
  const existingEmployee = employeeId ? employeeMap[employeeId] : undefined;
  const isEditing = Boolean(existingEmployee);

  const defaultDepartment = departments[0]?.name ?? "Engineering";
  const defaultRole = roles.find((role) => role.department === defaultDepartment)?.id;

  const [form, setForm] = useState<EditorFormState>(() =>
    existingEmployee
      ? {
          name: existingEmployee.name,
          email: existingEmployee.email,
          location: existingEmployee.location,
          department: existingEmployee.department,
          status: existingEmployee.status,
          salary: existingEmployee.salary,
          projects: existingEmployee.projects,
          roleId: existingEmployee.roleId
        }
      : {
          name: "",
          email: "",
          location: "Remote",
          department: defaultDepartment,
          status: "Active",
          salary: 120000,
          projects: 1,
          roleId: defaultRole
        }
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(existingEmployee?.avatar ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useEffect(() => {
    if (existingEmployee) {
      setForm({
        name: existingEmployee.name,
        email: existingEmployee.email,
        location: existingEmployee.location,
        department: existingEmployee.department,
        status: existingEmployee.status,
        salary: existingEmployee.salary,
        projects: existingEmployee.projects,
        roleId: existingEmployee.roleId
      });
      setPhotoPreview(existingEmployee.avatar ?? "");
    } else {
      setPhotoPreview("");
    }
    setPhotoFile(null);
    setErrors({});
  }, [existingEmployee]);

  const availableRoles = useMemo(
    () => roles.filter((role) => role.department === form.department),
    [roles, form.department]
  );

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) {
      nextErrors.name = "Full name is required.";
    }
    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!form.location.trim()) {
      nextErrors.location = "Location is required.";
    }
    if (form.salary < 50000) {
      nextErrors.salary = "Salary must be at least 50,000.";
    }
    if (form.projects < 0) {
      nextErrors.projects = "Projects cannot be negative.";
    }
    if (photoFile && photoFile.size > 2 * 1024 * 1024) {
      nextErrors.photo = "Profile image must be 2MB or smaller.";
    }
    return nextErrors;
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setPhotoFile(file ?? null);
    if (!file) {
      setPhotoPreview(existingEmployee?.avatar ?? "");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateForm();
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    const endpoint = isEditing && existingEmployee ? `/api/employees/${existingEmployee.id}` : "/api/employees";
    const method = isEditing && existingEmployee ? "PUT" : "POST";

    const payload = new FormData();
    payload.append("name", form.name.trim());
    payload.append("email", form.email.trim());
    payload.append("location", form.location.trim());
    payload.append("department", form.department);
    payload.append("status", form.status);
    payload.append("salary", String(form.salary));
    payload.append("projects", String(form.projects));
    payload.append("hiredAt", existingEmployee?.hiredAt ?? new Date().toISOString().split("T")[0]);
    if (form.roleId) {
      payload.append("roleId", form.roleId);
    }
    if (photoFile) {
      payload.append("photo", photoFile);
    }
    if (photoPreview) {
      payload.append("avatar", photoPreview);
    }

    try {
      const response = await fetch(endpoint, {
        method,
        body: payload
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      let serverData: Partial<Employee> | null = null;
      try {
        serverData = (await response.json()) as Partial<Employee>;
      } catch {
        serverData = null;
      }

      const sharedDetails = {
        name: form.name.trim(),
        email: form.email.trim(),
        location: form.location.trim(),
        department: form.department,
        status: form.status,
        salary: form.salary,
        projects: form.projects,
        roleId: form.roleId || undefined,
        avatar: (serverData?.avatar as string | undefined) ?? photoPreview ?? existingEmployee?.avatar
      };

      if (isEditing && existingEmployee) {
        updateEmployee({
          ...existingEmployee,
          ...sharedDetails
        });
        navigate(`/employees/${existingEmployee.id}`);
      } else {
        addEmployee({
          ...sharedDetails,
          hiredAt: (serverData?.hiredAt as string | undefined) ?? new Date().toISOString().split("T")[0]
        });
        navigate("/employees");
      }
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : "Unable to save employee.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6" aria-labelledby="editor-heading">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            to={isEditing ? `/employees/${employeeId}` : "/employees"}
            className="inline-flex items-center gap-2 text-sm text-slate-400 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            {isEditing ? "Back to profile" : "Back to directory"}
          </Link>
          <h1 id="editor-heading" className="mt-2 font-display text-3xl text-white">
            {isEditing ? "Edit employee" : "Add employee"}
          </h1>
          <p className="text-sm text-slate-400" id="editor-description">
            Required fields are marked with an asterisk. All controls support keyboard navigation.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-400">
          {isEditing ? <Save size={14} aria-hidden="true" /> : <UserPlus size={14} aria-hidden="true" />}
          <span>{isEditing ? "Update" : "Create"}</span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass-panel space-y-6 px-6 py-6"
        aria-describedby="editor-description"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {[{ label: "Full name", name: "name", type: "text", required: true }, { label: "Email", name: "email", type: "email", required: true }, { label: "Location", name: "location", type: "text", required: true }].map((field) => {
            const fieldError = errors[field.name];
            return (
              <label key={field.name} className="space-y-2 text-sm text-slate-200">
                {field.label}
                {field.required && <span aria-hidden="true"> *</span>}
                <input
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  value={(form as Record<string, string | number | undefined>)[field.name] as string}
                  onChange={(event) => setForm((prev) => ({ ...prev, [field.name]: event.target.value }))}
                  aria-invalid={Boolean(fieldError)}
                  aria-describedby={fieldError ? `${field.name}-error` : undefined}
                  className={`w-full rounded-2xl border bg-slate-900/60 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-brand-300 focus:ring-2 focus:ring-brand-400 focus:outline-none ${
                    fieldError ? "border-rose-400/70" : "border-white/20"
                  }`}
                />
                {fieldError && (
                  <p id={`${field.name}-error`} className="text-xs text-rose-300">
                    {fieldError}
                  </p>
                )}
              </label>
            );
          })}
          <label className="space-y-2 text-sm text-slate-200">
            Department
            <select
              value={form.department}
              onChange={(event) => {
                const nextDepartment = event.target.value;
                const nextRole = roles.find((role) => role.department === nextDepartment)?.id;
                setForm((prev) => ({ ...prev, department: nextDepartment, roleId: nextRole }));
              }}
              className="w-full rounded-2xl border border-white/20 bg-slate-900/60 px-4 py-3 text-base text-white focus:border-brand-300 focus:ring-2 focus:ring-brand-400 focus:outline-none"
            >
              {departments.map((department) => (
                <option key={department.id} value={department.name} className="text-slate-900">
                  {department.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            Status
            <select
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as EmployeeStatus }))}
              className="w-full rounded-2xl border border-white/20 bg-slate-900/60 px-4 py-3 text-base text-white focus:border-brand-300 focus:ring-2 focus:ring-brand-400 focus:outline-none"
            >
              {["Active", "On Leave", "Inactive"].map((status) => (
                <option key={status} value={status} className="text-slate-900">
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            Annual salary (USD)
            <input
              type="number"
              min={50000}
              max={400000}
              step={1000}
              value={form.salary}
              onChange={(event) => setForm((prev) => ({ ...prev, salary: Number(event.target.value) }))}
              aria-invalid={Boolean(errors.salary)}
              aria-describedby={errors.salary ? "salary-error" : undefined}
              className={`w-full rounded-2xl border bg-slate-900/60 px-4 py-3 text-base text-white focus:border-brand-300 focus:ring-2 focus:ring-brand-400 focus:outline-none ${
                errors.salary ? "border-rose-400/70" : "border-white/20"
              }`}
            />
            {errors.salary && (
              <p id="salary-error" className="text-xs text-rose-300">
                {errors.salary}
              </p>
            )}
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            Active projects
            <input
              type="number"
              min={0}
              max={12}
              value={form.projects}
              onChange={(event) => setForm((prev) => ({ ...prev, projects: Number(event.target.value) }))}
              aria-invalid={Boolean(errors.projects)}
              aria-describedby={errors.projects ? "projects-error" : undefined}
              className={`w-full rounded-2xl border bg-slate-900/60 px-4 py-3 text-base text-white focus:border-brand-300 focus:ring-2 focus:ring-brand-400 focus:outline-none ${
                errors.projects ? "border-rose-400/70" : "border-white/20"
              }`}
            />
            {errors.projects && (
              <p id="projects-error" className="text-xs text-rose-300">
                {errors.projects}
              </p>
            )}
          </label>
          <label className="space-y-2 text-sm text-slate-200 md:col-span-2">
            Role & permissions
            <select
              value={form.roleId ?? ""}
              onChange={(event) => setForm((prev) => ({ ...prev, roleId: event.target.value }))}
              className="w-full rounded-2xl border border-white/20 bg-slate-900/60 px-4 py-3 text-base text-white focus:border-brand-300 focus:ring-2 focus:ring-brand-400 focus:outline-none"
            >
              <option value="" className="text-slate-900">
                Assign later
              </option>
              {availableRoles.map((role) => (
                <option key={role.id} value={role.id} className="text-slate-900">
                  {role.title} · {role.permission}
                </option>
              ))}
            </select>
            {availableRoles.length === 0 && (
              <p className="text-xs text-amber-300">No roles available for this department yet.</p>
            )}
          </label>
        </div>
        <div className="space-y-3 rounded-2xl border border-dashed border-white/15 bg-slate-900/40 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-900/60">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Selected profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs text-slate-500">No photo</span>
              )}
            </div>
            <div className="space-y-2 text-sm text-slate-200">
              <p className="font-medium">Profile image</p>
              <p className="text-xs text-slate-400">JPEG or PNG, up to 2MB.</p>
              <div className="flex items-center gap-3">
                <label
                  htmlFor="employee-photo"
                  className="inline-flex cursor-pointer items-center rounded-2xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-white"
                >
                  Choose image
                </label>
                <input
                  id="employee-photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="sr-only"
                  aria-describedby={errors.photo ? "photo-error" : undefined}
                />
                {photoFile && (
                  <span className="text-xs text-slate-400" aria-live="polite">
                    {photoFile.name}
                  </span>
                )}
              </div>
              {errors.photo && (
                <p id="photo-error" className="text-xs text-rose-300">
                  {errors.photo}
                </p>
              )}
            </div>
          </div>
        </div>
        {submissionError && (
          <div
            role="alert"
            aria-live="assertive"
            className="rounded-2xl border border-rose-400/50 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
          >
            {submissionError}
          </div>
        )}
        <div className="flex flex-wrap gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-300 px-6 py-3 text-base font-semibold text-white shadow-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              isSubmitting ? "opacity-70" : "hover:opacity-90"
            }`}
            aria-busy={isSubmitting}
          >
            <Save size={18} aria-hidden="true" />
            {isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Create employee"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-white/20 px-5 py-3 text-base font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
};

export default EmployeeEditor;
