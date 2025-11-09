import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useTaskStore } from '../../store/taskStore';
import { chatWithOllama, checkOllamaHealth } from '../../lib/ollama';
import './AIPanel.css';

const AIPanel = () => {
  const { aiPanelOpen, selectedTaskId, tasks, settings, setAIPanelOpen } = useTaskStore();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOllamaOnline, setIsOllamaOnline] = useState(false);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  useEffect(() => {
    if (aiPanelOpen && selectedTask) {
      // Prefill prompt
      const defaultPrompt = selectedTask.aiPrompt ||
        `Draft an email about: ${selectedTask.title}\n${selectedTask.notes ? `Details: ${selectedTask.notes}\n` : ''}Tone: succinct, warm, plain language.`;
      setPrompt(defaultPrompt);
      setResponse('');
      setError(null);

      // Check Ollama health
      checkOllamaHealth(settings?.aiBaseUrl).then(setIsOllamaOnline);
    }
  }, [aiPanelOpen, selectedTask, settings]);

  const handleDraft = async () => {
    if (!settings) return;

    const aiMode = settings.aiMode || 'embedded';

    if (aiMode === 'external') {
      // Launch Ollama app and copy prompt
      try {
        await invoke('launch_ollama_app');
        await invoke('clipboard_copy', { text: prompt });
        // Show toast (you could add a toast system)
        alert('Prompt copied to clipboard. Switch to Ollama app to continue.');
      } catch (err) {
        setError(String(err));
      }
      return;
    }

    // Embedded mode: stream from Ollama
    setLoading(true);
    setError(null);
    setResponse('');

    try {
      const stream = chatWithOllama({
        model: settings.aiModel || 'llama3.1',
        user: prompt,
        temperature: settings.aiTemperature || 0.5,
        baseUrl: settings.aiBaseUrl || 'http://127.0.0.1:11434',
      });

      for await (const token of stream) {
        setResponse((prev) => prev + token);
      }

      setLoading(false);
    } catch (err) {
      setError(String(err));
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await invoke('clipboard_copy', { text: response });
      // Show toast
      alert('Draft copied to clipboard!');
    } catch (err) {
      setError(String(err));
    }
  };

  const handleMailto = () => {
    const subject = encodeURIComponent(selectedTask?.title || '');
    const body = encodeURIComponent(response);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  if (!aiPanelOpen) return null;

  return (
    <div className="ai-panel-overlay" onClick={() => setAIPanelOpen(false)}>
      <div className="ai-panel slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="ai-panel-header">
          <h3>AI Email Draft</h3>
          <button className="close-btn" onClick={() => setAIPanelOpen(false)}>
            ✕
          </button>
        </div>

        <div className="ai-panel-content">
          {!isOllamaOnline && (
            <div className="ai-warning">
              ⚠️ Ollama server is offline. Please start Ollama at{' '}
              <code>{settings?.aiBaseUrl || 'http://127.0.0.1:11434'}</code>
            </div>
          )}

          <div className="ai-section">
            <label htmlFor="ai-prompt">Prompt</label>
            <textarea
              id="ai-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="ai-textarea"
              rows={4}
              placeholder="Enter your prompt..."
            />
          </div>

          <button
            className="ai-draft-btn"
            onClick={handleDraft}
            disabled={loading || !isOllamaOnline}
          >
            {loading ? 'Drafting...' : '✨ Draft with Ollama'}
          </button>

          {error && <div className="ai-error">{error}</div>}

          {response && (
            <div className="ai-section">
              <label htmlFor="ai-response">Generated Draft</label>
              <textarea
                id="ai-response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="ai-textarea ai-response"
                rows={8}
              />
              <div className="ai-actions">
                <button className="ai-action-btn" onClick={handleCopy}>
                  Copy
                </button>
                <button className="ai-action-btn primary" onClick={handleMailto}>
                  Open in Email
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPanel;
