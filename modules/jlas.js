// Handlebars Helper Module
import { JLASHandlebarsHelpers } from "./handlebarshelpers.mjs";
import { JLASTextEditor } from "./texteditor.mjs";

/* -------------------------------------------- */
/*  Module Initialization                  */
/* -------------------------------------------- */

/**
 * Init hook.
 */
Hooks.once("init", async function() {
  console.log(`JLAS | Add Journals Like a Script functionality`);
  
  // Register sheet application classes
  Handlebars.unregisterHelper("editor");
  Handlebars.registerHelper("editor", JLASHandlebarsHelpers.editor);

  // Activate the additional listerers for JLASTextEditor
  JLASTextEditor.activateListeners();
});
