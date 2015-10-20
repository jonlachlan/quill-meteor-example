This is an example of live-text editing using Quill on Meteor.

See this example live: [quill-reactive-ot.meteor.com](quill-reactive-ot.meteor.com)

In my particular use-case, I wanted users to have the autonomy to click "Save" to apply their changes, rather than live-editing. And since multiple people might be editing a document at the same time, I didn't want new edits to overwrite another user's work in progress.

The template in the example successfully applies changes from down the wire, while maintaining all unsaved edits for the user.

If you want to have live edits (i.e., save as you type), then just uncomment the on text-changes code.

For me, the key insight is client/quill.js line 65:
```
editor.updateContents(localChanges.transform(remoteChanges, 0));
```
This uses ottypes (which Quill is build on) to transform the positions of any edits that were made from the server based on what changes were made locally -- this way one set of edits doesn't overwrite another.
