export const queryKeys = {
  users: {
    all: ["users"] as const,
    list: (filters?: Record<string, unknown>) => ["users", "list", filters] as const,
    detail: (id: number) => ["users", "detail", id] as const,
  },
  doctors: {
    all: ["doctors"] as const,
    list: (filters?: Record<string, unknown>) => ["doctors", "list", filters] as const,
    detail: (id: number) => ["doctors", "detail", id] as const,
  },
  marketers: {
    all: ["marketers"] as const,
    list: (filters?: Record<string, unknown>) => ["marketers", "list", filters] as const,
    detail: (id: number) => ["marketers", "detail", id] as const,
    promoCodes: (marketerId: number) => ["marketers", "promoCodes", marketerId] as const,
    consultations: (userId: number, fromDate: string, toDate: string) => ["marketers", "consultations", userId, fromDate, toDate] as const,
  },
  organizations: {
    all: ["organizations"] as const,
    list: (filters?: Record<string, unknown>) => ["organizations", "list", filters] as const,
    detail: (id: number) => ["organizations", "detail", id] as const,
    consultations: (orgId: number) => ["organizations", "consultations", orgId] as const,
    report: (orgId: number, fromDate: string, toDate: string) => ["organizations", "report", orgId, fromDate, toDate] as const,
  },
  consultations: {
    all: ["consultations"] as const,
    list: (filters?: Record<string, unknown>) => ["consultations", "list", filters] as const,
    detail: (id: number) => ["consultations", "detail", id] as const,
    report: (fromDate: string, toDate: string) => ["consultations", "report", fromDate, toDate] as const,
  },
  bundles: {
    all: ["bundles"] as const,
    list: (filters?: Record<string, unknown>) => ["bundles", "list", filters] as const,
  },
  subscriptions: {
    all: ["subscriptions"] as const,
    list: (filters?: Record<string, unknown>) => ["subscriptions", "list", filters] as const,
  },
  promoCodes: {
    all: ["promoCodes"] as const,
    list: (filters?: Record<string, unknown>) => ["promoCodes", "list", filters] as const,
  },
};
