import { useEffect, useMemo, useState } from 'react';

const defaultBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:2800';
const defaultPassword = import.meta.env.VITE_API_PASSWORD || 'team007';

const emptyMessage = { type: 'idle', text: '' };

const parseCollection = (payload, key) => {
  if (Array.isArray(payload)) return payload;
  if (payload?._embedded?.[key]) return payload._embedded[key];
  return [];
};

const SectionCard = ({ title, description, children, actions }) => (
  <section className="bg-white/90 shadow-md border border-sky-100 rounded-2xl overflow-hidden backdrop-blur-sm">
    <div className="h-1 w-full bg-gradient-to-r from-sky-400 via-sky-500 to-blue-500" />
    <div className="px-6 py-4 flex items-start justify-between gap-4 border-b border-sky-100 bg-sky-50/60">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 tracking-tight">{title}</h2>
        {description && <p className="mt-1 text-xs text-slate-600">{description}</p>}
      </div>
      {actions && (
        <div className="text-xs text-slate-500 whitespace-nowrap font-medium">
          {actions}
        </div>
      )}
    </div>
    <div className="px-6 py-4 space-y-4 bg-white/80">{children}</div>
  </section>
);

const Input = ({ label, ...props }) => (
  <label className="block text-sm font-medium text-slate-700">
    <span>{label}</span>
    <input
      className="mt-1 w-full rounded-xl border border-sky-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition"
      {...props}
    />
  </label>
);

const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
    <input
      type="checkbox"
      className="h-4 w-4 rounded border-sky-200 text-sky-500 focus:ring-sky-400"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
    <span>{label}</span>
  </label>
);

