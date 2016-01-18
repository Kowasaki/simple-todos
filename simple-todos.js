Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  // Code only runs on client
  Template.body.helpers({
    tasks: function() {
      if (Session.get("hideCompleted")){
        //If hide completed is checked, filter tasks
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
      return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function() {
      return Session.get("hideCompleted");
    },
    incompleteCount: function() {
      if (Tasks.find({checked: {$ne: true}}).count() > 0){
        return Tasks.find({checked: {$ne: true}}).count() + " tasks left!";
      } else {
        return "all tasks completed! Yay!"
      }
      
    }
  });

  Template.body.events({
    "submit .new-task": function (event){
      //Prevent default browser form submit
      event.preventDefault();

      //Get value from element
      var text = event.target.text.value;

      //Insert a text into the collection
      Tasks.insert({
        text: text,
        createdAt: new Date() //current time

      });

      //Clear form
      event.target.text.value = "";
    },
    "change .hide-completed input": function(event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });

  Template.task.events({
    "click .toggle-checked": function() {
      Tasks.update(this._id, {
        $set: {checked: ! this.checked}
      });
    },
    "click .delete": function(){
      Tasks.remove(this._id);
    }
  });
}

// if (Meteor.isServer) {
//   Meteor.startup(function () {
//     // code to run on server at startup
//   });
// }
