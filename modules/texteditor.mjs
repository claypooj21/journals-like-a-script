/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {TextEditor}
 */
export class JLASTextEditor extends TextEditor {

  /*
   * Enrich HTML content by replacing or augmenting components of it
   * @param {string} content        The original HTML content (as a string)
   * @param {object} [options={}]   Additional options which configure how HTML is enriched
   * @param {boolean} [options.secrets=false]      Include secret tags in the final HTML? If false secret blocks will be removed.
   * @param {boolean} [options.documents=true]     Replace dynamic document links?
   * @param {boolean} [options.links=true]         Replace hyperlink content?
   * @param {boolean} [options.rolls=true]         Replace inline dice rolls?
   * @param {Object|Function} [options.rollData]   The data object providing context for inline rolls
   * @return {string}               The enriched HTML content
   */
  /** @inheritdoc */
  static enrichHTML(content, {secrets=false, documents=true, links=true, rolls=true, rollData, ...options}={}) {

    // Create the HTML element
    const html = document.createElement("div");
    html.innerHTML = super.enrichHTML(content, {secrets=false, documents=true, links=true, rolls=true, rollData, ...options}={});

    // Plan text content replacements
    let text = [];

    // Replace document links
    if ( options.entities ) {
      console.warn("The 'entities' option for TextEditor.enrichHTML is deprecated. Please use 'documents' instead.");
      documents = options.entities;
    }

    if ( documents ) {
      text = this._getTextNodes(html);
      const rgx = new RegExp(`@(ActivateScene)\\[([^\\]]+)\\](?:{([^}]+)})?`, 'g');
      this._replaceTextContent(text, rgx, this._createActivateSceneLink);
    }

    // Return the enriched HTML
    return html.innerHTML;
  };

/**
   * Create a dynamic document link from a regular expression match
   * @param {string} match          The full matched string
   * @param {string} type           The matched document type or "Compendium"
   * @param {string} target         The requested match target (_id or name)
   * @param {string} name           A customized or over-ridden display name for the link
   * @return {HTMLAnchorElement}    An HTML element for the document link
   * @private
   */
  static _createActivateSceneLink(match, type, target, name) {

    console.log("JLAS | Creating Content Links");
    console.log("JLAS | match:", match);
    console.log("JLAS | type:", type);
    console.log("JLAS | target:", target);
    console.log("JLAS | name:", name);

    // If this link isn't supposed to activate a scene, exit.
    if (type !== "ActivateScene") return;
    console.log("JLAS | Recognized ActivateScene type");

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
    }
    a.innerHTML = `<i class="${data.icon}"></i> ${data.name}`;
    console.log("JLAS | Formed link:");
    console.log(a);
    return a;
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @inheritdoc */
  static activateListeners() {
    super.activateListeners();
    console.log("JLAS | Activating listeners.");
    const body = $("body");
    body.on("click", "a.jlas-activate-scene", this._onClickActivateScene);
  }

  /* -------------------------------------------- */

  /**
   * Handle click events on links that activate scenes.
   * @param {Event} event
   * @private
   */
  static async _onClickActivateScene(event) {
    event.preventDefault();
    console.log("JLAS | Clicked activate scene link.");
    const  a = event.currentTarget;
    console.log("JLAS | a:", a);
    let scene = game.scenes.get(a.dataset.id);
    console.log("JLAS | scene:", scene);

    // If the scene doesn't exist, gracefully exit.
    if ( !scene ) return;

    // Activate the scene.
    scene.activate();

    // If the scene has notes, get those and open them.
    if ( scene.journal ) {
      if ( !scene.journal.testUserPermission(game.user, "LIMITED") ) {
        return ui.notifications.warn(`You do not have permission to view this ${scene.journal.documentName} sheet.`);
      };
    };

    // Render the scene notes, if any.
    return scene.journal.sheet.render(true);
  }
}
