let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form")
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("div#toy-collection")
  //console.log(toyCollection)
  
  loadToys()
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  
  form.addEventListener("submit", function(e){
    e.preventDefault()
    const toyName = document.querySelector("input[name='name']").value
    const toyUrl = document.querySelector("input[name='image']").value
    const numOfCurrentToys = document.querySelectorAll('.card').length
    let toyLikes = 0
    let toyObject = {
      name: toyName,
      image: toyUrl,
      likes: toyLikes,
      id: numOfCurrentToys + 1
    }
    renderToy(toyObject)
    addToDb(toyObject)
    e.target.reset()
  })
  toyCollection.addEventListener("click", function(e){
    if (e.target.matches(".like-button")){
      const card = e.target.closest('.card')
      let numOfLikes = card.querySelector('p')
      numOfLikes.textContent = parseInt(numOfLikes.textContent) + 1
      let likeCount = numOfLikes.textContent
      let toyId = card.dataset.id
      updateDb(toyId, likeCount)
      //console.log(toyId)
    }
  })
});

function loadToys() {
  fetch("http://localhost:3000/toys")
    .then(r => r.json())
    .then(arrayOfToys => {
      arrayOfToys.forEach(toyObj => renderToy(toyObj))
      })
}
      
function renderToy(toyObj){
  const divCollection = document.querySelector("div#toy-collection")
  const div = document.createElement("div")
  //const likeBtn = document.querySelector(".like-button")
  //console.log(likeBtn)
    div.className = "card"
    div.dataset.id = toyObj.id
      const h2 = document.createElement("h2")
      const img = document.createElement("img")
      const p = document.createElement("p")
      const btn = document.createElement("button")
        btn.className = "like-button"
        img.className = "toy-avatar"
      h2.textContent = toyObj.name
      img.src = toyObj.image
      p.textContent = toyObj.likes
      btn.textContent = "Like"
    div.append(h2, img, p, btn)
  divCollection.append(div)
}


function addToDb(toyObject) {
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(toyObject),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
}

function updateDb(toyId, newLikes){
  fetch(`http://localhost:3000/toys/${toyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
        //Accept: "application/json"
      },
      body: JSON.stringify({
        likes: newLikes
    })
  })
}