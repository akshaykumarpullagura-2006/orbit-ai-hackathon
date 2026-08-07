import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  fetchHistoryFromFastApi,
  fetchResultsFromFastApi,
  deleteWorkflowFromFastApi,
  rerunWorkflowInFastApi,
  fetchAnalyticsFromFastApi,
  fetchApiKeysFromFastApi,
  createApiKeyInFastApi,
  deleteApiKeyInFastApi,
} from '@/services/apiClient';
import type {
  TaskStat,
  ActivityItem,
  WorkflowRun,
  Agent,
  ResultRecord,
  ChartPoint,
  ConfidencePoint,
  WorkflowDistribution,
} from '@/types';
import {
  stats as initialStats,
  recentActivity as initialActivity,
  workflowHistory as initialHistory,
  agents as initialAgents,
  results as initialResults,
  apiKeys as initialApiKeys,
  tasksTrend as initialTasksTrend,
  confidenceTrend as initialConfidenceTrend,
  workflowDistribution as initialWorkflowDistribution,
} from '@/data/mockData';

export interface ApiKeyItem {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
}

export interface UserProfile {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface OrganizationInfo {
  name: string;
  industry: string;
  plan: string;
  teamMembers: number;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  agentAlerts: boolean;
  weeklyReport: boolean;
}

interface AppContextType {
  // State
  stats: TaskStat[];
  activity: ActivityItem[];
  history: WorkflowRun[];
  agents: Agent[];
  results: ResultRecord[];
  apiKeys: ApiKeyItem[];
  tasksTrend: ChartPoint[];
  confidenceTrend: ConfidencePoint[];
  workflowDistribution: WorkflowDistribution[];
  theme: 'dark' | 'light';
  language: string;
  profile: UserProfile;
  organization: OrganizationInfo;
  notifications: NotificationSettings;

