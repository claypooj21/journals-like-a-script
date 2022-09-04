# Journals Like a Script
Allows GMs to embed links in journal entries that activate scenes and pull up the scene notes in a single click.

# Because Your Game is Scripted
Make the flow of your game easier with this tiny mod. Journals Like a Script (JLAS) lets you embed clickable links into your journal entries that activate a scene and open the scene's notes. No more fumbling trying to find the right tab--just point and click when you hit the right spot in your story. JLAS makes your journal entries feel more like a movie script (you know, with actors and scenes and stuff, get it?) and saves you some time and hassle.

# Installation and Setup
Either search for "Journals Like a Script" in Foundry's built-in module installation dialog, clone the repo from github into your `FoundryVTT/Data/modules` directory, or download the release you want and unpack it into your `FoundryVTT/Data/modules` directory. Then, open a world, navigate to `Game Settings > Manage Modules` and make sure Journals Like a Script is checked. Let the game session reload, and you're all set!

# How to Use It
1. Open or create a new journal entry.
2. Go to edit mode.
3. Get the UUID of the scene you want to link to. The easiest way to do this is to drag the scene you want to create an activation link for into the journal entry. The UUID is everything in the `[]`, not including `Scene.`. For example, if the text created from dragging the scene was `@UUID[Scene.SmHxdEH8WlNkOsBD]{A Dark and Stormy Night}`, the UUID is `SmHxdEH8WlNkOsBD`.
4. Change the text of the link to `@ActivateScene[UUID]{link_text}`. Using the example above, the text for your link might look like: `@ActivateScene[SmHxdEH8WlNkOsBD]{Activate A Dark and Stormy Night}`.
5. When you save from edit mode, your link will be embedded in your journal entry. Try it out!

# How It Works
## v2.0.0 (Foundry v10)
JLAS adds a custom enricher to Foundry's `TextEditor` class. JLAS's enricher instructs Foundry's `TextEditor` to also look for the `@ActivateScene[UUID]{link_text}` regular expression in addition the typical `@UUID[DocumentType.doc_UUID]{document_name}` expression when it creates embedded links. JLAS then adds an `onClick` event listener to all the `@ActivateScene` embedded links. The `onClick` event handles activating and opening the notes for the scene.

The `onClick` event JLAS creates looks for the `.jlas-activate-scene` CSS class to avoid conflicts with Foundry's existing `.entity-link` and `.content-link` classes. `.jlas-activate-scene` uses the same styling that those classes use.

## v1.0.0 (Foundry v9)
JLAS extends the `TextEditor` class of Foundry without removing any of the editor's previous capability. JLAS modifies the `TextEditor`'s `enhanceHTML` function to also look for the `@ActivateScene[scene_id]{scene_name}` regular expression in addition the typical `@DocumentType[document_id]{document_name}` expression when it creates embedded links. JLAS then adds an `onClick` event listener to all the `@ActivateScene` embedded links. The `onClick` event handles activating and opening the notes for the scene.

The `onClick` event JLAS creates looks for the `.jlas-activate-scene` CSS class to avoid conflicts with Foundry's existing `.entity-link` and `.content-link` classes. `.jlas-activate-scene` uses the same styling that those classes use, so it integrates seamlessly with Foundry's boilerplate style.

# Conflicts
Because JLAS inherits and/or extends Foundry's built-in TinyMCE, it will most likely conflict with any module or system that registers a different (or likewise extended) editor.

# Sidenotes About Compatibility
JLAS v1.0.0 was tested on Foundry VTT version 9 build 269. I don't intend to check that it's backwards-compatible with previous Foundry releases, but it very well may be. If you test it on a previous version of Foundry and it works, feel free to drop it in the issues module, or make a pull request with a manifest.json update.

JLAS v2.0.0 will not work with versions of Foundry prior to 10.
