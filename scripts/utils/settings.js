import "@johnlindquist/kit";
import { ChangePromptName, editPrompts, importPrompt } from "./prompt.js";
import { editTags, renderTags } from "./tags.js";
import { stripSquareBrackets } from "./helpers.js";
import { read } from "fs";

// const exportJSON = async (dbName, filterTags = []) => {
//   const dBase = await db(dbName);
//   await dBase.read();
//   const filteredData = Object.values(dBase.data.snips).map((snip) => {
//     if (filterTags.length > 0) {
//       if (tags.some((tag) => snip.tags.includes(tag))) {
//         return {
//           name: snip.name,
//           description: snip.description,
//           snippet: snip.snippet,
//           tags: snip.tags,
//         };
//       } else {
//         return null;
//       }
//     } else {
//       return {
//         name: snip.name,
//         description: snip.description,
//         snippet: snip.snippet,
//         tags: snip.tags,
//       };
//     }
//   });
//   const json = JSON.stringify(filteredData, null, 2);
//   const path = await selectFolder("Where would you like to export to?");
//   await writeFile(`${path}/${dbName}-snippets.json`, json);
// };

// const exportYAML = async (dbName, filterTags = []) => {
//   const dBase = await db(dbName);
//   await dBase.read();
//   const filteredData = Object.values(dBase.data.snips)
//     .map((snip) => {
//       if (filterTags.length > 0) {
//         if (tags.some((tag) => snip.tags.includes(tag))) {
//           return {
//             name: stripSquareBrackets(snip.name),
//             description: snip.description,
//             snippet: snip.snippet,
//             tags: snip.tags,
//           };
//         } else {
//           return null;
//         }
//       } else {
//         return {
//           name: stripSquareBrackets(snip.name),
//           description: snip.description,
//           snippet: snip.snippet,
//           tags: snip.tags,
//         };
//       }
//     })
//     .filter((snip) => snip !== null);

//   const yamlData = yaml.dump(filteredData, { lineWidth: 120 });
//   const path = await selectFolder("Where would you like to export to?");
//   await writeFile(`${path}/${dbName}-snippets.yml`, yamlData);
// };

const exportMarkdown = async (
  dbName,
  fileName = "prompt-snippets",
  filterTags = []
) => {
  let markdown = `# ${dbName}\n\n`;
  let promptsObject = await db(dbName);
  await promptsObject.read();
  for (const key in promptsObject.data.snips) {
    const { name, description, snippet, tags } = promptsObject.data.snips[key];
    if (filterTags.length > 0) {
      if (tags.some((tag) => filterTags.includes(tag))) {
        markdown += `## ${name}\n_${description}_\n\n\`\`\`plaintext\n${snippet}\n\`\`\`\n\n`;
      }
    } else {
      markdown += `## ${name}\n_${description}_\n\n\`\`\`plaintext\n${snippet}\n\`\`\`\n\n`;
    }
  }

  const path = await selectFolder("Where would you like to export to?");

  await writeFile(`${path}/${fileName}.md`, markdown);
};

const importMarkdown = async (
  dbName,
  fileName = "prompt-updates",
) => {
  const promptupdates = await readFile(home(".kenv/kenvs/cict-scripts/scripts",`${fileName}.md`),"utf-8");
  
  // Extract the section between "# Naamswijzigingen" and the next "# Naamswijzigingen"
  const namechangesSections = promptupdates.split('# Naamswijzigingen');
  const relevantSection = namechangesSections[1];  // we want the second section
  // Split the section into lines and keep only those starting with '@'
  const lines = relevantSection.split('\n').filter(line => line.startsWith('@'));
  // Map each line to an object with 'oldname' and 'newname'
  const objects = lines.map(line => {
    const parts = line.split('==>>');
    return {
        oldname: parts[0].substring(1).trim(),  // Remove the '@' at the start
        newname: parts[1].trim()
    };
  });
  for (let object of objects) {
      await ChangePromptName(dbName, object.oldname, object.newname);
    }

  let sections = promptupdates.split('##').slice(1); // We slice the first element off as it's an empty string
  for (let section of sections) {
      let title = section.split('\n')[0].trim(); // Take the first line after each '##' as title
      let comment = section.match(/_(.*?)_/s)?.[1];
      let content = section.match(/```.*?\n([\s\S]*?)```/s)?.[1];
      if (title && comment && content) {
        await importPrompt(dbName, title, comment, content);
      }
  }
};

export const settings = async (dbName) => {
  const actions = {
    "Manage Prompts": () => editPrompts(dbName),
    "Manage Tags": () => editTags(dbName),
    Export: async () => {
      // const format = await arg("Select format to export as", [
      //   "Markdown",
      //   "JSON",
      //   // "YAML",
      // ]);
      const tags = await renderTags(dbName);
      const fileName = await arg("What would you like to name the file?");
      await exportMarkdown(dbName, fileName, tags);
      toast(`Exported ${dbName} to ${fileName}.md`);
      // format === "Markdown" && (await exportMarkdown(dbName, tags));
      // format === "JSON" && (await exportJSON(dbName, tags));
      // format === "YAML" && (await exportYAML(dbName, tags));
    },
    Import: async () => {
      await importMarkdown(dbName);
      toast(`Imported ${fileName}.md to ${dbName}`);
    },
    Quit: async () => {
      const confirmation = await arg("Are you sure you want to quit?", [
        "[Y]es",
        "[N]o",
      ]);
      if (confirmation === "Yes") {
        exit();
      }
      setTab("Prompts");
    },
  };

  const selectedAction = await arg("Choose an action", [
    "Manage Prompts",
    "Manage Tags",
    "Export",
    "Import",
    "Quit",
  ]);
  await actions[selectedAction]();
};
