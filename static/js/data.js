const GET_WEATHER_API = 'http://api.weatherapi.com/v1/current.json?key=352d093325924260b28150556201912&q=Ghent'
const GET_COVID_CASES_API = 'https://data.stad.gent/api/records/1.0/search/?dataset=dataset-of-cumulative-number-of-confirmed-cases-by-municipality&q='
const GET_GITHUB_SEARCH = 'https://api.github.com/search/users?sort=desc&page=1&per_page=100&q=%24%7Bname%7D'
const GET_GITHUB_REPO = 'https://api.github.com/users/${username}/repos?page=1&per_page=50'
const GET_GITHUB_FOLLOW ='https://api.github.com/users/${username}/followers?page=1&per_page=100'
(() => {
  const app = {

    initialize() {
      this.cacheElements()
      this.buildUI()
    },
    cacheElements () {
      this.$getCurrentWheater = document.querySelector('.wheater_in')
    },
    buildUI() {
this.$getCurrentWheater.innerHTML = this.getWheaterFromAPI()
    },
    getWheaterFromAPI() {
      fetch(GET_WEATHER_API, {})
        .then(response => response.json())
        .then(json => {
          this.wheaterAPI = json
          this.CreateWheaterAPIForHTML(json)
        })
        .catch (error => console.log(error))
    },
    CreateWheaterAPIForHTML(data) {
      console.log(data)
    }
  }
  app.initialize() 
})();