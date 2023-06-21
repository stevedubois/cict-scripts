// Name: Prompt Manager v1.2
// Description: Manage your prompt templates
// Author: Josh Mabry
// Twitter: @SteveDu83816619
// Shortcut: cmd+shift+O

import "@johnlindquist/kit";

import { renderPrompts, seedPrompts } from "./utils/prompt.js";
import { filterPromptsByTag } from "./utils/tags.js";
import { settings } from "./utils/settings.js";

await seedPrompts();

onTab("Prompts", async () => {
  await renderPrompts("prompts");
  setTab("Prompts");
});

onTab("Filter by Tag", async () => {
  await filterPromptsByTag("prompts");
});

onTab("Settings", async () => {
  await settings("prompts");
  setTab("Prompts");
});
