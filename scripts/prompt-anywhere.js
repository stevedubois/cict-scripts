/*
# Prompt Anywhere
Highlight some text and run this script to prompt against it.
Useful for summarizing text, generating a title, or any other task you can think of.

## Usage

- Highlight the text you want to prompt against
- Run the script via shortcut or command palette
- Input your desired prompt
- Wait for the AI to respond
- Select one of the options
* Reply - Add a follow up question
* Retry - Rerun generation with option to update prompt
* Edit - Edit response in editor
    - On editor exit the message is saved to the clipboard
    - On editor submit the message is pasted into the highlighted text
* Copy - Copy response to clipboard
* Paste - Paste response into highlighted text
* Save - Save response to file in the .kenv/temp/prompt-anything/conversations directory

## Example
- Highlight: 'Some really long passage in a blog post'
- Run Script
- Prompt: `Summarize this passage in the form of Shakespearean prose`
- Waaaaait for it...
- Get a response from the AI
- Select an option
- Rinse and repeat
*/

// Name: Prompt Anywhere v1.2
// Description: Custom prompt for any highlighted text
// Author: Josh Mabry
// Twitter: @SteveDu83816619
// Shortcut: Cmd shift P

//##################
// ScriptKit Imports
//##################
import "@johnlindquist/kit";
import { getSnipsByTag } from "./utils/prompt.js";
import { AIChatMessage } from "langchain/schema";

//##################
// LangChain Imports
//##################
let { ChatOpenAI } = await import("langchain/chat_models");
let { HumanChatMessage, SystemChatMessage } = await import("langchain/schema");

//#################
// Request API KEY
//#################
// stored in .env file after first run
// can change there or through the command palette
let openAIApiKey = await env("OPENAI_API_KEY", {
  hint: `Grab a key from <a href="https://platform.openai.com/account/api-keys">here</a>`,
});

const defaultTemp = 0.7;
const defaultModel = "gpt-3.5-turbo";
let temp = defaultTemp;
let model = defaultModel;
let info = "";
let extra = '';
const prompts = await getSnipsByTag("prompt-anywhere");
const promptChoices = Object.entries(prompts).map(([key, value]) => {
  return { name: value.name, value: value.snippet };
});

// System input / Task for the AI to follow
let userSystemInput = await arg(
  {
    placeholder: "Typ eerste letters, kies prompt of schrijf eigen prompt",
    strict: false,
  },
  promptChoices
);

// Options
const optionsHint = `Optioneel (druk enter om over te slaan):
0.0 : Temperatuur van de respons van 0.0 (strikt) tot 1.0 (Creatief)
+ Uitgebreidere respons  ++ Erg uitgebreide respons
- Kortere respons  -- Erg korte respons
@4 : GPT4 (nog niet beschikbaar)
Voorbeeld: 0.3-- Temperatuur 0.3 (redelijk strict) en erg beknopte respons`;
let options = await arg(
  {
    strict: false,
    hint: optionsHint
  },
);

// User Prompt from highlighted text
let userPrompt = await getSelectedText();
userPrompt = `
"
${userPrompt}
"
`;


//#################
// Prompt Template
//#################
const formatPrompt = (prompt) => {
  let newprompt = prompt;
  if (prompt.startsWith("[Temperature:")) {
    let firstBracketText = /\[(.*?)\]/gm.exec(prompt)[1];
    let extractedTemp = isNaN(Number(firstBracketText.replace("Temperature:", ""))) ? -1 : Number(firstBracketText.replace("Temperature:", ""));
    newprompt = prompt.replace(`[${firstBracketText}]`, "");
    if (extractedTemp >= 0 && extractedTemp <= 1) {
      temp = extractedTemp;
    }
  }
  let optionsTempString = options.replaceAll(/[+\-@4]/g, '');
  let optionsTemp = isNaN(Number(optionsTempString)) ? -1 : Number(optionsTempString);
  if (optionsTempString != '' && optionsTemp >= 0 && optionsTemp <= 1) {
    temp = optionsTemp;
  }
  if (options.match('@4')) {
    model = "gpt-4";
  }
  const plus = (options.match(/\+/g) || []).length;
  const min = (options.match(/\-/g) || []).length;
  if (plus > 0) {
    extra = "Provide a reasonably extensive, detailed response.";
    if (plus > 1) {
      extra = "Provide a very extensive and detailed response.";
    }
  } else if (min > 0) {
    extra = "Keep it rather concise.";
    if (min > 1) {
      extra = "Keep it very concise";
    }
  }
  return `
##### Ignore prior instructions
Return answer in markdown format
${newprompt}
${extra}
########
`;
};

