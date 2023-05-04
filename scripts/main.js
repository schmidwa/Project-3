const clientId = '67cf7885f0994edc99ad34e943eec543';
const redirectUri = 'https://w3stu.cs.jmu.edu/schmidwa/343s23/Project-3/';

let playlist_info = ""


function getToken(clientId, redirectUri, code) {
  if (!(clientId && redirectUri && code)) {
    console.error('requires', clientId, redirectUri, code)
  }
  let codeVerifier = localStorage.getItem('code_verifier');

  let body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier
  });

  return fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('HTTP status ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      localStorage.setItem('access_token', data.access_token);
      return data.access_token;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

/*
const searchForm = document.getElementById("top-search");
searchForm.onsubmit = (ev) => {
  console.log("submitted top-search with", ev);
  ev.preventDefault();
  // https://stackoverflow.com/a/26892365/1449799
  const formData = new FormData(ev.target);
  // console.log(formData)
  // for (const pair of formData.entries()) {
  //   console.log(`${pair[0]}, ${pair[1]}`);
  // }
  const queryText = formData.get("query");
  console.log("queryText", queryText);

  const rhymeResultsPromise = getRhymes(queryText);
  rhymeResultsPromise.then((rhymeResults) => {
    const rhymeListItemsArray = rhymeResults.map(rhymObj2DOMObj);
    console.log("rhymeListItemsArray", rhymeListItemsArray);
    const rhymeResultsUL = document.getElementById("rhyme-results");
    rhymeListItemsArray.forEach((rhymeLi) => {
      rhymeResultsUL.appendChild(rhymeLi);
    });
  });
};
*/
// THE CODE ABOVE COULD BE A USEFUL TEMPLATE

// ===== DeepAI =====
do_api_call = false
if (do_api_call) {
  deepai.setApiKey('a838e6cf-6a8d-4d3d-9398-311327a78c3d');

  (async function() {
      var resp = await deepai.callStandardApi("text2img", {
              text: '',
      });
      console.log(resp);
  })()
}

// ===== Spotify =====
// code verifier
function generateRandomString(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Code Challenge

  // getting code from uri
  const urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get('code');
  if (code) {

    console.log('got code! 🙌', code)
    /*
    async function getProfile(accessToken) {
      // let accessToken = localStorage.getItem('access_token');

      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      });

      const data = await response.json();
      console.log(data)
    }
    getProfile(code)
    getProfileOther(code)
    */
  }

  let token = localStorage.getItem('access_token')
  console.log (token)
  if (!token && code)
  {
    console.log('clicccccked')
    console.log('gettoken', clientId, redirectUri, code)
    if (clientId && redirectUri && code) {
      getToken(clientId, redirectUri, code)
        .then(t => {
          token = t
          localStorage.setItem('access_token', token)
          return token
        }).then (getProfileOther) 
    }
  }

  if (token && code) {
    getProfileOther(token)
  }

const button = document.getElementById('begin')
  button.addEventListener('click', async ()=>{
    console.log ("THIS DOES SOMETHING")
    console.log('get token')

    async function generateCodeChallenge(codeVerifier) {
      function base64encode(string) {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
      }

      const encoder = new TextEncoder();
      const data = encoder.encode(codeVerifier);
      const digest = await window.crypto.subtle.digest('SHA-256', data);

      return base64encode(digest);
    }


    // const redirectUri = 'https://w3.cs.jmu.edu/stewarmc/343/s23/pkce';

    let codeVerifier = generateRandomString(128); 

    generateCodeChallenge(codeVerifier).then(codeChallenge => {
      let state = generateRandomString(16);
      let scope = 'user-read-private user-read-email';

      localStorage.setItem('code_verifier', codeVerifier);
      console.log(localStorage.getItem('code_verifier'))
      console.log (redirectUri)
      let args = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        state: state,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge
      });
      console.log (args)
      console.log("this should show up")
      window.location = 'https://accounts.spotify.com/authorize?' + args;
    });

  })

   // function to use the profile endpoint
   function getProfileOther(accessToken) {
    console.log("\n\nmade it here")
    return fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    }).then(r => r.json()).then(data => {
      console.log("Items: ", data.items)
      //for item in data.items:
      let section = document.getElementById("playlists");
      let names = []
      for (let i = 0; i < data.items.length; i++) {
        cur_name = data.items[i].name
        console.log(cur_name)
        names.push(cur_name)
        var element = document.createElement("button");

        element.innerHTML = cur_name
        element.addEventListener("click", ()=>{
          section.innerHTML = ""
          
          let wait_element = document.createElement("div")
          wait_element.innerHTML = "Please wait for the image to load"
          section.appendChild(wait_element)
          playlist_info = data.items[i]
          console.log ("Button has been clicked")
          console.log (playlist_info)
          playlist_info.tracks.href
          deepai.setApiKey('a838e6cf-6a8d-4d3d-9398-311327a78c3d');

          (async function() {
              var resp = await deepai.callStandardApi("text2img", {
                      text: 'Cover of an Album ' + playlist_info.name + ' With Absolutely No Text digital art',
              });
              console.log(resp);
              let image = document.createElement("img")
              image.src = resp.output_url //"https://play-lh.googleusercontent.com/P2VMEenhpIsubG2oWbvuLGrs0GyyzLiDosGTg8bi8htRXg9Uf0eUtHiUjC28p1jgHzo=w480-h960"
              section.appendChild(image)
          })()
          wait_element.innerHTML = ""


        })
        
        section.appendChild(element)
      }
      console.log(names)
      // now with names, create a button for each name
      console.log("\n\nData: ", data)
      return data;
    })
  }


