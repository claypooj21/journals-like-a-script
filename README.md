# Journals Like a Script
Allows GMs to embed links in journal entries that activate scenes or view scenes while simultaneously pulling up the scene notes in a single click.

# Because Your Game is Scripted
Make the flow of your game easier with this tiny mod. Journals Like a Script (JLAS) lets you embed clickable links into your journal entries that activate a scene and open the scene's notes. No more fumbling trying to find the right tab--just point and click when you hit the right spot in your story. JLAS makes your journal entries feel more like a movie script (you know, with actors and scenes and stuff, get it?) and saves you some time and hassle. Don't want to activate the scene? Would you rather just view it and open the journal entry? You can do that too by holding `ctrl` while you click.

# Installation and Setup
Either search for "Journals Like a Script" in Foundry's built-in module installation dialog, clone the repo from github into your `FoundryVTT/Data/modules` directory, or download the release you want and unpack it into your `FoundryVTT/Data/modules` directory. Then, open a world, navigate to `Game Settings > Manage Modules` and make sure Journals Like a Script is checked. Let the game session reload, and you're all set!

# How to Use It
Functionality has expanded in JLAS v2.0.1! You can now embed `@ActivateScene` or `@ViewScene` links. Additionally, you can configure JLAS to limit what your players see when they read journal entries with `@ActivateScene` links.

## Embedding Activation Links
1. Open or create a new journal entry.
2. Go to edit mode.
3. Get the UUID of the scene you want to link to. The easiest way to do this is to drag the scene you want to create an activation link for into the journal entry. The UUID is everything in the `[]`, not including `Scene.`. For example, if the text created from dragging the scene was `@UUID[Scene.SmHxdEH8WlNkOsBD]{A Dark and Stormy Night}`, the UUID is `SmHxdEH8WlNkOsBD`.
4. Change the text of the link to `@ActivateScene[UUID]{link_text}`. Using the example above, the text for your link might look like: `@ActivateScene[SmHxdEH8WlNkOsBD]{Activate A Dark and Stormy Night}`.
5. When you save from edit mode, your link will be embedded in your journal entry.
6. You have two options: Either `primary click` the link to activate the scene and open the scene's journal, or `ctrl + primary click` to view the scene and open the journal. Try it out!

## Embedding View Links
1. Open or create a new journal entry.
2. Go to edit mode.
3. Get the UUID of the scene you want to link to. The easiest way to do this is to drag the scene you want to create an activation link for into the journal entry. The UUID is everything in the `[]`, not including `Scene.`. For example, if the text created from dragging the scene was `@UUID[Scene.SmHxdEH8WlNkOsBD]{A Dark and Stormy Night}`, the UUID is `SmHxdEH8WlNkOsBD`.
4. Change the text of the link to `@ViewScene[UUID]{link_text}`. Using the example above, the text for your link might look like: `@ActivateScene[SmHxdEH8WlNkOsBD]{View A Dark and Stormy Night}`.
5. When you save from edit mode, your link will be embedded in your journal entry.
6. Click the link to view the scene and pull up the associated journal entry. NOTE: `ctrl + primary click` doesn't do anything special for `@ViewScene` links.

## Configuration Options
With v2.0.1, you can now configure what your players (non-GM users) see when accessing journal entries with JLAS activation links.

### `@ActivateScene` Link Visibility
This setting is worldwide. It determines what non-GM users see from a JLAS `@ActivateScene` link; it doesn't affect `@ViewScene` links.

* Link (default): The link is displayed the same for GMs and Players. Players can click `@ActivateScene` links.
* Text Only: The link is converted to text for non-GM users. Players see the same text as GMs, but there is no link for them to click.
* None: The `@ActivateScene` link and associated text is completely removed for Players. They shall not see the link, touch it, smell, or hear it! They will not perceive it even if the journal page is open before them!

