const GET_WEATHER_API = 'https://api.weatherapi.com/v1/current.json?key=352d093325924260b28150556201912&q=Ghent';
const GET_COVID_CASES_API = 'https://data.stad.gent/api/records/1.0/search/?dataset=dataset-of-cumulative-number-of-confirmed-cases-by-municipality&q=';
let username = document.getElementById('search_field').val;
let noUsername = `test`
const GET_GITHUB_SEARCH = `https://api.github.com/search/users?sort=desc&page=1&per_page=100&q=${username !== undefined ? username : noUsername}`;
const GET_GITHUB_REPO = `https://api.github.com/users/${username !== undefined ? username : noUsername}/repos?page=1&per_page=50`;
const GET_GITHUB_FOLLOW =`https://api.github.com/users/${username !== undefined ? username : noUsername}/followers?page=1&per_page=100`;
// console.log(GET_GITHUB_SEARCH)
// console.log( GET_GITHUB_REPO)
// console.log(GET_GITHUB_FOLLOW)
const USERS_API = 'data/pgm.json';
(() => {
  const app = {

    initialize() {
      this.cacheElements()
      this.buildUI()
      this.searchFunction()
      this.getPGMTeam()
      this.changeTheme()
    },
    cacheElements () {
      this.$getCurrentWheater = document.querySelector('.weather_in');
      this.$getCovidCases = document.querySelector('.covid_cases');
      this.$pgmTeamList = document.querySelector('.pgm_team-list');
      this.$userSpecifickDetails = document.querySelector('.git_user-details-inner')
      this.$gitHubFollowers = document.querySelector('.git_user-followers-ul');
      this.$gitSearchResults = document.querySelector('.git_search-result');
      this.$gitHubRepositories = document.querySelector('.git_user-repos-ul');
      this.$themeToggleButton = document.querySelector('.theme_toggle')
      this.$header = document.querySelector('.header')
      this.$search = document.querySelector('.git_search')
      this.$user = document.querySelector('.git_user')
      this.$user_repo = document.querySelector('.git_user-details')  
      this.$user_follow  = document.querySelector('.git_user-repos')
      this.$user_details  = document.querySelector('.git_user-followers')
      this.$toggleON = document.querySelector('.theme_on')
      this.$toggleOFF = document.querySelector('.theme_off')
      this.$theme_on_mark = document.querySelector('.theme_on-mark')
      this.$theme_off_mark = document.querySelector('.theme_off-mark')
    },
    buildUI() {
      this.$getCurrentWheater.innerHTML = this.getWheaterFromAPI();
      this.$getCovidCases.innerHTML = this.getCovidCasesfromAPI();
    },
    changeTheme(){
      let body = document.querySelector('body')
      this.$themeToggleButton.addEventListener('click', (evt) => {
        if(body.classList.contains('open')) {
          body.classList.remove('open')
          this.$header.classList.remove('open')
          this.$search.classList.remove('open')
          this.$pgmTeamList.classList.remove('open')
          this.$gitSearchResults.classList.remove('open')
          this.$user.classList.remove('open')
          this.$user_repo.classList.remove('open')
          this.$user_follow.classList.remove('open')
          this.$user_details.classList.remove('open')
          this.$toggleON.classList.remove('open')
          this.$toggleOFF.classList.add('open')
          this.$theme_on_mark.classList.remove('open')
          this.$theme_off_mark.classList.add('open')
        } else {
          body.classList.add('open')
          this.$pgmTeamList.classList.add('open')
          this.$header.classList.add('open')
          this.$search.classList.add('open')
          this.$gitSearchResults.classList.add('open')
          this.$user.classList.add('open')
          this.$user_repo.classList.add('open')
          this.$user_follow.classList.add('open')
          this.$user_details.classList.add('open')          
          this.$toggleON.classList.add('open')
          this.$toggleOFF.classList.remove('open')
          this.$theme_on_mark.classList.add('open')
          this.$theme_off_mark.classList.remove('open')
        }
      })
    },
     async getWheaterFromAPI() {
       try {
         const response = await fetch(GET_WEATHER_API)
         const jsonData = await response.json()
         this.CreateWheaterAPIForHTML(jsonData)
       } catch(error) {
         console.log(error)
       }
      },
    CreateWheaterAPIForHTML(data) {
      console.log(data);
      this.$getCurrentWheater.innerHTML = `
      <p>${data.current.temp_c}°C</p> <img src="${data.current.condition.icon}">`  
    },
   async getCovidCasesfromAPI() {
      try {
      const response = await fetch(GET_COVID_CASES_API)
      const jsonData = await response.json()
      this.CreateCovidCasesForHTML(jsonData)
      } catch(error) {
        console.log(error)
      }
    },
    CreateCovidCasesForHTML(data) {
      console.log(data);
      this.$getCovidCases.innerHTML = `
      <p>${data.records[0].fields.cases}</p>`
    },
    async searchFunction() {
      const githubAPI = new GitHubAPI();
      const $searchField = document.getElementById('searchResult')
      const $submitButton = document.getElementById('search_field')
      $searchField.addEventListener('submit', async (event) => {
        event.preventDefault();
        if ($submitButton.value.length) {
          const jsonFile = await githubAPI.getSearchFieldUsers($submitButton.value);
          console.log('-=-=-=')
          const users = jsonFile.items.map(U => {
            return U
          })
          this.UpdateGitHubUsersResults(users);
        }
      })
    },
    UpdateGitHubUsersResults(users) {
      this.$gitSearchResults.innerHTML = users.map(user => {
        return `
        <li class="user_specific-info" data-id="${user.id}">
        <img src="${user.avatar_url}">
        <p>${user.login}</p>
        </li>`
      }).join('')
      let $userinfo = document.querySelectorAll('.user_specific-info')
      $userinfo.forEach(user => {
        user.addEventListener('click', (evt) => {
          this.DatasetId = evt.target.dataset.id || evt.target.parentNode.dataset.id
          this.createHTMLFromSearchInput(users);
        })
      })
    },
    createHTMLFromSearchInput(users) {
        users.map(userMap => {
          if (this.DatasetId == userMap.id) {
           this.$userSpecifickDetails.innerHTML = `
           <div class="user_image" style="background-image: url(${userMap.avatar_url})">
           </div>
           `
          }
        if (this.DatasetId == userMap.id) {
          fetch(userMap.followers_url)
          .then(response => response.json())
          .then(json => {
            this.createHTMLforFollowers(json)
          })
          fetch(userMap.repos_url)
          .then(response => response.json())
          .then(json => {
            this.createHTMLforRepositories(json)
          })
        }
      })   
    },
     async createHTMLforFollowers(data) {
      let tempStr = '';
      console.log(data)
      if (data.length !== null){
       data.map((per) => {
         console.log(per)
        // console.log(per.avatar_url)
        tempStr += `
        <li class="user_specific-followers-info" data-id="${per.id}">
        <img src="${per.avatar_url !== undefined ? per.avatar_url : per.thumbnail}" data-id="${per.id}">
        <section>
        <p data-id="${per.id}">${per.login}</p>
        </section>
        </li>`
        return this.$gitHubFollowers.innerHTML = tempStr
          })
      this.SpecificUSerFollowerClick(data)
      }

    },
    createHTMLforRepositories(data) {
      let tempStr = '';
       data.map((per) => {
        // console.log(per.avatar_url)
        tempStr += `
        <li>
        <section>
        <h2>${per.name}</h2>
        <p>${per.description !== null || undefined ? per.description : "-"}</p>
        </section>
        <p>${per.size}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill-rule="evenodd" d="M5.75 21a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM2.5 19.25a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0zM5.75 6.5a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM2.5 4.75a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0zM18.25 6.5a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM15 4.75a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0z"></path><path fill-rule="evenodd" d="M5.75 16.75A.75.75 0 006.5 16V8A.75.75 0 005 8v8c0 .414.336.75.75.75z"></path><path fill-rule="evenodd" d="M17.5 8.75v-1H19v1a3.75 3.75 0 01-3.75 3.75h-7a1.75 1.75 0 00-1.75 1.75H5A3.25 3.25 0 018.25 11h7a2.25 2.25 0 002.25-2.25z"></path></svg> 
        ${per.default_branch}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill-rule="evenodd" d="M12.75 2.75a.75.75 0 00-1.5 0V4.5H9.276a1.75 1.75 0 00-.985.303L6.596 5.957A.25.25 0 016.455 6H2.353a.75.75 0 100 1.5H3.93L.563 15.18a.762.762 0 00.21.88c.08.064.161.125.309.221.186.121.452.278.792.433.68.311 1.662.62 2.876.62a6.919 6.919 0 002.876-.62c.34-.155.606-.312.792-.433.15-.097.23-.158.31-.223a.75.75 0 00.209-.878L5.569 7.5h.886c.351 0 .694-.106.984-.303l1.696-1.154A.25.25 0 019.275 6h1.975v14.5H6.763a.75.75 0 000 1.5h10.474a.75.75 0 000-1.5H12.75V6h1.974c.05 0 .1.015.14.043l1.697 1.154c.29.197.633.303.984.303h.886l-3.368 7.68a.75.75 0 00.23.896c.012.009 0 0 .002 0a3.154 3.154 0 00.31.206c.185.112.45.256.79.4a7.343 7.343 0 002.855.568 7.343 7.343 0 002.856-.569c.338-.143.604-.287.79-.399a3.5 3.5 0 00.31-.206.75.75 0 00.23-.896L20.07 7.5h1.578a.75.75 0 000-1.5h-4.102a.25.25 0 01-.14-.043l-1.697-1.154a1.75 1.75 0 00-.984-.303H12.75V2.75zM2.193 15.198a5.418 5.418 0 002.557.635 5.418 5.418 0 002.557-.635L4.75 9.368l-2.557 5.83zm14.51-.024c.082.04.174.083.275.126.53.223 1.305.45 2.272.45a5.846 5.846 0 002.547-.576L19.25 9.367l-2.547 5.807z"></path></svg>
        ${per.license !== null || undefined ? per.license.key : ""}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M13 15.5a1 1 0 11-2 0 1 1 0 012 0zm-.25-8.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5z"></path><path fill-rule="evenodd" d="M11.46.637a1.75 1.75 0 011.08 0l8.25 2.675A1.75 1.75 0 0122 4.976V10c0 6.19-3.77 10.705-9.401 12.83a1.699 1.699 0 01-1.198 0C5.771 20.704 2 16.19 2 10V4.976c0-.76.49-1.43 1.21-1.664L11.46.637zm.617 1.426a.25.25 0 00-.154 0L3.673 4.74a.249.249 0 00-.173.237V10c0 5.461 3.28 9.483 8.43 11.426a.2.2 0 00.14 0C17.22 19.483 20.5 15.46 20.5 10V4.976a.25.25 0 00-.173-.237l-8.25-2.676z"></path></svg>
         ${per.private === false ? "public" : "private"}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill-rule="evenodd" d="M12 21a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zm-3.25-1.75a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0zm-3-12.75a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM2.5 4.75a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0zM18.25 6.5a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM15 4.75a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0z"></path><path fill-rule="evenodd" d="M6.5 7.75v1A2.25 2.25 0 008.75 11h6.5a2.25 2.25 0 002.25-2.25v-1H19v1a3.75 3.75 0 01-3.75 3.75h-6.5A3.75 3.75 0 015 8.75v-1h1.5z"></path><path fill-rule="evenodd" d="M11.25 16.25v-5h1.5v5h-1.5z"></path></svg>
         ${per.open_issues}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 7a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0112 7zm1 9a1 1 0 11-2 0 1 1 0 012 0z"></path><path fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z"></path></svg>
         ${per.watchers}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M15.5 12a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z"></path><path fill-rule="evenodd" d="M12 3.5c-3.432 0-6.125 1.534-8.054 3.24C2.02 8.445.814 10.352.33 11.202a1.6 1.6 0 000 1.598c.484.85 1.69 2.758 3.616 4.46C5.876 18.966 8.568 20.5 12 20.5c3.432 0 6.125-1.534 8.054-3.24 1.926-1.704 3.132-3.611 3.616-4.461a1.6 1.6 0 000-1.598c-.484-.85-1.69-2.757-3.616-4.46C18.124 5.034 15.432 3.5 12 3.5zM1.633 11.945c.441-.774 1.551-2.528 3.307-4.08C6.69 6.314 9.045 5 12 5c2.955 0 5.309 1.315 7.06 2.864 1.756 1.553 2.866 3.307 3.307 4.08a.111.111 0 01.017.056.111.111 0 01-.017.056c-.441.774-1.551 2.527-3.307 4.08C17.31 17.685 14.955 19 12 19c-2.955 0-5.309-1.315-7.06-2.864-1.756-1.553-2.866-3.306-3.307-4.08A.11.11 0 011.616 12a.11.11 0 01.017-.055z"></path></svg>
         <a href="${per.svn_url}" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M15.5 2.25a.75.75 0 01.75-.75h5.5a.75.75 0 01.75.75v5.5a.75.75 0 01-1.5 0V4.06l-6.22 6.22a.75.75 0 11-1.06-1.06L19.94 3h-3.69a.75.75 0 01-.75-.75z"></path><path d="M2.5 4.25c0-.966.784-1.75 1.75-1.75h8.5a.75.75 0 010 1.5h-8.5a.25.25 0 00-.25.25v15.5c0 .138.112.25.25.25h15.5a.25.25 0 00.25-.25v-8.5a.75.75 0 011.5 0v8.5a1.75 1.75 0 01-1.75 1.75H4.25a1.75 1.75 0 01-1.75-1.75V4.25z"></path></svg>
         </a><p>
        </li>`
      })
      return this.$gitHubRepositories.innerHTML = tempStr
    },
     async getPGMTeam() {
      const pgmTeamFunction = new UsersAPI()
      const pgmJSONfile = await pgmTeamFunction.createHTMLForPgmteam()
      const team = pgmJSONfile
      this.createHTMLForPgmTeamFromJson(team)
    },
    async createHTMLForPgmTeamFromJson(team) {
      console.log(team)
      tempStr = "";
      team.map(member => {
        tempStr += `
        <li class="pgmTeam_click" data-id="${member.id}">
        <section data-id="${member.id}">
        <img src="${member.thumbnail}" data-id="${member.id}"><p>${member.firstName} ${member.LastName}</p>
        </section>
        <section data-id="${member.id}">
        <p data-id="${member.id}">${member.portfolio.Github}</p>
        </section>
        </li>`
        return this.$pgmTeamList.innerHTML = tempStr
      }).join('')
      let $userinfo = document.querySelectorAll('.pgmTeam_click')
      $userinfo.forEach(user => {
        user.addEventListener('click', (evt) => {
          this.DatasetId = evt.target.dataset.id || evt.target.parentNode.dataset.id
          this.createHTMLFrompgmTeamMembers(team);
        })
      })
    },
    createHTMLFrompgmTeamMembers(team){
      team.map(Us => {
          if (Us.id == this.DatasetId) {
            console.log('member ID ok!')
            console.log(Us.firstName)
            let Bday = new Date(Us.geboortedatum)
            //get the year the team member was born
            let birthYear = Bday.getUTCFullYear()
            //use the member's birth year and substact the epoch tine year (1970)
            let age = Math.abs(birthYear - 1970)
            this.$userSpecifickDetails.innerHTML = `
        <div class="user_image" style="background-image: url(${Us.thumbnail})">
        <h2>${Us.teacher == true ? "Teacher" : "Student"}</h2>
        <p>${Us.lijfspruek}</p>
        <h3>${Us.firstName} ${Us.LastName} / ${age} Jaar oud</h3>
        <a href="" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M15.5 2.25a.75.75 0 01.75-.75h5.5a.75.75 0 01.75.75v5.5a.75.75 0 01-1.5 0V4.06l-6.22 6.22a.75.75 0 11-1.06-1.06L19.94 3h-3.69a.75.75 0 01-.75-.75z"></path><path d="M2.5 4.25c0-.966.784-1.75 1.75-1.75h8.5a.75.75 0 010 1.5h-8.5a.25.25 0 00-.25.25v15.5c0 .138.112.25.25.25h15.5a.25.25 0 00.25-.25v-8.5a.75.75 0 011.5 0v8.5a1.75 1.75 0 01-1.75 1.75H4.25a1.75 1.75 0 01-1.75-1.75V4.25z"></path></svg>
        </a>
        </div>
        `
        fetch(`https://api.github.com/users/${Us.portfolio.Github}/repos?page=1&per_page=50`)
        .then(response => response.json())
        .then(json => {
          this.createHTMLforRepositories(json)
         fetch(`https://api.github.com/users/${Us.portfolio.Github}/followers?page=1&per_page=100`)
         .then(response => response.json())
         .then(json => {
           this.pgmTeamFollowers = json
           console.log('1')
           this.createHTMLforFollowers(json)
         })
        })
      }
      })
    },
    // getpgmTeamApis(){
    //   console.log(this.pgmTeamrepos)
    //   console.log(this.pgmTeamFollowers)
    //   tempStr = '';
    //   this.pgmTeamrepos.map(repo => {
    //     tempStr =         tempStr += `
    //     <li class="user_specific-followers-info" data-id="${repo.id}">
    //     <img src="${repo.avatar_url}" data-id="${repo.id}">
    //     <section>
    //     <p data-id="${repo.id}">${repo.login}</p>
    //     </section>
    //     </li>`
    //     return this.$gitHubFollowers.innerHTML = tempStr
    //   })
    //   this.pgmTeamFollowers.map(follower => {

    //   })
    // },
    SpecificUSerFollowerClick(data) {
      let $userinfo = document.querySelectorAll('.user_specific-followers-info')
      console.log($userinfo)
      $userinfo.forEach(user => {
        user.addEventListener('click', (evt) => {
          this.Dataid = evt.target.dataset.id || evt.target.parentNode.id
          this.createHTMLFromSpecificUSerFollower(data)
        })
      })
    },
    createHTMLFromSpecificUSerFollower(data) {
      console.log(data)
      data.map(userMap => {
        if (this.Dataid == userMap.id) {
         this.$userSpecifickDetails.innerHTML = `
         <div class="user_image" style="background-image: url(${userMap.avatar_url})">
         </div>
         `
        }
      if (this.Dataid == userMap.id) {
        fetch(userMap.followers_url)
        .then(response => response.json())
        .then(json => {
          this.createHTMLforFollowers(json)
                  fetch(userMap.repos_url)
        .then(response => response.json())
        .then(json => {
          this.createHTMLforRepositories(json)
        })
        })

      }
    })   
    },
    async createHTMLforFollowersSpecific(data) {
      let tempStr = '';
       data.map((per) => {
        // console.log(per.avatar_url)
        tempStr += `
        <li class="user_specific-followers-info" data-id="${per.id}">
        <img src="${per.avatar_url}" data-id="${per.id}">
        <section>
        <p data-id="${per.id}">${per.login}</p>
        </section>
        </li>`
        return this.$gitHubFollowers.innerHTML = tempStr
          })
          let $userinfo = document.querySelectorAll('.user_specific-followers-info')
          console.log($userinfo)
          $userinfo.forEach(user => {
            user.addEventListener('click', (evt) => {
              this.Dataid = evt.target.dataset.id || evt.target.parentNode.id
              this.createHTMLFromSpecificUSerFollower(data)
            })
          })
        },
    // createHTMLforRepositoriesSpecific(data) {
    //   let tempStr = '';
    //    data.map((per) => {
    //     // console.log(per.avatar_url)
    //     tempStr += `
    //     <li>
    //     <section>
    //     <h2>${per.name}</h2>
    //     <p>${per.description !== undefined || null ? per.description : "-"}</p>
    //     </section>
    //     <p>${per.size}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill-rule="evenodd" d="M5.75 21a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM2.5 19.25a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0zM5.75 6.5a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM2.5 4.75a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0zM18.25 6.5a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM15 4.75a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0z"></path><path fill-rule="evenodd" d="M5.75 16.75A.75.75 0 006.5 16V8A.75.75 0 005 8v8c0 .414.336.75.75.75z"></path><path fill-rule="evenodd" d="M17.5 8.75v-1H19v1a3.75 3.75 0 01-3.75 3.75h-7a1.75 1.75 0 00-1.75 1.75H5A3.25 3.25 0 018.25 11h7a2.25 2.25 0 002.25-2.25z"></path></svg> 
    //     ${per.default_branch}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill-rule="evenodd" d="M12.75 2.75a.75.75 0 00-1.5 0V4.5H9.276a1.75 1.75 0 00-.985.303L6.596 5.957A.25.25 0 016.455 6H2.353a.75.75 0 100 1.5H3.93L.563 15.18a.762.762 0 00.21.88c.08.064.161.125.309.221.186.121.452.278.792.433.68.311 1.662.62 2.876.62a6.919 6.919 0 002.876-.62c.34-.155.606-.312.792-.433.15-.097.23-.158.31-.223a.75.75 0 00.209-.878L5.569 7.5h.886c.351 0 .694-.106.984-.303l1.696-1.154A.25.25 0 019.275 6h1.975v14.5H6.763a.75.75 0 000 1.5h10.474a.75.75 0 000-1.5H12.75V6h1.974c.05 0 .1.015.14.043l1.697 1.154c.29.197.633.303.984.303h.886l-3.368 7.68a.75.75 0 00.23.896c.012.009 0 0 .002 0a3.154 3.154 0 00.31.206c.185.112.45.256.79.4a7.343 7.343 0 002.855.568 7.343 7.343 0 002.856-.569c.338-.143.604-.287.79-.399a3.5 3.5 0 00.31-.206.75.75 0 00.23-.896L20.07 7.5h1.578a.75.75 0 000-1.5h-4.102a.25.25 0 01-.14-.043l-1.697-1.154a1.75 1.75 0 00-.984-.303H12.75V2.75zM2.193 15.198a5.418 5.418 0 002.557.635 5.418 5.418 0 002.557-.635L4.75 9.368l-2.557 5.83zm14.51-.024c.082.04.174.083.275.126.53.223 1.305.45 2.272.45a5.846 5.846 0 002.547-.576L19.25 9.367l-2.547 5.807z"></path></svg>
    //     ${per.license !== null ? per.license.key : ""}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M13 15.5a1 1 0 11-2 0 1 1 0 012 0zm-.25-8.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5z"></path><path fill-rule="evenodd" d="M11.46.637a1.75 1.75 0 011.08 0l8.25 2.675A1.75 1.75 0 0122 4.976V10c0 6.19-3.77 10.705-9.401 12.83a1.699 1.699 0 01-1.198 0C5.771 20.704 2 16.19 2 10V4.976c0-.76.49-1.43 1.21-1.664L11.46.637zm.617 1.426a.25.25 0 00-.154 0L3.673 4.74a.249.249 0 00-.173.237V10c0 5.461 3.28 9.483 8.43 11.426a.2.2 0 00.14 0C17.22 19.483 20.5 15.46 20.5 10V4.976a.25.25 0 00-.173-.237l-8.25-2.676z"></path></svg>
    //      ${per.private === false ? "public" : "private"}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill-rule="evenodd" d="M12 21a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zm-3.25-1.75a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0zm-3-12.75a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM2.5 4.75a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0zM18.25 6.5a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM15 4.75a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0z"></path><path fill-rule="evenodd" d="M6.5 7.75v1A2.25 2.25 0 008.75 11h6.5a2.25 2.25 0 002.25-2.25v-1H19v1a3.75 3.75 0 01-3.75 3.75h-6.5A3.75 3.75 0 015 8.75v-1h1.5z"></path><path fill-rule="evenodd" d="M11.25 16.25v-5h1.5v5h-1.5z"></path></svg>
    //      ${per.open_issues}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 7a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0112 7zm1 9a1 1 0 11-2 0 1 1 0 012 0z"></path><path fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z"></path></svg>
    //      ${per.watchers}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M15.5 12a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z"></path><path fill-rule="evenodd" d="M12 3.5c-3.432 0-6.125 1.534-8.054 3.24C2.02 8.445.814 10.352.33 11.202a1.6 1.6 0 000 1.598c.484.85 1.69 2.758 3.616 4.46C5.876 18.966 8.568 20.5 12 20.5c3.432 0 6.125-1.534 8.054-3.24 1.926-1.704 3.132-3.611 3.616-4.461a1.6 1.6 0 000-1.598c-.484-.85-1.69-2.757-3.616-4.46C18.124 5.034 15.432 3.5 12 3.5zM1.633 11.945c.441-.774 1.551-2.528 3.307-4.08C6.69 6.314 9.045 5 12 5c2.955 0 5.309 1.315 7.06 2.864 1.756 1.553 2.866 3.307 3.307 4.08a.111.111 0 01.017.056.111.111 0 01-.017.056c-.441.774-1.551 2.527-3.307 4.08C17.31 17.685 14.955 19 12 19c-2.955 0-5.309-1.315-7.06-2.864-1.756-1.553-2.866-3.306-3.307-4.08A.11.11 0 011.616 12a.11.11 0 01.017-.055z"></path></svg>
    //      <a href="${per.svn_url}" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M15.5 2.25a.75.75 0 01.75-.75h5.5a.75.75 0 01.75.75v5.5a.75.75 0 01-1.5 0V4.06l-6.22 6.22a.75.75 0 11-1.06-1.06L19.94 3h-3.69a.75.75 0 01-.75-.75z"></path><path d="M2.5 4.25c0-.966.784-1.75 1.75-1.75h8.5a.75.75 0 010 1.5h-8.5a.25.25 0 00-.25.25v15.5c0 .138.112.25.25.25h15.5a.25.25 0 00.25-.25v-8.5a.75.75 0 011.5 0v8.5a1.75 1.75 0 01-1.75 1.75H4.25a1.75 1.75 0 01-1.75-1.75V4.25z"></path></svg>
    //      </a><p>
    //     </li>`
    //   })
    //   return this.$gitHubRepositories.innerHTML = tempStr
    // },

  }
  app.initialize() 
})();