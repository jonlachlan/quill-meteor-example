MyCollection = new Mongo.Collection('myCollection')

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.quillExample.helpers({
    editorDataReady: function () {
      return true;
      // return (Meteor.user()) // need at least a user id. If you are using routes
    },
    docId: function() {
      var doc = MyCollection.findOne({});
      if(doc) {
        return doc._id
      }
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if(MyCollection.find().fetch().length < 1) {
      MyCollection.insert({
        myField: "here is my text."
      });
    }
  });
}