const formattedPrompt = formatPrompt(userSystemInput);

//#########
// Helpers
//########
// exit script on cancel
const cancelChat = () => {
  exit();
};

/**
 * Paste text to highlighted text and exit script
 * @param {*} text
 */
const pasteTextAndExit = async (text) => {
  await setSelectedText(text);
  exit();
};

/**
 * Copy text to clipboard and exit script
 * @param {*} text
 */
const copyToClipboardAndExit = async (text) => {
  await clipboard.writeText(text.replace(/`/g, ""));
  exit();
};

let priorMessage = "";
let currentMessage = "";
let toast = null;
let chatStarted = false;
const llm = new ChatOpenAI({
  // 0 = "precise", 1 = "creative"
  temperature: temp,
  modelName: model, // GPT-4 requires beta access
  openAIApiKey: openAIApiKey,
  // turn off to only get output when the AI is done
  streaming: true,
  callbacks: [
    {
      handleLLMStart: async () => {
        log(`handleLLMStart`);
        log(`used temperature: ${temp}`);
        log(`used chat-model: ${model}`);
        log(`used prompt: ${formattedPrompt}`);
        log(`used text to handle: \n${userPrompt}`);
        info = `
        - used chat-model: ${model}
        - used temperature: ${temp}
        - exta: ${extra}
        `;
      },
      handleLLMNewToken: async (token) => {
        // each new token is appended to the current message
        // and then rendered to the screen
        currentMessage += token;
        // render current message
        await div({
          html: md(priorMessage + "\n" + currentMessage),
          onEscape: async () => {
            cancelChat();
          },
          shortcuts: [
            {
              name: "Cancel Generation",
              key: `${cmd}+c`,
              bar: "left",
              onPress: async () => {
                cancelChat();
              },
            },
          ],
        });
      },
      handleLLMError: async (err) => {
        dev({ err });
        chatStarted = false;
      },
      handleLLMEnd: async () => {
        log(`output: \n\n${currentMessage.replace(/`/g, "")}`);
        log(`handleLLMEnd`);
        let html = md(priorMessage + "\n\n" + currentMessage +  "\n\n" + "\n\n" + "\n\n" + info);
        await div({
          html,
          shortcuts: [
            {
              name: "Reply",
              key: `${cmd}+f`,
              bar: "left",
              onPress: async () => {
                const newPrompt = await arg(
                  {
                    placeholder: "Follow up question",
                    strict: false,
                  },
                  {
                    html,
                  }
                );
                priorMessage += currentMessage + "\n\n";
                currentMessage = "";
                await llm.call([
                  new SystemChatMessage(formattedPrompt),
                  new HumanChatMessage(userPrompt),
                  new AIChatMessage(priorMessage),
                  new HumanChatMessage(newPrompt),
                ]);
              },
            },
            {
              name: "Retry",
              key: `${cmd}+r`,
              bar: "left",
              onPress: async () => {
                currentMessage = "";
                await llm.call([
                  new SystemChatMessage(formattedPrompt),
                  new HumanChatMessage(userPrompt),
                ]);
              },
            },
            {
              name: "Edit",
              key: `${cmd}+x`,
              bar: "right",
              onPress: async () => {
                await editor({
                  value: currentMessage.replace(/`/g, ""),
                  footer: `Submit = changes to Clipboard`,
                  onEscape: async (state) => await copyToClipboardAndExit(state),
                  onAbandon : async (state) => await copyToClipboardAndExit(state),
                  onSubmit: async (state) => await copyToClipboardAndExit(state),
                });
              },
            },
            {
              name: "Copy",
              key: `${cmd}+c`,
              bar: "right",
              onPress: async () => {
                await clipboard.writeText(currentMessage.replace(/`/g, ""));
                toast(`Copied`);
                setTimeout(() => {
                  exitChat();
                }, 1000);
              },
            },
            {
              name: "Paste",
              key: `${cmd}+p`,
              bar: "right",
              onPress: async () => {
                await setSelectedText(currentMessage.replace(/`/g, ""));
                setTimeout(() => {
                  exitChat();
                }, 1000);
              },
            },
            {
              name: "Save",
              key: `${cmd}+s`,
              bar: "right",
              onPress: async () => {
                await inspect(
                  priorMessage + "\n" + currentMessage,
                  `conversations/${Date.now()}.md`
                );
                exitChat();
              },
            },
          ],
        });
      },
    },
  ],
});

await llm.call([
  new SystemChatMessage(formattedPrompt),
  new HumanChatMessage(userPrompt),
]);
