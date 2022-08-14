// Import the extended text editor.
import { JLASTextEditor } from "./texteditor.mjs";

/**
 * A collection of Handlebars template helpers which can be used within HTML templates.
 */
export class JLASHandlebarsHelpers extends HandlebarsHelpers {

  /*
   * Construct an editor element for rich text editing with TinyMCE
   * @param {object} options              Helper options
   * @param {string} [options.target]     The named target data element
   * @param {boolean} [options.owner]     Is the current user an owner of the data?
   * @param {boolean} [options.button]    Include a button used to activate the editor later?
   * @param {boolean} [options.editable]  Is the text editor area currently editable?
   * @param {boolean} [options.documents=true] Replace dynamic document links?
   * @param {Object|Function} [options.rollData] The data object providing context for inline rolls
   * @param {string} [options.content=""]  The original HTML content as a string
   * @return {Handlebars.SafeString}
   */
  /** @inheritdoc */
  static editor(options) {
    const target = options.hash['target'];
    if ( !target ) throw new Error("You must define the name of a target field.");

    // Enrich the content
    let documents = options.hash.documents !== false;
    if ( options.hash.entities !== undefined ) {
      console.warn("The 'entities' argument for the editor helper is deprecated. Please use 'documents' instead.");
      documents = options.hash.entities !== false;
    }
    const owner = Boolean(options.hash['owner']);
    const rollData = options.hash["rollData"];
    const content = JLASTextEditor.enrichHTML(options.hash['content'] || "", {secrets: owner, documents, rollData});

    // Construct the HTML
    let editor = $(`<div class="editor"><div class="editor-content" data-edit="${target}">${content}</div></div>`);

    // Append edit button
    const button = Boolean(options.hash['button']);
    const editable = Boolean(options.hash['editable']);
    if ( button && editable ) editor.append($('<a class="editor-edit"><i class="fas fa-edit"></i></a>'));
    return new Handlebars.SafeString(editor[0].outerHTML);
  }
}
