function UsersAPI(params) {
  const USERS_API = './static/data/pgm.json';
  this.createHTMLForPgmteam = async () => { 
    try {
      const response = await fetch(USERS_API)
      const data = await response.json();
      return data
    } catch(error) {
      console.log(error)
    }
}
}

function GitHubAPI() {
  this.getSearchFieldUsers = async (name) => {
    return new Promise((resolve, reject) => {
      fetch(`https://api.github.com/search/users?sort=desc&page=1&per_page=100&q=${name}`)
      .then(response => response.json())
      .then(json => resolve(json))
      .catch(error => reject(error))
    })
  }
}

function GithubFollowers() {
  this.getUserFollowers = async (name) => {
    return new Promise ((resolve, reject) => {
      fetch(`https://api.github.com/users/${name}/followers?page=1&per_page=100`)
      .then(response => response.json())
      .then(json => resolve(json))
      .catch(error => reject(error))
    })
  }
}