### Players Can View Scenes Using `@ActivateScene` Links
This setting is worldwide. WARNING: THIS MAY ALLOW PLAYERS TO VIEW SCENES THAT ARE NOT DISPLAYED IN THE NAVIGATION TABS. If checked, when a non-GM user clicks an `@ActivateScene` link, that user will view the associated scene. This allows the GM to give players the ability to navigate to scenes from the same journal entries and links that the GM uses.

By default, this is unchecked. If `@ActivateScene` Link Visibility is not 'Link', this doesn't do anything. This does not affect `@ViewScene` links in any way.

# Tips and Tricks

* Setting the link visibility affects every `@ActivateScene` link in your game (but not `@ViewScene` links!). If you'd like to hide your individual links--either `@Activate Scene` or `@ViewScene`--from players until just the right moment, place the link in a `Secret` paragraph. You can format a paragraph as `Secret` by selecting `Format -> Block -> Secret` in the text editor. Foundry v10.290 and earlier does not have a built-in in-line `Secret` format unfortunately.
* `@ViewScene` links are useful if you want players to be able to autonomously navigate to links on their own. They work just like `@ActivateScene` links, except that they only view scenes.
* JLAS can be configured such that `@Activate Scene` and `@ViewScene` links both allow users to view a scene, but this forces the GM to name the links without using spoilers. JLAS provides both `@Activate Scene` and `@ViewScene` links so that the GM can add spoiler text to `@Activate Scene` links while keeping all the secrets using `@ViewScene` links for their players. This works best if you set *\@ActivateScene Link Visibility* to *None* and leave *Players Can View Scenes Using \@ActivateScene Links* unchecked.
* The only way to restrict which players can use which `@ActivateScene` or `@ViewScene` links is by changing journal ownership and/or journal page ownership. You have to set the journal ownership for the player(s) to at least *Limited* before the player's can view it on their own.

# How It Works
## v2.0.0 (Foundry v10)
JLAS adds two custom enrichers to Foundry's `TextEditor` class. JLAS's enrichers instructs Foundry's `TextEditor` to also look for the `@ActivateScene[UUID]{link_text}` and `@ViewScene[UUID]{link_text}` regular expressions in addition the typical `@UUID[DocumentType.doc_UUID]{document_name}` expression when it creates embedded links. JLAS then adds an `onClick` event listener to all the `@ActivateScene` and `@ViewScene` embedded links. The `onClick` event handles activating and opening the notes for the scene.

The `onClick` event JLAS creates looks for `.jlas-activate-scene` or `.jlas-view-scene` CSS classes to avoid conflicts with Foundry's existing `.entity-link` and `.content-link` classes. `.jlas-activate-scene` and `jlas-view-scene` use the same styling that Foundry's `.entity-link` and `.content-link` classes use.

## v1.0.0 (Foundry v9)
JLAS extends the `TextEditor` class of Foundry without removing any of the editor's previous capability. JLAS modifies the `TextEditor`'s `enhanceHTML` function to also look for the `@ActivateScene[scene_id]{scene_name}` regular expression in addition the typical `@DocumentType[document_id]{document_name}` expression when it creates embedded links. JLAS then adds an `onClick` event listener to all the `@ActivateScene` embedded links. The `onClick` event handles activating and opening the notes for the scene.

The `onClick` event JLAS creates looks for the `.jlas-activate-scene` CSS class to avoid conflicts with Foundry's existing `.entity-link` and `.content-link` classes. `.jlas-activate-scene` uses the same styling that those classes use, so it integrates seamlessly with Foundry's boilerplate style.

# Conflicts
Because JLAS inherits and/or extends Foundry's built-in TinyMCE, it will most likely conflict with any module or system that registers a different (or likewise extended) editor.

# Sidenotes About Compatibility
JLAS v1.0.0 was tested on Foundry VTT version 9 build 269. I don't intend to check that it's backwards-compatible with previous Foundry releases, but it very well may be. If you test it on a previous version of Foundry and it works, feel free to drop it in the issues module, or make a pull request with a manifest.json update.

JLAS v2.0.0 will not work with versions of Foundry prior to 10.
