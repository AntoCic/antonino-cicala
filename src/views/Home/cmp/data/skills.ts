export type SkillCategory = 'Frontend' | 'Backend' | 'Tools' | 'AI';

export interface Skill {
  name: string;
  icon: string;
  category: SkillCategory;
}

export const skills: Skill[] = [
  // ── Frontend ──────────────────────────────────────────────
  { name: 'HTML',        icon: 'html.svg',        category: 'Frontend' },
  { name: 'CSS',         icon: 'css.svg',         category: 'Frontend' },
  { name: 'JavaScript',  icon: 'javascript.svg',  category: 'Frontend' },
  { name: 'TypeScript',  icon: 'typescript.svg',  category: 'Frontend' },
  { name: 'React',       icon: 'react.svg',       category: 'Frontend' },
  { name: 'Vue',         icon: 'vue.svg',         category: 'Frontend' },
  { name: 'Angular',     icon: 'angular.svg',     category: 'Frontend' },
  { name: 'Bootstrap',   icon: 'bootstrap.svg',   category: 'Frontend' },
  { name: 'Tailwind',    icon: 'tailwind.svg',    category: 'Frontend' },
  { name: 'Sass',        icon: 'sass.svg',        category: 'Frontend' },

  // ── Backend ───────────────────────────────────────────────
  { name: 'Node.js',     icon: 'node.svg',        category: 'Backend' },
  { name: 'Express',     icon: 'express.svg',     category: 'Backend' },
  { name: 'PHP',         icon: 'php.svg',         category: 'Backend' },
  { name: 'Laravel',     icon: 'laravel.svg',     category: 'Backend' },
  { name: 'Symfony',     icon: 'symfony.png',     category: 'Backend' },
  { name: 'Python',      icon: 'python.svg',      category: 'Backend' },
  { name: 'Firebase',    icon: 'firebase.svg',    category: 'Backend' },
  { name: 'MySQL',       icon: 'mysql.svg',       category: 'Backend' },
  { name: 'MongoDB',     icon: 'mongo.svg',       category: 'Backend' },
  { name: 'SQL',         icon: 'sql.svg',         category: 'Backend' },

  // ── Tools ─────────────────────────────────────────────────
  { name: 'Git',         icon: 'git.svg',         category: 'Tools' },
  { name: 'GitHub',      icon: 'github.svg',      category: 'Tools' },
  { name: 'Vite',        icon: 'vite.svg',        category: 'Tools' },
  { name: 'Docker',      icon: 'docker.svg',      category: 'Tools' },
  { name: 'npm',         icon: 'npm.svg',         category: 'Tools' },
  { name: 'VS Code',     icon: 'vscode.svg',      category: 'Tools' },
  { name: 'Postman',     icon: 'postman.svg',     category: 'Tools' },
  { name: 'Notion',      icon: 'notion.svg',      category: 'Tools' },
  { name: 'Canva',       icon: 'canva.png',       category: 'Tools' },

  // ── AI ────────────────────────────────────────────────────
  { name: 'ChatGPT',     icon: 'chatgpt.png',     category: 'AI' },
  { name: 'Claude',      icon: 'claude-code.png', category: 'AI' },
  { name: 'Codex',       icon: 'codex.png',       category: 'AI' },
  { name: 'Gemini',      icon: 'gemini.png',      category: 'AI' },
  { name: 'Genkit',      icon: 'genkit.png',      category: 'AI' },
];

export const skillCategories: SkillCategory[] = ['Frontend', 'Backend', 'Tools', 'AI'];
