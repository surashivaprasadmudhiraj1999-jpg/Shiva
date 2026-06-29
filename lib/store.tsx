"use client";

import * as React from "react";
import type {
  Project,
  Task,
  Keyword,
  ContentBrief,
  SchemaDraft,
  Competitor,
  AIPrompt,
  AIVisibilityReview,
  Integration,
  Report,
  Role,
  User,
} from "./types";
import {
  demoProjects,
  demoTasks,
  demoKeywords,
  demoBriefs,
  demoSchemas,
  demoCompetitors,
  demoPrompts,
  demoReviews,
  demoIntegrations,
  demoReports,
  demoUsers,
  demoOrg,
  SAMPLE_PROJECT_ID,
} from "./demo-data";

interface State {
  projects: Project[];
  tasks: Task[];
  keywords: Keyword[];
  briefs: ContentBrief[];
  schemas: SchemaDraft[];
  competitors: Competitor[];
  prompts: AIPrompt[];
  reviews: AIVisibilityReview[];
  integrations: Integration[];
  reports: Report[];
  currentProjectId: string;
  currentUserId: string;
  dateRange: string;
}

const initialState: State = {
  projects: demoProjects,
  tasks: demoTasks,
  keywords: demoKeywords,
  briefs: demoBriefs,
  schemas: demoSchemas,
  competitors: demoCompetitors,
  prompts: demoPrompts,
  reviews: demoReviews,
  integrations: demoIntegrations,
  reports: demoReports,
  currentProjectId: SAMPLE_PROJECT_ID,
  currentUserId: demoUsers[0].id,
  dateRange: "Last 28 days",
};

type Action =
  | { type: "HYDRATE"; state: State }
  | { type: "SET_PROJECT"; id: string }
  | { type: "SET_USER"; id: string }
  | { type: "SET_DATE_RANGE"; value: string }
  | { type: "ADD_PROJECT"; project: Project }
  | { type: "ADD_TASK"; task: Task }
  | { type: "UPDATE_TASK"; id: string; patch: Partial<Task> }
  | { type: "ADD_KEYWORDS"; keywords: Keyword[] }
  | { type: "UPDATE_KEYWORD"; id: string; patch: Partial<Keyword> }
  | { type: "DELETE_KEYWORD"; id: string }
  | { type: "ADD_BRIEF"; brief: ContentBrief }
  | { type: "UPDATE_BRIEF"; id: string; patch: Partial<ContentBrief> }
  | { type: "ADD_SCHEMA"; schema: SchemaDraft }
  | { type: "UPDATE_SCHEMA"; id: string; patch: Partial<SchemaDraft> }
  | { type: "ADD_COMPETITOR"; competitor: Competitor }
  | { type: "ADD_PROMPT"; prompt: AIPrompt }
  | { type: "UPDATE_PROMPT"; id: string; patch: Partial<AIPrompt> }
  | { type: "ADD_REVIEW"; review: AIVisibilityReview }
  | { type: "UPDATE_INTEGRATION"; id: string; patch: Partial<Integration> }
  | { type: "ADD_REPORT"; report: Report };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      return action.state;
    case "SET_PROJECT":
      return { ...state, currentProjectId: action.id };
    case "SET_USER":
      return { ...state, currentUserId: action.id };
    case "SET_DATE_RANGE":
      return { ...state, dateRange: action.value };
    case "ADD_PROJECT":
      return { ...state, projects: [action.project, ...state.projects], currentProjectId: action.project.id };
    case "ADD_TASK":
      return { ...state, tasks: [action.task, ...state.tasks] };
    case "UPDATE_TASK":
      return { ...state, tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, ...action.patch } : t)) };
    case "ADD_KEYWORDS":
      return { ...state, keywords: [...action.keywords, ...state.keywords] };
    case "UPDATE_KEYWORD":
      return { ...state, keywords: state.keywords.map((k) => (k.id === action.id ? { ...k, ...action.patch } : k)) };
    case "DELETE_KEYWORD":
      return { ...state, keywords: state.keywords.filter((k) => k.id !== action.id) };
    case "ADD_BRIEF":
      return { ...state, briefs: [action.brief, ...state.briefs] };
    case "UPDATE_BRIEF":
      return { ...state, briefs: state.briefs.map((b) => (b.id === action.id ? { ...b, ...action.patch } : b)) };
    case "ADD_SCHEMA":
      return { ...state, schemas: [action.schema, ...state.schemas] };
    case "UPDATE_SCHEMA":
      return { ...state, schemas: state.schemas.map((s) => (s.id === action.id ? { ...s, ...action.patch } : s)) };
    case "ADD_COMPETITOR":
      return { ...state, competitors: [action.competitor, ...state.competitors] };
    case "ADD_PROMPT":
      return { ...state, prompts: [action.prompt, ...state.prompts] };
    case "UPDATE_PROMPT":
      return { ...state, prompts: state.prompts.map((p) => (p.id === action.id ? { ...p, ...action.patch } : p)) };
    case "ADD_REVIEW":
      return { ...state, reviews: [action.review, ...state.reviews] };
    case "UPDATE_INTEGRATION":
      return { ...state, integrations: state.integrations.map((i) => (i.id === action.id ? { ...i, ...action.patch } : i)) };
    case "ADD_REPORT":
      return { ...state, reports: [action.report, ...state.reports] };
    default:
      return state;
  }
}

const STORAGE_KEY = "searchos_state_v1";

interface StoreContextValue extends State {
  dispatch: React.Dispatch<Action>;
  currentProject: Project;
  currentUser: User;
  role: Role;
  org: typeof demoOrg;
  users: User[];
}

const StoreContext = React.createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as State;
        // Ensure sample/demo data is always present alongside user data.
        dispatch({ type: "HYDRATE", state: { ...initialState, ...parsed } });
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const currentProject = state.projects.find((p) => p.id === state.currentProjectId) ?? state.projects[0];
  const currentUser = demoUsers.find((u) => u.id === state.currentUserId) ?? demoUsers[0];

  const value: StoreContextValue = {
    ...state,
    dispatch,
    currentProject,
    currentUser,
    role: currentUser.role,
    org: demoOrg,
    users: demoUsers,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

/** Convenience: scoped selectors for the active project. */
export function useProjectData() {
  const s = useStore();
  const pid = s.currentProjectId;
  return {
    tasks: s.tasks.filter((t) => t.projectId === pid),
    keywords: s.keywords.filter((k) => k.projectId === pid),
    briefs: s.briefs.filter((b) => b.projectId === pid),
    schemas: s.schemas.filter((x) => x.projectId === pid),
    competitors: s.competitors.filter((c) => c.projectId === pid),
    prompts: s.prompts.filter((p) => p.projectId === pid),
    reviews: s.reviews.filter((r) => r.projectId === pid),
    integrations: s.integrations.filter((i) => i.projectId === pid),
    reports: s.reports.filter((r) => r.projectId === pid),
  };
}

export const canEdit = (role: Role) => role === "Owner" || role === "Editor";
