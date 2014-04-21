var app = (function() {
  var privateVariable = 'app fired!',
    docElem = document.documentElement;

  return {
    publicFunction: function() {
      console.log(privateVariable);
    },
    userAgentInit: function() {
      docElem.setAttribute('data-useragent', navigator.userAgent);
    }
  };
})();

(function() {
  // Preloader
  $(window).load(function() {
    $('.loader').fadeOut('slow');
  });

  // Perfectly center on resize
  $(window).resize(function(){
    $('.container').css({
      height: $(window).height(),
      width: $(window).width()
    });
    $('.weather-container').css({
      position: 'absolute',
      left: ($(window).width() - $('.weather-container').outerWidth())/2,
      top: ($(window).height() - $('.weather-container').outerHeight())/2
    });
  });

  $(window).resize();

})();

(function(window, $) {
  var Forecast = function() {
    //throws error if you try to do new Forecast()
    throw ('this is not to be instantiated');
  };

  var f = Forecast;
  var BV = new $.BigVideo();

  // array of all weather videos
  var videos = [
    'videos/clouds-vid.mp4',
    'videos/sunny-vid.mp4',
    'videos/overcast-vid.mp4',
    'videos/fog-vid.mp4',
    'videos/snow-vid.mp4',
    'videos/rain-vid.mp4',
    'videos/clearnight-vid.mp4',
    'videos/cloudynight-vid.mp4'
  ];

  // array of all weather background images
  var BGimg = [
    'images/backgrounds/cloudy-bg.jpg',
    'images/backgrounds/sunny-bg.jpg',
    'images/backgrounds/overcast-bg.jpg',
    'images/backgrounds/fog-bg.jpg',
    'images/backgrounds/winter-bg.jpg',
    'images/backgrounds/rain-bg.jpg',
    'images/backgrounds/clearnight-bg.jpg',
    'images/backgrounds/cloudynight-bg.jpg'
  ];

  // initialize background video
  BV.init();
  window.BV = BV;

  // private variables
  f._apiKey ='8638f2d6a266f36f9ed32a2e21ad4174'; // api key for forecast.io
  f._currentTemperature = null;
  f._celsius = null;

  // template for Mustache
  var template = $('#template').html();

  // initializes our Forecast object by getting the forecast
  f.__initialize = function() {
    f.getLocation(function(result) {
      if (result) {
        f.getForecast('https://api.forecast.io/forecast/' + f._apiKey + '/' + result.loc);
      }
      else {
        f.getForecast('https://api.forecast.io/forecast/' + f._apiKey + '/43.6486,-79.3853');
      }
    });
    setInterval(f.updateDisplay, 30000);
  };

  f.getLocation = function(callback) {
    $.ajax({
      url: 'http://ipinfo.io',
      dataType: 'jsonp'
    })
    .done(function(result){
      callback(result);
    });
  };

  // converts farenheit result from forecast.io to celsius
  f.getCelsius = function(tempFarenheit) {
    return Math.round((tempFarenheit - 32) * 5 / 9);
  };

  // set background video and icon according to weather
  // if on mobile - set to background image
  f.displayBG = function(icon) {
    var iconLetter = '';
    switch (icon) {
      case 'clear-day':
        if (Modernizr.touch) {
          BV.show(BGimg[1]);
        }
        else {
          BV.show(videos[1],{ambient:true});
        }
        iconLetter = 'B';
        break;
      case 'rain':
        if (Modernizr.touch) {
          BV.show(BGimg[5]);
        }
        else {
          BV.show(videos[5],{ambient:true});
        }
        iconLetter = 'R';
        break;
      case 'snow':
        if (Modernizr.touch) {
          BV.show(BGimg[4]);
        }
        else {
          BV.show(videos[4],{ambient:true});
        }
        iconLetter = 'W';
        break;
      case 'sleet':
        if (Modernizr.touch) {
          BV.show(BGimg[5]);
        }
        else {
          BV.show(videos[5],{ambient:true});
        }
        iconLetter = 'X';
        break;
      case 'wind':
        if (Modernizr.touch) {
          BV.show(BGimg[0]);
        }
        else {
          BV.show(videos[0],{ambient:true});
        }
        iconLetter = 'S';
        break;
      case 'fog':
        if (Modernizr.touch) {
          BV.show(BGimg[3]);
        }
        else {
          BV.show(videos[3],{ambient:true});
        }
        iconLetter = 'M';
        break;
      case 'cloudy':
        if (Modernizr.touch) {
          BV.show(BGimg[2]);
        }
        else {
          BV.show(videos[2],{ambient:true});
        }
        iconLetter = 'Y';
        break;
      case 'partly-cloudy-day':
        if (Modernizr.touch) {
          BV.show(BGimg[0]);
        }
        else {
          BV.show(videos[0],{ambient:true});
        }
        iconLetter = 'H';
        break;
      case 'partly-cloudy-night':
        if (Modernizr.touch) {
          BV.show(BGimg[7]);
        }
        else {
          BV.show(videos[7],{ambient:true});
        }
        iconLetter = 'I';
        break;
      case 'clear-night':
        if (Modernizr.touch) {
          BV.show(BGimg[6]);
        }
        else {
          BV.show(videos[6],{ambient:true});
        }
        iconLetter = 'C';
        break;
      default:
        if (Modernizr.touch) {
          BV.show(BGimg[0]);
        }
        else {
          BV.show(videos[0],{ambient:true});
        }
        iconLetter = 'Y';
    }
    return iconLetter;
  };

  // round wind speed in KM
  f.getWindSpeed = function(windSpeed) {
    return Math.round(windSpeed*1.60934);
  };

  // converts wind degrees to direction
  f.getWindDir = function(windDir) {
    var direction;
    if (windDir === 0){
      direction = 'N';
    }
    else if (windDir > 0 && windDir < 90) {
      direction = 'NE';
    }
    else if (windDir === 90) {
      direction = 'E';
    }
    else if (windDir > 90 && windDir < 180) {
      direction = 'SE';
    }
    else if (windDir === 180){
      direction = 'S';
    }
    else if (windDir > 180 && windDir < 270) {
      direction = 'SW';
    }
    else if (windDir === 270) {
      direction = 'W';
    }
    else if (windDir > 270 && windDir < 360) {
      direction = 'NW';
    }
    else {
      direction = '';
    }
    return direction;
  };

  f.getPOP = function(pop) {
    return Math.round((pop*100)) + '%';
  };

  f.getHumidity = function(humidity) {
    return Math.round((humidity*100)) + '%';
  };

  // set hour for clock
  f.getHour = function() {
    // create a newDate() object and extract the hours of the current time on the visitor's
    var hours = new Date().getHours();

    // 12 hour clock
    if (hours > 12) {
      hours -= 12;
    }
    else if (hours === 0) {
      hours = 12;
    }

    // add a leading zero to the hours value
    return (hours < 10 ? '0' : '') + hours;
  };

  // set minute for clock
  f.getMinute = function() {
    var minutes = new Date().getMinutes();

    // add a leading zero to the minutes value
    return (minutes < 10 ? '0' : '') + minutes;
  };

  // gets current date
  f.getDate = function() {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();

    return day + '/' + month + '/' + year;
  };

  // gets current day
  f.getDay = function() {
    var currentDate = new Date();
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    return days[currentDate.getDay()];
  };

  // updates the display after making the call to forecast.io
  f.updateDisplay = function(){
    // JSON object for data
    var data = {
      'date': f.getDate(),
      'day': f.getDay(),
      'hour': f.getHour(),
      'minute': f.getMinute(),
      'icon': f.displayBG(f._currentTemperature.icon),
      'temperature': f.getCelsius(f._currentTemperature.temperature),
      'aTemperature': 'Feels like ' + f.getCelsius(f._currentTemperature.apparentTemperature),
      'summary': f._currentTemperature.summary,
      'windSpeed': f.getWindSpeed(f._currentTemperature.windSpeed) + ' km/h',
      'windDir': 'Wind ' + f.getWindDir(f._currentTemperature.windBearing),
      'pop': 'P.O.P. ' + f.getPOP(f._currentTemperature.precipProbability),
      'humidity': 'Humidity ' + f.getHumidity(f._currentTemperature.humidity)
    };

    $('.weather-container').html(Mustache.render(template, data));
  };

  // makes ajax call to forecast.io
  f.getForecast = function(locationURL){
    $.ajax({
      url: locationURL,
      dataType: 'jsonp'
    }).done(function(result){
      f._currentTemperature = result.currently;
      console.log(f._currentTemperature);
      f.updateDisplay();
    });
  };

  window.Forecast = f;

  // call this from anywhere to initialize the Forecast object
  window.Forecast.__initialize();
}(window, jQuery));
