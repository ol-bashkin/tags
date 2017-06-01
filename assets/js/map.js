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
      //console.log('ouch');
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    }, {
      enableHighAccuracy: true,
      timeout: 60000,
      maximumAge: 0
    });
    
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
    
  }
  /* Получение архива расстояний до маркера
  
  currentPositionMarker.addListener('position_changed', function () {
    var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest,
      xhr = new XHR(),
      userLatLng = currentPositionMarker.getPosition(),
      distances = [],
      destinationsArray = [],
      splicedDestinations = [],
      request = [],
      requestBase = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric',
      requestAPI = '&key=AIzaSyAVVH_sNL6bjByqSGCJogNH65U_CVDkSiI',
      requestOrigin = '&origins=' + userLatLng.lat() + ',' + userLatLng.lng(),
      requestDestinations = '&destinations=',
      iterations = 0;
    
    destinationsArray = markers.map(function (marker) {
      var distLatLng = marker.getPosition(),
        destination = distLatLng.lat() + ',' + distLatLng.lng();
      return destination;
    });
    
    while (destinationsArray.length > 0) {
      splicedDestinations.push(destinationsArray.splice(0, 25).join('|'));
    }
    
    request = splicedDestinations.map(function (destinations) {
      return requestBase + requestOrigin + requestDestinations + destinations + requestAPI;
    });
    
    function waitResponse(request) {
      var currentRequest = request.shift();
      console.log(currentRequest);
      if (request.length > 0) {

        window.setTimeout(function () {
          xhr.open('GET', currentRequest, true);

          xhr.onload = function () {
            var response = JSON.parse(this.responseText),
              responseDists = [];
            if (!!(response.rows[0])) {
              response.rows[0].elements.map(function (element) {
                return {distanceText: element.distance.text, distanceValue: element.distance.value};
              });
              distances = distances.concat(responseDists.concat(waitResponse(request)));
              console.log(distances);
            } else {
              console.log('ERROR: ' + response.status);
            }

          };

          xhr.onerror = function () {
            console.log('Ошибка ' + this.status);
          };

          xhr.send();
        }, '500');
      } else {
        window.setTimeout(function () {
          xhr.open('GET', currentRequest, true);

          xhr.onload = function () {
            var response = JSON.parse(this.responseText),
              responseDists = response.rows[0].elements.map(function (element) {
                return {distanceText: element.distance.text, distanceValue: element.distance.value};
              });
            
            distances = distances.concat(responseDists);
            console.log(distances);
          };

          xhr.onerror = function () {
            console.log('Ошибка ' + this.status);
          };

          xhr.send();
        }, '251');
      }
      
    }
    
    waitResponse(request);
    
  });
  
  */
  
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
    
    if (!!(marker)) {
      resultText = '<p class="results__name">' +
        marker.properties.name.substr(0, matchStart) +
        '<span class="results__name_query">' +
          marker.properties.name.substr(matchStart, query.length) +
        '</span>' +
        marker.properties.name.substr(matchStart + query.length) +
        '</p>';
      resultText += '<p class="results__category">' + marker.properties.category + '</p>';
      resultText += '<p class="results__address">' + marker.properties.address + '</p>';
      console.log(resultText);
      resultsItem.innerHTML = resultText;
      console.log(resultsItem);
      resultsItem.addEventListener('click', resultClick);
      return resultsItem;
      
    } else {
      resultsItem.classList.add('results__item_is_passive');
      resultsItem.innerHTML = '<p class="results__name">Нет результатов поиска</p>';
      return resultsItem;
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
      query = searchBar.value,
      resultsHolder = [];
    
    if (!(searchResults.classList.contains('results_is_hidden'))) { searchResults.classList.add('results_is_hidden'); }
    
    resultsArray.forEach(function (item) {
      item.parentNode.removeChild(item);
    });
    
    /* сортировка элементов выдачи
    
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
    */

    if (query.length >= 2) {
      
      markers.forEach(function (marker, i) {
        var regQuery = new RegExp(query, 'i'),
          mazdaName = marker.properties.name,
          matchPosition = mazdaName.search(regQuery),
          result = '';
        if (matchPosition !== -1) {
          result = resulter(marker, matchPosition, query, map);
          searchResults.appendChild(result);
        } else if (i === markers.length - 1 && searchResults.childNodes.length === 0) {
          result = resulter();
          searchResults.appendChild(result);
        }
      });
      
      if (searchResults.classList.contains('results_is_hidden')) { searchResults.classList.remove('results_is_hidden'); }
    }

  });
}