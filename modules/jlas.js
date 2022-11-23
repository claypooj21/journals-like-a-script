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

  // Register module settings
  game.settings.register("journals-like-a-script", "sceneLinkVisibility", {
    name: "@ActivateScene Link Visibility",
    hint: "This setting is worldwide. Determines what non-GM users see from a JLAS @ActivateScene link. Link (default): the link is displayed the same for GMs and Players; Text Only: the link is converted to text for non-GM users; None: the link is completely removed from the text.",
    scope: "world",
    config: true,
    requiresReload: false,
    type: Number,
    choices: {
      0: "Link",
      1: "Text Only",
      2: "None"
    },
    default: 0
  });

  game.settings.register("journals-like-a-script", "playersViewScenes", {
    name: "Players Can View Scenes Using @ActivateScene Links",
    hint: "This setting is worldwide. WARNING: THIS MAY ALLOW PLAYERS TO VIEW SCENES THAT ARE NOT DISPLAYED IN THE NAVIGATION TABS. If checked, when a non-GM user clicks a JLAS @ActivateScene link, they will view the associated scene. Default is unchecked. If @ActivateScene Link Visibility is not 'Link', this doesn't do anything.",
    scope: "world",
    config: true,
    requiresReload: false,
    type: Boolean,
    default: false
  });

  // Establish the base enricher.
  const jlas_enricher = (match, {activate = true, cls = "jlas-activate-scene"}={}) => {
    let [type, target, name] = match.slice(1, 4);
    console.log(`JLAS | Match: ${match}`);
    console.log(`JLAS | Type: ${type}`);
    console.log(`JLAS | Target: ${target}`);
    console.log(`JLAS | Name: ${name}`);

    // Prepare replacement data
    const data = {
      cls: [cls],
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

    // Check if the user has permissions to use this link. If not, determine
    // how much of the link should show based on the settings.
    if ( !doc.canUserModify(game.user, "update" ) && activate) {
      const visibility = game.settings.get("journals-like-a-script","sceneLinkVisibility");
      if(visibility == 1) return document.createTextNode(`${data.name}`);
      if(visibility == 2) return document.createElement('wbr');
    };

    // Update link data
    data.name = data.name || (broken ? target : doc.name);
    data.icon = config.sidebarIcon;
    data.dataset = {type, entity: doc_type, id: broken ? null : doc.id};

    // Flag a link as broken
    if (broken) {
      data.icon = "fas fa-unlink";
      data.cls.push("broken");
    };

    // Construct the formed link
    const a = document.createElement('a');
    a.classList.add(...data.cls);
    a.draggable = false;
    for (let [k, v] of Object.entries(data.dataset)) {
      a.dataset[k] = v;
    };
    a.innerHTML = `<i class="${data.icon}"></i> ${data.name}`;
    console.log("JLAS | Formed Scene link:");
    console.log(a);
    return a;
  };

  // Add the activate scene text enricher.
  CONFIG.TextEditor.enrichers = CONFIG.TextEditor.enrichers.concat([
    {
      // Derived from resources/app/client/ui/editor.js
      pattern : new RegExp(`@(ActivateScene)\\[([^\\]]+)\\](?:{([^}]+)})?`, 'g'),
      enricher : jlas_enricher
    }
  ]);

  // Add the view scene text enricher.
  CONFIG.TextEditor.enrichers = CONFIG.TextEditor.enrichers.concat([
    {
      // Derived from resources/app/client/ui/editor.js
      pattern : new RegExp(`@(ViewScene)\\[([^\\]]+)\\](?:{([^}]+)})?`, 'g'),
      enricher : (match, options) => jlas_enricher(match,{activate:false, cls:"jlas-view-scene"})
    }
  ]);

  JLASListener.activateListeners();

});
