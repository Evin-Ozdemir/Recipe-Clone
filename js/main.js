// Uuid benzersiz id'ler oluşturan bir kütüphanedir.
// Bu projede tarif malzemeleri için benzersiz id'ler oluşturmak istediğimizden bu kütüphaneyi kullandık.
import { v4 } from "https://jspm.dev/uuid";
import Search from "./api.js";
import {
  controlBtn,
  elements,
  getFromLocalStorage,
  setToLocalStorage,
} from "./helpers.js";
import { Recipe } from "./recipe.js";
import { renderBasketItems, renderLoader, renderResults } from "./ui.js";

// Localstorage daki sepet verilerini al ve bir diziye aktar
let basket = getFromLocalStorage("basket") || [];
// Recipe classının örneğini al
const recipe = new Recipe();

// ? Fonksiyonlar

// ! Formun gönderilmesi durumunda çalışacak fonksiyon
const handleSumbit = async (e) => {
  e.preventDefault();
  console.log(e);

  // Input içerisindeki değere erişme
  const query = e.target[0].value;

  // Eğer query yoksa uyarı ver
  if (!query) {
    Toastify({
      text: "Input boş bırakılamaz !",
      duration: 3000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #FF9D23, #F93827)",
      },
      onClick: function () {},
    }).showToast();

    return;
    // Eğer query yoksa uyarı ver ve kodu durdur
  }
  // Eğer query varsa API işlemlerini yap
  const search = new Search(query);
  renderLoader(elements.resultList);
  try {
    // Search classı içerisindeki getResult fonk. çalıştır ve verileri al
    await search.getResults();
    // Gelen verileri ui.js deki renderResults ile ekrana render et
    renderResults(search.result);
  } catch (err) {
    // Bir hata olursa bunu yakala ve uyarı ver
    alert("Aradığınız kriterde tarif bulunmadı");
  }
  // Input içerisini sıfırla
  e.target[0].value = "";
};
// ! Sayfa yüklendiğinde ve id değişince çalışacak fonksiyon
const controlRecipe = async () => {
  // Ui dosyasında url e geçilen # ile id y api a gönderirsek hata alırız.
  // Bunun önlemek için replace("#","") ile # kaldırdık.
  const id = window.location.hash.replace("#", "");
  if (id) {
    renderLoader(elements.recipeArea);
    try {
      await recipe.getRecipe(id);
      recipe.renderRecipe(recipe.info);
    } catch (err) {}
  }
};

// ! RecipeArea ya tıklanıldığında çalışacak fonksiyon
const handleClick = (e) => {
  // Sepet iconuna tıklanırsa
  if (e.target.id === "add-to-basket") {
    recipe.ingredients.forEach((title) => {
      // Malzeme için bir obje oluştur ve sepete ekle
      const newItem = { id: v4(), title };
      basket.push(newItem);
    });

    // Sepeti güncelle ve arayüzü render et
    setToLocalStorage("basket", basket);
    renderBasketItems(basket);
    controlBtn(basket); // Clear button kontrolü
  }

  // Like butonuna tıklanırsa
  if (e.target.id === "like-btn") {
    recipe.controlLike();
  }
};

// ! Sepetteki ürünü silen fonksiyon
const deleteItem = (e) => {
  if (e.target.id === "delete-item") {
    // Tıklanılan elemanın kapsam elemanına eriş
    const parentElement = e.target.parentElement;
    // ParentElemanın id'sine eriş
    const parentId = parentElement.dataset.id;
    // Sepetteki ürünlerin arasında id'si bilinen elemanı sepetten kaldır
    basket = basket.filter((i) => i.id != parentId);
    // Sepetin güncel halini localstorage a gönder
    setToLocalStorage("basket", basket);
    // Elemanı arayüzden de kaldır
    parentElement.remove();
    // Sepetteki ürün miktarına göre clearBtn i render et
    controlBtn(basket);
  }
};

// ! Sepeti sıfırlayan fonksiyon
const handleClear = () => {
  // Kullanıcıdan silmek istediğinize eminmisiniz şeklinde bir onay al
  const res = confirm("Bütün sepet silinecek!! Eminmisiniz ??");

  if (res) {
    // localstorage'ı temizle
    setToLocalStorage("basket", null);

    // basket dizisini sıfırla
    basket = [];

    // Sepet alanın Html'ini boşalt
    elements.basketList.innerHTML = "";

    // Sepetteki ürün miktarına göre clearBtn'i render et
    controlBtn(basket);
  }
};

// ? Olay İzleyicileri

// ! Formun gönderilmesini izle
elements.form.addEventListener("submit", handleSumbit);

// ! Url'deki değişimi ve sayfa yüklenmesini izle
["load", "hashchange"].forEach((eventName) => {
  window.addEventListener(eventName, controlRecipe);

  // Sayfa yüklendiğinde sepetteki verileri render et
  renderBasketItems(basket);
  // Sepetteki ürün miktarına göre clearBtn i render et
  controlBtn(basket);
});

// ! Recipe alanındaki tıklanmaları izle
elements.recipeArea.addEventListener("click", handleClick);

// ! Sepetteki ürünleri tıklanılma olayını izle
elements.basketList.addEventListener("click", deleteItem);

// ! ClearBtn e tıklanma olayını izle
elements.clearBtn.addEventListener("click", handleClear);
