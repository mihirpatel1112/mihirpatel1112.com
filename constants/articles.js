export const heading = "Articles I've Been Reading";

export const tags = {
  AI: "AI",
  AGENTS: "Agents",
  BOTS: "Bots",
  LLM: "LLM",
  MACHINE_LEARNING: "Machine Learning",
  DISTRIBUTED_SYSTEMS: "Distributed Systems",
  STORAGE: "Storage",
  INFRASTRUCTURE: "Infrastructure",
};

export const articles = [
  {
    title: "Agents or Bots: Making Sense of AI on the Open Web",
    description:
      "Understanding the difference between AI agents and bots in the context of the open web",
    url: "https://www.perplexity.ai/hub/blog/agents-or-bots-making-sense-of-ai-on-the-open-web",
    tags: [tags.AI, tags.AGENTS, tags.BOTS],
    dateRead: "03/01/2025",
  },
  {
    title: "How LLMs Work, Explained Without Math",
    description:
      "A comprehensive explanation of how Large Language Models work without complex mathematics",
    url: "https://blog.miguelgrinberg.com/post/how-llms-work-explained-without-math",
    tags: [tags.LLM, tags.AI, tags.MACHINE_LEARNING],
    dateRead: "01/01/2025",
  },
  {
    title: "Building and Operating a Pretty Big Storage System",
    description:
      "Insights on building and operating large-scale storage systems",
    url: "https://www.allthingsdistributed.com/2023/07/building-and-operating-a-pretty-big-storage-system.html",
    tags: [tags.DISTRIBUTED_SYSTEMS, tags.STORAGE, tags.INFRASTRUCTURE],
    dateRead: "02/01/2025",
  },
];
