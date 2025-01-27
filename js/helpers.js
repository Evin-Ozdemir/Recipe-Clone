export const elements = {
  form: document.querySelector("form"),
  resultList: document.querySelector(".results"),
  recipeArea: document.querySelector(".recipe"),
  basketList: document.querySelector(".shopping ul"),
  clearBtn: document.querySelector("#clear"),
  likeList: document.querySelector(".list"),
};

// Localstorage a kayıt yapacak fonksiyon
export const setToLocalStorage = (key, data) => {
  // Dışarıdan alınan datayı stringe çevir
  const strData = JSON.stringify(data);

  // Stringe cevrilen elemanı localstorage a kayıt et
  localStorage.setItem(key, strData);
};

export const getFromLocalStorage = (key) => {
  // Belirtilen key değerine sahip elemanları localstorage dan al
  const strData = localStorage.getItem(key);
  // Localstorage dan gelen veriyi js nesnesine cevir
  const data = JSON.parse(strData);
  return data;
};

export const controlBtn = (basket) => {
  // Sepete ürün varsa clearBtn i göster
  if (basket.length > 0) {
    elements.clearBtn.style.display = "block";
  } else {
    // Sepete ürün yoksa clearBtn i gösterme
    elements.clearBtn.style.display = "none";
  }
};
