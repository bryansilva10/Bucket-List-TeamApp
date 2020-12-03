//DREW'S FUNCTIONS TO INTERACT WITH SERVER
function serverGet(itemsArray) {
  axios.get('/')
    .then(function (response) {
      let jsonData = JSON.parse(response);
      itemsArray = Array.from(jsonData);
      
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function serverDelete(id) {
  axios.delete('/:' + id) // Not sure how to refer to which item to delete. Same with .put for editing
    .then(function (response) {
      // success
      // should we reload the page here?
    })
    .catch(function (error) {
      console.log(error);
    });
}

function serverPost(userInputDesc) {
  axios.post('/', {

      // userInputDesc is whatever the user inputs for the description of new item
      description: userInputDesc

    })
    .then(function (response) {
      let jsonData = JSON.parse(response);
      return jsonData.id;
    })
    .catch(function (error) {
      console.log(error);
    });
}

// .put should be able to edit items already existing
function serverPut(id, userInputUpdatedDesc) {
  axios.put('/:' + id, {

      // userInputUpdatedDesc is whatever the user inputs to change the description to
      description: userInputUpdatedDesc

    })
    .then(function (response) {
      // success
      // should we reload the page here?
    })
    .catch(function (error) {
      console.log(error);
    });
}

//CLIENTSIDE CODE
//Accepts an item in js object form and whether it is in the right column. 
//Adds item to page in proper column.
function displayItem(onLeft, item) {
  if (onLeft) {
    itemClass = "item-left";
    column = document.getElementById("left-column");
  } else {
    itemClass = "item-right";
    column = document.getElementById("right-column");
  }
  itemString = "<div class=\"" + itemClass +
    "\"><div class=\"description\">" + item.description +
    "</div><div class=\"button\">Check</div></div>";

  column.insertAdjacentHTML("beforeend", itemString);
}

//Accepts an item in js object form and whether it is in the right column. 
//Adds item to page in proper column.
function displayItemEdit(itemID, item) {
  if (editOnLeft) {
    itemClass = "item-left";
    column = document.getElementById("left-column-edit");
    document.getElementById("leftAddButton").className = "hideButtonLeft"
    document.getElementById("rightAddButton").className = "showButtonRight";
  } else {
    itemClass = "item-right";
    column = document.getElementById("right-column-edit");
    document.getElementById("leftAddButton").className = "showButtonLeft";
    document.getElementById("rightAddButton").className = "hideButtonRight";
  }
  itemString = "<div class=\"" + itemClass +
    "\"><input type=\"text\" value=\"" + item.description +
    "\" onchange=\"modifyItem(" + itemID + ")\" class=\"description\" id=\"" + itemID + "\"><button class=\"button\" onclick=\"deleteItem(" + itemID + ")\">Delete</button></div>";

  column.insertAdjacentHTML("beforeend", itemString);
  editOnLeft = !editOnLeft;
}

//Accepts a list of items and whether the mode is Display or Edit.
//Displays them in columns.
function displayList(items, displayModeOn) {
  leftCount = Math.round(items.length / 2);

  if (displayModeOn) {
    document.getElementById("left-column").innerHTML = "";
    document.getElementById("right-column").innerHTML = "";
    for (i = 0; i < items.length; i++) {
      displayItem((i % 2 == 0), items[i]);
    }
  } else {
    document.getElementById("left-column-edit").innerHTML = "";
    document.getElementById("right-column-edit").innerHTML = "";
    for (i = 0; i < items.length; i++) {
      displayItemEdit(i, items[i]);
    }
  }

}

function modifyItem(itemID) {
  if (toModify.includes(itemID) || toAdd.includes(itemID)) {
    //Do nothing since the save function is already going to take care of these.
  } else {
    //If the item is up for deletion, restore it if it is modified.
    if (toDelete.includes(itemID)) {
      restoreItem(itemID);
    }
    toModify[toModify.length] = itemID;
  }
  console.log(document.getElementById(itemID).value);
}

function addItem() {
  itemID = idTracker;
  idTracker++;
  toAdd[toAdd.length] = itemID;
  displayItemEdit(itemID, {
    description: ""
  });
  console.log(document.getElementById(1).value);

}

//Only delete if not on add list, make sure that nothing is on both delete and modify.
function deleteItem(itemID) {
  if (toDelete.includes(itemID)) {
    restoreItem(itemID);
  } else {
    if (toAdd.includes(itemID)) {
      toAdd.splice(toAdd.indexOf(itemID), 1);
    } else {
      if (toModify.includes(itemID)) {
        toModify.splice(toModify.indexOf(itemID), 1);
      }
      toDelete[toDelete.length] = itemID;
    }
    //Add strikethrough to item
    document.getElementById(itemID).style.textDecoration = "line-through";
  }
}

function restoreItem(itemID) {
  if (toDelete.includes(itemID)) {
    toDelete.splice(toDelete.indexOf(itemID), 1);
  }
  //Remove strikethrough from item
  document.getElementById(itemID).style.textDecoration = "none";
}

//Switches to edit mode.
function edit() {
  toModify = new Array();
  toAdd = new Array();
  toDelete = new Array();
  editOnLeft = true;
  idTracker = items.length;
  displayList(items, false);
  document.getElementById("displayer").className = "hidden";
  document.getElementById("editor").className = "shown";
}

//Goes through items and modifies any items that need to be modified, 
//deletes any items that need to be deleted, and adds any items that 
//need to be added. Then, displays the new list. Then, sends the new 
//list to the server.
function save() {
  //Modify
  for (i = 0; i < toModify.length; i++) {
    items[toModify[i]].description = document.getElementById(toModify[i]).value;
    serverPut(items[toModify[i]].id, items[toModify[i]].description);
  }
  //Delete
  toDelete.sort();
  toDelete.reverse();
  for (i = 0; i < toDelete.length; i++) {
    serverDelete(items[toDelete[i]]);
    items.splice(toDelete[i], 1);
  }
  //Add
  for (i = 0; i < toAdd.length; i++) {
    let newDescription = document.getElementById(toAdd[i]).value;
    let newID = serverPost(desc);
    items[items.length] = {
      description: newDescription,
      id: newID,
    };
  }

  //Display list
  displayList(items, true);
  document.getElementById("displayer").className = "shown";
  document.getElementById("editor").className = "hidden";
}

//test code for debugging
testString = "Helloooooo there";
testItems = new Array({
  description: "do a flip"
}, {
  description: "do a barrel roll"
}, {
  description: "watch out"
}, {
  description: "be cool"
}, {
  description: "disguise as superman"
}, {
  description: "steal a mustache"
}, {
  description: "skydive"
}, {
  description: "do something evil"
}, {
  description: "kick this very bucket"
}, {
  description: "do something"
}, {
  description: "be something"
}, {
  description: "make a web app that stores bucket lists"
}, {
  description: "Add checkboxes so we can see if we have done the things"
});
testItems[testItems.length] = {
  description: testString
};
testItems[testItems.length] = {
  description: testString
};
testItems[testItems.length] = {
  description: testString
};
//var items = Array.from(testItems);


//actual code
//initialize items array
var items = new array;
serverGet(items);

var toModify = new Array();
var toAdd = new Array();
var toDelete = new Array();
var editOnLeft = true;
var idTracker = items.length;

//test code
displayList(items, true);
document.getElementById("displayer").className = "shown";
document.getElementById("editor").className = "hidden";