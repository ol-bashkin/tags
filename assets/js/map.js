function initMap() {
  'use strict';
  var uluru = {lat: -25.363, lng: 131.044},
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 55.755826, lng: 37.6173},
      zoom: 10,
      disableDefaultUI: true,
      gestureHandling: 'greedy',
      styles: [
        {
          featureType: 'poi.business',
          stylers: [{visibility: 'off'}]
        },
        {
          featureType: 'transit',
          elementType: 'labels.icon',
          stylers: [{visibility: 'off'}]
        }
      ]
    }),
    iconBase = '../assets/img/__map_icons/__markers/',
    icons = {
      main: {
        icon: iconBase + 'icon_blue.svg'
      },
      main_sel: {
        icon: iconBase + 'icon_blue_sel.svg'
      },
      partner: {
        icon: iconBase + 'icon_orange.svg'
      },
      partner_sel: {
        icon: iconBase + 'icon_orange_sel.svg'
      },
      premium: {
        icon: iconBase + 'icon_purple.svg'
      },
      premium_sel: {
        icon: iconBase + 'icon_purple_sel.svg'
      },
      elite: {
        icon: iconBase + 'icon_green.svg'
      },
      elite_sel: {
        icon: iconBase + 'icon_green_sel.svg'
      }
    },
    markers = mazdaCenters.features.map(function (center) {
      var properties = center.properties,
        coords = center.geometry.coordinates,
        latLng = new google.maps.LatLng(coords[1], coords[0]);
      
      return new google.maps.Marker({

        position: latLng,
        properties: properties,

        icon: {
          url: icons[properties.type].icon,
          size: new google.maps.Size(30, 55),
          scaledSize: new google.maps.Size(30, 55),
          anchor: new google.maps.Point(15, 47.2)
        },
        shape: {
          coords: [15, 47.2, 15],
          type: 'circle'
        },
        optimized: false,
        map: map

      });
    }),
    infoWindow = new google.maps.InfoWindow({
      content: ''
    }),
    centerControlDiv = document.createElement('div'),
    centerControl = new CenterControl(centerControlDiv, map),
    trafficViewDiv = document.createElement('div'),
    trafficView = new TrafficView(trafficViewDiv, map),
    isInfo = false,
    markerCluster = new MarkerClusterer(map, markers, {imagePath: '../assets/img/clusters/', maxZoom: 12}),
    markerHolder = '',
    searchBar = document.getElementsByClassName('js-search-bar')[0],
    currentPosition = false,
    currentPositionMarker = new google.maps.Marker({
      icon: {
        url: '../assets/img/__map_icons/currentposition.svg',
        size: new google.maps.Size(30, 50),
        scaledSize: new google.maps.Size(30, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(15, 47.2)
      },
      visible: false,
      optimized: false,
      map: map
    }),
    serviceDistance = new google.maps.DistanceMatrixService();
  
  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
  }
  
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(function (position) {
      currentPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      currentPositionMarker.setPosition(currentPosition);
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    }, {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
  
  function CenterControl(controlDiv, map) {
    var controlUI = document.createElement('div');
    controlUI.classList.add('map__control');
    controlUI.classList.add('map__control_locate');

    controlUI.title = 'Нажмите для определения собственного местоположения';
    controlDiv.appendChild(controlUI);

    controlUI.addEventListener('click', function () {
      if (currentPosition && !(controlUI.classList.contains('map__control_locate_is_active'))) {
        currentPositionMarker.setPosition(currentPosition);
        currentPositionMarker.setVisible(true);
        controlUI.classList.add('map__control_locate_is_active');
        map.panTo(currentPositionMarker.getPosition());
      } else if (controlUI.classList.contains('map__control_locate_is_active')) {
        currentPositionMarker.setVisible(false);
        controlUI.classList.remove('map__control_locate_is_active');
      }
    });

  }

  function TrafficView(controlDiv, map) {
    var controlUI = document.createElement('div'),
      isMap = true,
      trafficLayer = new google.maps.TrafficLayer();
    controlUI.classList.add('map__control');
    controlUI.classList.add('map__control_traffic');

    controlUI.title = 'Нажмите для определения собственного местоположения';
    controlDiv.appendChild(controlUI);
    controlUI.addEventListener('click', function () {
      if (isMap) {
        trafficLayer.setMap(map);
        isMap = false;
        controlUI.classList.add('map__control_traffic_is_active');
      } else {
        trafficLayer.setMap(null);
        isMap = true;
        controlUI.classList.remove('map__control_traffic_is_active');
      }

    });
  }
  
  

  //контент информационноо окна
  //'  <div class="infowindow__distance">' + distance                   + '</div>' +

  function contenter(marker, distance) {
    return (
      '<div class="infowindow">' +
      '  <p class="infowindow__name">' +       marker.properties.name     + '</p>' +
      '  <p class="infowindow__category">' +   marker.properties.category + '</p>' +
      '  <p class="infowindow__address">' +    marker.properties.address  + '</p>' +
      '  <p class="infowindow__phone">' +      marker.properties.phone    + '</p>' +
      '  <p class="infowindow__workTime">' +   marker.properties.worktime + '</p>' +

      '</div>'
    );
  }
  
  function resulter(marker, matchStart, query, map, sendResult) {
    var resultsItem = document.createElement('div'),
      resultText = '',
      result = {};
    
    resultsItem.classList.add('results__item');
    
    if (!!(marker)) {
      resultText =
        '<div class="results__left"><p class="results__name">' +
          marker.properties.name.substr(0, matchStart) +
          '<span class="results__name_query">' +
            marker.properties.name.substr(matchStart, query.length) +
          '</span>' +
          marker.properties.name.substr(matchStart + query.length) +
        '</p>';
      resultText += '<p class="results__category">' + marker.properties.category + '</p></div>';
      
    } else {
      resultsItem.classList.add('results__item_is_passive');
      resultsItem.innerHTML = '<p class="results__name">Нет результатов поиска</p>';
      return { result: resultsItem, distance: ''};
    }
    
    function resultClick() {
      var resultsContainer = document.getElementsByClassName('js-search-results')[0],
        resultsArray = Array.prototype.slice.call(document.getElementsByClassName('results__item')),
        searchBar = document.getElementsByClassName('js-search-bar')[0],
        markerPosition = marker.getPosition();
      
      if (!(resultsContainer.classList.contains('results_is_hidden'))) { resultsContainer.classList.add('results_is_hidden'); }
      
      resultsArray.forEach(function (item) {
        item.parentNode.removeChild(item);
      });
      
      if (!!(markerHolder)) {
        markerHolder.setOptions({
          icon: {
            url: icons[markerHolder.properties.type].icon,
            size: new google.maps.Size(30, 55),
            scaledSize: new google.maps.Size(30, 55)
          },
          clickable: true
        });
      }

      marker.setOptions({
        icon: {
          url: icons[marker.properties.type + '_sel'].icon,
          size: new google.maps.Size(30, 55),
          scaledSize: new google.maps.Size(30, 55)
        },
        clickable: false
      });

      map.panTo(markerPosition);
      map.setZoom(14);
      map.panBy(0, -96);

      infoWindow.setContent(contenter(marker));
      infoWindow.open(map, marker);

      markerHolder = marker;
    }
    
    function getResult(result, distanceText, distance, callback) {
      result.distance = distance;
      resultText += '<p class="results__distance">' + distanceText + '</p>';

      resultsItem.addEventListener('click', resultClick);
      resultsItem.innerHTML = resultText;
      result.result = resultsItem;
      callback(result);
    }
    
    if (!!(currentPosition) && !!(marker)) {
      serviceDistance.getDistanceMatrix({
        origins: [currentPosition],
        destinations: [marker.getPosition()],
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      }, function (response, status) {
        if (status === 'OK') {
          
          getResult(result, response.rows[0].elements[0].distance.text, response.rows[0].elements[0].distance.value, function (result) {
            sendResult(result);
          });
          
          
        } else {
          resultsItem.addEventListener('click', resultClick);
          resultsItem.innerHTML = resultText;
          result.result = resultsItem;
          console.log(status);
          sendResult(result);
        }
      });
    } else {
      resultsItem.addEventListener('click', resultClick);
      resultsItem.innerHTML = resultText;
      result.result = resultsItem;
      sendResult(result);
    }

  }
  
  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);

  trafficViewDiv.index = 2;
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(trafficViewDiv);

  infoWindow.setOptions({
    disableAutoPan: true
  });
  
  //обработчик клика по маркеру

  markers.forEach(function (marker) {
    marker.addListener('click', function (event) {
      
      var markerPosition = marker.getPosition();
      
      if (!!(markerHolder)) {
        markerHolder.setOptions({
          icon: {
            url: icons[markerHolder.properties.type].icon,
            size: new google.maps.Size(30, 55),
            scaledSize: new google.maps.Size(30, 55)
          },
          clickable: true
        });
      }
      
      marker.setOptions({
        icon: {
          url: icons[marker.properties.type + '_sel'].icon,
          size: new google.maps.Size(30, 55),
          scaledSize: new google.maps.Size(30, 55)
        },
        clickable: false
      });

      map.panTo(markerPosition);
      map.panBy(0, -96);

      infoWindow.setContent(contenter(marker));
      infoWindow.open(map, marker);
      
      markerHolder = marker;

    });
  });
  
  infoWindow.addListener('closeclick', function (event) {
    markerHolder.setOptions({
      icon: {
        url: icons[markerHolder.properties.type].icon,
        size: new google.maps.Size(30, 55),
        scaledSize: new google.maps.Size(30, 55)
      },
      clickable: true
    });
  });
  
  //Исправление информационного окна

  google.maps.event.addListener(infoWindow, 'domready', function () {
    var iw    = document.getElementsByClassName('gm-style-iw')[0],
      iwBg    = iw.previousSibling,
      iwDecor = iwBg.children,
      iwTip = iwDecor[2].children,
      iwTipLeft = iwTip[0].children[0],
      iwTipRight = iwTip[1].children[0];
    
    iwDecor[0].classList.add('infowindow__decorator');
    iwDecor[1].classList.add('infowindow__bodyDecorator');
    iwDecor[3].classList.add('infowindow__whyDecorator');
    iwTipLeft.classList.add('infowindow__tipDecorator');
    iwTipRight.classList.add('infowindow__tipDecorator');

  });
  
  google.maps.event.addDomListener(searchBar, 'input', function (event) {
    var searchResults = document.getElementsByClassName('js-search-results')[0],
      resultsArray = Array.prototype.slice.call(document.getElementsByClassName('results__item')),
      query = searchBar.value;
    
    if (!(searchResults.classList.contains('results_is_hidden'))) { searchResults.classList.add('results_is_hidden'); }
    
    resultsArray.forEach(function (item) {
      item.parentNode.removeChild(item);
    });
    
    function findResult(query, sendHolder) {
      var resultsHolder = [];
      markers.forEach(function (marker, i) {
        var regQuery = new RegExp(query, 'i'),
          mazdaName = marker.properties.name,
          matchPosition = mazdaName.search(regQuery);
        resulter(marker, matchPosition, query, map, function (result) {
          if (matchPosition !== -1) {
            console.log(i + ' ' + markers.length);
            resultsHolder.push(result);
          }
          if (i === markers.length - 1) {
            console.log(resultsHolder);
            sendHolder(resultsHolder);
          }
        });
      });
    }
    
    function resultSorter(resultsHolder, sendSorted) {
      resultsHolder.sort(function (a, b) {
        if (a.distance < b.distance) {
          return -1;
        }
        if (a.distance > b.distance) {
          return 1;
        }
        return 0;
      });
      sendSorted(resultsHolder);
    }

    if (query.length >= 2) {
      
      findResult(query, function (resultsHolder) {
        console.log(resultsHolder);
        resultSorter(resultsHolder, function (resultsHolder) {
          var result = '';
          console.log(resultsHolder);
          if (searchResults.classList.contains('results_is_hidden')) { searchResults.classList.remove('results_is_hidden'); }
          if (resultsHolder.length !== 0) {
            resultsHolder.forEach(function (result) {
              searchResults.appendChild(result.result);
            });
          } else {
            result = resulter();
            console.log(result);
            searchResults.appendChild(result.result);
          }
        });
      });
    }
  });
}