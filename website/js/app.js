// Open Weather API
createApiUrl = (location) => {
  const apiKey = "76fb4255f06d6b3b42e35195ffaaae01";
  return `http://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${apiKey}`
}

const getWeatherData = async (url) => {
  const response = await fetch (url)
    try {
      const data = await response.json();
      return data
    } catch (error) {
      // handle the error
    };
}

// Get current date
let d = new Date();
let currentDate = (d.getMonth()+1)+'.'+ d.getDate()+'.'+ d.getFullYear();

// Generate Dom Content
generateJournalContent = (idx, obj) => {
  if (idx === 0){
    console.log(obj)
    const recentDate = document.getElementById('date');
    const recentTemp = document.getElementById('temp');
    const recentCity = document.getElementById('place');
    const recentContent = document.getElementById('content');
    recentDate.innerHTML = obj.date;
    recentTemp.innerHTML = obj.temperature;
    recentCity.innerHTML = obj.city;
    recentContent.innerHTML = obj.mood;
  } else {
    const journalEntry = document.createElement('li');
    const journalEntryDate = document.createElement('div');
    journalEntryDate.classList.add('date');
    journalEntryDate.innerHTML = obj.date;
    const journalEntryTemp = document.createElement('div');
    journalEntryTemp.classList.add('temp');
    journalEntryTemp.innerHTML = obj.temperature;
    const journalEntryCity = document.createElement('div');
    journalEntryCity.classList.add('city');
    journalEntryCity.innerHTML = obj.city;
    const journalEntryContent = document.createElement('div');
    journalEntryContent.classList.add('content');
    journalEntryContent.innerHTML = obj.mood;
    journalEntry.append(journalEntryDate);
    journalEntry.append(journalEntryTemp);
    journalEntry.append(journalEntryCity);
    journalEntry.append(journalEntryContent);

    const journalContainer = document.getElementById('oldEntryHolder');
    journalContainer.append(journalEntry);
  }

}


// Get Input Data from DOM
document.getElementById("generate").addEventListener('click', function(){
  const inputCity = document.getElementById("city").value;
  const inputFeelings = document.getElementById("feelings").value;
  const input = {city: inputCity, feelings: inputFeelings}

  getWeatherData(createApiUrl(inputCity)).then(function(data){
    if (data.cod  != 404) {
      postData('/add', {date: currentDate, temperature:data.main.temp, city: inputCity, mood: inputFeelings});
    } else {
      alert ("I don't think that is a valid city!");
    }
  }).then(()=>updateUI());
});

const updateUI = async () => {
  const request = await fetch('/all');
  try{
    const dataObject = await request.json();

    dataObject.reverse().forEach((value, index) => {
      generateJournalContent(index, value);
    });

 } catch(error) {
    console.log("error", error);
  }
}

// Async POST
const postData = async ( url = '', data = {})=>{
      const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
          'Content-Type': 'application/json',
      },
     // Body data type must match "Content-Type" header        
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

      try {
        const newData = await response.json();
        return newData;
      } 
      catch(error) {
          console.log("error", error);
          // appropriately handle the error
      }
}