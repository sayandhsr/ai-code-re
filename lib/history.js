const HISTORY_KEY = "codereview_history";
const MAX_ITEMS = 50;

export function getHistory() {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveAnalysis(analysis) {
  const history = getHistory();
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    timestamp: new Date().toISOString(),
    language: analysis.language || "unknown",
    code: analysis.code?.slice(0, 500) || "",
    score: analysis.results?.score || 0,
    complexity: analysis.results?.complexity || "Medium",
    bugsCount: analysis.results?.bugs?.length || 0,
    suggestionsCount: analysis.results?.suggestions?.length || 0,
    results: analysis.results,
  };
  history.unshift(entry);
  if (history.length > MAX_ITEMS) history.length = MAX_ITEMS;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return entry;
}

export function getAnalysisById(id) {
  const history = getHistory();
  return history.find((item) => item.id === id) || null;
}

export function deleteAnalysis(id) {
  const history = getHistory().filter((item) => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
