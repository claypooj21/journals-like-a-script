// Import the extended text editor.
import { JLASListener } from "./listener.mjs";

/* -------------------------------------------- */
/*  Module Initialization                  */
/* -------------------------------------------- */

/**
 * Init hook.
 */
Hooks.once("init", async function() {
  console.log(`JLAS | Add Journals Like a Script functionality`);

  CONFIG.TextEditor.enrichers = CONFIG.TextEditor.enrichers.concat([
    {
      // Derived from resources/app/client/ui/editor.js
      pattern : new RegExp(`@(ActivateScene)\\[([^\\]]+)\\](?:{([^}]+)})?`, 'g'),
      enricher : (match, options) => {
        let [type, target, name] = match.slice(1, 4);
        console.log(`JLAS | Match: ${match}`);
        console.log(`JLAS | Type: ${type}`);
        console.log(`JLAS | Target: ${target}`);
        console.log(`JLAS | Name: ${name}`);
        // Prepare replacement data
        const data = {
          cls: ["jlas-activate-scene"],
          icon: null,
          dataset: {},
          name: name
        };
        let broken = false;
        let doc_type = "Scene";

        // Get the linked Scene
        const config = CONFIG[doc_type];
        const collection = game.collections.get(doc_type);
        const doc = /^[a-zA-Z0-9]{16}$/.test(target) ? collection.get(target) : collection.getName(target);
        if (!doc) broken = true;

        // Update link data
        data.name = data.name || (broken ? target : doc.name);
        data.icon = config.sidebarIcon;
        data.dataset = {type, entity: doc_type, id: broken ? null : doc.id};

        // Flag a link as broken
        if (broken) {
          data.icon = "fas fa-unlink";
          data.cls.push("broken");
        }

        // Construct the formed link
        const a = document.createElement('a');
        a.classList.add(...data.cls);
        a.draggable = false;
        for (let [k, v] of Object.entries(data.dataset)) {
          a.dataset[k] = v;
        };
        a.innerHTML = `<i class="${data.icon}"></i> ${data.name}`;
        console.log("JLAS | Formed link:");
        console.log(a);
        return a;
      }
    }
  ]);

  JLASListener.activateListeners();

});
