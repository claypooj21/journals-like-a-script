export class JLASListener {
  static activateListeners() {
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
    console.log(`JLAS | a: ${a}`);
    let scene = game.scenes.get(a.dataset.id);
    console.log(`JLAS | scene: ${scene}`);

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
