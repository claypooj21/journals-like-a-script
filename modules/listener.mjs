export class JLASListener {
  static activateListeners() {
    console.log("JLAS | Activating listeners.");
    const body = $("body");
    body.on("click", "a.jlas-activate-scene", this._onClickActivateScene);
    body.on("click","a.jlas-view-scene", this._onClickViewScene);
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

    // If the scene doesn't exist, warn and exit.
    if ( !scene ) {
      return ui.notifications.warn("This link seems to be broken. Does the scene still exist?");
    };

    // If the user has permissions to modify, activate the scene. Otherwise, just
    // view the scene.
    const canView = game.settings.get("journals-like-a-script","playersViewScenes");
    const canMod = scene.canUserModify(game.user, "update");
    if ( ( !canMod && canView ) || ( canMod && event.ctrlKey ) ) {
      scene.view();
    } else {
      scene.activate();
    };

    // If the scene has notes, get those and open them.
    if ( scene.journal ) {
      if ( !scene.journal.testUserPermission(game.user, "LIMITED") ) {
        return ui.notifications.warn(`You do not have permission to view this: ${scene.journal.documentName}`);
      };
    };

    // Render the scene notes, if any.
    return scene.journal.sheet.render(true);
  }

  /**
   * Handle click events on links that view scenes.
   * @param {Event} event
   * @private
   */
  static async _onClickViewScene(event) {
    event.preventDefault();
    console.log("JLAS | Clicked view scene link.");
    const  a = event.currentTarget;
    console.log(`JLAS | a: ${a}`);
    let scene = game.scenes.get(a.dataset.id);
    console.log(`JLAS | scene: ${scene}`);

    // If the scene doesn't exist, warn and exit.
    if ( !scene ) {
      return ui.notifications.warn("This link seems to be broken. Does the scene still exist?");
    };

    // View the scene.
    scene.view();

    // If the scene has notes, get those and open them.
    if ( scene.journal ) {
      if ( !scene.journal.testUserPermission(game.user, "LIMITED") ) {
        return ui.notifications.warn(`You do not have permission to view this: ${scene.journal.documentName}`);
      };
    };

    // Render the scene notes, if any.
    return scene.journal.sheet.render(true);
  }
}
