export type TaskSection = 'today' | 'upcoming' | 'someday';
export type TaskAction = 'none' | 'email_draft' | 'custom';

export interface Recurrence {
  cron?: string;
  tz?: string;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  section: TaskSection;
  dueAt?: string;
  remindAt?: string[];
  recurrence?: Recurrence;
  tags?: string[];
  priority?: 1 | 2 | 3;
  completedAt?: string;
  action?: TaskAction;
  aiModel?: string;
  aiPrompt?: string;
  customCommand?: string;
}

export interface TaskInput {
  title: string;
  notes?: string;
  section: TaskSection;
  dueAt?: string;
  remindAt?: string[];
  recurrence?: Recurrence;
  tags?: string[];
  priority?: 1 | 2 | 3;
  action?: TaskAction;
  aiModel?: string;
  aiPrompt?: string;
  customCommand?: string;
}

export interface AppSettings {
  autoStartOnLogin: boolean;
  alwaysOnTop: boolean;
  enableBurnInMitigation: boolean;
  aiMode: 'embedded' | 'external';
  aiModel: string;
  aiTemperature: number;
  aiBaseUrl: string;
  emailClientAction: 'mailto' | 'default' | 'custom';
  emailCustomCommand?: string;
  resolutionProfile: '1920x480' | '1280x400' | '1024x256' | 'auto';
  fontSizeScale: number;
  theme?: Theme;
}

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    base: number; // in px
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
  opacity: {
    glass: number;
  };
  blur: {
    glass: number; // in px
  };
  fonts: {
    body: string;
    heading: string;
    mono: string;
  };
}
