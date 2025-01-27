class Search {
  constructor(query) {
    this.query = query;
    this.result = [];
  }
  async getResults() {
    // Api ye istek at
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/search?q=${this.query}`
    );
    // Gelen verileri json dan js nesnesine cevir
    const data = await res.json();
    // Js nesnesi içerisindeki recipes dizisini this.result a ata
    this.result = data.recipes;
  }
}
export default Search;
