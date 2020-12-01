axios.get('/')
  .then(function (response) {
    let jsonData = JSON.parse(response);
    let arrayData = []
    // loop through jsonData of all the items to grab what info you need
    // and store it in arrayData to use your function that accepts an array of items
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
axios.delete('/:' + item.id) // Not sure how to refer to which item to delete. Same with .put for editing
  .then(function (response) {
    // success
    // should we reload the page here?
  })
  .catch(function (error) {
    console.log(error);
  });
axios.post('/', {
    
    // userInputDesc is whatever the user inputs for the description of new item
    description: userInputDesc 
    
  }) 
  .then(function (response) {
    // success
    // should we reload the page here?
  })
  .catch(function (error) {
    console.log(error);
  });
// .put should be able to edit items already existing
axios.put('/:' + item.id, {
    
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