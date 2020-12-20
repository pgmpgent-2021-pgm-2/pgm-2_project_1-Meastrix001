const GET_WEATHER_API = 'http://api.weatherapi.com/v1/current.json?key=352d093325924260b28150556201912&q=Ghent';
const GET_COVID_CASES_API = 'https://data.stad.gent/api/records/1.0/search/?dataset=dataset-of-cumulative-number-of-confirmed-cases-by-municipality&q=';
let username = document.getElementById('search_field').val;
console.log(document.getElementById('search_field').val)
let noUsername = `test`
const GET_GITHUB_SEARCH = `https://api.github.com/search/users?sort=desc&page=1&per_page=100&q=${username !== undefined ? username : noUsername}`;
const GET_GITHUB_REPO = `https://api.github.com/users/${username !== undefined ? username : noUsername}/repos?page=1&per_page=50`;
const GET_GITHUB_FOLLOW =`https://api.github.com/users/${username !== undefined ? username : noUsername}/followers?page=1&per_page=100`;
// console.log(GET_GITHUB_SEARCH)
// console.log( GET_GITHUB_REPO)
// console.log(GET_GITHUB_FOLLOW)
(() => {
  const app = {

    initialize() {
      this.cacheElements()
      this.buildUI()
      this.getAllGitApis()
    },
    cacheElements () {
      this.$getCurrentWheater = document.querySelector('.weather_in')
      this.$getCovidCases = document.querySelector('.covid_cases')
      this.$pgmTeamList = document.querySelector('.pgm_team-list')
      this.$gitHubFollowers = document.querySelector('.git_user-followers-ul')
      this.$gitSearchResults = document.querySelector('.git_user-repos-ul')
    },
    buildUI() {
      // this.$getCurrentWheater.innerHTML = this.getWheaterFromAPI();
      // this.$getCovidCases.innerHTML = this.getCovidCasesfromAPI();
    },
    getWheaterFromAPI() {
      fetch(GET_WEATHER_API, {})
      .then(response => response.json())
      .then(json => this.CreateWheaterAPIForHTML(json))
      .catch(error => console.log(error));
      },
    CreateWheaterAPIForHTML(data) {
      console.log(data)
      this.$getCurrentWheater.innerHTML = `
      <p>${data.current.temp_c}°C</p> <img src="${data.current.condition.icon}">`  
    },
    getCovidCasesfromAPI() {
      fetch(GET_COVID_CASES_API, {})
      .then(response => response.json())
      .then(json => this.CreateCovidCasesForHTML(json))
      .catch(error => console.log(error));
    },
    CreateCovidCasesForHTML(data) {
      console.log(data)
      this.$getCovidCases.innerHTML = `
      <p>${data.records[0].fields.cases}</p>`
    },
    getAllGitApis() { 
      fetch(GET_GITHUB_SEARCH, {})
      .then(response => response.json())
      .then((json) => {
        this.gitHubSearch = json;
        this.getGitHubRepoAPI()
      })
      .catch(error => console.log(error))
    },
    getGitHubRepoAPI() {
      fetch(GET_GITHUB_REPO, {})
      .then(response => response.json())
      .then((json) => {
        this.gitHubRepo = json;
        this.getGitHubfollowers()
        console.log(GET_GITHUB_FOLLOW)
      })
      .catch(error => console.log(error))
    },
    getGitHubfollowers() {
      fetch(GET_GITHUB_FOLLOW, {})
      .then(response => response.json())
      .then((json) => {
        this.gitHubFollowers = json;
        this.createHTMLForFollowers();
        this.createHTMLForRepositories();
        this.createHTMLForPGMTeam();
        
      })
      .catch(error => console.log(error))
    },
    createHTMLForFollowers() {
      // // this.gitHubSearch
      // // this.gitHubRepo
      // // this.gitHubFollowers
      // searchURL = window.location.search
      // searchForParam = new URLSearchParams(searchURL)
      // getParamID = searchForParam.get('id')
      let tempStr = '';
      // if (getParamID !== null || undefined) {
        this.gitHubFollowers.map(follower => {
          tempStr += `<li>${follower.login}</li> `
          return this.$gitHubFollowers.innerHTML = tempStr
        }); 
    },
    createHTMLForRepositories() {
      let tempStr = '';
      this.gitHubRepo.map(rep => {
      console.log(this.gitHubRepo)         
     tempStr += `<li>${rep.default_branch}</li> `
     console.log(tempStr)
     return this.$gitSearchResults.innerHTML = tempStr
   }) 
    },
    createHTMLForPGMTeam() {
      let tempStr = '';
      this.gitHubFollowers.map(rep => {
        let followURL = rep.followers_url
      console.log(this.gitHubRepo)         
     tempStr += `<li>${rep.followers_url}</li> `
     console.log(tempStr)
     return this.$gitSearchResults.innerHTML = tempStr
   }) 
    }
  }
  app.initialize() 
})();