  // Actions
  setTheme: (theme: 'dark' | 'light') => void;
  setLanguage: (lang: string) => void;
  setNotifications: React.Dispatch<React.SetStateAction<NotificationSettings>>;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateOrganization: (org: Partial<OrganizationInfo>) => void;
  addWorkflowRun: (run: WorkflowRun) => void;
  updateWorkflowRun: (id: string, update: Partial<WorkflowRun>) => void;
  deleteWorkflowRun: (id: string) => void;
  addResultRecord: (result: ResultRecord) => void;
  updateResultRecord: (id: string, update: Partial<ResultRecord>) => void;
  deleteResultRecord: (id: string) => void;
  updateAgent: (id: string, update: Partial<Agent>) => void;
  addActivity: (activity: ActivityItem) => void;
  generateApiKey: (name: string) => ApiKeyItem;
  deleteApiKey: (id: string) => void;
  rerunWorkflow: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'orbit_ai_state_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Safe localStorage helper to prevent unhandled JSON.parse crash on launch
  const loadSavedState = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${key}`);
      return saved ? (JSON.parse(saved) as T) : fallback;
    } catch {
      return fallback;
    }
  };

  const [stats, setStats] = useState<TaskStat[]>(() => loadSavedState('stats', initialStats));
  const [activity, setActivity] = useState<ActivityItem[]>(() => loadSavedState('activity', initialActivity));
  const [history, setHistory] = useState<WorkflowRun[]>(() => loadSavedState('history', initialHistory));
  const [agents, setAgents] = useState<Agent[]>(() => loadSavedState('agents', initialAgents));
  const [results, setResults] = useState<ResultRecord[]>(() => loadSavedState('results', initialResults));
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(() => loadSavedState('apikeys', initialApiKeys));
  const [tasksTrend, setTasksTrend] = useState<ChartPoint[]>(() => loadSavedState('tasksTrend', initialTasksTrend));
  const [confidenceTrend, setConfidenceTrend] = useState<ConfidencePoint[]>(() => loadSavedState('confidenceTrend', initialConfidenceTrend));
  const [workflowDistribution, setWorkflowDistribution] = useState<WorkflowDistribution[]>(() => loadSavedState('workflowDistribution', initialWorkflowDistribution));
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => loadSavedState('theme', 'light'));

  const [language, setLanguage] = useState<string>('en');

  const [profile, setProfile] = useState<UserProfile>({
    name: 'Elena Marsh',
    role: 'Operations Lead',
    email: 'elena@acmecorp.com',
    phone: '+1 (555) 014-8820',
  });

  const [organization, setOrganization] = useState<OrganizationInfo>({
    name: 'Acme Corp',
    industry: 'Logistics & Supply Chain',
    plan: 'Enterprise',
    teamMembers: 42,
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    agentAlerts: true,
    weeklyReport: false,
  });

  // Sync theme with document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_theme`, theme);
  }, [theme]);

  // Sync key collections to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_history`, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_results`, JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_agents`, JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_activity`, JSON.stringify(activity));
  }, [activity]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_apikeys`, JSON.stringify(apiKeys));
  }, [apiKeys]);

  // Sync backend state on mount — load real SQLite data and analytics if backend is available
  useEffect(() => {
    const syncFromBackend = async () => {
      const [backendHistory, backendResults, analytics, backendKeys] = await Promise.all([
        fetchHistoryFromFastApi(),
        fetchResultsFromFastApi(),
        fetchAnalyticsFromFastApi(),
        fetchApiKeysFromFastApi(),
      ]);

      if (backendKeys && backendKeys.length > 0) {
        setApiKeys(backendKeys);
      }

      if (backendHistory && backendHistory.length > 0) {
        setHistory(backendHistory);
      }
      if (backendResults && backendResults.length > 0) {
        const mapped = backendResults.map((r: any) => ({
          ...r,
          incidentType: r.incidentType || r.incident_type,
          riskLevel: r.riskLevel || r.risk_level,
          businessImpact: r.businessImpact || r.business_impact,
          generatedReply: r.generatedReply || r.generated_reply,
          suggestedActions: r.suggestedActions || r.suggested_actions || [],
          validationScore: r.validationScore || r.validation_score,
          validationStatus: r.validationStatus || r.validation_status,
        }));
        setResults(mapped);
      }

      if (analytics) {
        if (analytics.tasksTrend && analytics.tasksTrend.length > 0) {
          setTasksTrend(analytics.tasksTrend);
        }
        if (analytics.confidenceTrend && analytics.confidenceTrend.length > 0) {
          setConfidenceTrend(analytics.confidenceTrend);
        }
        if (analytics.workflowDistribution && analytics.workflowDistribution.length > 0) {
          const colorMap: Record<string, string> = {
            'Complaint Resolution': 'hsl(248 82% 66%)',
            'Contract Analysis': 'hsl(198 83% 60%)',
            'Report Generation': 'hsl(152 60% 50%)',
            'Meeting Synthesis': 'hsl(38 92% 55%)',
          };
          setWorkflowDistribution(
            analytics.workflowDistribution.map((w) => ({
              ...w,
              color: colorMap[w.name] || 'hsl(280 75% 60%)',
            }))
          );
        }
      }
    };
    syncFromBackend();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recalculate stats & distribution dynamically based on live history
  useEffect(() => {
    const total = history.length;
    const completed = history.filter((h) => h.status === 'Completed').length;
    const pending = history.filter((h) => h.status === 'Pending' || h.status === 'Processing').length;
    const confidences = history.filter((h) => h.confidence > 0).map((h) => h.confidence);
    const avgConfidence = confidences.length > 0
      ? (confidences.reduce((a, b) => a + b, 0) / confidences.length).toFixed(1)
      : '94.2';

    setStats([
      { label: 'Total Tasks', value: total.toLocaleString(), delta: total > 0 ? '+100%' : '0%', trend: 'up', icon: 'Layers' },
      { label: 'Completed', value: completed.toLocaleString(), delta: completed > 0 ? '+100%' : '0%', trend: 'up', icon: 'CheckCircle2' },
      { label: 'Pending', value: pending.toLocaleString(), delta: pending > 0 ? '+1' : '0%', trend: pending > 0 ? 'up' : 'down', icon: 'Clock' },
      { label: 'Avg AI Confidence', value: `${avgConfidence}%`, delta: '+1.8%', trend: 'up', icon: 'Gauge' },
    ]);

    if (history.length > 0) {
      // Aggregate workflow distribution dynamically
      const wfCounts: Record<string, number> = {};
      history.forEach((h) => {
        const wf = h.workflow || 'Other';
        wfCounts[wf] = (wfCounts[wf] || 0) + 1;
      });

      const colorMap: Record<string, string> = {
        'Complaint Resolution': 'hsl(248 82% 66%)',
        'Contract Analysis': 'hsl(198 83% 60%)',
        'Report Generation': 'hsl(152 60% 50%)',
        'Meeting Synthesis': 'hsl(38 92% 55%)',
        'Document Extraction': 'hsl(280 75% 60%)',
      };

      const dist = Object.entries(wfCounts).map(([name, value]) => ({
        name,
        value,
        color: colorMap[name] || 'hsl(210 70% 55%)',
      }));

      setWorkflowDistribution(dist);
    }
  }, [history]);

  const setTheme = (t: 'dark' | 'light') => {
    setThemeState(t);
  };

  const updateProfile = (p: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...p }));
  };

  const updateOrganization = (org: Partial<OrganizationInfo>) => {
    setOrganization((prev) => ({ ...prev, ...org }));
  };

  const addWorkflowRun = (run: WorkflowRun) => {
    setHistory((prev) => [run, ...prev]);
  };

  const updateWorkflowRun = (id: string, update: Partial<WorkflowRun>) => {
    setHistory((prev) => prev.map((item) => (item.id === id ? { ...item, ...update } : item)));
  };

  const deleteWorkflowRun = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    // Also delete from backend (fire and forget)
    deleteWorkflowFromFastApi(id).catch(() => {});
  };

  const addResultRecord = (result: ResultRecord) => {
    setResults((prev) => [result, ...prev]);
  };

  const updateResultRecord = (id: string, update: Partial<ResultRecord>) => {
    setResults((prev) => prev.map((item) => (item.id === id ? { ...item, ...update } : item)));
  };

  const deleteResultRecord = (id: string) => {
    setResults((prev) => prev.filter((item) => item.id !== id));
  };

  const updateAgent = (id: string, update: Partial<Agent>) => {
    setAgents((prev) => prev.map((item) => (item.id === id ? { ...item, ...update } : item)));
  };

  const addActivity = (item: ActivityItem) => {
    setActivity((prev) => [item, ...prev]);
  };

  const generateApiKey = (name: string): ApiKeyItem => {
    const randomHex = Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const keyName = name || 'New API Key';
    const newKey: ApiKeyItem = {
      id: `k-${Date.now()}`,
      name: keyName,
      key: `sk-orbit-prod-${randomHex}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Just now',
    };
    setApiKeys((prev) => [newKey, ...prev]);

    // Create in FastAPI SQLite DB
    createApiKeyInFastApi(keyName).then((res) => {
      if (res) {
        setApiKeys((prev) => prev.map((k) => (k.id === newKey.id ? res : k)));
      }
    }).catch(() => {});

    return newKey;
  };

  const deleteApiKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    deleteApiKeyInFastApi(id).catch(() => {});
  };

  const rerunWorkflow = (id: string) => {
    const target = history.find((h) => h.id === id);
    if (!target) return;
    updateWorkflowRun(id, { status: 'Processing', date: new Date().toISOString().replace('T', ' ').slice(0, 16) });
    addActivity({
      id: `act-${Date.now()}`,
      agent: 'Planner Agent',
      action: 're-triggered workflow for',
      target: target.task,
      time: 'Just now',
      status: 'Processing',
    });
    // Notify backend of re-run
    rerunWorkflowInFastApi(id).catch(() => {});

    setTimeout(() => {
      updateWorkflowRun(id, { status: 'Completed', confidence: Math.floor(88 + Math.random() * 10) });
      addActivity({
        id: `act-${Date.now() + 1}`,
        agent: 'Report Agent',
        action: 'completed re-run synthesis for',
        target: target.task,
        time: 'Just now',
        status: 'Completed',
      });
    }, 2500);
  };

  return (
    <AppContext.Provider
      value={{
        stats,
        activity,
        history,
        agents,
        results,
        apiKeys,
        tasksTrend,
        confidenceTrend,
        workflowDistribution,
        theme,
        language,
        profile,
        organization,
        notifications,
        setTheme,
        setLanguage,
        setNotifications,
        updateProfile,
        updateOrganization,
        addWorkflowRun,
        updateWorkflowRun,
        deleteWorkflowRun,
        addResultRecord,
        updateResultRecord,
        deleteResultRecord,
        updateAgent,
        addActivity,
        generateApiKey,
        deleteApiKey,
        rerunWorkflow,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
