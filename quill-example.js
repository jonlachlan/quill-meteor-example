MyCollection = new Mongo.Collection('myCollection')

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.quillExample.helpers({
    editorDataReady: function () {
      var doc = MyCollection.findOne({});
      if(doc) {
        return true
      }
      // return (Meteor.user()) // need at least a user id. If you are using routes
    },
    editorHelper: function() {
      return {
        collection: MyCollection,
        docId: function() {
          return MyCollection.findOne({})._id;
        },
        field: "myField"
      }
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.setInterval(function() {
      MyCollection.remove({});
      MyCollection.insert({
        myField: '<div contenteditable="true" spellcheck="false"><span class="author-anonymousUser">H</span>ere is my text. </div><div contenteditable="true" spellcheck="false"><span class="author-anonymousUser">If this is unsaved text, it will not be overwritten.</span></div><div contenteditable="true" spellcheck="false"><b class="author-anonymousUser">I can even have rich formatting</b></div><ol><li contenteditable="true" spellcheck="false"><span class="author-anonymousUser">like numbered lists</span></li></ol><ul><li contenteditable="true" spellcheck="false"><span class="author-anonymousUser">and ordered lists</span></li><li contenteditable="true" spellcheck="false"><span class="author-anonymousUser">And edits from server can be inserted anywhere, without deleting my work in progress.</span></li></ul><div contenteditable="true" spellcheck="false"><span class="author-anonymousUser">Toggle live editing with the button above.</span></div><div contenteditable="true" spellcheck="false"><span class="author-anonymousUser"><i>Does it work for you? Does it break? Let me know https://github.com/jonlachlan/quill-meteor-example/issues</i></span></div>',
        myFieldDelta: { ops: [
          {insert: "Here is my text. "},
          {insert: "↵If this is unsaved text, it will not be overwritten.↵"},
          {insert: "I can even have rich formatting", attributes: {bold: true}},
          {insert: "↵like numbered lists"},
          {insert: "↵", attributes: {list: true}},
          {insert: "↵and ordered lists"},
          {insert: "↵", attributes: {bullet: true}},
          {insert: "↵And edits from server can be inserted anywhere, without deleting my work in progress."},
          {insert: "↵Toggle live editing with the button above."},
          {insert: "↵Does it work for you? Does it break? Let me know https://github.com/jonlachlan/quill-meteor-example/issues", attributes: {italic: true}}
        ]},
      });
    }, 600000); // reset every 10 minutes
  });
}
