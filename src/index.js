document.addEventListener('DOMContentLoaded', ()=>{
    
    // Fetching titles from server
     function fetchname() {
         fetch(`http://localhost:3000/films`)
         .then(res => res.json())
         .then(data => data.forEach(element => render(element)))
 
         // Rendering titles to DOM
         function render(element) {
             let del = document.createElement('button');
             // Styling the button
             del.textContent = 'Delete';
             del.style.backgroundColor = 'red';
             del.style.color = 'white';
             del.style.border = 'none';
             del.style.borderRadius = '5px';
             del.style.margin = '6px';
             del.style.marginLeft = '20px';
             del.style.boxShadow = '0 0 5px black';
 
             // Adding event listener to the delete button
             del.addEventListener('click', (e) =>{
                 e.preventDefault();
                 li.remove();
             });
 
             // Creating a clickable title
             let title = document.createElement('button');
             title.textContent = element.title;
             title.className = 'myTitles';
             title.style.border = '0';
             title.id = element.id;
 
             // Creating list elements
             let li = document.createElement('li');
             li.className = 'film item';
             let ul = document.querySelector('#films');
             li.appendChild(title);
             li.appendChild(del);
             ul.appendChild(li);
 
             // Adding event listener to title button to fetch data
             title.addEventListener('click', (e) => {
                 e.preventDefault();
                 let id = e.target.id;
                 fetchData(id); 
             });
         }
     }
 
     fetchname();
 
     // Fetching image and related film details
     function fetchData(id) {
         fetch(`http://localhost:3000/films/${id}`)
         .then(res => res.json())
         .then(data => imgRender(data));
 
         // Rendering info to DOM
         function imgRender(data) {
             let post = document.querySelector('#poster');
             let mvTitle = document.querySelector('#title');
             let runtime = document.querySelector('#runtime');
             let filmInfo = document.querySelector('#film-info');
             let showtm = document.querySelector('#showtime');
             let ticketNum = document.querySelector('#ticket-num');
             let btn = document.querySelector('#buy-ticket');
             let capacity = data.capacity;
             let tsold = data.tickets_sold;
 
             let rem = capacity - tsold;
             ticketNum.textContent = ` ${rem}`;
             showtm.textContent = data.showtime;
             filmInfo.textContent = data.description;
             runtime.textContent = `${data.runtime} minutes`;
             mvTitle.textContent = data.title.toUpperCase();
             post.src = `${data.poster}`;
 
             
             btn.removeEventListener('click', update);
 
             // Function to patch to server and update the number
             function update(e) {
                 e.preventDefault();  // Prevent page refresh on click
                 
                 if (tsold < capacity) {
                     let dt = { tickets_sold: tsold + 1 };
 
                     fetch(`http://localhost:3000/films/${id}`, {
                         method: 'PATCH',
                         headers: {
                             "Content-Type": "application/json",
                             "Accept" : "application/json"
                         },
                         body: JSON.stringify(dt)
                     })
                     .then(res => res.json())
                     .then(items => {
                         console.log(items);
                         tsold = items.tickets_sold;
                         rem = capacity - tsold;
                         ticketNum.textContent = ` ${rem}`;
                     });
                 } else {
                     btn.textContent = 'Sold out'
                     let li = document.querySelector('li')
                     li.className ='sold-out'
                 }
             }
 
             // Add the new event listener
             btn.addEventListener('click', update);
         }
     }
 });
 