const Table = ({ headers, rows }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-sky-100 text-sm">
      <thead className="bg-sky-50/80">
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              className="px-4 py-2 text-left font-semibold text-slate-700 uppercase tracking-wide text-xs"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-sky-50">
        {rows.length === 0 && (
          <tr>
            <td
              className="px-4 py-6 text-center text-slate-400 text-sm"
              colSpan={headers.length}
            >
              No data yet. Try creating one above.
            </td>
          </tr>
        )}
        {rows.map((cells, index) => (
          <tr
            key={index}
            className={
              index % 2 === 0
                ? "bg-white hover:bg-sky-50"
                : "bg-sky-50 hover:bg-sky-100"
            }
          >
            {cells.map((cell, idx) => (
              <td
                key={idx}
                className={`px-4 py-3 text-slate-700 ${
                  typeof cell === "number" ? "text-right" : ""
                }`}
              >
                {cell ?? "—"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

function App() {
  const [apiBase, setApiBase] = useState(defaultBaseUrl);
  const [apiPassword, setApiPassword] = useState(defaultPassword);
  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [grades, setGrades] = useState([]);
  const [message, setMessage] = useState(emptyMessage);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [studentForm, setStudentForm] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
  });

  const [moduleForm, setModuleForm] = useState({
    code: '',
    name: '',
    mnc: false,
  });

  const [registrationForm, setRegistrationForm] = useState({
    studentId: '',
    moduleId: '',
  });

  const [gradeForm, setGradeForm] = useState({
    studentId: '',
    moduleId: '',
    score: '',
  });

  const [isStudentSubmitting, setIsStudentSubmitting] = useState(false);
  const [isModuleSubmitting, setIsModuleSubmitting] = useState(false);
  const [isRegistrationSubmitting, setIsRegistrationSubmitting] = useState(false);
  const [isGradeSubmitting, setIsGradeSubmitting] = useState(false);

  const apiClient = useMemo(() => {
    const client = {
      async request(path, options = {}) {
        const response = await fetch(`${apiBase}${path}`, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          ...options,
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(errorBody || response.statusText);
        }

        if (response.status === 204) return null;
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) return response.json();
        return response.text();
      },
    };

    client.get = (path) => client.request(path);
    client.post = (path, body) =>
        client.request(path, {
          method: 'POST',
          body: JSON.stringify(body),
        });
    client.put = (path, body) =>
        client.request(path, {
          method: 'PUT',
          body: JSON.stringify(body),
        });
    client.del = (path, body) =>
        client.request(path, {
          method: 'DELETE',
          body: body ? JSON.stringify(body) : undefined,
        });

    return client;
  }, [apiBase]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(emptyMessage), 4000);
  };

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [studentData, moduleData, registrationData, gradeData] = await Promise.all([
        apiClient.get('/students'),
        apiClient.get('/modules'),
        apiClient.get('/registrations'),
        apiClient.get('/grades'),
      ]);

      setStudents(parseCollection(studentData, 'students'));
      setModules(parseCollection(moduleData, 'modules'));
      setRegistrations(parseCollection(registrationData, 'registrations'));
      setGrades(parseCollection(gradeData, 'grades'));
      showMessage('success', 'Data refreshed successfully');
    } catch (error) {
      console.error(error);
      showMessage('error', `Failed to fetch data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateStudent = async (event) => {
    event.preventDefault();
    setIsStudentSubmitting(true);
    try {
      await apiClient.post('/students', { ...studentForm, password: apiPassword });
      setStudentForm({ firstName: '', lastName: '', userName: '', email: '' });
      showMessage('success', 'Student created successfully');
      loadAll();
    } catch (error) {
      console.error(error);
      showMessage('error', `Failed to create student: ${error.message}`);
    } finally {
      setIsStudentSubmitting(false);
    }
  };

  const handleCreateModule = async (event) => {
    event.preventDefault();
    setIsModuleSubmitting(true);
    try {
      await apiClient.post('/modules', { ...moduleForm, password: apiPassword });
      setModuleForm({ code: '', name: '', mnc: false });
      showMessage('success', 'Module created successfully');
      loadAll();
    } catch (error) {
      console.error(error);
      showMessage('error', `Failed to create module: ${error.message}`);
    } finally {
      setIsModuleSubmitting(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setIsRegistrationSubmitting(true);
    try {
      await apiClient.post('/registrations', {
        studentId: Number(registrationForm.studentId),
        moduleId: Number(registrationForm.moduleId),
        password: apiPassword,
      });
      setRegistrationForm({ studentId: '', moduleId: '' });
      showMessage('success', 'Student registered successfully');
      loadAll();
    } catch (error) {
      console.error(error);
      showMessage('error', `Failed to register student: ${error.message}`);
    } finally {
      setIsRegistrationSubmitting(false);
    }
  };

  const handleGrade = async (event) => {
    event.preventDefault();
    setIsGradeSubmitting(true);
    try {
      await apiClient.post('/grades/upsert', {
        studentId: Number(gradeForm.studentId),
        moduleId: Number(gradeForm.moduleId),
        score: Number(gradeForm.score),
        password: apiPassword,
      });
      setGradeForm({ studentId: '', moduleId: '', score: '' });
      showMessage('success', 'Grade saved successfully');
      loadAll();
    } catch (error) {
      console.error(error);
      showMessage('error', `Failed to save grade: ${error.message}`);
    } finally {
      setIsGradeSubmitting(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 text-slate-900">
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-sky-100 shadow-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
                Awesome University
              </span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-[0.25em]">
                Computer Science
              </span>
            </div>
            <span className="text-xs font-semibold text-sky-700">COMP0010 · Group 007</span>
          </div>

          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 pb-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Student Grades Management System
                </h1>
                <p className="mt-1 text-sm text-slate-600 max-w-2xl">
                  A modern console to manage students, modules, registrations, and grades with ease.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => setIsSettingsOpen(true)}
                    className="rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-sky-200 hover:bg-sky-50"
                >
                  API Settings
                </button>
                <button
                    onClick={loadAll}
                    disabled={isLoading}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-lg shadow-sky-200 focus:ring-2 focus:ring-sky-200 focus:ring-offset-1 ${
                        isLoading
                            ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                            : 'bg-sky-600 text-white hover:bg-sky-700'
                    }`}
                >
                  {isLoading && (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
                  )}
                  {isLoading ? 'Refreshing…' : 'Refresh Data'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {isSettingsOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Connection Settings</h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Modify API base URL and shared password. Changes will be used when you refresh data.
                    </p>
                  </div>
                  <button
                      type="button"
                      onClick={() => setIsSettingsOpen(false)}
                      className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Input
                      label="API Base URL"
                      value={apiBase}
                      onChange={(event) => setApiBase(event.target.value)}
                      placeholder="http://localhost:8080"
                  />
                  <Input
                      label="Shared Password"
                      value={apiPassword}
                      onChange={(event) => setApiPassword(event.target.value)}
                      placeholder="team007"
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                      type="button"
                      onClick={() => setIsSettingsOpen(false)}
                      className="rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-sky-200 hover:bg-sky-50"
                  >
                    Close
                  </button>
                  <button
                      type="button"
                      onClick={() => {
                        setIsSettingsOpen(false);
                        loadAll();
                      }}
                      className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sky-200 hover:bg-sky-700 focus:ring-2 focus:ring-sky-200 focus:ring-offset-1"
                  >
                    Save &amp; Refresh
                  </button>
                </div>
              </div>
            </div>
        )}

        <main className="mx-auto max-w-6xl px-6 py-8 space-y-6">
          {message.type !== 'idle' && (
              <div
                  className={`rounded-lg border px-4 py-3 text-sm ${
                      message.type === 'success'
                          ? 'border-green-200 bg-green-50 text-green-700'
                          : 'border-rose-200 bg-rose-50 text-rose-700'
                  }`}
              >
                {message.text}
              </div>
          )}

          <div className="grid gap-4 md:grid-cols-4">
            {[{
              label: 'Students',
              value: students.length,
            }, {
              label: 'Modules',
              value: modules.length,
            }, {
              label: 'Registrations',
              value: registrations.length,
            }, {
              label: 'Grades',
              value: grades.length,
            }].map((item) => (
              <div key={item.label} className="rounded-2xl border border-sky-100 bg-white/90 px-4 py-3 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
                <p className="mt-1 text-2xl font-semibold text-sky-700">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
                title="Student Management"
                description="Create students or view the current student list."
                actions="POST /students"
            >
              <form onSubmit={handleCreateStudent} className="grid gap-3 md:grid-cols-4">
                <Input
                    label="First Name"
                    value={studentForm.firstName}
                    onChange={(event) =>
                        setStudentForm({ ...studentForm, firstName: event.target.value })
                    }
                    required
                />
                <Input
                    label="Last Name"
                    value={studentForm.lastName}
                    onChange={(event) =>
                        setStudentForm({ ...studentForm, lastName: event.target.value })
                    }
                    required
                />
                <Input
                    label="Username"
                    value={studentForm.userName}
                    onChange={(event) =>
                        setStudentForm({ ...studentForm, userName: event.target.value })
                    }
                    required
                />
                <Input
                    label="Email"
                    type="email"
                    value={studentForm.email}
                    onChange={(event) =>
                        setStudentForm({ ...studentForm, email: event.target.value })
                    }
                    required
                />
                <div className="md:col-span-4 flex justify-end">
                  <button
                      type="submit"
                      disabled={isStudentSubmitting}
                      className={`rounded-full px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sky-200 focus:ring-2 focus:ring-sky-200 focus:ring-offset-1 ${
                          isStudentSubmitting
                              ? 'bg-slate-300 cursor-not-allowed'
                              : 'bg-sky-600 hover:bg-sky-700'
                      }`}
                  >
                    {isStudentSubmitting ? 'Creating…' : 'Create Student'}
                  </button>
                </div>
              </form>
              <Table
                  headers={['ID', 'First', 'Last', 'Username', 'Email']}
                  rows={students.map((student) => [
                    student.id,
                    student.firstName,
                    student.lastName,
                    student.userName,
                    student.email,
                  ])}
              />
            </SectionCard>

            <SectionCard
                title="Module Management"
                description="Create modules and view existing modules."
                actions="POST /modules"
            >
              <form onSubmit={handleCreateModule} className="grid gap-3 md:grid-cols-3">
                <Input
                    label="Module Code"
                    value={moduleForm.code}
                    onChange={(event) =>
                        setModuleForm({ ...moduleForm, code: event.target.value })
                    }
                    required
                />
                <Input
                    label="Module Name"
                    value={moduleForm.name}
                    onChange={(event) =>
                        setModuleForm({ ...moduleForm, name: event.target.value })
                    }
                    required
                />
                <div className="flex items-end">
                  <Toggle
                      label="Mandatory module (mnc)"
                      checked={moduleForm.mnc}
                      onChange={(checked) =>
                          setModuleForm({ ...moduleForm, mnc: checked })
                      }
                  />
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <button
                      type="submit"
                      disabled={isModuleSubmitting}
                      className={`rounded-full px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sky-200 focus:ring-2 focus:ring-sky-200 focus:ring-offset-1 ${
                          isModuleSubmitting
                              ? 'bg-slate-300 cursor-not-allowed'
                              : 'bg-sky-600 hover:bg-sky-700'
                      }`}
                  >
                    {isModuleSubmitting ? 'Creating…' : 'Create Module'}
                  </button>
                </div>
              </form>
              <Table
                  headers={['ID', 'Code', 'Name', 'Type']}
                  rows={modules.map((module) => [
                    module.id,
                    module.code,
                    module.name,
                    module.mnc ? (
                        <span className="inline-flex items-center rounded-full bg-sky-600 px-2 py-0.5 text-xs font-medium text-white shadow-sm">
                          Core
                        </span>
                    ) : (
                        <span className="inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">
                          Optional
                        </span>
                    ),
                  ])}
              />
            </SectionCard>

            <SectionCard
                title="Registration Management"
                description="Register students to modules, or deregister them (DELETE /registrations)."
                actions="POST /registrations"
            >
              <form onSubmit={handleRegister} className="grid gap-3 md:grid-cols-3">
                <Input
                    label="Student ID"
                    value={registrationForm.studentId}
                    onChange={(event) =>
                        setRegistrationForm({ ...registrationForm, studentId: event.target.value })
                    }
                    required
                />
                <Input
                    label="Module ID"
                    value={registrationForm.moduleId}
                    onChange={(event) =>
                        setRegistrationForm({ ...registrationForm, moduleId: event.target.value })
                    }
                    required
                />
                <div className="flex items-end">
                  <button
                      type="submit"
                      disabled={isRegistrationSubmitting}
                      className={`w-full rounded-full px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sky-200 focus:ring-2 focus:ring-sky-200 focus:ring-offset-1 ${
                          isRegistrationSubmitting
                              ? 'bg-slate-300 cursor-not-allowed'
                              : 'bg-sky-600 hover:bg-sky-700'
                      }`}
                  >
                    {isRegistrationSubmitting ? 'Registering…' : 'Register Student'}
                  </button>
                </div>
              </form>
              <Table
                  headers={['ID', 'Student ID', 'Module ID']}
                  rows={registrations.map((registration) => [
                    registration.id,
                    registration.student?.id,
                    registration.module?.id,
                  ])}
              />
            </SectionCard>

            <SectionCard
                title="Grade Management"
                description="Insert or update grades via /grades/upsert."
                actions="POST /grades/upsert"
            >
              <form onSubmit={handleGrade} className="grid gap-3 md:grid-cols-4">
                <Input
                    label="Student ID"
                    value={gradeForm.studentId}
                    onChange={(event) =>
                        setGradeForm({ ...gradeForm, studentId: event.target.value })
                    }
                    required
                />
                <Input
                    label="Module ID"
                    value={gradeForm.moduleId}
                    onChange={(event) =>
                        setGradeForm({ ...gradeForm, moduleId: event.target.value })
                    }
                    required
                />
                <Input
                    label="Score"
                    type="number"
                    min="0"
                    max="100"
                    value={gradeForm.score}
                    onChange={(event) =>
                        setGradeForm({ ...gradeForm, score: event.target.value })
                    }
                    required
                />
                <div className="flex items-end">
                  <button
                      type="submit"
                      disabled={isGradeSubmitting}
                      className={`w-full rounded-full px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sky-200 focus:ring-2 focus:ring-sky-200 focus:ring-offset-1 ${
                          isGradeSubmitting
                              ? 'bg-slate-300 cursor-not-allowed'
                              : 'bg-sky-600 hover:bg-sky-700'
                      }`}
                  >
                    {isGradeSubmitting ? 'Saving…' : 'Save Grade'}
                  </button>
                </div>
              </form>
              <Table
                  headers={['ID', 'Student', 'Module', 'Score']}
                  rows={grades.map((grade) => [
                    grade.id,
                    grade.student?.id,
                    grade.module?.id,
                    grade.score,
                  ])}
              />
            </SectionCard>
          </div>
        </main>
      </div>
  );
}

export default App;
