
Template.quill.onRendered(function() {
  var tmpl = this;
  // var authorId = Meteor.user().username;

  tmpl.quillEditor = new Quill('#editor', {
    modules: {
      'authorship': {
        authorId: "anonymousUser", // should be authorId
      //   // button: "#author-button",
        enabled: true
      },
      // 'multi-cursor': {
      //   enabled: true
      // },
      'toolbar': {
        container: '#toolbar'
      },
      'link-tooltip': true
    },
    theme: 'snow'
  });

  var authorship = tmpl.quillEditor.getModule('authorship');

  // var cursorManager = tmpl.quillEditor.getModule('multi-cursor');
  // cursorManager.setCursor(authorId, 0, authorId, browserColors[BrowserDetect.browser])

  var fieldDelta = tmpl.data.field + "Delta";
  // var fieldCursor = tmpl.data.field + "Cursor";
  tmpl.quillEditor.oldDelta = tmpl.quillEditor.getContents();

  Tracker.autorun(function() {
    var editor = tmpl.quillEditor;
    var doc = tmpl.data.collection.findOne({_id:tmpl.data.docId});

    if(!doc[tmpl.data.field]) {
      var blankObj = {}
      blankObj[tmpl.data.field] = "";
      tmpl.data.collection.update({_id: tmpl.data.docId}, {$set: blankObj})
    }
    var remoteContents = doc[fieldDelta];
    var remoteHTML = doc[tmpl.data.field];

    var editorContents = editor.getContents();
    var diff = editorContents.diff(remoteContents);

    // editor.oldData is a new field created to store the last server update
    var oldContents = editor.oldDelta
    var localChanges = oldContents.diff(editorContents);
    var remoteChanges = oldContents.diff(remoteContents);

    // No "diff" means that this user made the last save, and there's nothing to update
    if(diff.ops.length > 0) {
      // THIS IS THE KEY TO MAKING UPDATES THAT WON'T OVERWRITE WORK IN PROGRESS
      editor.updateContents(localChanges.transform(remoteChanges, 0));
    }

    // Save our server update as a reference point for future changes
    editor.oldDelta = oldContents.compose(remoteChanges);
    // var cursor = doc[fieldCursor];
    // if(cursor) {
    //   _.forIn(cursor, function(cursorIndex, cursorAuthorId) {
    //     if(cursorAuthorId !== authorId) {
    //       cursorManager.setCursor(cursorAuthorId, cursorIndex, cursorAuthorId, browserColors[BrowserDetect.browser])
    //     }
    //   })
    // }
  });


  // Add basic editor's author
  // authorship.addAuthor(authorId, "lightBlue");


  // Add a cursor to represent basic editor's cursor
  // cursorManager.setCursor(Meteor.user().username + BrowserDetect.browser, tmpl.quillEditor.getLength()-1, Meteor.user().username + BrowserDetect.browser, browserColors[BrowserDetect.browser]);

  // Sync basic editor's cursor location
  // tmpl.quillEditor.on('selection-change', function(range) {
  //   if (range) {
  //     cursorManager.moveCursor(Meteor.user().username + BrowserDetect.browser, range.end);
  //     setObj = {};
  //     setObj[fieldCursor] = {}
  //     setObj[fieldCursor][authorId] = range.end;
  //     tmpl.data.collection.update({_id: tmpl.data.docId}, {$set: setObj})
  //   }
  // });

  // If you want to save on every change, use the text-change event below. We're using a save button
  Tracker.autorun(function() {
    if(Session.get("liveEditing")) {
      tmpl.quillEditor.on('text-change', function(delta, source) {
        if (source === 'user') {
          var newContents = tmpl.quillEditor.getContents();
          var newHTML = tmpl.quillEditor.getHTML();
          // newContents.updateContents(delta);
          setObj = {};
          setObj[fieldDelta] = newContents;
          setObj[tmpl.data.field] = newHTML;
          // setObj[fieldCursor] = {}
          // setObj[fieldCursor][authorId] = delta.length();
          tmpl.data.collection.update({_id: tmpl.data.docId}, {$set: setObj})
        }
      });
    } else {
      tmpl.quillEditor.on('text-change', function(delta, source) {
        // do nothing
        return false;
      })
    }
  });
});

Template.quill.helpers({
  liveEditing: function() {
    return Session.get("liveEditing");
  }
});


Template.quill.events({
  'click .ql-save': function(e, tmpl) {
    var editor = tmpl.quillEditor;
    var fieldDelta = tmpl.data.field + "Delta";
    var fieldPrevious = tmpl.data.field + "Diff";
    var newContents = editor.getContents();
    var newHTML = editor.getHTML();
    setObj = {};
    setObj[fieldDelta] = newContents;
    setObj[tmpl.data.field] = newHTML;
    // setObj[fieldCursor] = {}
    // setObj[fieldCursor][authorId] = delta.length();

    // This update assumes that we already have the latest contents in our editor
    tmpl.data.collection.update({_id: tmpl.data.docId}, {$set: setObj})
  }
});