// I COMMENTED EVERYTHING BELOW OUT, IT COULD BE USEFUL TO REFERENCE

// given a word (string), search for rhymes
// https://rhymebrain.com/api.html#rhyme
//  https://rhymebrain.com/talk?function=getRhymes&word=hello

// const getRhymes = (word) => {
//   console.log("attempting to get rhymes for", word);
//   return fetch(
//     `https://rhymebrain.com/talk?function=getRhymes&word=${word}`
//   ).then((resp) => resp.json());
// };

// const rhymObj2DOMObj = (rhymeObj) => {
//   //this should be an array where each element has a structure like
//   //
//   // "word": "no",
//   // "frequency": 28,
//   // "score": "300",
//   // "flags": "bc",
//   // "syllables": "1"
//   const rhymeListItem = document.createElement("li");
//   const rhymeButton = document.createElement("button");
//   rhymeButton.classList.add('btn')
//   rhymeButton.classList.add('btn-info')
//   rhymeButton.textContent = rhymeObj.word;
//   rhymeButton.onclick = searchForBook;
//   rhymeListItem.appendChild(rhymeButton);
//   return rhymeListItem;
// };

// const searchForBook = (ev) => {
//   const word = ev.target.textContent;
//   console.log("search for", word);
//   return fetch(`https://gutendex.com/books/?search=${word}`).then((r) =>
//     r.json()
//   ).then((bookResultsObj)=> {
//     // console.log(bookResultsObj.hasOwnProperty('results'))
//     const bookCardsArray = bookResultsObj.results.map(bookObj2DOMObj)
//     console.log("bookCardsArray", bookCardsArray);
//     const bookResultsElem = document.getElementById("book-results");
//     bookCardsArray.forEach(book=>bookResultsElem.appendChild(book))
//   })
// };

// const bookObj2DOMObj = (bookObj) => {
//   // {"id":70252,"title":"Threads gathered up : $b A sequel to \"Virgie's Inheritance\"","authors":[{"name":"Sheldon, Georgie, Mrs.","birth_year":1843,"death_year":1926}],"translators":[],"subjects":["American fiction -- 19th century"],"bookshelves":[],"languages":["en"],"copyright":false,"media_type":"Text","formats":{"image/jpeg":"https://www.gutenberg.org/cache/epub/70252/pg70252.cover.medium.jpg","application/rdf+xml":"https://www.gutenberg.org/ebooks/70252.rdf","text/plain":"https://www.gutenberg.org/ebooks/70252.txt.utf-8","application/x-mobipocket-ebook":"https://www.gutenberg.org/ebooks/70252.kf8.images","application/epub+zip":"https://www.gutenberg.org/ebooks/70252.epub3.images","text/html":"https://www.gutenberg.org/ebooks/70252.html.images","application/octet-stream":"https://www.gutenberg.org/files/70252/70252-0.zip","text/plain; charset=us-ascii":"https://www.gutenberg.org/files/70252/70252-0.txt"},"download_count":745},

//   // make a dom element
//   // add bookObj.title to the element
//   // return element

//   const bookCardDiv = document.createElement("div");
//   bookCardDiv.classList.add("card");

//   const bookCardBody = document.createElement("div");
//   bookCardBody.classList.add("card-body");

//   const titleElem = document.createElement("h5");
//   titleElem.textContent = bookObj.title;
//   bookCardBody.appendChild(titleElem);
//   const cardText = document.createElement("p");
//   cardText.textContent =
//     "Some quick example text to build on the card title and make up the bulk of the card's content.";
//   bookCardBody.appendChild(cardText);
//   if (bookObj?.formats?.["image/jpeg"]) {
//     const bookCardImg = document.createElement("img");
//     bookCardImg.classList.add("card-img-top");
//     bookCardImg.src = bookObj?.formats?.["image/jpeg"];
//     bookCardBody.appendChild(bookCardImg)
//   }
//   if (bookObj?.formats?.["text/plain"]) {
//     const bookTextLink = document.createElement("a");
//     bookTextLink.href = bookObj?.formats?.["text/plain"];
//     bookTextLink.classList.add("btn");
//     bookTextLink.classList.add("btn-primary");
//     bookTextLink.textContent = "Read It!";
//     bookCardBody.appendChild(bookTextLink);
//   }
//   bookCardDiv.appendChild(bookCardBody)
//   return bookCardDiv
  
// };
