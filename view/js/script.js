function Weather() {
}

Weather.prototype.fetchResults = function(val) {
  fetch(`http://localhost:5000/api/weather/?name=${val}`).then((resp) => {
    if (resp) {
      resp.json().then((response) => {
        this.weatherResults = response.data;
        this.updateSuggestions();
      });
    }
  });
}

Weather.prototype.onKeyup = function(e) {
  const val = e.target.value;
  clearInterval(this.timer);
  this.timer = setTimeout(() => {
    this.fetchResults(val);
  }, 500);
}

Weather.prototype.updatecitySelect = function(results) {
  const {name = '', weather = '', status = ''} = results;
  this.$suggestions.innerHTML = '';
  this.$city.value = name;
  this.$selectedCity.innerText = name;
  this.$selctedWeather.innerText = weather;
  this.$selectedStatus.innerText = status;
}

Weather.prototype.updateSuggestions = function() {
  if (this.weatherResults.length === 0) {
    this.$suggestions.innerHTML = `<div class="suggestionItem red">No Info available!</div>`;
  } else {
    this.$suggestions.innerHTML = this.weatherResults.map((item) => {
      return `<div class="suggestionItem">${item.name}</div>`;
    }).join('');
    const $suggestion = document.getElementsByClassName('suggestionItem');
    if ($suggestion.length > 0) {
      for(let i=0; i < $suggestion.length; i++) {
        $suggestion[i].onclick = this.updatecitySelect.bind(this, this.weatherResults[i]);
      }
    }
  }
}

Weather.prototype.reset = function() {
  this.$city.value = '';
  this.$selectedCity.innerText = '';
  this.$selctedWeather.innerText = '';
  this.$selectedStatus.innerText = '';
  this.$suggestions.innerHTML = '';
}

Weather.prototype.init = function() {
  this.timer = null;
  this.weatherResults = [];
  this.$city = document.getElementById('city');
  this.$suggestions = document.getElementById('suggestions');
  this.$selectedInfo = document.getElementById('selectedCityInfo');
  this.$selectedCity = document.getElementById('selectedCity');
  this.$selctedWeather = document.getElementById('selctedWeather');
  this.$selectedStatus = document.getElementById('selectedStatus');
  this.$resetBtn = document.getElementById('resetBtn');
  this.$city.addEventListener('keyup', this.onKeyup.bind(this));
  this.$resetBtn.addEventListener('click', this.reset.bind(this));
}

var weatherApp = new Weather();
weatherApp.init();

