// const URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
// const result = document.getElementById("result");
// const sound = document.getElementById("sound");
// const btn = document.getElementById("search-btn");

// btn.addEventListener("click", () => {
//   let inpWord = document.getElementById("inp-word").value;
//   fetch(`${URL}${inpWord}`)
//     .then((response) =>
//       response.json()
//     )
//     .then((data) => {
//       console.log(data);
//       result.innerHTML = `
//       <div class="word">
//       <h3>${inpWord} </h3>
//       <button onclick="playSound()"><i class="fa-solid fa-volume-high"></i></button>
//   </div>
//   <div class="details">
//       <p>${data[0].meanings[0].partOfSpeech} </p>
//       <p>/${data[0].phonetic} /</p>
//   </div>
//   <p class="word-meaning">${data[0].meanings[0].definitions[0].definition}</p>
//   <p class="word-example">${data[0].meanings[0].definitions[0].example || ""}</p>`;
//   sound.setAttribute("src",`https:${data[0].phonetics[0].audio}`);
// });
// });

// function playSound () {
//     sound.play();
// }

const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");

btn.addEventListener("click", () => {
  let inpWord = document.getElementById("inp-word").value.trim();
  if (inpWord === "") {
    result.innerHTML = `<h3 class="error">Please enter a word</h3>`;
    return;
  }

  fetch(`${url}${inpWord}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.length === 0) {
        throw new Error("No data found");
      }
      console.log(data);
      const wordData = data[0];
      const meanings = wordData.meanings[0];
      const phonetics = wordData.phonetics[0];
      let meaning, example,phon;
      for (def of data[0].meanings) {
        let flag = false;
        for (defi of  data[0].meanings[0].definitions) {
          if (defi.definition && defi.example) {
            meaning = defi.definition;
            example = defi.example;
            flag = true;
            break;
          }
        }
       if (flag) break;
      }

      if(!(data[0].phonetic))
        {
            for(phone of data[0].phonetics)
                {
                    if(phone.text)
                        {
                            phon = phone.text;
                            break;
                        }
                }
        }

      result.innerHTML = `
            <div class="word">
                    <h3>${inpWord}</h3>
                    <button onclick="playSound()">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
                <div class="details">
                    <p>${meanings.partOfSpeech || ""}</p>
                    <p>/${phon || wordData.phonetic || ""}/</p>
                </div>
                <p class="word-meaning">
                   ${meaning || data[0].meanings[0].definitions[0].definition || ""}
                </p>
                <p class="word-example">
                    ${example || "No Example available"}
                </p>`;

      if (phonetics && phonetics.audio) {
        sound.setAttribute(
          "src",
          phonetics.audio.startsWith("https")
            ? phonetics.audio
            : `https:${phonetics.audio}`
        );
      } else {
        sound.setAttribute("src", "");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
    });
});

function playSound() {
  sound.play();
}
