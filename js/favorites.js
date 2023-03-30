import GitHubUser from "./githubUserSearch.js"

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  save() {
    localStorage.setItem('@git-fav:', JSON.stringify(this.entries))
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@git-fav:') || "[]") 
  }

  async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists) {
        throw new Error('Usuário já cadastrado')
      }

      const user = await GitHubUser.search(username)

      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]

      this.root.querySelector('.searchWrapper #searchInput').value = ''
      this.update()
    } catch(error) {
      alert(error.message)
    }  
  }

  delete(user) {
    this.entries = this.entries.filter( (entry) => (
      entry.login !== user.login
    ))

    this.update()
    this.save()
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onAdd()
  }

  onAdd() {
    const addButton = this.root.querySelector('.searchWrapper .addButton')

    addButton.onclick = () => {
      let {value} = this.root.querySelector('.searchWrapper #searchInput')

      this.add(value)
    }
  }

  update() {
    this.removeAllData()

    this.entries.forEach(user => {
      const row = this.createRow()
      
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user a p').textContent = user.name
      row.querySelector('.user a span').textContent = `/${user.login}`
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers
      row.querySelector('.removeItem').onclick = () => {
        const isOk = confirm('Você realmente deseja excluir este usuário?')

        if(isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }
  
  createRow() {
    const tr = document.createElement('tr')
    
    tr.innerHTML = `
    <tr>
    <td class="user">
      <div class="user-wrapper">
        <img src="https://github.com/EduVieira131.png" alt="" />

        <a href="#">
          <p>Eduardo Vieira</p>
          <span>/EduVieira131</span>
        </a>
      </div>
    </td>
    <td class="repositories">30</td>
    <td class="followers">1000</td>
    <td><button class="removeItem">Remover</button></td>
    </tr>`

    return tr
  }

  removeAllData() {  
    this.tbody.querySelectorAll('tr').forEach(tr => {
      tr.remove()
    })
  }
}
