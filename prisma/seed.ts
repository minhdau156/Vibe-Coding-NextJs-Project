import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding database...');

  // 1. Create Demo User
  console.log('Creating demo user...');
  const hashedPassword = await bcrypt.hash('12345678', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@devstash.io' },
    update: {},
    create: {
      email: 'demo@devstash.io',
      name: 'Demo User',
      password: hashedPassword,
      isPro: false,
      emailVerified: new Date(),
    },
  });

  // 2. System Item Types
  console.log('Creating system item types...');
  const types = [
    { name: 'snippet', icon: 'Code', color: '#3b82f6', isSystem: true },
    { name: 'prompt', icon: 'Sparkles', color: '#8b5cf6', isSystem: true },
    { name: 'command', icon: 'Terminal', color: '#f97316', isSystem: true },
    { name: 'note', icon: 'StickyNote', color: '#fde047', isSystem: true },
    { name: 'file', icon: 'File', color: '#6b7280', isSystem: true },
    { name: 'image', icon: 'Image', color: '#ec4899', isSystem: true },
    { name: 'link', icon: 'Link', color: '#10b981', isSystem: true },
  ];

  const typeMap: Record<string, string> = {};
  for (const t of types) {
    let itemType = await prisma.itemType.findFirst({
      where: { name: t.name, isSystem: true },
    });
    if (!itemType) {
      itemType = await prisma.itemType.create({ data: t });
    }
    typeMap[t.name] = itemType.id;
  }

  // Helper to create item
  async function createItem(data: {
    title: string;
    description?: string;
    contentType: 'TEXT' | 'FILE' | 'URL';
    content?: string;
    url?: string;
    language?: string;
    itemTypeName: string;
    collectionId: string;
    isPinned?: boolean;
  }) {
    const item = await prisma.item.create({
      data: {
        title: data.title,
        description: data.description || '',
        contentType: data.contentType,
        content: data.content,
        url: data.url,
        language: data.language,
        isPinned: data.isPinned || false,
        itemTypeId: typeMap[data.itemTypeName],
        userId: user.id,
      },
    });
    await prisma.itemCollection.create({
      data: {
        itemId: item.id,
        collectionId: data.collectionId,
      },
    });
    return item;
  }

  // 3. Collections & Items
  console.log('Creating collections & items...');

  // --- React Patterns ---
  const reactCollection = await prisma.collection.create({
    data: {
      name: 'React Patterns',
      description: 'Reusable React patterns and hooks',
      userId: user.id,
      defaultTypeId: typeMap['snippet'],
      isFavorite: true,
    },
  });
  await createItem({
    title: 'useDebounce Hook',
    description: 'Custom hook to debounce values',
    contentType: 'TEXT',
    content: 'export function useDebounce(value, delay) { /* implementation */ }',
    language: 'typescript',
    itemTypeName: 'snippet',
    collectionId: reactCollection.id,
    isPinned: true,
  });
  await createItem({
    title: 'Context Provider Pattern',
    description: 'A clean way to provide context',
    contentType: 'TEXT',
    content: 'export const AppProvider = ({ children }) => { return <AppContext.Provider>{children}</AppContext.Provider> }',
    language: 'typescript',
    itemTypeName: 'snippet',
    collectionId: reactCollection.id,
  });
  await createItem({
    title: 'useLocalStorage Hook',
    description: 'Hook to store state in localStorage',
    contentType: 'TEXT',
    content: 'export function useLocalStorage(key, initialValue) { /* implementation */ }',
    language: 'typescript',
    itemTypeName: 'snippet',
    collectionId: reactCollection.id,
  });

  // --- AI Workflows ---
  const aiCollection = await prisma.collection.create({
    data: {
      name: 'AI Workflows',
      description: 'AI prompts and workflow automations',
      userId: user.id,
      defaultTypeId: typeMap['prompt'],
      isFavorite: true,
    },
  });
  await createItem({
    title: 'Code Review Assistant',
    description: 'Prompt for code review',
    contentType: 'TEXT',
    content: 'Please review the following code for security, performance, and best practices...',
    itemTypeName: 'prompt',
    collectionId: aiCollection.id,
  });
  await createItem({
    title: 'Documentation Generator',
    description: 'Prompt for generating docs',
    contentType: 'TEXT',
    content: 'Generate markdown documentation for the following TypeScript functions...',
    itemTypeName: 'prompt',
    collectionId: aiCollection.id,
  });
  await createItem({
    title: 'Refactoring Assistant',
    description: 'Prompt for refactoring',
    contentType: 'TEXT',
    content: 'Refactor this code to be more functional and minimize side effects...',
    itemTypeName: 'prompt',
    collectionId: aiCollection.id,
  });

  // --- DevOps ---
  const devopsCollection = await prisma.collection.create({
    data: {
      name: 'DevOps',
      description: 'Infrastructure and deployment resources',
      userId: user.id,
    },
  });
  await createItem({
    title: 'Node.js Dockerfile',
    contentType: 'TEXT',
    content: 'FROM node:18-alpine\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD ["npm", "start"]',
    language: 'dockerfile',
    itemTypeName: 'snippet',
    collectionId: devopsCollection.id,
  });
  await createItem({
    title: 'Deploy to VPS',
    contentType: 'TEXT',
    content: 'scp -r ./dist user@server:/var/www/my-app',
    language: 'bash',
    itemTypeName: 'command',
    collectionId: devopsCollection.id,
  });
  await createItem({
    title: 'Docker Documentation',
    contentType: 'URL',
    url: 'https://docs.docker.com/',
    itemTypeName: 'link',
    collectionId: devopsCollection.id,
  });
  await createItem({
    title: 'Kubernetes Docs',
    contentType: 'URL',
    url: 'https://kubernetes.io/docs/home/',
    itemTypeName: 'link',
    collectionId: devopsCollection.id,
  });

  // --- Terminal Commands ---
  const terminalCollection = await prisma.collection.create({
    data: {
      name: 'Terminal Commands',
      description: 'Useful shell commands for everyday development',
      userId: user.id,
      defaultTypeId: typeMap['command'],
    },
  });
  await createItem({
    title: 'Git: Undo last commit',
    contentType: 'TEXT',
    content: 'git reset --soft HEAD~1',
    language: 'bash',
    itemTypeName: 'command',
    collectionId: terminalCollection.id,
  });
  await createItem({
    title: 'Docker: Clean up unused',
    contentType: 'TEXT',
    content: 'docker system prune -a --volumes',
    language: 'bash',
    itemTypeName: 'command',
    collectionId: terminalCollection.id,
  });
  await createItem({
    title: 'Kill process on port',
    contentType: 'TEXT',
    content: 'npx kill-port 3000',
    language: 'bash',
    itemTypeName: 'command',
    collectionId: terminalCollection.id,
  });
  await createItem({
    title: 'NPM: update interactive',
    contentType: 'TEXT',
    content: 'npm-check-updates -i',
    language: 'bash',
    itemTypeName: 'command',
    collectionId: terminalCollection.id,
  });

  // --- Design Resources ---
  const designCollection = await prisma.collection.create({
    data: {
      name: 'Design Resources',
      description: 'UI/UX resources and references',
      userId: user.id,
      defaultTypeId: typeMap['link'],
    },
  });
  await createItem({
    title: 'Tailwind CSS',
    contentType: 'URL',
    url: 'https://tailwindcss.com',
    itemTypeName: 'link',
    collectionId: designCollection.id,
    isPinned: true,
  });
  await createItem({
    title: 'shadcn/ui',
    contentType: 'URL',
    url: 'https://ui.shadcn.com',
    itemTypeName: 'link',
    collectionId: designCollection.id,
  });
  await createItem({
    title: 'Lucide Icons',
    contentType: 'URL',
    url: 'https://lucide.dev',
    itemTypeName: 'link',
    collectionId: designCollection.id,
  });
  await createItem({
    title: 'Google Fonts',
    contentType: 'URL',
    url: 'https://fonts.google.com',
    itemTypeName: 'link',
    collectionId: designCollection.id,
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
