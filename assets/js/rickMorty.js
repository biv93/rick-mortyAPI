/**
 * Const
 */
const urls = [
    "https://rickandmortyapi.com/api/character",
    "https://rickandmortyapi.com/api/location",
    "https://rickandmortyapi.com/api/episode"
]

const container = document.getElementById('container')
const tpl = document.getElementById('listaPersonaggi')
const tplC = document.getElementById('counter')
const btnAdd = document.getElementById('personaggiBtn');
const btnRemove = document.getElementById('rimuoviPersonaggi');
const modalContainer = document.getElementById('modal')

/**
 * Obj
 */
class Modal {
    static createModal(char){
      
        modalContainer.classList.add('active')
        const modal = document.createElement('div');
        modal.className ='modal-bck';
    
        const title = document.createElement('h2');
        title.textContent = "Sicuro di voler eliminare l'elemento?"

        const container = document.createElement('div');
        container.id = 'button-modal-container'
        const btnY = document.createElement('button');
        btnY.id = 'confirm';
        btnY.textContent = 'elimina'

        const btnN = document.createElement('button');
        btnN.id = 'decline';
        btnN.textContent = 'annulla'

        container.appendChild(btnN)
        container.appendChild(btnY)
        
        modal.appendChild(title)
        modal.appendChild(container)
        
        modalContainer.appendChild(modal)

        btnN.addEventListener('click',(e)=>{
            e.target.closest('#modal').classList.remove('active')
            e.target.closest('.modal-bck').remove()
        })

        btnY.addEventListener('click',(e)=>{
            if(document.getElementById(char).id == char){
                e.target.closest('#modal').classList.remove('active')
                e.target.closest('.modal-bck').remove()
                document.getElementById(char).remove()
            } 
        })

    }
    
}

class Count {
    static createCount (loc,eps){
        const link = document.importNode(tplC.content,true);
        link.querySelector('#location').textContent = `N°luoghi: ${loc.info.count}`
        link.querySelector('#episode').textContent = `N° episodi: ${eps.info.count}`
        container.appendChild(link)
    }
}

class Character{
    static createChar({results}){
        results.map( char => {
            const cardChar = document.importNode(tpl.content,true);
            cardChar.getElementById('card').id = `${char.id}`
            cardChar.getElementById('numE').textContent = `presente in: ${char.episode.length} episodi`
            cardChar.querySelector('h2').textContent = char.name;
            cardChar.querySelector('strong').textContent = `specie: ${char.species}`;
            cardChar.querySelector('img').setAttribute('src',char.image)
            cardChar.querySelector('img').setAttribute('alt',char.name)
            cardChar.querySelector('i').classList.add('fa','fa-television')
            cardChar.querySelector('span').textContent = (char.type) ? `tipo: ${char.type}` :`tipo: persona comune`
            cardChar.getElementById('removeBtn').textContent = 'rimuovi Card';
       
            const btnRemoveCard = cardChar.getElementById('removeBtn');
            btnRemoveCard.addEventListener('click',()=>{Modal.createModal(char.id)})
            return container.appendChild(cardChar);
            
     })
    }
   
}

class Card{
    static async getData(){
       const [characters,locations,episodes] = await Promise.all(urls.map( url =>{
           try {
             
               return fetch(url).then( response => response.json() )
           } catch (error) {
               console.error(error)
           }
        }))
        /** create statistics **/
        Count.createCount(locations,episodes)
        
        /** create cards **/
        Character.createChar(characters)
        
      
    }
    static removeElement(){
        const [...newContainer] = container.children;
        newContainer.map( x => {
            x.remove()
        })
        btnAdd.style.display = 'inline-block'
        btnRemove.style.display = 'none'
    }
    static loadHandler(){
        Card.getData()
        btnRemove.style.display = 'inline-block'
        btnAdd.style.display = 'none'
    }
    
}

btnAdd.addEventListener('click',Card.loadHandler)
btnRemove.addEventListener('click',Card.removeElement)
