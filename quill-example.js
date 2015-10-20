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
    MyCollection.remove({});
    MyCollection.insert({
      myField: "here is my text.",
      myFieldDelta: { ops: [ {insert: "here is my text. "}]}
    });
  });
}
